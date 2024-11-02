# Document Processing App 📄
This app helps users process images containing text. Users can upload an image with text, and the app will extract that text and show it along with some user details.

# What Can This App Do? 🎯

Take user information (first name, last name, date of birth)
Accept image uploads
Extract text from images
Calculate user's age
Display all processed information nicely

# Technologies Used 🛠️
# Backend (Server):

Node.js & Express: Creates a server that handles user requests

Tesseract OCR: Reads text from images

Zod: Makes sure user data is correct

Multer: Handles file uploads

# Frontend (Website):

Next.js: Creates the website pages

Axios: Sends data to the server

Tailwind CSS: Makes everything look nice

Zod: Double-checks user data before sending

# How to Install and Run 📦
You can run this application either locally or using Docker.

# Option 1: Local Installation 🏠
Backend Setup:

Install Tesseract OCR first:
# For Ubuntu/Debian
sudo apt update

sudo apt install tesseract-ocr

# For macOS
brew install tesseract

# Install backend dependencies:
cd backend

npm install

Start the server:

Note: Please download nodemon first by using this command 

npm install --save-dev nodemon

or globally: 

npm install -g nodemon

npm start


# Frontend Setup:

Install frontend dependencies:

cd frontend

npm install

Start the website:

npm run dev


# Option 2: Using Docker 🐳
The app is containerized using Docker, making it easy to run everywhere!

# Prerequisites:

Install Docker

Install Docker Compose

# Running with Docker:

Clone the repository:

git clone repository-url

cd project-directory

# Start the application using Docker Compose:
docker-compose up

This will:

Build both frontend and backend containers

Start the entire application

The frontend will be available at http://localhost:3000

The backend will be available at http://localhost:4001


# To stop the application:
docker-compose down


# Docker Commands Cheatsheet:

Build and start containers:

docker-compose up --build

Start containers in background:

docker-compose up -d

Stop containers:

docker-compose down

View container logs:
# All containers
docker-compose logs

# Specific service
docker-compose logs client

docker-compose logs server

# Rebuild a specific service:
docker-compose build client

docker-compose build server

# How It Works 🔄

Users go to the website and see a form

They fill in their:

First Name

Last Name

Date of Birth

Upload an image containing text


# When they click submit:

The form checks if everything is filled correctly
Sends the information to the server
The server processes the image and extracts text
Shows the results on a new page



# Important Notes 📝

The server runs on port 4001

Frontend runs on port 3000

Make sure Tesseract OCR is installed before running locally
Docker setup includes Tesseract OCR installation automatically
Images should be clear for best text extraction
Supported image formats: PNG, JPEG, JPG

# Common Issues 🔧

"Tesseract not found" error:

Solution for local setup: Install Tesseract OCR on your computer

Solution for Docker: Make sure to rebuild the server container


# Form submission errors:

Check if all fields are filled

Make sure the image file is supported


# Docker-specific issues:

Port conflicts: Make sure ports 3000 and 4001 are available

Build errors: Try rebuilding with docker-compose build

Container not starting: Check logs with docker-compose logs

