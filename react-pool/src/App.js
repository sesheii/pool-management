import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'; // якщо ви використовуєте CSS
import HomePage from "./components/HomePage.jsx"; 
import LoginPage from './components/LoginPage.jsx';
import LandingPage from './components/LandingPage.jsx';
import UserList from './components/UserList.jsx';
import CreatePoolUser from './components/CreatePoolUser.jsx';
import UserDetails from './components/UserDetails.jsx';
import CreateSubscriptionType from './components/CreateSubscriptionType.jsx';
import AssignSubscription from './components/AssignSubscription.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-content">
          <Routes>
            <Route path='/' exact element={<LandingPage/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/home' element={<HomePage/>} />
            <Route path='/user-list' element={<UserList/>} />
            <Route path='/create-pool-user' element={<CreatePoolUser/>} />
            <Route path='/user-details/:email' element={<UserDetails/>} />
            <Route path='/createsub-scription-type' element={<CreateSubscriptionType/>} />
            <Route path='/assign-subscription' element={<AssignSubscription/>} />
            
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
