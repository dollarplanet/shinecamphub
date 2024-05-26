import React from "react";
import SectionLberhasil from "../component/section_Lberhasil";
import photo from "../images/image_background_side.png";
import photo2 from "../images/logo.png";
import "./login-berhasil.css";

const Login = ({ setLoggedIn, setEmail }) => {
  return (
    <div className="loginContainer">
      <div className="loginContent">
        <div className="logoContainer">
          <img src={photo2} alt="Logo" />
        </div>
        <SectionLberhasil />
      </div>
      <div className="imageContainer">
        <img src={photo} alt="Background" />
      </div>
    </div>
  );
};

export default Login;