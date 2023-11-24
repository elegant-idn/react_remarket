import React, { Component } from 'react';
import { Link } from 'react-router';
import ItemTopDeviceMenuRow from './itemTopDeviceMenuRow';
import ItemTopDeviceMenuRowNew from './itemTopDeviceMenuRowNew';
import ItemTopProductMenuRow from './itemTopProductMenuRow';
import ItemTopProductMenuRowNew from './itemTopProductMenuRowNew';
import ModelMenuRow from "./modelMenuRow";
import ModelMenuRowNew from "./modelMenuRowNew";
import ProductModelMenuRow from "./productModelMenuRow";
import ProductModelMenuRowNew from "./productModelMenuRowNew";


export default class TopDeviceMenu extends Component {
  constructor(props) {
    super(props);
    this.mapDevices = this.mapDevices.bind(this);
    this.groupBy = this.groupBy.bind(this);
    
  }

  mapDevices = (device) => {
    let currentDeviceName = this.props.params.deviceCategory1 && this.props.params.deviceCategory1.replace(/-/g, ' '),
        className = '',
        imageUrl = '',
        deviceCategories = [device.name.replace( / /g, '-').toLowerCase()],
        computerIds = [8, 15, 23, 24];

    if(device.submodels && computerIds.every( item => item != device.id)) mapSubmodels(device.submodels)
    let strUrl = deviceCategories.join('/') + '/filter'

    if(device.name.toLowerCase().replace('-', ' ') === currentDeviceName.replace('-', ' ')) {
      className = 'current row smallDevice'
      imageUrl = `/images/design/${device.id}activeDevice.svg`
    }
    else {
      className = 'row smallDevice'
      imageUrl = `/images/design/${device.id}device.svg`
    }

    function mapSubmodels(submodels){
      deviceCategories.push(submodels[0].name.replace( / /g, '-').toLowerCase())
      if(submodels[0].submodels) mapSubmodels(submodels[0].submodels)
    }

    // if (device.name !== 'Zubehör') {
      return (
        <Link
          to={`/kaufen/${strUrl}`}
          title={`${device.name} kaufen`}
          className={className}
          key={device.id}
        >
          <span className="image"><img src={imageUrl} alt="" /></span>
          <span className="title">{device.name}</span>
          <span className="name">{device.name}</span>
        </Link>
      );
  };

  /*
  groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
  };
  */

