import React, {Component} from 'react'

import HeaderMobile from '../header/headerMobile'
import MainPage from '../../mainPage/mainPage'
import HeaderBottomMainPage from '../../header/headerBottomMainPage'
import Footer from '../../Footer/footer'

class MainMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    componentDidUpdate(){
         if(!$('.hamburger').hasClass('open')){
             $('#mobile > .mainPage > .headerBottom-mobile .header-bottom').css('display','block');
             $('#mobile > .mainPage > .mainPage').css('display','block');
             $('#mobile footer').css('display','block');
         }
     }

    render() {
        return (
            <div className="mainPage">
                <HeaderMobile menu={true} title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <div className="headerBottom-mobile">
                    <HeaderBottomMainPage/>
                </div>
                <div className="discount border-gradient">
                    <strong className="price">-30.–</strong>
                    <p>Rabatt auf gebrauchte Geräte ab 299.- CHF</p>
                </div>
                <MainPage/>
                <Footer/>
            </div>
        )
    }
}

MainMobile.propTypes = {}
MainMobile.defaultProps = {}

export default MainMobile
