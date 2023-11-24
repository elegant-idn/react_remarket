import React, {Component} from 'react'
import {Animated} from "react-animated-css"

class LastActivitiesNotification extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            currentMessage: null,
            currentIndex: null

        }

        this.closeNotification = this.closeNotification.bind(this)
        this.changeCurrentMessage = this.changeCurrentMessage.bind(this)
    }

    componentDidMount(){
        this.setTimeout = setTimeout(() => this.loadData(), 40000)
    }
    componentDidUpdate(){
        if(this.state.currentMessage) $('.itemNotification').css({ visibility: 'visible'})
        else setTimeout( () => $('.itemNotification').css({ visibility: 'hidden'}), 1000)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
        clearTimeout(this.setTimeout)
    }
    changeCurrentMessage(){
        let { data, currentIndex } = this.state

        if(currentIndex === data.length - 1){
            this.setState({ currentMessage: data[0], currentIndex: 0 })
        }
        else{
            this.setState({ currentMessage: data[currentIndex + 1], currentIndex: currentIndex + 1 })
        }
        this.setTimeout = setTimeout(() => this.closeNotification(), 5000)
    }
    loadData(){
        axios.get('/api/lastOrders')
            .then( result => {
                this.setState({ data: result.data, currentMessage: result.data[0], currentIndex: 0 })
                this.interval = setInterval(this.changeCurrentMessage, 40000)
                this.setTimeout = setTimeout(() => this.closeNotification(), 5000)
            })
    }
    closeNotification(){
        this.setState({ currentMessage: null })
    }

    render() {
        let { currentMessage } = this.state,
            text = currentMessage && currentMessage.price
                ? `gekauft für ${currentMessage.price}`
                : 'verkauft',
            isVisible = currentMessage ? true : false
        return (
            <div className="itemNotification" style={{ visibility: 'hidden' }}>
                <Animated animationIn="fadeInUp" animationOut="zoomOut" isVisible={isVisible}>
                    <div className="itemNotification-content">
                        <span className="closeNotification" onClick={this.closeNotification}>
                            <img src='/images/design/close-last-activities.svg' alt=""/>
                        </span>
                        <div className="image">
                            <img src={currentMessage && currentMessage.image} alt=""/>
                        </div>
                        <div className="content">
                            <p className="title">{currentMessage && currentMessage.title}</p>
                            <p className="text">{currentMessage && currentMessage.firstname && currentMessage.firstname.slice(0, 1).toUpperCase()}. von {currentMessage && currentMessage.city} hat ein {currentMessage && currentMessage.model}, {currentMessage && currentMessage.capacity}, {currentMessage && currentMessage.color} {text}</p>
                        </div>
                    </div>
                </Animated>
            </div>
        )
    }
}

LastActivitiesNotification.propTypes = {}
LastActivitiesNotification.defaultProps = {}

export default LastActivitiesNotification