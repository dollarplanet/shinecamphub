import React from "react";
import SectionRegister from "../component/section_register_healer";
import photo from "../images/image_background_side.png";
import photo2 from "../images/logo.png";
import "./register_healer.css"; // Assuming you have a CSS file for styling

const Login = ({ setLoggedIn, setEmail }) => {
  return (
    <div className="loginContainer">
      <div className="loginContent">
        <div className="logoContainer">
          <img src={photo2} alt="Logo" />
        </div>
        <SectionRegister />
      </div>
      <div className="imageContainer">
        <img src={photo} alt="Background" />
      </div>
    </div>
  );
};

export default Login;

