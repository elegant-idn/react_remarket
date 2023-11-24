import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

class SubcategoriesComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.mapSubmodels = this.mapSubmodels.bind(this)

    }
    mapSubmodels(element, i){
        let { index, params } = this.props,
            strPrevUrl = '';

        /*get prev url*/
        for(let key in params){
            let paramKeyIndex = key.slice(14)
            if(key.includes('deviceCategory') && params[key] && +paramKeyIndex < index) strPrevUrl += params[key] + '/'
        }
        
        let strForLastCategory = element.submodels ? '' : '/filter'
        // if(element.name !== 'Zubehör') {
            return(
                <Link to={`/kaufen/${strPrevUrl}${element.name.toLowerCase().replace( / /g, '-')}${strForLastCategory}`}
                      className="item-category" key={i}>
                    { this.props.index === 1 &&
                    <div className="image">
                        <img src={`/images/design/${element.id}activeDevice.svg`} alt=""/>
                    </div>
                    }
                    { this.props.index !== 1 && element.logoContent &&
                    <div className="image" dangerouslySetInnerHTML={{ __html: element.logoContent}}/>
                    }
                    { this.props.index !== 1 && element.images &&
                    <div className="image">
                        <img src={element.images[0]} alt=""/>
                    </div>
                    }
                    <p className="name">{element.name}</p>
                </Link>
            )
        // }
    }
    render() {
        let { submodels, index, params, category } = this.props,
            currentDevice = '',
            currentSubmodels = [];
        if(params['deviceCategory' + index]){
            currentDevice = submodels.filter( item => item.name.toLowerCase() == params['deviceCategory' + index].replace( /-/g, ' ') )
        }
        if(currentDevice[0] && currentDevice[0].submodels) currentSubmodels = currentDevice[0].submodels
        return (
            <div>
                { !params['deviceCategory' + index] &&
                <div className='category-row'>
                    { (category && category != 'zubehör') &&
                        <Link
                            to={`/kaufen/${category}/filter`}
                            className="item-category" key={index+99}>
                            <div className="image">
                                <img src={`/images/design/all_devices.svg`} alt=""/>
                            </div>
                            <p className="name">Alle Geräte anzeigen</p>
                        </Link>
                    }
                    {this.props.submodels.map(this.mapSubmodels)}
                </div>
                }
                { (currentSubmodels.length > 0 && params['deviceCategory' + index])  &&
                    <SubcategoriesComponent submodels={currentSubmodels}
                                            params={params}
                                            index={index + 1}
                                            category={params['deviceCategory' + index]}/>
                }
            </div>
        )
    }
}
SubcategoriesComponent.propTypes = {}
SubcategoriesComponent.defaultProps = {}
export default SubcategoriesComponent