# Pet_1

This project contains a React TypeScript frontend and a C# backend. Below are the instructions to set up and run both parts locally in debug mode.

## Prerequisites

### General
- Ensure you have Git installed.

### Frontend
- Node.js (LTS version recommended)
- npm or yarn (comes with Node.js)

### Backend
- .NET SDK (version 6.0 or later)

## Project Structure

- `frontend/`: Contains the React TypeScript frontend.
- `backend/`: Contains the C# backend.

## Setup Instructions

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the backend in debug mode:
   ```bash
   dotnet run
   ```

4. The backend will start on `http://localhost:5000` (or another port if configured).

## Connecting Frontend and Backend

- Ensure both the frontend and backend are running.
- Update the API base URL in the frontend code (if necessary) to point to the backend's URL (e.g., `http://localhost:5000`).

## Notes

- For debugging, you can use Visual Studio Code or any other IDE that supports React and .NET development.
- Ensure the ports used by the frontend and backend do not conflict.
