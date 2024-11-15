+++
title = "BiomeData Project Presentation"
outputs = ["Reveal"]
+++

# BiomeData

*Empowering Biomedical Research Through Unified Data Management*

---

## agenda

* Introduction to BiomeData
* Tech Stack
* System Security
* Privacy and Safety
* Live Demonstration
* Future Plans and Improvements

---

## disclaimer and notes

* All data in the application is fictional
  * Data is highly randomised (data such as signal data might not make sense)
* Scope adjustment with approval
  * Reduced expectation for number of visualisations
  * No longer required to generate/export reports on datasets
  * More lenient marking 😅

---

{{% section %}}

## what is biomedata?

A centralised platform for researchers to:
* Store diverse biomedical data
* Manage patient records securely
* Analyse biomedical data
* Collaborate while maintaining privacy and data integrity

---

### app features

* Patient data management
* Upload biomedical data
* Search and filter capability for data retrieval
* Data visualisation
* Individual dataset overview
* Secure researcher authentication

{{% /section %}}

---

{{% section %}}

## tech stack

---

### backend/server

Express.js in TypeScript

RESTful API Design

JWT Authentication

---

### database

PostgreSQL database

Prisma ORM

---

### frontend/client

Next.js in TypeScript Execute (tsx)

---

### deployment

Render for Backend/Server

Vercel for Frontend/Client

App is deployed at https://biomedata.denzeliskandar.com

{{% /section %}}

---

{{% section %}}

## system security

---

### data/form validation

Using RegEx

{{<figure src="/data-validation.png">}}

---

### network security

Using secure HTTPS connection for data transfer

{{<figure src="/https.png">}}

---

### cookies workflow

{{<figure src="/token-flowchart.png">}}

---

### authentication flow

JWT-based authentication

Refresh token rotation

Session management

Brute force protection

Secure password storage - hash before making a request to prevent packet sniffing

---

### session management

Tokens stored as cookies

Retrieve researcher's ID from the JWT

---

### access control

Role-based permissions (who can access what)

Cookies included in API requests

{{% /section %}}

---

{{% section %}}

## privacy and safety

---

### australian privacy act

Only data that are relevant to the research are shown and visible to all researchers with an account 

Confidential data such as patient name and date of birth are hidden to the public

Researcher contact information is available for further inquiries

---

### data logging

Every request is logged, showing researcher's name, their action, and the outcome of the request (success or fail)

Only available to system admins

{{% /section %}}

---

{{% section %}}

## future plans

---

### report generation and export

Generate detailed reports on datasets, including patient demographics, mutation details, and data summaries

Export reports in PDF or CSV format for easy sharing with collaborators or publication purposes

---

### enhanced visualisation

Show more data visualisation that can help with research

---

### projects

Allows researchers to collaborate on some patients, allowing them to add/edit patients and their data

{{% /section %}}

---

## thank you

Questions?
