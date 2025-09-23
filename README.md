SpeakEasy 🎙️
An AI-powered public speaking coach designed to help users improve their presentation skills through data-driven feedback. This project was built for a hackathon by the Kernel Crew team.

Live Demo
Check out the live version of the application here: https://speak-easy-zeta.vercel.app

Key Features
Real-Time Transcription: See your words appear on the screen live as you speak.

Pacing Analysis: Calculates your words-per-minute to help you maintain an ideal speaking speed.

Filler Word Detection: Identifies and counts common filler words like "um," "uh," and "like" to increase fluency.

Long Pause Detection: Measures pauses between words to help you improve the flow of your speech.

Actionable AI Coach: Provides personalized suggestions based on your performance.

Technology Stack
Frontend: React.js (Hosted on Vercel)

Backend: Node.js with Express.js (MVC Architecture, Hosted on Render)

Real-Time & Analysis: AssemblyAI

Database: MongoDB Atlas

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites

You will need to have Node.js and Git installed on your computer.

Installation & Setup

Clone the repository:

git clone [https://github.com/mayank0306/SpeakEasy.git](https://github.com/mayank0306/SpeakEasy.git)

Navigate to the project directory:

cd SpeakEasy

Set up the Backend:

Navigate to the server folder: cd server

Install the required dependencies: npm install

Create a new file named .env in the server folder.

Add your secret keys to the .env file like this:

ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
MONGODB_CONNECTION_STRING=your_mongodb_connection_string_here

Go back to the root directory: cd ..

Set up the Frontend:

Navigate to the client folder: cd client

Install the required dependencies: npm install

Running the Application

You will need to run the backend and frontend servers in two separate terminals.

Start the Backend Server:

In a terminal at the SpeakEasy/server directory, run:

node index.js

The server should now be running on http://localhost:8000.

Start the Frontend Application:

In another terminal at the SpeakEasy/client directory, run:

npm start

The application will open automatically in your browser at http://localhost:3000.

Project by Mayank Jaiswal, Tarun Chaudhary, Ramit Taparia, Sunidhi Mundra, and Raghvendra Verma.

