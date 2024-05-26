import React from "react";
import LoginForm from "./LoginForm";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";


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