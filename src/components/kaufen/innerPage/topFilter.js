import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import SearchBarKaufen from "../searchResults/searchBarKaufen";

const TopFilter = ({ changeSortBy, viewMode, changeViewMode, currentValue, totalItems, showSearchBar, options, mapDuplicateFilter }) => {

    return (
        <div className="row topFilter">
            {/* <div className="col-sm-0 text-left leftPart">
                {showSearchBar && <SearchBarKaufen placeholder="Modell suchen" showBtn={false}/>}
            </div>             */}
            <div className="col-sm-12 sortBy">
                {mapDuplicateFilter}
                <div className="flex-grow-1"></div>
                <div className="text-center countProducts">
                    <p>{totalItems} Artikel</p>
                </div>                
                <span>Sortieren nach</span>
                <div className='select'>
                    <Select
                        options={options}
                        onChange={changeSortBy}
                        value={currentValue}
                        searchable={false}
                        clearable={false}
                    />
                </div>
            </div>


        </div>
    )
}

TopFilter.propTypes = {}
TopFilter.defaultProps = {}

export default TopFilter
