import React from 'react';

function App() {
  const checkBackend = async () => {
    try {
      const response = await fetch('/health');
      const result = await response.text();
      alert(result);
    } catch (error) {
      alert('Error connecting to backend');
    }
  };

  return (
    <div>
      <button onClick={checkBackend}>Check Backend</button>
    </div>
  );
}

export default App;
