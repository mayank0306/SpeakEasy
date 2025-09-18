SpeakEasy 🎙️
An AI-powered public speaking coach designed to help users improve their presentation skills through data-driven feedback. This project was built for a hackathon by the Kernel Crew team.

Key Features
Pacing Analysis: Calculates your words-per-minute to help you maintain an ideal speaking speed.

Filler Word Detection: Identifies and counts common filler words like "um," "uh," and "like" to increase fluency.

Full Transcription: Provides a complete text transcript of your speech for review.

Actionable Dashboard: Displays all your results in a simple, easy-to-understand interface.

Technology Stack
Frontend: React.js

Backend: Node.js with Express.js

AI / Speech-to-Text: AssemblyAI

Database: MongoDB Atlas

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites

You will need to have Node.js and Git installed on your computer.

Installation & Setup

Clone the repository:

git clone [https://github.com/mayank8306/SpeakEasy.git](https://github.com/mayank8306/SpeakEasy.git)

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


### How to Add This to Your Project

1.  In your `SpeakEasy` folder in VS Code, create a new file named `README.md`.
2.  Copy and paste the content from the file above into your new `README.md` file.
3.  Save the file.
4.  In your terminal (inside the `SpeakEasy` folder), run these commands to upload it to GitHub:
    ```bash
    git add README.md
    ```
    ```bash
    git commit -m "docs: Add project README file"
    ```
    ```bash
    git push

