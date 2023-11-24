import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'

import ModelInfoBlock from '../../detailModelPage/modelInfoBlock'
import { pushKlavioIdentify } from '../../../helpers/helpersFunction'


class QuickViewPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentModel: this.props.model,
            showPrev: this.props.allModels[0].id !== this.props.model.id,
            showNext: this.props.allModels[this.props.allModels.length-1].id !== this.props.model.id
        }

        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.nextModel = this.nextModel.bind(this)
        this.prevModel = this.prevModel.bind(this)
    }
    componentDidMount(){
        document.addEventListener("keyup", this.handleKeyPress, {passive: true})

    }
    componentWillUnmount(){
        document.removeEventListener("keyup", this.handleKeyPress)
    }
    handleKeyPress(e){
        if(e.key === "Escape"){
            this.props.closeQuickView()
        }
        else if(e.key === 'ArrowRight'){
            this.state.showNext && this.nextModel()
        }
        else if(e.key === 'ArrowLeft'){
            this.state.showPrev && this.prevModel()
        }
    }
    nextModel(){
        let position = this.props.allModels.findIndex( item => item.id === this.state.currentModel.id)
        if(position >= 0){
            this.setState({ currentModel: this.props.allModels[position+1],
                            showPrev: true,
                            showNext: this.props.allModels.length > position+2 })
        }
    }
    prevModel(){
        let position = this.props.allModels.findIndex( item => item.id === this.state.currentModel.id)
        if(position >= 0){
            this.setState({ currentModel: this.props.allModels[position-1],
                            showNext: true,
                            showPrev: position-1 > 0 })
        }
    }
    handleCloseQuickView = () => {
        this.props.closeQuickView()
    }
    render() {
        let modelName = this.state.currentModel.model.split(" ").join('-').toLowerCase(),
            color = this.state.currentModel.color.toLowerCase() || 'color',
            capacity = this.state.currentModel.capacity.toLowerCase() || 'capacity',
            deviceName = this.state.currentModel.deviceName.replace(/ /g, '-').toLowerCase()
        let product = this.state.currentModel;
        gtag('event', 'view_item', {
            "items": [
                {
                    "id": product.shortcode,
                    "name": product.descriptionLong,
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "price": product.price,
                    "brand": product.deviceName,
                    "category": this.props.deviceName||'',
                }
            ]
        });

        pushKlavioIdentify();

        var klavioItem = {
            "ProductName": product.descriptionLong,
            "ProductID": product.shortcode,
            "Categories": [this.props.deviceName],
            "ImageURL": product.deviceImages.mainImg.src,
            "URL": window.location.href,
            "Brand": product.deviceName,
            "Price": product.discountPrice ||  product.price,
            "CompareAtPrice": product.price
        };

        _learnq.push(["track", "Viewed Product", klavioItem]);

        _learnq.push(["trackViewedItem", {
            "Title": klavioItem.ProductName,
            "ItemId": klavioItem.ProductID,
            "Categories": klavioItem.Categories,
            "ImageUrl": klavioItem.ImageURL,
            "Url": klavioItem.URL,
            "Metadata": {
                "Brand": klavioItem.Brand,
                "Price": klavioItem.Price,
                "CompareAtPrice": klavioItem.CompareAtPrice
            }
        }]);

        return (
            <div className="quickViewPage-overlay">
                <div className="container">
                    <div className="quickViewPage-wrap">
                        <div className="quickViewPage-wrap-btnClose" onClick={this.props.closeQuickView}>
                            <i className="fa fa-times" aria-hidden="true"/>
                        </div>
                        { this.state.showNext && <span className="next" onClick={this.nextModel}>
                                                <i className="fa fa-angle-right" aria-hidden="true"/>
                                             </span>
                        }
                        { this.state.showPrev && <span className="prev" onClick={this.prevModel}>
                                                <i className="fa fa-angle-left" aria-hidden="true"/>
                                             </span>
                        }
                        <ModelInfoBlock currentModel={[this.state.currentModel]}
                                        quickPreview={true}
                                        handleCloseQuickView={this.handleCloseQuickView}
                                        openSuccessAddToBasket={this.props.openSuccessAddToBasket}
                                        capacityName={this.props.capacityName}
                                        upsellingItems={[]} />
                        <div className="cb"/>
                        <div className="col-sm-12" style={{marginTop: '15px'}}>
                            <Link className="btn"
                                  style={{color: '#fff'}}
                                  to={`/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${this.state.currentModel.shortcode}`}>
                                Im Detail anzeigen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </Link>
                        </div>
                        <div className="cb"/>
                    </div>
                </div>
            </div>
        );
    }
}

QuickViewPage.propTypes = {}
QuickViewPage.defaultProps = {}

export default QuickViewPage
