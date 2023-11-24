import React, {Component} from 'react'
import PropTypes from 'prop-types'

class AddToBasketEffect extends Component {
    constructor(props) {
        super(props)

        this.state = {}

    }

    componentDidMount(){
        const elem = document.querySelector('.addToBasketEffect');
        const { startPosition } = this.props;
        const endPosition = this.getEndPosition();

        elem.style.top = startPosition.top + 'px'
        elem.style.left = startPosition.left + 'px'
        setTimeout( () => {
            elem.style.transition = 'all 2s'
            elem.style.top = endPosition.top - 20 + 'px'
            elem.style.left = endPosition.left - 19 +  'px'
            elem.style.transform = 'scale(.3)'
        }, 0)
    }

    getEndPosition(){
        if(this.props.basketType !== 'kaufen') {
            return $('.cart-total-verkaufen').offset()
        }
        const end = $('.cart-total-kaufen');
        let endPosition = end.offset();
        if(endPosition.top == 0 && endPosition.left == 0) {
            const otherEnd = $($('.cart-total-kaufen')[1]);
            endPosition = otherEnd.offset();
        }
        return endPosition
    }

    render() {
        return (
            <div className="addToBasketEffect">
                <img src={this.props.image} alt=""/>
            </div>
        )
    }
}

AddToBasketEffect.propTypes = {}
AddToBasketEffect.defaultProps = {}

export default AddToBasketEffect