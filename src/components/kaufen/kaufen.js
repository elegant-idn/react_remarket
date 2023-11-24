import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'

class Kaufen extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        // console.log('language hello = ', this.props.t('headerTop.openinghours'))
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
Kaufen.propTypes = {}
Kaufen.defaultProps = {}
export default withTranslation()(Kaufen)
