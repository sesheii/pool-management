import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'; // якщо ви використовуєте CSS
import LoginForm from "./components/LoginForm.jsx"; 
import HomePage from "./components/HomePage.jsx"; 
import AboutPage from "./components/AboutPage.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route path='/' exact element={<HomePage/>} />
            <Route path='/login' element={<LoginForm/>} />
            <Route path='/about' element={<AboutPage/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
