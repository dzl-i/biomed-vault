# BiomeData

**"Empowering Biomedical Research Through Unified Data Management"**

The Australian Biomedical Data Repository System aims to provide a secure, centralized platform for Australian researchers to store and manage diverse biomedical data, including whole genome sequencing (WGS), whole exome sequencing (WES), mutation data, phenotypes, imaging data, and signals. This platform will serve as a comprehensive database, enabling researchers to store, search, and retrieve data efficiently, while also providing powerful tools for data visualization, analysis, and reporting. Inspired by projects like the UK Biobank, this system will promote data sharing and collaboration among the Australian research community, while ensuring data integrity, security, and compliance with ethical and legal standards.

## Routes
Planned routes that would be integral to the workflow of the Data Repository System.

### AUTH Routes
- `POST /auth/register` - Register a new account
- `POST /auth/login` - Login to an existing account
- `POST /auth/logout` - Logs user out of existing session
- `POST /auth/refreshToken` - Refreshes access token if a refresh token is valid

### RESEARCHER Routes
- `GET /researcher/profile` - Show details of a researcher's profile (including themselves)
- Modification to researcher's details (e.g. name, institution, etc.) might be supported

### DATASET Routes
- `GET /dataset/listPatients` - Show a list of available patient datasets
- `GET /dataset/listGenomics` - Show a list of available genomic information datasets
- `GET /dataset/listPhenotypes` - Show a list of available phenotype datasets
- `GET /dataset/listImaging` - Show a list of available biomedical imaging datasets
- `GET /dataset/listSignal` - Show a list of available biomedical signal datasets
- `GET /dataset/listCategory` - Show a list of available datasets based on category

### SEARCH Routes
- `GET /search` - Search across all datasets with filters

### OVERVIEW Routes
- `GET /overview/patient` - View a comprehensive overview of the dataset such as patient demographic information (e.g. age, sex)
- `GET /overview/genomic` - View a comprehensive overview of the dataset such as genomic profiles and mutation variants
- `GET /overview/phenotype` - View a comprehensive overview of the dataset such as phenotypic details and trait associations
- `GET /overview/imaging` - View a comprehensive overview of the dataset such as linked imaging and signal data
- `GET /overview/signal` - View a comprehensive overview of the dataset such as linked imaging and signal data

### UPLOAD Routes
- `POST /upload/patient` - Upload patient information such as name and age
- `POST /upload/genomic` - Upload genomic information such as WGS and WES
- `POST /upload/phenotype` - Upload phenotypic details such as description and associated traits
- `POST /upload/imaging` - Upload biomedical images such as MRI and CT scans
- `POST /upload/signal` - Upload biomedical signal data such as EEG and ECG

### UPDATE Routes
- These may or may not be supported due to time constraints
- `PUT /update/patient/:id` - Update patient information
- `PUT /update/genomic/:id` - Update genomic information
- `PUT /update/phenotype/:id` - Update phenotypic details
- `PUT /update/imaging/:id` - Update biomedical images
- `PUT /update/signal/:id` - Update biomedical signal data

### PROJECT Routes
- `POST /project/create` - Create a new project with at least one category selected
- `POST /project/join` - Join an existing project using a code
- `POST /project/leave` - Leave an existing project
- `GET /project/list` - List all projects
- `GET /project/details/:id` - Show details of the project
- `PUT /project/update/:id` - Update project details
- `PUT /project/statusUpdate` - Update the project status

### VISUALISATION Routes
- `GET /visualise/genomic/:id` - Generate visualisation for genomic data
- `GET /visualise/phenotype/:id` - Generate visualisation for phenotype data
- `GET /visualise/signal/:id` - Generate visualisation for signal data

### LOGS Routes
- `POST /logs/create` - Log an event
- `GET /logs/list` - List the event logs
- `GET /logs/researcher/:id` - Get logs for a specific researcher

### Notes
- Due to privacy concerns, researchers can only view patients that they have "created"
- There will be "Projects" so that researchers can collaborate on some cases -> technicalities will be defined later
- More will be added as the project progresses

## UI/UX Design
Some plans for the UI/UX design to make the web application more intuitive for researchers. Planned colour scheme is white, yellow, and purple for a modernised look.

### Register/Login Page
- Login page should be relatively straightforward - just email and password
- Register page is quite extensive, a lot of details - name, institution, email, username, password -> how to make this seem less daunting? Cleaner ui, plenty spacing so it does not look cramped
- Aiming for a clean

### Dashboard
- Several tabs for the datasets such as Patients, Genomic Data, etc.
- One tab for "All", where all datasets will be shows and searches/filters can be applied here
- Vertical navbar for a cleaner look

## Technical Requirements

### Security Workflow
- User has access tokens and refresh tokens in cookies -> tokens has researcherId embedded in it (JWTs).
- We can get researcherId by decoding the token.
- When a user makes an API call, tokens are sent together with the request.
- Before any requests are processed, the access token is checked to see if it is valid -> check to see if it exists (in the database) and if is not expired yet
- If the access token exists in the database but is expired, check for the refresh token and check if it is valid. If the refresh token is valid, generate a new access token and refresh token pair and assign it to the user. Delete the old access-refresh token pair.
- If the access token exists in the database and it is not expired, proceed with processing the request.
- If the access token is not valid, return a HTTP Error code 401 Unauthorised.
- Refresh tokens are one time use - it can only be used once to generate a new access token. Once it is used, it cannot be used again to generate a new token pair. Hence, it should be deleted from the database.