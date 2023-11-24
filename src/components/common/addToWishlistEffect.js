import React, {Component} from 'react'

class AddToWishlistEffect extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    componentDidMount(){
        let elem = document.querySelector('.addToWishlistEffect'),
            { startPosition } = this.props, endPosition = $('.wish-total-kaufen').offset()        

        elem.style.top = startPosition.top + 'px'
        elem.style.left = startPosition.left + 'px'

        setTimeout( () => {
            elem.style.transition = 'all 2s'
            elem.style.top = endPosition.top - 20 + 'px'
            elem.style.left = endPosition.left - 19 +  'px'
            elem.style.transform = 'scale(.3)'
        }, 0)
    }

    render() {
        return (
            <div className="addToWishlistEffect">
                <img src={this.props.image} alt=""/>
            </div>
        )
    }
}

AddToWishlistEffect.propTypes = {}
AddToWishlistEffect.defaultProps = {}

export default AddToWishlistEffect