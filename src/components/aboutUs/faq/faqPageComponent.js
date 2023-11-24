import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

import SearchBarFaqPage from "./searchBarFaqPage"
import {cookieApi} from "../../../api/apiCookie";

class FaqPageComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataCategories: [],
            selectedCategory: {
                id: 'all',
                title: 'Alle'
            },
            searchItemFaqId: null,
            mobileView:{
                showSidebar: true,
                showContent: false
            },
            openLink: false,
            hash: window.location.hash
        }

        this.getData = this.getData.bind(this)
        this.mapCategoriesSidebar = this.mapCategoriesSidebar.bind(this)
        this.mapCategoriesTopFilter = this.mapCategoriesTopFilter.bind(this)
        this.mapContent = this.mapContent.bind(this)
        this.handlerChangeSelectedCategoryId = this.handlerChangeSelectedCategoryId.bind(this)
        this.setSearchParams = this.setSearchParams.bind(this)
        this.handlerHelpfulButton = this.handlerHelpfulButton.bind(this)
        this.handlerBackMobile = this.handlerBackMobile.bind(this)
    }

    componentDidMount(){
        this.getData()
        this.checkHashLink()
    }
    componentDidUpdate(){
        this.checkHashLink()
    }
    checkHashLink(){
        let { openLink, hash } = this.state
        if(hash && !openLink && !!this[`inputElement${hash.slice(1)}`]){
            let linkSelector = '#link' + hash.slice(1)
            this[`inputElement${hash.slice(1)}`].click()
            $("html, body").animate({ scrollTop: $(linkSelector).offset().top - 80 }, 600)
            this.setState({ openLink : true })
        }
        else return false
    }
    getData(){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get('/api/getFAQList')
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ data: result.data.FAQList, dataCategories: result.data.FAQCategories })
            })
    }
    handlerBackMobile(){
        let mobileView = {...this.state.mobileView}
        if(window.isMobile){
            mobileView.showContent = false
            mobileView.showSidebar = true
            this.setState({ mobileView })
        }
    }
    handlerChangeSelectedCategoryId(item){
        let mobileView = {...this.state.mobileView}
        if(window.isMobile){
            mobileView.showContent = true
            mobileView.showSidebar = false
        }

        this.setState({ selectedCategory: { ...this.state.selectedCategory,
                                            id: item.id,
                                            title: item.title},
                        mobileView
        })
    }
    setSearchParams(searchParam){
        if(searchParam){
            let title = '',
                mobileView = {...this.state.mobileView}
            if(window.isMobile){
                mobileView.showContent = true
                mobileView.showSidebar = false
            }
            this.state.dataCategories.forEach( item => {
                if(item.id == searchParam.categoryId) title = item.title
            })
            window.location.hash = searchParam.categoryId + '-' + searchParam.id
            this.setState({ searchItemFaqId: searchParam.id,
                            selectedCategory: { ...this.state.selectedCategory,
                                id: searchParam.categoryId,
                                title
                            },
                            mobileView,
                            openLink : true
            })
        }
        else{
            this.setState({ searchItemFaqId: null,
                            selectedCategory: { ...this.state.selectedCategory,
                                                id: 'all',
                                                title: 'Alle'
                            }
            })
        }
    }
    mapCategoriesSidebar( item ){
        return(
            <li key={item.id}
                onClick={() => this.handlerChangeSelectedCategoryId(item)}>
                <div className="image">
                    <img src={`/images/design/faq_page/sidebar_icon_${item.id}.svg`} alt=""/>
                </div>
                <span>{item.title}</span>
            </li>
        )
    }
    mapCategoriesTopFilter( item ){
        let { selectedCategory } = this.state
        return(
            <li key={item.id}
                className={ selectedCategory.id == item.id ? 'active' : ''}
                onClick={() => this.handlerChangeSelectedCategoryId(item)}> {item.title} </li>
        )
    }
    handlerHelpfulButton(e, categoryId, itemId, isHelpful){
        let cookieValue = cookieApi.getCookie('arrayOfClickedHelpBtnOnFaq'),
            cookieData = [],
            isClickThisHelpfulBtn = false,
            targetBtn = e.target

        if(cookieValue){
            cookieData = JSON.parse(cookieValue)
            isClickThisHelpfulBtn = cookieData.some( item => item.id == itemId && item.categoryId == categoryId)
        }
        if(!isClickThisHelpfulBtn){
            let currentObjForCookie = { id: itemId, categoryId, isHelpful },
                array = [...cookieData, currentObjForCookie],
                action = isHelpful ? 'increase' : 'reduce'

            cookieApi.setCookie('arrayOfClickedHelpBtnOnFaq', JSON.stringify(array), { expires: 'Fri, 31 Dec 9999 23:59:59 GMT' })
            axios.get(`/api/updateFAQCounter?id=${itemId}&action=${action}`)
                .then( result => {
                    $(targetBtn).addClass('active')
                })
        }

    }
    mapContent(item){
        let { selectedCategory, searchItemFaqId } = this.state,
            equalSelectedCategory = selectedCategory.id == item.categoryId || selectedCategory.id == 'all',
            _this = this

        if(item.items.length > 0 && equalSelectedCategory ){
            return(
                <div key={item.categoryId}>{item.items.map(mapCategories) }</div>
            )
        }
        else return null
        function mapCategories(itemQuestion){
            let showQuestion = !searchItemFaqId ? true : searchItemFaqId == itemQuestion.id,
                classNameLi = searchItemFaqId ? 'active-search active' : '',
                classNameArrow = searchItemFaqId ? 'arrow up' : 'arrow down',
                cookieValue = cookieApi.getCookie('arrayOfClickedHelpBtnOnFaq'),
                cookieData = [],
                thisHelpfulBtnData = null,
                classNameHelpfulBtnYes = '',
                classNameHelpfulBtnNo = ''

            if(cookieValue){
                cookieData = JSON.parse(cookieValue)
                thisHelpfulBtnData = cookieData.find( itemCookie => itemCookie.id == itemQuestion.id && itemCookie.categoryId == item.categoryId)
                if(thisHelpfulBtnData){
                    thisHelpfulBtnData.isHelpful
                        ? classNameHelpfulBtnYes = 'active'
                        : classNameHelpfulBtnNo = 'active'
                }
            }

            function handlerShowAnswer(e){
                $(e.currentTarget).parent().removeClass('active-search').toggleClass('active')
                $(e.currentTarget).parent().hasClass('active')
                    ? $(e.currentTarget).parent().find('.answer').slideDown(200)
                    : $(e.currentTarget).parent().find('.answer').slideUp(200)
            }
            if( showQuestion){
                return(
                    <li key={itemQuestion.id} className={classNameLi}
                        id={'link' + item.categoryId + '-' +itemQuestion.id}>
                        <a href={`#${item.categoryId}-${itemQuestion.id}`} className="question"
                           ref={input => _this[`inputElement${item.categoryId}-${itemQuestion.id}`] = input}
                           onClick={handlerShowAnswer}>
                            {itemQuestion.title}
                            <i className={classNameArrow}/>
                        </a>
                        <div className="answer">
                            <div dangerouslySetInnerHTML={{ __html: itemQuestion.description }}/>
                            <p className="helpful-counter">Fandest du dies hilfreich ?&nbsp;
                                <span className={classNameHelpfulBtnYes}
                                      onClick={(e) => _this.handlerHelpfulButton(e, item.categoryId, itemQuestion.id, true)}>Ja</span>
                                &nbsp;oder&nbsp;
                                <span className={classNameHelpfulBtnNo}
                                      onClick={(e) => _this.handlerHelpfulButton(e, item.categoryId, itemQuestion.id ,false)}>Nein</span>
                            </p>
                            <Link to="/kontakt" className="another-question">Ich habe weitere Fragen</Link>
                        </div>
                    </li>
                )
            }
            else return null
        }
    }
    render() {
        let { data, dataCategories, selectedCategory, mobileView } = this.state

        return (
            <div className="faq-page-content">
                <div className="container">
                    <div className="row row-flex">
                        <div className="col-sm-4 col-flex">
                            <SearchBarFaqPage setSearchParams={this.setSearchParams}/>
                            { (!window.isMobile || mobileView.showSidebar) &&
                                <div className="side-bar">
                                    <ul>
                                        <li onClick={() => this.handlerChangeSelectedCategoryId({id: 'all', title: 'Alle'})}>
                                            <div className="image">
                                                <img src="/images/design/faq_page/sidebar_icon_all.svg" alt=""/>
                                            </div>
                                            <span>Alle Artikel</span>
                                        </li>
                                        {dataCategories.map(this.mapCategoriesSidebar)}
                                    </ul>
                                </div>
                            }
                        </div>
                        <div className="col-sm-8 col-flex">
                            {(!window.isMobile || mobileView.showContent) &&
                                <div className="main-part">
                                    <div className="title">
                                        {window.isMobile && <img src="/images/design/faq_page/faq_page_arrow-back.svg"
                                                                 onClick={this.handlerBackMobile}
                                                                 alt=""/> }
                                        {this.state.selectedCategory.title} Artikel</div>
                                    <div className="tags">
                                        <ul>
                                            <li className={ selectedCategory.id == 'all' ? 'active' : ''}
                                                onClick={() => this.handlerChangeSelectedCategoryId({id: 'all', title: 'Alle'})}>
                                                Alle Artikel
                                            </li>
                                            {dataCategories.map(this.mapCategoriesTopFilter)}
                                        </ul>
                                    </div>
                                    <div className="content">
                                        <ul>
                                            {data.map(this.mapContent)}
                                        </ul>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
FaqPageComponent.propTypes = {}
FaqPageComponent.defaultProps = {}
export default FaqPageComponent