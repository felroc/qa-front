// Componente basado en clase
import React, { Component } from "react";
import myImage from './img/sqa.jpg';

class Welcome extends Component {
    render() {
        return (
        <>
            <h1>Bienvenido!</h1>
            <hr></hr>
            <p>
                Sistema para la gestión y control de calidad del Sofware
            </p>
            <img src={myImage} alt="Imagen SQA"></img>
        </>
        );
    }
}

export default Welcome;