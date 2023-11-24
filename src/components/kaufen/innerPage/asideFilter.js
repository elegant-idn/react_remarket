import React from 'react';
import InputRange from 'react-input-range';
import Select from 'react-select';
import ItemFilterBlock from './itemFilterBlock';

const AsideFilter = ( { selectedFilterOptions, availableFilterOptions, filterOptions, inputPriceMin, inputPriceMax, inputPriceErr, changePrice, changeInputPrice, applyInputPrice, totalItems, mainModelGroupId,
                        mobileChoseItemFilter, mobileApply, changeSortBy, currentValue, viewMode, routeParams, options, isAsideFilterVisible } ) => {
    let { price } = selectedFilterOptions

    function returnItemFilterBlock(key){
        return <ItemFilterBlock key={key}
                                mainModelGroupId={mainModelGroupId}
                                totalItems={totalItems}
                                title={filterOptions[key].name}
                                name={key}
                                data={filterOptions[key]}
                                availableOption={availableFilterOptions[key]}
                                availableFilterOptions={availableFilterOptions}
                                selectedOption={selectedFilterOptions[key]}
                                allSelected={selectedFilterOptions}
                                mobileChoseItemFilter={mobileChoseItemFilter}
                                routeParams={routeParams}/>
    }
    let arrayFilterOptions = []

    if(filterOptions.lagerort) arrayFilterOptions.push(returnItemFilterBlock('lagerort'))
    if(filterOptions.modell) arrayFilterOptions.push(returnItemFilterBlock('modell'))
    if(filterOptions.zustand) arrayFilterOptions.push(returnItemFilterBlock('zustand'))

    for( let key in filterOptions){
        if(key != 'modell' && key != 'zustand' && key != 'lagerort'){
            let option = returnItemFilterBlock(key)
            arrayFilterOptions.push(option);
        }
    }
    return (
        <div className="col-md-3 asideFilter">
            {/* <div className="col-sm-12 text-right sortBy for-mobile">
                <span>Sortieren nach</span>
                <div className={viewMode !== 'List' ? 'select disable' : 'select'}>
                    <Select
                        options={options}
                        onChange={changeSortBy}
                        value={currentValue}
                        search={false}
                    />
                </div>
            </div> */}
            <div className="priceFilter itemFilterBlock">
                <div className="head">
                    <div>
                        <img src='/images/design/aside_filter_category_icons/price.svg' alt=""/>
                        <span className="headFilterTitle">Preis</span>
                    </div>
                    <InputRange
                        maxValue={+price.max}
                        minValue={+price.min - 0.00001}
                        value={ { min: +price.minSearch - 0.00001, max: +price.maxSearch } }
                        onChange={changePrice } />
                    <div className="priceRange">
                        <div className="price-min">
                            <input id="price_min" max={+price.max} min={+price.min} className={inputPriceErr.min ? "price-error" : null} value={inputPriceMin != 0 ? +inputPriceMin : +price.minSearch} type="number" onChange={(e) => changeInputPrice(e, 'min') } onBlur={(e) => applyInputPrice(e, 'min')} /> {window.currencyValue}
                        </div>
                        <div className="price-devider">
                            -
                        </div>
                        <div className="price-max">
                            <input id="price_max" max={+price.max} min={+price.min} className={inputPriceErr.max ? "price-error" : null} value={inputPriceMax != 0 ? +inputPriceMax : +price.maxSearch} type="number" onChange={(e) => changeInputPrice(e, 'max') } onBlur={(e) => applyInputPrice(e, 'max')}/> {window.currencyValue}
                        </div>
                    </div>
                </div>
            </div>
            { arrayFilterOptions.map( ( item, i) => {
                return item;
            })}
            <div className="btnApply-mobile mobileFixedBtn">
                <button className="btn" onClick={mobileApply}>Übernehmen</button>
            </div>
        </div>
    );
}

AsideFilter.propTypes = {}
AsideFilter.defaultProps = {}

export default AsideFilter