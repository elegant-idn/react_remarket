import React, { Component } from 'react';

import '../../../i18n'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'

export class MenuMobileLang extends Component {
  constructor(props) {
    let lang = window.localStorage.getItem('lang')
    if (typeof(lang) == 'undefined' || !lang || lang == '')
        lang = 'de'
    super(props)
    this.state = {
      lang: lang,
      langOptions:[
        {
          title: 'DE',
          value: 'de',
          image: '/images/design/lang/de.svg'
        },
        {
          title: 'FR',
          value: 'fr',
          image: '/images/design/lang/fr.svg'
        },
        {
          title: 'IT',
          value: 'it',
          image: '/images/design/lang/it.svg'
        },
        {
          title: 'EN',
          value: 'en',
          image: '/images/design/lang/en.svg'
        },
      ]
    }

    this.selLang = this.selLang.bind(this)
    this.applyLang = this.applyLang.bind(this)
  }
  componentDidMount() {
    let headerHeight = $('.header-mobile.scrolling-header').innerHeight()
    $('.menuMobile').css({
      top: headerHeight + 'px',
      maxHeight: `calc( 100vh - ${headerHeight}px`,
      transform: 'translateY(0)'
    });
  }

  selLang (e, item) {
    this.setState({
      lang: item.value
    })
  }

  applyLang () {
    let {lang} = this.state
    let {hideLangMenu} = this.props
    window.localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
    if (hideLangMenu) {
      hideLangMenu()
    }
  }

  render() {
    let {  lang, langOptions } = this.state
    return (
      <div className="menuMobile langUse">
        <nav>
          <ul>
            {
              langOptions.map( ( item, i ) => {
                return(
                  <li key={`lang-${i}`} className={item.value === lang ? "acitve" : null} onClick={(e) => this.selLang(e, item)}>
                    <img src={`/images/design/lang/${item.value}.svg`}></img>
                    <a style={{textDecoration: 'none'}}>{item.title}</a>
                  </li>
                )
              })
            }
          </ul>
        </nav>
        <div className="langUseBtn" onClick={this.applyLang}>
          anwenden
        </div>
      </div>
    )
  }
}

MenuMobileLang.propTypes = {}
MenuMobileLang.defaultProps = {}

export default withTranslation()(MenuMobileLang)