  groupBy = (list, keyGetter) => {
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
  
  render() {
    const { params, filterOptions, devices, productModels, modelCategoryId } = this.props,    
      currentDeviceName = params.deviceCategory1.replace(/-/g, ' '),
      currentDevice = devices.filter(item => item.name.toLowerCase() === currentDeviceName),
      isModelMenu = !!((currentDeviceName === 'tablet' || currentDeviceName === 'smartphone') && params.deviceCategory2);

    let currentSubmodels = [];
    if (currentDevice[0] && currentDevice[0].submodels) {
      currentSubmodels = currentDevice[0].submodels;
    }

    let currentProductBrands = [];
    if (currentDeviceName === "zubehör") {      
      for( let key in filterOptions){
        if(key === 'kategorie-compatibility'){
          Array.from(this.groupBy( filterOptions['kategorie-compatibility'].values, item => item.deviceModelGroupOrderBy+'-'+item.deviceModelGroupName)).sort(            
            (a,b)=> {return parseInt(a[0].split('-')[0]) > parseInt(b[0].split('-')[0]) ? 1 : -1 }                    
          ).map((item) =>  (            
            currentProductBrands.push({
                'deviceModelName' : item[0].split('-')[1],
                'deviceModelGroupId' : item[1][0]['deviceModelGroupId'],
                'deviceModelGroupLogoContent': item[1][0]['deviceModelGroupLogoContent'],
              })  
            )
          )
        }
      } 
    }

    let paramModelCategoryId = 0;    
    for (let key in params) {
        if (params[key] && params[key].includes('kategorie-compatibility-brand=')) {
          paramModelCategoryId = params[key].split('=')[1];
        }
    }
    let currentProductBrands_1 = [];
    if (currentDeviceName === "zubehör" && paramModelCategoryId != 0) {      
      for( let key in filterOptions){
        if(key === 'kategorie-compatibility'){
          Array.from(this.groupBy( filterOptions['kategorie-compatibility'].values, item => item.deviceModelSubGroupOrderBy+'-'+item.deviceModelSubGroupName)).filter(item => item[1][0]['deviceModelSubGroupName'] != null && item[1][0]['deviceModelGroupId'] == paramModelCategoryId).sort(
            (a,b)=> {return parseInt(a[0].split('-')[0]) > parseInt(b[0].split('-')[0]) ? 1 : -1 }
          ).map((item) =>  (
                currentProductBrands_1.push({
                  'deviceModelName' : item[0].split('-')[1],
                  'deviceModelGroupId' : item[1][0]['deviceModelSubGroupId'],
                  'deviceModelGroupLogoContent': item[1][0]['deviceModelSubGroupLogoContent'],               
                  'deviceModelParentGroupId' : item[1][0]['deviceModelGroupId'],
                })
            )
          )
        }
      }
    }
    let paramModelSubCategoryId = 0;
    if (currentProductBrands_1.length > 0) {
      for (let key in params) {
        if (params[key] && params[key].includes('kategorie-compatibility-brand1=')) {
          paramModelSubCategoryId = params[key].split('=')[1];
        }
      }
    }

    let currentProductModels = [];
    if (currentDeviceName === "zubehör" && paramModelCategoryId != 0) {
      for( let key in filterOptions){
        if(key === 'kategorie-compatibility'){
          Array.from(this.groupBy( filterOptions['kategorie-compatibility'].values, item => paramModelSubCategoryId != 0 ? item.deviceModelSubGroupName : item.deviceModelGroupName)).sort(function(a, b){
            return a.orderBy > b.orderBy;
          }).filter((item) => paramModelSubCategoryId != 0 ? item[1][0].deviceModelSubGroupId == paramModelSubCategoryId : item[1][0].deviceModelGroupId == modelCategoryId).map((item1) => (
                item1[1].map((item2) =>
                  currentProductModels.push({
                    'id' : item2.id,
                    'modelGroupId' : item2.deviceModelGroupId,
                    'modelSubGroupId' : item2.deviceModelSubGroupId,
                    'name': item2.name,
                    'image': item2.deviceMainImage,
                    'orderBy': item2.orderBy,
                  })
              )
            )
          )     
        }
      } 
    }

    return (
      <div className="container no-padding">

        <div className="model" id="devicesListSmall">

          <div className="clearfix text-center deviceRow">
              <div>
                { devices.map(this.mapDevices) }
              </div>
          </div>
          {
            currentSubmodels.length > 0 && !window.isMobile && (
              <ItemTopDeviceMenuRow
                submodels={currentSubmodels || []}
                params={params}
                index={2}
              />
              )
          }
          {
            currentSubmodels.length > 0 && window.isMobile && (
              <ItemTopDeviceMenuRowNew
                submodels={currentSubmodels || []}
                params={params}
                index={2}
              />
              )
          }
          {
            isModelMenu && !window.isMobile &&
              <ModelMenuRow
                models={this.props.models}
                params={this.props.params}
              />
          }
          {
            isModelMenu && window.isMobile &&
              <ModelMenuRowNew
                models={this.props.models}
                params={this.props.params}
              />
          }
          {
            currentProductBrands.length > 0 && !window.isMobile &&
            (
              <ItemTopProductMenuRow
                submodels={currentProductBrands || []}
                params={params}
                index={3}
                layer={0}
              />
            )
          }
          {
            currentProductBrands.length > 0 && window.isMobile &&
            (
              <ItemTopProductMenuRowNew
                submodels={currentProductBrands || []}
                params={params}
                index={3}
                layer={0}
              />
            )
          }
          {
            currentProductBrands_1.length > 0 && !window.isMobile &&
            (
              <ItemTopProductMenuRow
                submodels={currentProductBrands_1 || []}
                params={params}
                index={3}
                layer={1}
              />
            )
          }
          {
            currentProductBrands_1.length > 0 && window.isMobile &&
            (
              <ItemTopProductMenuRowNew
                submodels={currentProductBrands_1 || []}
                params={params}
                index={3}
                layer={1}
              />
            )
          }
          {
            currentProductModels.length > 0 && !window.isMobile && (
              <ProductModelMenuRow
              models={currentProductModels || []}
              params={this.props.params}
            />
            )
          }
          {
            currentProductModels.length > 0 && window.isMobile && (
              <ProductModelMenuRowNew
              models={currentProductModels || []}
              params={this.props.params}
            />
            )
          }
          
          <div className="cb" />
        </div>
      </div>
    );
  }
}
