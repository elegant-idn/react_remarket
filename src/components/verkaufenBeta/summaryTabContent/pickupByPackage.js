import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class PickupByPackage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div className="pickup-by-package">
                <h3 className="title"><img src="/images/design/packing.svg" alt=""/>Paket abholen</h3>
                <div className="date-row">
                    <h4>Gewunschetes Abholdatum?</h4>
                    <Select
                        placeholder="Bitte wahlen..."/>
                </div>
                <div className="date-row">
                    <h4>Gewunschetes Abholdatum?</h4>
                    <Select
                        placeholder="Bitte wahlen..."/>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                <button className="btn">
                    Book apointment
                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                </button>
                <div className="text-right"><img src="/images/design/swiss-post.svg" alt=""/></div>
            </div>
        )
    }
}
PickupByPackage.propTypes = {}
PickupByPackage.defaultProps = {}
export default PickupByPackage