import React from 'react'
import { Link } from 'react-router'

const Model = () => {
    const styleBg = {
        backgroundImage: 'url(/images/model/iphone.png)'
    };
    return (
        <div>
            <h2>Modell auswählen</h2>
            <div className="model">
                <Link to="/verkaufen/apple-iphone" title="Apple iPhone 7" className="row">
                    <span className="image" style={styleBg}></span>
                    <span className="title">Apple iPhone 7</span>
                </Link>
                <Link to="/verkaufen/apple-ipad" title="Apple iPhone 7 Plus" className="row">
                    <span className="image" style={styleBg}></span>
                    <span className="title">Apple iPhone 7 Plus</span>
                </Link>
                <div className="cb"></div>
            </div>
            <div className="line"></div>
        </div>
    )
}
export default Model;