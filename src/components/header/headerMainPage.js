import React, { Component } from 'react';

import HeaderTop from './headerTop'
import HeaderMobile from '../mobile/header/headerMobile';

const HeaderMainPage = ({ params, isJobPage }) => {
        return (
                <header >
                        <HeaderTop params={params} isJobPage={isJobPage}/>
                        {(window.isMobile && !window.isTablet) && <HeaderMobile menu={true} title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>}
                </header>
        )
}

export default HeaderMainPage

