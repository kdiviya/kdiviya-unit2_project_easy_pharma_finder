# kdiviya-unit2_project_easy_pharma_finder

# Easy Pharma Finder

## Project Description

**Easy Pharma Finder** is a web application designed to help insured users navigate the complex landscape of prescription medication costs. Given the frequent changes in healthcare plans and medication providers, understanding the real cost of prescriptions can be challenging for both patients and caregivers. This platform addresses that challenge by providing users with transparent, personalized pricing information. By logging in with their insurance details, users can view the actual cost of their prescriptions, including deductible status and copay information, all in a single, easy-to-read view. The application also allows users to compare medication prices across local pharmacies based on their zip code. Additionally, a **Family Members** feature is implemented, enabling users to list and compare medication costs for all their family members, making it easier to find the most cost-effective options for everyone’s prescriptions.

---

## Features

1. **User Login with Insurance Details**:  
    Users can log in by entering their insurance credentials, which will allow the system to generate personalized pricing for medications. This includes important information such as the actual cost of the medication, copay amounts, insurance deductible status, and the option for home delivery. 
   
2. **Add Family Members**:  
   Users can add/remove family members to their account. This allows them to manage prescription medication details for the whole family in one place.

3. **Compare Medication Costs**:  
   After logging in, users can view and compare the cost of their medications at different local pharmacies. Prices are personalized based on the user's insurance details and zip code.

---

## Technologies Used

- **Frontend**: React
- **Backend**: Spring Boot (Java)
- **Database**: MySQL
- **Authentication**: Session-Based Username and Password Authentication with Spring Security
- **Styling**: Responsive Layout Design Using Flexbox, CSS Grid, and Media Queries
- **API Integration**: RESTful APIs for User Authentication, storing hashed passwords using BCryptPasswordEncoder and CRUD operations (Create, Read, Update, Delete) on user details.

---

## Installation Steps
Ensure the following items are installed on the local machine to run the project

- [Node.js] (https://nodejs.org/) (for the front-end react app)
- [JavaJDK] (https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) (for the back-end spring boot application)
- [Maven] (https://maven.apache.org/install.html) (for building the back-end application)
- [MYSQL] (https://dev.mysql.com/downloads/mysql/) (SQL database for back end storage)


Follow these steps to set up the development environment and run the application locally:

### 1. **Clone the Repository**

Clone the project repository to your local machine using, 
git clone <<github url>>

### 2. **Set Up Backend**

Install Java JDK and maven for building the back end,
brew install maven (for mac users)

### 3. **Set Up MySQL Database**

Install MySQL and Create a new MySQL database for the application using,
CREATE DATABASE databasename;

### 4. **Configure the application.properties file in src/main/resources to connect the Spring Boot application to the MySQL database**

spring.application.name=easy-pharma-finder
spring.datasource.url=jdbc:mysql://yourhostname:portnumber/easy_pharma_finder
spring.datasource.username=username
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

### 5. **Build and Run the Backend in IntelliJ IDEA**

1. Open IntelliJ IDEA and import the project by selecting File > Open, and choose the project folder.
2. Ensure that the project SDK is set to Java 21. To do this: Go to File > Project Structure. Under Project Settings, select Project, and set the Project SDK to JDK 21.
3. In IntelliJ, run the Spring Boot application:
    Open the EasyPharmaFinderApplication.java file.
    Click on the green run button at the top right or use Shift + F10.

This will start the backend API on http://localhost:8080.

### 6. **Set Up Frontend (React)**
1. Install Node.js (Download Node.js)
2. Install Frontend Dependencies (cd frontend & npm install)
3. Run the Frontend in VS Code using npm start. This will launch the frontend application on http://localhost:3000.
4. Verify the Application 
    Once both the backend and frontend are running, you can access the full application by opening your browser and navigating to:
    Frontend: http://localhost:3000
    Backend API: http://localhost:8080

---

[Link to Wireframe] (https://www.figma.com/design/OUrYpu21Q18TiYAAdhzLgf/EasyPharmaFinder?node-id=4-91&m=dev&t=LuC8ta0ngmAJIUdk-1)

[Link to ER diagram] (https://www.figma.com/board/L54wTKmStp5rQ7msJfiSaJ/ERD_EasyPharma_Finder?node-id=0-1&t=EqZJvRXY4w0mAP2f-1)

---

## Future Features / Unresolved Issues

- **Email Medication Cost Breakdown**  
  In the future, users will be able to email the medication cost breakdown directly from the application. This feature will make it easier for users to share the information with family, caregivers, or healthcare providers and keep a record of their medication costs.

- **Medication Price Alerts**  
  Implement a notification system that allows users to set alerts when medication prices drop or become more affordable at certain pharmacies, making it easier for them to track cost changes.

- **Getting Real-Time Data for Medication Prices**  
  One of the challenges is obtaining real-time pricing data for medications from various pharmacies. While we can show base pricing data, getting accurate and up-to-date information across multiple pharmacies is a challenge due to API limitations and the dynamic nature of drug pricing.






