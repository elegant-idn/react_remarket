import React, { Component } from 'react'
import { Link } from 'react-router'
import { cookieApi } from '../../api/apiCookie'

class CookieBanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showBanner: true
        }

        this.closeBanner = this.closeBanner.bind(this)
    }
    closeBanner(){
        cookieApi.setCookie('cookieBannerHasBeenClosed', 'true', {path: '/', expires: window.expireTimeWriteRating })
        this.setState({ showBanner: false })
    }
    render() {
        let { showBanner } = this.state
        if(showBanner){
            return (
                <div className="cookie-banner">
                    <div className="content">
                        <div className="image">
                            <img src="/images/design/cookies.svg" alt=""/>
                        </div>
                        <p>Wir verwenden Cookies, um Ihre Nutzererfahrung auf unserer Webseite zu verbessern. Sie akzeptieren, indem Sie auf unserer Webseite weitersurfen, dass wir Cookies einsetzen und verwenden. Für weitere Informationen über Cookies besuchen Sie bitte unsere <Link to="/ueber-uns/datenschutzerklaerung/">Datenschutzrichtlinie</Link>.</p>
                    </div>
                    <div className="close-btn" onClick={this.closeBanner}/>
                </div>
            )
        }
        else return null
    }
}
CookieBanner.propTypes = {}
CookieBanner.defaultProps = {}
export default CookieBanner