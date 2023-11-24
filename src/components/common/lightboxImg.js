import React, {Component} from 'react'
import PropTypes from 'prop-types'
let MAGNIFY = null

export default class LightboxImage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentSrc: this.props.src
        }

        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.next = this.next.bind(this)
        this.prev = this.prev.bind(this)
        this.clickThumb = this.clickThumb.bind(this)
        this.enableMagnify = this.enableMagnify.bind(this)
    }
    componentDidMount(){
        this.enableMagnify()
        document.querySelector('body').addEventListener("keyup", this.handleKeyPress,  {passive: true})
    }
    componentWillUnmount(){
        document.querySelector('body').removeEventListener("keyup", this.handleKeyPress)
        if(MAGNIFY) MAGNIFY.destroy()
    }
    componentDidUpdate(){
        this.enableMagnify()
    }
    enableMagnify(){
        if(MAGNIFY) MAGNIFY.destroy()
        let currentImg = document.querySelector('.imgPopup'),
            width = currentImg.naturalWidth,
            height = currentImg.naturalHeight
        if(width <= 900){
            width = width*3
            height = height*3
            document.querySelector('.imgPopup').setAttribute('data-magnify-magnifiedwidth', width.toString())
            document.querySelector('.imgPopup').setAttribute('data-magnify-magnifiedheight', height.toString())
        }
        if(this.props.showFirstImage) MAGNIFY = $('.popup .popupContainer .mainImg .imgPopup').magnify()
        else if(currentImg.getAttribute('src') !== this.props.array[0].src) MAGNIFY = $('.popup .popupContainer .mainImg .imgPopup').magnify()
    }
    handleKeyPress(e){
        if(e.key === "Escape"){
            this.props.close()
            e.stopPropagation()
        }
        else if(e.key === 'ArrowRight'){
            this.next()
            e.stopPropagation()
        }
        else if(e.key === 'ArrowLeft'){
            this.prev()
            e.stopPropagation()
        }

    }
    next(){
        let currentSrc = this.state.currentSrc,
            indexSrc = null

        this.props.array.forEach( (item, i) => {
            if(item.src === currentSrc) indexSrc = i
        })
        if(indexSrc == this.props.array.length-1) this.setState({ currentSrc: this.props.array[0].src })
        else this.setState({ currentSrc: this.props.array[indexSrc+1].src })
    }
    prev(){
        let currentSrc = this.state.currentSrc
        let indexSrc = null
        this.props.array.forEach( (item, i) => {
            if(item.src === currentSrc) indexSrc = i
        })
        if(indexSrc == 0) this.setState({ currentSrc: this.props.array[this.props.array.length-1].src })
        else this.setState({ currentSrc: this.props.array[indexSrc - 1].src })
    }
    clickThumb(e){
        let currentSrc = $(e.currentTarget).find('img').attr('src')
        this.setState({ currentSrc })
    }
    render() {
        let { currentSrc } = this.state,
            showTextRealImage = this.props.showRealImageText && currentSrc !== this.props.array[0].src ? true : undefined
        return (
            <div className="popup" >
                <div className="popupContainer">
                    <span className="closeLightbox" onClick={this.props.close}><i className="fa fa-times" aria-hidden="true"/></span>
                    <span className="next" onClick={this.next}><i className="fa fa-angle-right" aria-hidden="true"/></span>
                    <span className="prev" onClick={this.prev}><i className="fa fa-angle-left" aria-hidden="true"/></span>

                    <div className="mainImg">
                        <img className="imgPopup"
                             data-magnify-src={currentSrc}
                             src={currentSrc} onClick={this.next} alt=""/>
                    </div>
                    <div className="smallPic text-right">
                        <div className="real-image">
                            { /* showTextRealImage &&
                                <p>
                                    <img src="/images/design/camera-real-image.svg" alt=""/>
                                    Bei diesem Bild handelt es sich um 100% echte Aufnahmen dieses Gerätes
                                </p> */
                            }
                        </div>
                        <div>
                            { this.props.array.map ( (item, i) => {
                                let className = item.src == currentSrc ? "itemSmallPic current" : "itemSmallPic"
                                return  <div className={className}
                                             onClick={this.clickThumb}
                                             key={i} >
                                            <img src={item.src} alt=""/>
                                        </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

LightboxImage.propTypes = {
    showFirstImage: PropTypes.bool
}
LightboxImage.defaultProps = {
    showFirstImage: true,
    showRealImageText: false
}