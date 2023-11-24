import React from 'react'
import { Link, IndexLink } from 'react-router'

const HeaderMenu = ({ basketCount, basketCountVerkaufen }) => {
        return (
            <nav>
                <ul id="header-menu">
                    <li><Link to="/verkaufen" activeClassName="active" >Verkaufen</Link></li>
                    <li><Link to="/kaufen" activeClassName="active" >Kaufen</Link></li>
                    <li><Link to="/ueber-uns" activeClassName="active" >Über uns</Link></li>
                    <li>
                        <div id="cart-total" className="cart-total-kaufen"><span className="text">{basketCount}</span></div>
                        <Link to="/warenkorb" activeClassName="active">Warenkorb</Link>
                    </li>
                    <li>
                        <div id="cart-total" className="cart-total-verkaufen" ><span className="text">{basketCountVerkaufen}</span></div>
                        <Link to="/verkaufen/warenkorb" activeClassName="active">Warenkorb Verkaufen</Link>
                    </li>
                </ul>
            </nav>
        )
    }

export default HeaderMenu