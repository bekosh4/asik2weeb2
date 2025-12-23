# Assignment 2 — Multi API Dashboard (Node.js)

## 1. Project Overview

This project was developed as part of **Assignment 2: API Integration**.  
The main objective is to demonstrate the ability to work with multiple REST APIs, process data on the **server side**, and display structured information on the **frontend** using clean architecture and best practices.

All application logic related to data fetching, processing, and rendering is implemented inside **`core.js`**, while **HTML contains no business logic**.

---

## 2. Project Objectives

- Retrieve data from multiple APIs using Node.js
- Process and clean API responses on the server side
- Secure API keys using environment variables
- Display structured information on the frontend
- Follow best practices in code organization and design
- Implement a responsive and user-friendly interface

---

## 3. Technologies and Tools

- **Node.js**
- **Express.js**
- **node-fetch**
- **dotenv**
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**

---

## 4. Project Structure

backend2/
│
├── server.js # Express server and API routes
├── package.json # Project metadata and dependencies
├── .env.example # Example environment variables
├── README.md # Project documentation
│
└── public/
├── index.html # Static HTML (no logic)
├── styles.css # UI styling
└── core.js # Frontend logic (all logic here)

yaml
Копировать код

---

## 5. Setup Instructions

### 5.1 Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Internet connection for API requests

---

### 5.2 Installation Steps

1. Clone or download the repository:
```bash
git clone https://github.com/Janattie/backend2.git
Navigate to the project folder:

bash
Копировать код
cd backend2
Install dependencies:

bash
Копировать код
npm install
5.3 Environment Variables Configuration
Create a .env file in the root directory:

env
Копировать код
RANDOMUSER_API_KEY=demo_key
RESTCOUNTRIES_API_KEY=demo_key
EXCHANGERATE_API_KEY=your_real_exchange_rate_key
NEWS_API_KEY=your_real_news_api_key
API keys are not stored in the repository for security reasons.

5.4 Running the Application
Start the server:

bash
Копировать код
npm start
The server runs on:

arduino
Копировать код
http://localhost:3000
6. API Usage Details
6.1 Random User Generator API
Endpoint: https://randomuser.me/api/

Purpose:
Generates a random user profile.

Extracted Data:

First name

Last name

Gender

Profile picture

Age

Date of birth

City

Country

Full address (street name and number)

Server-side processing:
Only required fields are extracted and sent to the frontend as a clean JSON object.

6.2 REST Countries API
Endpoint: https://restcountries.com/

Purpose:
Retrieves country-related data based on the user’s country.

Extracted Data:

Country name

Capital city

Official language(s)

Currency

National flag

Design Notes:

API key is stored in environment variables

Missing or unavailable data is handled gracefully

Only relevant fields are returned to the frontend

6.3 Exchange Rate API
Endpoint: https://www.exchangerate-api.com/

Purpose:
Displays currency exchange rates based on the user’s local currency.

Displayed Rates:

United States Dollar (USD)

Kazakhstani Tenge (KZT)

Example Output:

Копировать код
1 EUR = 1.08 USD  
1 EUR = 495.20 KZT
6.4 News API
Endpoint: https://newsapi.org/

Purpose:
Displays recent news headlines related to the user’s country.

Rules Applied:

English language only

5 headlines maximum

Headline title must contain the user’s country name

Displayed Fields:

Title

Image (if available)

Short description

Link to the full article

7. Frontend Logic Design
Logic Placement
All frontend logic is implemented inside public/core.js

HTML is used only for structure

No inline scripts or logic inside HTML files

Responsibilities of core.js
Handles button click events

Sends requests to server endpoints

Receives and processes JSON responses

Dynamically renders UI components

Handles loading states and errors

8. Key Design Decisions
8.1 Server-Side API Handling
All external API calls are executed on the server side to:

Protect API keys

Avoid CORS issues

Centralize data processing

Improve security and scalability

8.2 Data Cleaning Strategy
Instead of sending full API responses to the frontend:

Server extracts only required fields

Reduces payload size

Improves frontend readability

Simplifies UI logic

8.3 UI and Design Approach
Card-based layout for clear data separation

Anime-inspired (Blue Lock–style) modern UI

Responsive design for different screen sizes

Clear grouping of related information

9. Error Handling Strategy
Server validates required query parameters

Graceful handling of missing or invalid API responses

Frontend displays user-friendly error messages

Prevents application crashes

10. Assignment Compliance Summary
✅ 4 APIs integrated

✅ All API calls handled on server side

✅ Environment variables used for API keys

✅ Frontend logic fully in core.js

✅ No business logic inside HTML

✅ Clean project structure

✅ Server runs on port 3000

11. Conclusion
This project demonstrates the ability to design a clean, secure, and scalable API-driven application using Node.js.
It follows academic and industry best practices for server-side API integration, frontend logic separation, and UI design.
