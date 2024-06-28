import React from "react";
import Arrow from "../images/ei_arrow-left.png"
import Logo_barbox from "../images/logo_circle.png"
import Logo_three_circle from "../images/titik_3-removebg-preview 1.png"
import "./barbox.css"

const BarBox = ({title}) => {
    return (
      <div className="barbox">
        <img className="arrow" src={Arrow} alt="icon arrow"/>
        <div className="logo-circle">
            <img src={Logo_barbox} alt="logo barbox"/>
        </div>
        <h1>{title}</h1>
        <div className="logo-three-circle">
            <img src={Logo_three_circle} alt="logo three-circle"/>
        </div>
      </div>
    );
  };
  
  export default BarBox;

