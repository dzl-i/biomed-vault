// Server imports
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { CategoryType, DataQuality, GenomicDataType, ImagingType, PrismaClient, SignalType } from '@prisma/client';
import { Server } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Helper functions
import { deleteToken, generateToken } from './helper/tokenHelper';

// Route imports
import { authRegister } from './auth/register';
import { authLogin } from './auth/login';
import { authLogout } from './auth/logout';
import { researcherProfile } from './researcher/profile';
import { datasetListPatients } from './dataset/listPatients';
import { datasetListPhenotype } from './dataset/listPhenotypes';
import { datasetListGenomics } from './dataset/listGenomic';
import { datasetListImaging } from './dataset/listImaging';
import { datasetListSignals } from './dataset/listSignals';
import { datasetListCategorisedData } from './dataset/listCategory';
import { patientDetails } from './patient/details';
import { uploadPatient } from './upload/patient';
import { uploadGenomic } from './upload/genomic';
import { uploadPhenotype } from './upload/phenotype';
import { uploadImaging } from './upload/imaging';
import { uploadSignal } from './upload/signal';
import { overviewPatient } from './overview/patient';
import { overviewGenomic } from './overview/genomic';
import { overviewPhenotype } from './overview/phenotype';
import { overviewImaging } from './overview/imaging';
import { overviewSignal } from './overview/signal';
import { updatePatient } from './update/patient';
import { updateResearcher } from './update/researcher';
import { updateGenomic } from './update/genomic';
import { updatePhenotype } from './update/phenotype';
import { updateImaging } from './update/imaging';
import { updateSignal } from './update/signal';
import { logCreate } from './log/create';
import { logList } from './log/list';
import { logResearcher } from './log/researcher';
import { searchPatient } from './search/patient';
import { searchGenomic } from './search/genomic';
import { searchPhenotype } from './search/phenotype';

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

    // Logging
    await logCreate(researcherId, "registered an account", "SUCCESS");

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

    // Assign cookies
    res.cookie('accessToken', accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 1800000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

    res.header('Access-Control-Allow-Credentials', 'true');

    // Logging
    await logCreate(researcherId, "logged into their account", "SUCCESS");

    res.status(200).json({ researcherId: researcherId, researcherName: researcherName, researcherUsername: researcherUsername });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const refreshToken = req.cookies.refreshToken;
    await authLogout(refreshToken);

    // Assign cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Logging
    await logCreate(researcherId, "logged out of their account", "SUCCESS");

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
    const researcherId = res.locals.researcherId;
    const { name, email, institution } = await researcherProfile(username);

    // Logging
    await logCreate(researcherId, `viewed Researcher ${username}'s profile`, "SUCCESS");

    res.status(200).json({ researcherName: name, researcherUsername: username, researcherEmail: email, researcherInstitution: institution });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// DATASET ROUTES
app.get('/dataset/list-patients', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { patients } = await datasetListPatients(researcherId);

    // Logging
    await logCreate(researcherId, `viewed a list of their patients`, "SUCCESS");

    res.status(200).json({ patients });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/dataset/list-phenotypes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { phenotypes } = await datasetListPhenotype();

    // Logging
    await logCreate(researcherId, `viewed a list of phenotype data`, "SUCCESS");

    res.status(200).json({ phenotypes });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/dataset/list-genomics', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { genomics } = await datasetListGenomics();

    // Logging
    await logCreate(researcherId, `viewed a list of genomic data`, "SUCCESS");

    res.status(200).json({ genomics });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/dataset/list-imaging', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { imaging } = await datasetListImaging();

    // Logging
    await logCreate(researcherId, `viewed a list of imaging data`, "SUCCESS");

    res.status(200).json({ imaging });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/dataset/list-signals', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { signals } = await datasetListSignals();

    // Logging
    await logCreate(researcherId, `viewed a list of signal data`, "SUCCESS");

    res.status(200).json({ signals });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// PATIENT ROUTES
app.get('/patient/details/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, genomicData, phenotypeData, imagingData, signalData, categories } = await patientDetails(id, researcherId);

    // Logging
    await logCreate(researcherId, `viewed Patient ${name}'s data`, "SUCCESS");

    res.status(200).json({ name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, genomicData, phenotypeData, imagingData, signalData, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// UPLOAD ROUTES
app.post('/upload/patient', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, categories } = req.body;
    const patient = await uploadPatient(researcherId, name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, categories);

    // Logging
    await logCreate(researcherId, `uploaded Patient ${name}'s data`, "SUCCESS");

    res.status(200).json({ name: patient.name, dateOfBirth: patient.dateOfBirth, sex: patient.sex, diagnosticInfo: patient.diagnosticInfo, treatmentInfo: patient.treatmentInfo, categories: patient.categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/upload/genomic', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { patientId, name, description, dataType, geneNames, mutationTypes, impacts, rawDataUrl, quality, categories } = req.body;
    const genomic = await uploadGenomic(patientId, name, description, dataType as GenomicDataType, geneNames, mutationTypes, impacts, rawDataUrl, quality as DataQuality, categories);

    // Logging
    await logCreate(researcherId, `uploaded a Genomic Data ${name} for Patient ${patientId}`, "SUCCESS");

    res.status(200).json({ id: genomic.id, name: genomic.name, description: genomic.description, dataType: genomic.dataType, categories: genomic.categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/upload/phenotype', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { patientId, name, description, traits, categories } = req.body;
    const phenotype = await uploadPhenotype(patientId, name, description, traits, categories);

    // Logging
    await logCreate(researcherId, `uploaded a Phenotype Data ${name} for Patient ${patientId}`, "SUCCESS");

    res.status(200).json({ id: phenotype.id, name: phenotype.name, description: phenotype.description, traits: phenotype.traits, categories: phenotype.categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/upload/imaging', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { patientId, name, description, imageType, image, imageUrl, categories } = req.body;
    const imaging = await uploadImaging(patientId, name, description, imageType as ImagingType, image, imageUrl, categories);

    // Logging
    await logCreate(researcherId, `uploaded an Imaging Data ${name} for Patient ${patientId}`, "SUCCESS");

    res.status(200).json({ id: imaging.id, name: imaging.name, description: imaging.description, imageType: imaging.imageType, categories: imaging.categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/upload/signal', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { patientId, name, description, signalType, dataPoints, duration, sampleRate, categories } = req.body;
    const signal = await uploadSignal(patientId, name, description, signalType as SignalType, dataPoints, duration, sampleRate, categories);

    // Logging
    await logCreate(researcherId, `uploaded a Signal Data ${name} for Patient ${patientId}`, "SUCCESS");

    res.status(200).json({ id: signal.id, name: signal.name, description: signal.description, signalType: signal.signalType, categories: signal.categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});


// OVERVIEW ROUTES
app.get('/overview/patient/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, genomicData, phenotypeData, imagingData, signalData, categories } = await overviewPatient(id, researcherId);

    // Logging
    await logCreate(researcherId, `viewed a detailed overview of Patient ${name}`, "SUCCESS");

    res.status(200).json({ id, name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, genomicData, phenotypeData, imagingData, signalData, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/overview/genomic/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { name, description, dataType, geneNames, mutationTypes, impacts, rawDataUrl, quality, categories } = await overviewGenomic(id, researcherId);

    // Logging
    await logCreate(researcherId, `viewed a detailed overview of Patient ${id}'s Genomic Data ${name}`, "SUCCESS");

    res.status(200).json({ id, name, description, dataType, geneNames, mutationTypes, impacts, rawDataUrl, quality, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/overview/phenotype/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { name, description, traits, categories } = await overviewPhenotype(id, researcherId);

    // Logging
    await logCreate(researcherId, `viewed a detailed overview of Patient ${id}'s Phenotype Data ${name}`, "SUCCESS");

    res.status(200).json({ id, name, description, traits, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/overview/imaging/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { name, description, imageType, image, imageUrl, categories } = await overviewImaging(id, researcherId);

    // Logging
    await logCreate(researcherId, `viewed a detailed overview of Patient ${id}'s Imaging Data ${name}`, "SUCCESS");

    res.status(200).json({ id, name, description, imageType, image, imageUrl, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/overview/signal/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { name, description, signalType, dataPoints, duration, sampleRate, categories } = await overviewSignal(id, researcherId);

    // Logging
    await logCreate(researcherId, `viewed a detailed overview of Patient ${id}'s Signal Data ${name}`, "SUCCESS");

    res.status(200).json({ id, name, description, signalType, dataPoints, duration, sampleRate, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// UPDATE ROUTES
app.put('/update/researcher/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const updatedResearcherData = req.body;
    const { name, username, email, institution } = await updateResearcher(researcherId, id, updatedResearcherData);

    // Logging
    await logCreate(researcherId, `updated their own data`, "SUCCESS");

    res.status(200).json({ id, name, username, email, institution });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.put('/update/patient/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const updatedPatientData = req.body;
    const { name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, genomicData, phenotypeData, imagingData, signalData, categories } = await updatePatient(researcherId, id, updatedPatientData);

    // Logging
    await logCreate(researcherId, `updated Patient ${name}'s data`, "SUCCESS");

    res.status(200).json({ id, name, dateOfBirth, sex, diagnosticInfo, treatmentInfo, genomicData, phenotypeData, imagingData, signalData, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.put('/update/genomic/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const updatedGenomicData = req.body;
    const { name, description, dataType, geneNames, mutationTypes, impacts, rawDataUrl, quality, categories } = await updateGenomic(researcherId, id, updatedGenomicData);

    // Logging
    await logCreate(researcherId, `updated Patient ${name}'s Genomic Data`, "SUCCESS");

    res.status(200).json({ id, name, description, dataType, geneNames, mutationTypes, impacts, rawDataUrl, quality, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.put('/update/phenotype/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const updatedPhenotypeData = req.body;
    const { name, description, traits, categories } = await updatePhenotype(researcherId, id, updatedPhenotypeData);

    // Logging
    await logCreate(researcherId, `updated Patient ${name}'s Phenotype Data`, "SUCCESS");

    res.status(200).json({ id, name, description, traits, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.put('/update/imaging/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const updatedImagingData = req.body;
    const { name, description, imageType, image, imageUrl, categories } = await updateImaging(researcherId, id, updatedImagingData);

    // Logging
    await logCreate(researcherId, `updated Patient ${name}'s Imaging Data`, "SUCCESS");

    res.status(200).json({ id, name, description, imageType, image, imageUrl, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.put('/update/signal/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const updatedSignalData = req.body;
    const { name, description, signalType, dataPoints, duration, sampleRate, categories } = await updateSignal(researcherId, id, updatedSignalData);

    // Logging
    await logCreate(researcherId, `updated Patient ${name}'s Signal Data`, "SUCCESS");

    res.status(200).json({ id, name, description, signalType, dataPoints, duration, sampleRate, categories });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// LOG ROUTES
app.get('/log/list', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { logs } = await logList(researcherId);

    res.status(200).json({ logs });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/log/researcher/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const researcherId = res.locals.researcherId;
    const { logs } = await logResearcher(researcherId, id);

    res.status(200).json({ logs });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})


// SEARCH ROUTES
app.get('/search/patients/:searchTerm', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { searchTerm } = req.params;
    const { patients } = await searchPatient(researcherId);

    // Logging
    await logCreate(researcherId, `viewed a list of patients with a search ${searchTerm}`, "SUCCESS");

    res.status(200).json({ patients });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/search/phenotypes/:searchTerm', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { searchTerm } = req.params;
    const { phenotypes } = await searchPhenotype(searchTerm);

    // Logging
    await logCreate(researcherId, `viewed a list of phenotype data with a search ${searchTerm}`, "SUCCESS");

    res.status(200).json({ phenotypes });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
})

app.get('/search/genomics/:searchTerm', authenticateToken, async (req: Request, res: Response) => {
  try {
    const researcherId = res.locals.researcherId;
    const { searchTerm } = req.params;
    const { genomics } = await searchGenomic(searchTerm);

    // Logging
    await logCreate(researcherId, `viewed a list of genomic data with a search ${searchTerm}`, "SUCCESS");

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

  if (!accessToken && !refreshToken) return res.status(401).json({ error: "No token provided." });

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
    // If access token is expired or invalid, attempt to use refresh token
    if (!refreshToken) { return res.status(401).json({ error: "No refresh token provided." }); }

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

    // For any other errors
    return res.status(500).json({ error: "An unexpected error occurred when authenticating token." });
  }
}
