import React from 'react';
import './App.css'; // якщо ви використовуєте CSS
import NavBar from './copmonents/NavBar.jsx';

import LoginForm from "./copmonents/LoginForm.jsx"; 


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LoginForm />
      </header>
    </div>
  );
}

export default App;
