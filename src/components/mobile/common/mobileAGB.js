import React from 'react';

import HeaderMobile from '../header/headerMobile';
import AGB from '../../aboutUs/agb';

const MobileAGB = () => (
  <div>
    <HeaderMobile
      menu
      title="AGB"
    />
    <div className="mobileAGB">
      <AGB />
    </div>
  </div>
);

export default MobileAGB;
