import React from "react";
import LoginForm from "./LoginForm";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  return (
    <div>
      <GlobalHeader/>
      <LoginForm/>
      <GlobalFooter/>
    </div>
  )
}
 
export default LoginPage;