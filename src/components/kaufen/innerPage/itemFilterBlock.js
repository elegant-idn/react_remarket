import React from 'react'
import { Link } from 'react-router'

const ItemFilterBlock = ( { routeParams, data, name, title, availableOption, allSelected, selectedOption, totalItems,
                            mobileChoseItemFilter, availableFilterOptions, mainModelGroupId } ) => {
    function getStr(arr, name, currentValue){
        let s = ''
        let selectedFilterOptions = { ...arr }
        for(let key in selectedFilterOptions){
            if(key !== 'price' && key !== 'sort' && key !== 'page') {
                selectedFilterOptions[key] = {...arr[key] }
                selectedFilterOptions[key].values = arr[key].values.map( item => {
                    return {...item}
                })
            }
            else if(key === 'page'){
                selectedFilterOptions[key] = 1
            }
        }

        if(currentValue === 'allValues'){
            /*if(selectedFilterOptions[name].length === data.length) selectedFilterOptions.Models = []
            else selectedFilterOptions[name] = data*/
            selectedFilterOptions[name] ? selectedFilterOptions[name].values = data.values : null
        }
        else{
            if(selectedFilterOptions[name] && selectedFilterOptions[name].values.length === data.values.length){
                selectedFilterOptions[name].values = []
                selectedFilterOptions[name].values.push(currentValue)
            }
            else{
                if( selectedFilterOptions[name] && selectedFilterOptions[name].values.some( option => option.id === currentValue.id)){
                    if(selectedFilterOptions[name].values.length === 1) selectedFilterOptions[name].values = []
                    else selectedFilterOptions[name].values = selectedFilterOptions[name].values.filter( item => item.id !== currentValue.id)
                }
                else if(selectedFilterOptions[name]){
                    selectedFilterOptions[name].values.push(currentValue)
                }
            }

        }
        for( let key in selectedFilterOptions){
            if( key === 'price'){
                if(selectedFilterOptions[key].minSearch > 0 || selectedFilterOptions[key].maxSearch < selectedFilterOptions[key].max){
                    s += `preis=${selectedFilterOptions[key].minSearch}-${selectedFilterOptions[key].maxSearch}/`
                }
            }
            else if( key === 'sort' || key === 'page') s += `${key}=${selectedFilterOptions[key]}/`
            else{
                let categoryName = key

                if(selectedFilterOptions[key].values.length === availableFilterOptions[key].values.length){
                    s += `${categoryName}=alle/`
                }
                else if(selectedFilterOptions[key].values.length > 0){
                    selectedFilterOptions[key].values.forEach( (item, i) => {
                        if(i === 0){
                            if(selectedFilterOptions[key].values.length === 1) {
                                s += `${categoryName}=${item.id}/`
                            }
                            else s += `${categoryName}=${item.id}`
                        }
                        else if( i === selectedFilterOptions[key].values.length -1) {
                            s += `,${item.id}/`
                        }
                        else s += `,${item.id}`
                    })
                }
            }
        }
        return s
    }

    let filteredValues = data.values.sort((a,b)=> {
        if ( title === 'Speichergrösse') return false;
        else return a.name > b.name ? 1 : -1 })
    
    let titleName = '';
    switch (title){
        case 'zustand':
            titleName = 'Allgemeiner Zustand'
            break
        default:
            titleName = title
            break
    }

    function getCategoriesParamRoute(){
        let str = '/'
        for(let key in routeParams){
            if(key.includes('deviceCategory') && routeParams[key]) str += routeParams[key] + '/';
        }
        return str
    }

    function mapValues(item,i ){
        
        let isChecked = selectedOption && selectedOption.values.some(model => model.id === item.id) && selectedOption.values.length !== data.values.length
        let color = item.colorCode ? item.colorCode : '' ;
        let enable = item.hasOwnProperty('enable') ? item.enable : 1
        return(
            <li key={i} className={ !enable ? 'disable' : isChecked ? 'active' : ''} >
                <Link key={item.id} to={enable ? `${url}/${getStr(allSelected, name, item)}` : null}
                      onClick={(e) => enable ? window.isMobile && mobileChoseItemFilter(e, name, item) : null}>
                        <input type="checkbox"
                               readOnly={true}
                               checked={isChecked}
                               disabled={availableOption && availableOption.values.every(items => item.id !== items.id)}/>
                    {titleName === 'farbe' ?
                        color && <span className='checkbox-farbe' key={i} style={{background: color}}/>
                        :
                        <span className="checkbox"/>
                    }
                    <span>
                        { name === 'lagerort'&& <img className="filter-img" src={`/images/design/aside_filter_category_icons/lagerort/filter-lagerort-${item.id}.svg`} alt=""/>}
                        {item.name}
                    </span>
                </Link>
                <span>{(name === 'modell' || name === 'lagerort') && `(${item.count})`}</span>
            </li>
        )
    }
    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, item.deviceModelGroupOrderBy);
                map.set(key, [item]);
            } else {                
                collection.push(item);
            }
        });
        return map;
    }
    function toggleIcon(e) {
        const is_onened = e.currentTarget.getAttribute('aria-expanded');
        if(is_onened === 'true') {
            e.currentTarget.lastChild.classList.remove('glyphicon-plus');
            e.currentTarget.lastChild.className += " glyphicon-minus";
        }
        else {
            e.currentTarget.lastChild.classList.remove('glyphicon-minus');
            e.currentTarget.lastChild.className += " glyphicon-plus";
        }
    }

    let url = `/kaufen${getCategoriesParamRoute()}filter`;
    if(titleName === 'Arbeitsspeicher (RAM)'){
        titleName = titleName.replace('Arbeitsspeicher (RAM)', 'Arbeitsspeicher RAM')
    }

    let customHref = titleName.split(' ');
    
    return (
        <div className={`${titleName} itemFilterBlock`}>
            <h5 className='head'
                data-toggle="collapse"
                href={`#multiCollapseExample-${customHref[customHref.length - 1]}`}
                aria-expanded="false"
                aria-controls="collapseExample"
                onClick={(e) => toggleIcon(e)}>
                <span>
                    <img src={`/images/design/aside_filter_category_icons/${mainModelGroupId}/${mainModelGroupId}-${name}.svg`}
                         onError={(e)=>{e.target.src='/images/design/aside_filter_category_icons/default-icon.svg'}}
                         alt=""/>
                     <span className="head-titleName">{titleName}</span>
                </span>
                <span style={{color: '#b8d4cb'}} className="glyphicon glyphicon-plus" aria-hidden="true"/>
            </h5>
            <ul id={`multiCollapseExample-${customHref[customHref.length - 1]}`}
                className="collapse multi-collapse">
                <li className={selectedOption && selectedOption.values.length === data.values.length ? 'active' : ''}>
                    <Link key={`allValues-${name}`} to={`${url}/${getStr(allSelected, name, 'allValues')}`}
                          onClick={(e) => window.isMobile && mobileChoseItemFilter(e, name, 'allValues')}>
                        <input type="checkbox"
                               className={`${titleName}-all`}
                               value='Show all models'
                               readOnly={true}
                               checked={selectedOption && selectedOption.values.length === data.values.length}/>
                        <span className="checkbox"/>
                        { name !== 'lagerort' && <span>Zeige alle {routeParams.deviceCategory1 === "zubehör" ? 'Produkte' : 'Modelle'}</span>}
                        { name === 'lagerort' && <span>Alle Filialen anzeigen</span>}
                    </Link>
                    <span>{  name === 'modell' || name === 'lagerort'  && `(${totalItems})`}</span>
                </li>
                {name === 'kategorie-compatibility' ?
                    Array.from( groupBy( data.values, item => item.deviceModelGroupOrderBy + '-' + item.deviceModelGroupName)).sort(
                        (a,b)=> {return parseInt(a[0].split('-')[0]) > parseInt(b[0].split('-')[0]) ? 1 : -1 }
                    ).map((item, index) =>  (
                        <React.Fragment key={`label-0-${index}`}>
                            <a  className="brand"
                               data-toggle="collapse"
                               href={`#collapseExample-${item[1][0]['deviceModelGroupId']}-${item[1][0]['deviceModelGroupOrderBy']}`}
                               aria-expanded="false"
                               aria-controls="collapseExample"
                               onClick={(e) => toggleIcon(e)}>
                                <span className="name">
                                    {/* <img src={`/images/design/submodel/${item[1][0]['deviceModelGroupId']}.svg`} alt=""/> */}
                                    {item[0].split('-')[1]}
                                </span>
                               <span className="glyphicon glyphicon-plus" aria-hidden="true"/>
                            </a>
                            <span className="collapse" id={`collapseExample-${item[1][0]['deviceModelGroupId']}-${item[1][0]['deviceModelGroupOrderBy']}`}>
                            {
                                item[1][0].deviceModelSubGroupId ?  
                                Array.from(groupBy(item[1], subItem => subItem.deviceModelSubGroupOrderBy + '-' + subItem.deviceModelSubGroupName)).sort(
                                    (a,b)=> {return parseInt(a[0].split('-')[0]) > parseInt(b[0].split('-')[0]) ? 1 : -1 }
                                ).map((subItem, index) =>  (
                                    <React.Fragment key={`label-1-${index}`}>
                                        <a className="brand"
                                        data-toggle="collapse"
                                        href={`#collapseExample-${subItem[1][0]['deviceModelSubGroupId']}-${subItem[1][0]['deviceModelSubGroupOrderBy']}`}
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                        onClick={(e) => toggleIcon(e)}>
                                            <span className="name">
                                                <img src={`/images/design/submodel/${subItem[1][0]['deviceModelSubGroupId']}.svg`} alt=""/>
                                                {subItem[0].split('-')[1]}
                                            </span>
                                            <span className="glyphicon glyphicon-plus" aria-hidden="true"/>
                                        </a>
                                        <span className="collapse" id={`collapseExample-${subItem[1][0]['deviceModelSubGroupId']}-${subItem[1][0]['deviceModelSubGroupOrderBy']}`}>
                                            {
                                                subItem[1].sort(function(a,b){
                                                    return a.orderBy-b.orderBy;                                  
                                                }).map(mapValues)
                                            }
                                        </span>
                                    </React.Fragment>
                                )) : 
                                item[1].sort(function(a,b){
                                    return a.orderBy-b.orderBy;                                  
                                }).map(mapValues)
                            }
                            </span>
                        </React.Fragment>
                    ))
               : filteredValues.map(mapValues)}
            </ul>
        </div>
    )
}

ItemFilterBlock.propTypes = {}
ItemFilterBlock.defaultProps = {}

export default ItemFilterBlock