import React from 'react'
import { Link } from 'react-router'

const Services = () => {
    return (
        <div>
          <div className="cb"></div>
            <div className="services">
                <Link to="/verkaufen" title="Gerät verkaufen" className="row">
                    <span className="sell-device"></span>
                    <span className="title">Gerät verkaufen</span>
                </Link>
                <Link to="/kaufen" title="Gerät kaufen" className="row">
                    <span className="buy-device"></span>
                    <span className="title">Gerät kaufen</span>
                </Link>
                <Link to="/reparieren" title="Gerät reparieren" className="row">
                    <span className="repair-device"></span>
                    <span className="title">Gerät reparieren</span>
                </Link>
            </div>

            <div className="line"></div>
        </div>
    )
}

export default Services;