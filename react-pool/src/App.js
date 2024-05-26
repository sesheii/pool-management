import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'; // якщо ви використовуєте CSS
import LoginForm from "./components/LoginForm.jsx"; 
import HomePage from "./components/HomePage.jsx"; 
import AboutPage from "./components/AboutPage.jsx"; 
import SuccessPage from './components/SuccessPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import LandingPage from './components/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route path='/' exact element={<LandingPage/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/home' element={<HomePage/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
