import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      alert(`Response from backend: ${data.message}`);
    } catch (error) {
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1>Frontend-Backend Connection Test</h1>
        <button onClick={handleClick}>Test Backend Connection</button>
      </header>
    </div>
  );
}

export default App;
