// Server imports
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Helper functions
import { deleteToken, deleteTokenFromEmail, generateToken } from './helper/tokenHelper';

// Route imports
import { authRegister } from './auth/register';
import { authLogin } from './auth/login';
import { authLogout } from './auth/logout';
import { researcherProfile } from './researcher/profile';
import { datasetListPatients } from './dataset/listPatients';
import { datasetListPhenotype } from './dataset/listPhenotypes';
import { datasetListGenomics } from './dataset/listGenomic';

// Database client
const prisma = new PrismaClient()

// Set up web app using JSON
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
const httpServer = new Server(app);


// Use middleware that allows for access from other domains
app.use(cors({
  origin: ["http://localhost:8080", "https://biomedata.denzeliskandar.com"],
  credentials: true
}));


const PORT: number = parseInt(process.env.PORT || '3030');
const isProduction: boolean = process.env.NODE_ENV === "production";


///////////////////////// ROUTES /////////////////////////


// HEALTH CHECK ROUTE
app.get('/', (req: Request, res: Response) => {
  console.log("Health check")
  return res.status(200).json({
    message: "Server is up!"
  });
});


// AUTH ROUTES
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, username, institution } = req.body;
    const { accessToken, refreshToken, researcherId, researcherName, researcherUsername } = await authRegister(name, email, password, username, institution);

    // Assign cookies
    res.cookie('accessToken', accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 1800000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

    res.header('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({ researcherId: researcherId, researcherName: researcherName, researcherUsername: researcherUsername });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, researcherId, researcherName, researcherUsername } = await authLogin(email, password);

    // Delete the previous token pair
    if (req.cookies.refreshToken) {
      const oldRefreshToken = req.cookies.refreshToken;
      await deleteToken(oldRefreshToken);
    } else {
      await deleteTokenFromEmail(email);
    }

    // Assign cookies
    res.cookie('accessToken', accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 1800000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

    res.header('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({ researcherId: researcherId, researcherName: researcherName, researcherUsername: researcherUsername });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authLogout(refreshToken);

    res.sendStatus(200);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});


// RESEARCHER ROUTES
app.get('/researcher/profile/:username', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { name, email, institution } = await researcherProfile(username);

    res.status(200).json({ researcherName: name, researcherUsername: username, researcherEmail: email, researcherInstitution: institution });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// DATASET ROUTES
app.get('/dataset/list-patients', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { researcherId } = res.locals.researcherId;
    const { patients } = await datasetListPatients(researcherId);

    res.status(200).json({ patients });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/dataset/list-phenotypes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { phenotypes } = await datasetListPhenotype();

    res.status(200).json({ phenotypes });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/dataset/list-genomics', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { genomics } = await datasetListGenomics();

    res.status(200).json({ genomics });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


///////////////////////// SERVER /////////////////////////


// Logging errors
app.use(morgan('dev'));

app.use(errorHandler());

// Start server
const server = httpServer.listen(PORT, () => {
  console.log(`⚡️ Server listening on port ${PORT}`);
});

// For coverage, handle Ctrl+C
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server.'));
});

/* ------------------- HELPER FUNCTIONS ------------------- */
async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) return res.status(401).json({ error: "No access token provided." });

  try {
    const atDecoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET as string) as JwtPayload;

    if (atDecoded && atDecoded.researcherId) {
      const researcher = await prisma.researcher.findUnique({ where: { id: atDecoded.researcherId } });

      if (!researcher) {
        return res.status(403).json({ error: "Researcher not found." });
      }

      if (researcher.remainingLoginAttempts <= 0) {
        return res.status(403).json({ error: "Researcher is blocked." });
      }

      res.locals.researcherId = atDecoded.researcherId;
      return next();
    } else {
      // Access token not valid
      res.status(403).json({ error: "Invalid access token." });
    }
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      // If access token is expired or invalid, attempt to use refresh token
      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided." });
      }

      try {
        const rtDecoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET as string) as JwtPayload;

        if (rtDecoded && rtDecoded.researcherId) {
          // Generate new token pair
          const newTokens = await generateToken(rtDecoded.researcherId);

          // Delete the previous refresh token as they are single use only
          await deleteToken(refreshToken);

          // Set new cookies
          res.cookie('accessToken', newTokens.accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 1800000 });
          res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

          res.locals.researcherId = rtDecoded.researcherId;
          return next();
        }
      } catch (refreshErr) {
        // Refresh token is invalid or expired
        return res.status(403).json({ error: "Invalid refresh token. Please log in again." });
      }
    }

    // For any other errors
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
