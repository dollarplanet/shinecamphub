import React from "react";
import SectionLogin from "../component/section_login"; // Ensure the correct path
import photo from "../images/image_background_side.png";
import photo2 from "../images/logo.png";
import "./login.css"; // Assuming you have a CSS file for styling

const Login = ({ setLoggedIn, setEmail }) => {
  return (
    <div className="loginContainer">
      <div className="loginContent">
        <div className="logoContainer">
          <img src={photo2} alt="Logo" />
        </div>
        <SectionLogin setLoggedIn={setLoggedIn} setEmail={setEmail} />
      </div>
      <div className="imageContainer">
        <img src={photo} alt="Background" />
      </div>
    </div>
  );
};

export default Login;
