import axios from "axios";
import _debounce from "lodash/debounce";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import { browserHistory, Link } from "react-router";
import { bindActionCreators } from "redux";
import * as basketActions from "../../../actions/basket";
import * as shopActions from "../../../actions/shop";
import api from "../../../api/index";
import AddToBasketEffect from "../../common/addToBasketEffect";
import AddToWishlistEffect from "../../common/addToWishlistEffect";
import Banner from "../../mainPage/banner";
import CustomerAboutUs from "../../mainPage/customerAboutUs";
import SearchBarKaufen from "../searchResults/searchBarKaufen";
import AsideFilter from "./asideFilter";
import ModelsGrid from "./modelsGrid";
import DeviceModelsGrid from "./deviceModelsGrid";
import ModelsList from "./modelsList";
import QuickViewPage from "./quickViewPage";
import SuccessAddToBasket from "./successAddToBasket";
import TopDeviceMenu from "./topDeviceMenu/topDeviceMenu";
import TopFilter from "./topFilter";
import Select from "react-select";
import { seoTextAdjustHeight } from "../../seoText/seoText";

export class ModelsInnerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagination: {
        activePage: 0,
        totalItemsCount: 0,
        pageCount: 0,
      },
      options:
        this.props.params.deviceCategory1 === "zubehör"
          ? [
              { label: "Nach Beliebtheit", value: "popular" },
              {
                label: "Günstige Preise zuerst anzeigen",
                value: "niedrighoch",
              },
              { label: "Hohe Preise zuerst anzeigen", value: "hochniedrig" },
              { label: "Nach Einstelldatum sortieren", value: "neu" },
            ]
          : [
              { label: "Beliebteste Produkte", value: "popular" },
              {
                label: "Günstige Preise zuerst anzeigen",
                value: "niedrighoch",
              },
              { label: "Hohe Preise zuerst anzeigen", value: "hochniedrig" },
              { label: "Nach Einstelldatum sortieren", value: "neu" },
            ],
      selectedFilterOptions: {
        page: 1,
        price: {
          min: 0,
          max: 1,
          maxSearch: 0,
          minSearch: 0,
        },
        lagerort: { values: [] },
        modell: { values: [] },
        zustand: { values: [] },
        sort:
          this.props.params.deviceCategory1 === "zubehör"
            ? "popular"
            : "popular",
      },
      availableFilterOptions: {
        lagerort: [],
        modell: { values: [] },
        zustand: { values: [] },
      },
      mainModelGroupId: null,
      modelCategoryId: 0,
      viewMode:
        this.props.params.deviceCategory1 !== "zubehör" ? "List" : "Group",
      totalCountModels: 0,
      addBasketEffect: null,
      quickViewPage: null,
      capacityName: null,
      infoNoModels: false,
      showSidebar: false,
      seoData: null,
      successAddToBasket: null,
      recommendProducts: null,
      seoAccessoriesData: null,
      productModels: [],
      inputPriceMin: 0,
      inputPriceMax: 0,
      inputPriceErr: {
        min: false,
        max: false,
      },
    };

    this.changeViewMode = this.changeViewMode.bind(this);
    this.changePrice = this.changePrice.bind(this);
    this.changeInputPrice = this.changeInputPrice.bind(this);
    this.applyInputPrice = this.applyInputPrice.bind(this);
    this.changeSortBy = this.changeSortBy.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleClickItemGroup = this.handleClickItemGroup.bind(this);
    this.handleChooseFilterItemMobile =
      this.handleChooseFilterItemMobile.bind(this);
    this.handleApplyFiltersMobile = this.handleApplyFiltersMobile.bind(this);
    this.addModelToBasket = this.addModelToBasket.bind(this);
    this.addModelToWishlist = this.addModelToWishlist.bind(this);
    this.openQuickView = this.openQuickView.bind(this);
    this.closeQuickView = this.closeQuickView.bind(this);
    this._parseUrl = this._parseUrl.bind(this);
    this._getBrowserUrl = this._getBrowserUrl.bind(this);
    this._getObjForRequest = this._getObjForRequest.bind(this);
    this._getObjForRequestByCategoryId =
      this._getObjForRequestByCategoryId.bind(this);

    this._setSelectedFilterOption = this._setSelectedFilterOption.bind(this);
    this._parseDevicesForUrl = this._parseDevicesForUrl.bind(this);
    this._getModelsData = this._getModelsData.bind(this);
    this._getModelsDataByCategoryId =
      this._getModelsDataByCategoryId.bind(this);
    this._getAccessoriesData = this._getAccessoriesData.bind(this);
    this._getSeoData = this._getSeoData.bind(this);
    this.openSuccessAddToBasket = this.openSuccessAddToBasket.bind(this);
    this.closeSuccessAddToBasket = this.closeSuccessAddToBasket.bind(this);
    this.showFilters = this.showFilters.bind(this);
  }

  _getAccessoriesData(params) {
    let deviceName = null,
      ifNoCriterias = false;
    /*find device name*/
    for (let key in params) {
      if (key.includes("deviceCategory") && params[key])
        deviceName = params[key].replace(/-/g, " ");
    }
    let selectedFilterOptions = this._parseUrl(params);
    let objForRequest = this._getObjForRequest(
      selectedFilterOptions,
      selectedFilterOptions.page,
      deviceName
    );
    document.getElementById("spinner-box-load").style.display = "block";
    this.setState({ infoNoModels: false });
    api
      .getModels(`/api/getShopCategoryProducts`, objForRequest)
      .then(({ data }) => {
        document.getElementById("spinner-box-load").style.display = "none";
        this.setState({ viewMode: "Group" });
        let filterOptions = {};
        let availableFilterOptions = {};

        selectedFilterOptions = this._setSelectedFilterOption(
          selectedFilterOptions,
          data
        );
        data.meta.criteriasList.forEach((item) => {
          if (!filterOptions["kategorie-" + item.id])
            filterOptions["kategorie-" + item.id] = { ...item };
          if (!availableFilterOptions["kategorie-" + item.id])
            availableFilterOptions["kategorie-" + item.id] = { ...item };
          if (!selectedFilterOptions["kategorie-" + item.id]) {
            selectedFilterOptions["kategorie-" + item.id] = []; //if no such criteria, then add to object SelectedFilterOptions
            if (selectedFilterOptions["kategorie-" + item.id].length === 0)
              selectedFilterOptions["kategorie-" + item.id] = item;
          }
        });
        let pagination = data.meta.pagination;
        let capacityName = data.meta.capacityName;

        selectedFilterOptions.price.max = data.meta.maxPrice;
        selectedFilterOptions.price.min = data.meta.minPrice;
        if (selectedFilterOptions.price.maxSearch === 0)
          selectedFilterOptions.price.maxSearch = data.meta.maxPrice;
        if (selectedFilterOptions.price.minSearch === 0)
          selectedFilterOptions.price.minSearch = data.meta.minPrice;

        this.props.shopActions.setFilterOptions(filterOptions);
        this.props.shopActions.loadModels(data.data, data.meta.categoriesList);
        let count = Math.ceil(pagination.total / pagination.per_page);
        selectedFilterOptions.page =
          count > selectedFilterOptions.page
            ? selectedFilterOptions.page
            : count;
        this.setState({
          pagination: {
            ...this.state.pagination,
            activePage: selectedFilterOptions.page - 1,
            totalItemsCount: pagination.total,
            pageCount: count,
          },
          totalCountModels: data.meta.totalCount,
          selectedFilterOptions,
          availableFilterOptions,
          capacityName,
          infoNoModels: !ifNoCriterias && data.data.length === 0,
          showSidebar: data.meta.minPrice !== null,
          seoAccessoriesData: {
            ...this.state.seoAccessoriesData,
            html_description: data.meta.html_description,
            meta_description: data.meta.meta_description,
            meta_keywords: data.meta.meta_keywords,
            title: data.meta.title,
          },
        });
        if (window.isGoogleConnection) this.gtagEnhancedEcommerce();
        document.getElementById("devicesListSmall").scrollIntoView();
      })
      .catch(() => {
        document.getElementById("spinner-box-load").style.display = "none";
        if (window.isGoogleConnection === true) {
          this.props.shopActions.setFilterOptions({
            lagerort: { values: [] },
            modell: { values: [] },
            zustand: { values: [] },
          });
          this.props.shopActions.loadModels([], []);
          this.setState({ infoNoModels: true });
          this.setState({ seoAccessoriesData: null });
        }
      });
  }

  _getModelsDataByCategoryId(params) {
    let modelCategoryId = 0;
    for (let key in params) {
      if (key.includes("param1") && params[key]) {
        modelCategoryId = params[key].split("=")[1];
      }
    }
    if (modelCategoryId != 0) {
      let selectedFilterOptions = this._parseUrl(params);
      let objForRequest = this._getObjForRequestByCategoryId(
        selectedFilterOptions,
        selectedFilterOptions.page,
        modelCategoryId
      );
      document.getElementById("spinner-box-load").style.display = "block";
      this.setState({
        infoNoModels: false,
        objForRequest,
      });

      this.setState({
        modelCategoryId: modelCategoryId,
      });

      // api.getModels(`/api/modelsByCategoryId`, objForRequest)
      //     .then(({data}) => {
      //         document.getElementById('spinner-box-load').style.display = 'none'
      //         this.setState({
      //             productModels: data.meta.namesList.values
      //         });

      //     })
      //     .catch(() => {
      //         document.getElementById('spinner-box-load').style.display = 'none'
      //         this.setState({
      //             productModels: []
      //         });
      //     })
    }
  }

  _getModelsData(params) {
    let deviceName = null,
      ifNoCriterias = false;
    /*find device name*/
    for (let key in params) {
      if (key.includes("deviceCategory") && params[key])
        deviceName = params[key].replace(/-/g, " ");
    }

    let selectedFilterOptions = this._parseUrl(params);
    let objForRequest = this._getObjForRequest(
      selectedFilterOptions,
      selectedFilterOptions.page,
      deviceName
    );
    document.getElementById("spinner-box-load").style.display = "block";
    this.setState({
      infoNoModels: false,
      objForRequest,
    });

    api
      .getModels(`/api/models`, objForRequest)
      .then(({ data }) => {
        document.getElementById("spinner-box-load").style.display = "none";

        let filterOptions = {
          lagerort: data.meta.placesList,
          modell: data.meta.namesList,
          zustand: data.meta.conditionsList,
        };

        let availableFilterOptions = {
          lagerort: data.meta.placesList,
          modell: data.meta.namesList,
          zustand: data.meta.conditionsList,
        };

        selectedFilterOptions = this._setSelectedFilterOption(
          selectedFilterOptions,
          data
        );

        data.meta.criteriasList.forEach((item) => {
          if (!filterOptions["kategorie-" + item.id])
            filterOptions["kategorie-" + item.id] = { ...item };
          if (!availableFilterOptions["kategorie-" + item.id])
            availableFilterOptions["kategorie-" + item.id] = { ...item };
          if (!selectedFilterOptions["kategorie-" + item.id]) {
            selectedFilterOptions["kategorie-" + item.id] = []; //if no such criteria, then add to object SelectedFilterOptions
            if (selectedFilterOptions["kategorie-" + item.id].length === 0)
              selectedFilterOptions["kategorie-" + item.id] = item;
          }
        });

        data.meta.specificationsList.forEach((item) => {
          if (!filterOptions["spezifikation-" + item.id])
            filterOptions["spezifikation-" + item.id] = { ...item };
          if (!availableFilterOptions["spezifikation-" + item.id])
            availableFilterOptions["spezifikation-" + item.id] = { ...item };
          if (!selectedFilterOptions["spezifikation-" + item.id]) {
            selectedFilterOptions["spezifikation-" + item.id] = []; //if no such criteria, then add to object SelectedFilterOptions
            if (selectedFilterOptions["spezifikation-" + item.id].length === 0)
              selectedFilterOptions["spezifikation-" + item.id] = item;
          }
        });

        if (data.meta.warrantiesList.values.length > 0) {
          filterOptions.garantie = data.meta.warrantiesList;
          availableFilterOptions.garantie = data.meta.warrantiesList;
          if (!selectedFilterOptions.garantie)
            selectedFilterOptions.garantie = { ...data.meta.warrantiesList };
        }

        let pagination = data.meta.pagination;
        let capacityName = data.meta.capacityName;

        if (selectedFilterOptions.lagerort.length === 0)
          selectedFilterOptions.lagerort = data.meta.placesList;
        if (selectedFilterOptions.modell.length === 0)
          selectedFilterOptions.modell = data.meta.namesList;
        if (selectedFilterOptions.zustand.length === 0)
          selectedFilterOptions.zustand = data.meta.conditionsList;
        if (
          data.meta.warrantiesList.values.length > 0 &&
          selectedFilterOptions.garantie &&
          selectedFilterOptions.garantie.length === 0
        ) {
          selectedFilterOptions.garantie = data.meta.warrantiesList;
        }
        selectedFilterOptions.price.max = data.meta.maxPrice;
        selectedFilterOptions.price.min = data.meta.minPrice;
        if (selectedFilterOptions.price.maxSearch === 0)
          selectedFilterOptions.price.maxSearch = data.meta.maxPrice;
        if (selectedFilterOptions.price.minSearch === 0)
          selectedFilterOptions.price.minSearch = data.meta.minPrice;
        this.props.shopActions.setFilterOptions(filterOptions);
        this.props.shopActions.loadModels(data.data, data.meta.categoriesList);
        let count = Math.ceil(pagination.total / pagination.per_page);
        selectedFilterOptions.page =
          count > selectedFilterOptions.page
            ? selectedFilterOptions.page
            : count;
        this.setState({
          mainModelGroupId: data.meta.mainModelGroupId,
          pagination: {
            ...this.state.pagination,
            activePage: selectedFilterOptions.page - 1,
            totalItemsCount: pagination.total,
            pageCount: count,
          },
          totalCountModels: data.meta.totalCount,
          selectedFilterOptions,
          availableFilterOptions,
          capacityName,
          infoNoModels: !ifNoCriterias && data.data.length === 0,
          showSidebar: data.meta.namesList.values.length > 0,
          viewMode: "List",
        });
        if (window.isGoogleConnection) this.gtagEnhancedEcommerce();
        // document.getElementById('devicesListSmall').scrollIntoView(); function that scroll to devicesListSmall id on page
      })
      .catch(() => {
        document.getElementById("spinner-box-load").style.display = "none";
        if (window.isGoogleConnection === true) {
          this.props.shopActions.setFilterOptions({
            lagerort: { values: [] },
            modell: { values: [] },
            zustand: { values: [] },
          });
          this.props.shopActions.loadModels([], []);
          this.setState({ infoNoModels: true });
        }
      });
  }

  _getSeoData(params) {
    let deviceName = null;
    /*find device name*/
    for (let key in params) {
      if (key.includes("deviceCategory") && params[key])
        deviceName = params[key].replace(/-/g, " ");
    }

    axios
      .get(`/api/deviceGroupMetaData?modelGroup=${deviceName}&pageType=buy`)
      .then(({ data }) => {
        if (data[0]) {
          if (data[0].footer) $(".footerBottom p.seo").html(data[0].footer);
          else $(".footerBottom p.seo").empty();
          this.setState({
            seoData: {
              description: data[0].description,
              title: data[0].title,
              keywords: data[0].keywords,
            },
          });
        } else {
          $(".footerBottom p.seo").empty();
          this.setState({ seoData: null });
        }
        seoTextAdjustHeight();
      })
      .catch(() => {
        document.getElementById("spinner-box-load").style.display = "none";
        $(".footerBottom p.seo").empty();
        this.setState({ seoData: null });
        seoTextAdjustHeight();
      });
  }

  componentWillUnmount() {
    this.props.shopActions.setFilterOptions({
      lagerort: { values: [] },
      modell: { values: [] },
      zustand: { values: [] },
    });
    this.props.shopActions.loadModels([], []);

    //save checked filters
    let categoriesParams = [];

    for (let key in this.props.params) {
      if (key.includes("deviceCategory") && this.props.params[key])
        categoriesParams.push(this.props.params[key]);
    }

    let obj = {
      values: this.state.selectedFilterOptions,
      availableFilterOptions: this.state.availableFilterOptions,
      categoriesParams,
    };
    window.localStorage.setItem("selectedFilterOptions", JSON.stringify(obj));
    $(".footerBottom p.seo").empty();
  }

  componentWillMount() {
    this.inputPriceCallback = _debounce(function () {
      let { selectedFilterOptions } = this.state;
      browserHistory.push(
        `/kaufen/${this._getBrowserUrl(selectedFilterOptions)}`
      );
    }, 1000);
  }

  componentDidMount() {
    this.props.shopActions.loadDevices("/api/devices");
    if (this.props.params.deviceCategory1) {
      if (this.props.params.deviceCategory1 === "zubehör") {
        this._getAccessoriesData(this.props.params);
        this._getModelsDataByCategoryId(this.props.params);
      } else {
        this._getSeoData(this.props.params);
        this._getModelsData(this.props.params);
      }
    } else if (window.localStorage.getItem("selectedFilterOptions")) {
      let obj = JSON.parse(
        window.localStorage.getItem("selectedFilterOptions")
      );
      if ((page = obj.values.page)) {
        this.setState({
          pagination: {
            ...this.state.pagination,
            activePage: page - 1,
          },
        });
      }
      browserHistory.push(
        `/kaufen/${obj.categoriesParams.join("/")}/${this._getBrowserUrl(
          obj.values,
          obj.availableFilterOptions
        )}`
      );
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (
      nextProps.devices !== this.props.devices &&
      nextProps.devices.length > 0
    ) {
      if (!this.props.params.deviceCategory1) {
        let { devices } = nextProps;
        this._parseDevicesForUrl(devices);
      }
    }
    if (
      nextProps.params &&
      nextProps.params !== this.props.params &&
      nextProps.params.deviceCategory1
    ) {
      let selectedFilterOptions = this.state.selectedFilterOptions;
      if (nextProps.params.deviceCategory1 === "zubehör") {
        this._getAccessoriesData(nextProps.params);
        this._getModelsDataByCategoryId(nextProps.params);
        selectedFilterOptions.sort = "popular";
        this.setState({
          options: [
            { label: "Nach Beliebtheit", value: "popular" },
            { label: "Günstige Preise zuerst anzeigen", value: "niedrighoch" },
            { label: "Hohe Preise zuerst anzeigen", value: "hochniedrig" },
            { label: "Nach Einstelldatum sortieren", value: "neu" },
          ],
          selectedFilterOptions,
        });
      } else {
        this._getSeoData(nextProps.params);
        this._getModelsData(nextProps.params);
        selectedFilterOptions.sort = "popular";
        this.setState({
          options: [
            { label: "Nach Beliebtheit", value: "popular" },
            { label: "Günstige Preise zuerst anzeigen", value: "niedrighoch" },
            { label: "Hohe Preise zuerst anzeigen", value: "hochniedrig" },
            { label: "Nach Einstelldatum sortieren", value: "neu" },
          ],
          selectedFilterOptions,
        });
      }
    }
    if (
      nextState.selectedFilterOptions !== this.state.selectedFilterOptions ||
      nextState.availableFilterOptions !== this.state.availableFilterOptions
    ) {
      this.mapSelectedCriteria(
        nextProps.availableFilterOptions,
        this.state.selectedFilterOptions
      );
    }
  }

  mapDuplicateFilter = () => {
    let { pathname: path } = this.props.location;
    let searchParamsArr = path.split("/").filter((x) => x);
    let { selectedFilterOptions, mainModelGroupId } = this.state;
    let { params } = this.props;
    let filtered;

    searchParamsArr.forEach((el, index) => {
      if (el === "filter") {
        searchParamsArr.length = index + 1;
        searchParamsArr = searchParamsArr.join("/");
      }
    });

    Object.keys(params).forEach(function (key) {
      if (typeof params[key] === "undefined") {
        delete params[key];
      }
    });

    let filteredParams = Object.values(params);
    for (let elem in filteredParams) {
      if (
        filteredParams[elem].split("=").length === 1 ||
        filteredParams[elem].split("=")[1] === "alle"
      ) {
        delete filteredParams[elem];
        filtered = filteredParams.filter((e) => e);
      }
    }

    if (filtered && selectedFilterOptions) {
      return (
        <div>
          {filtered.length > 3 ? (
            <div className="duplicate-header">
              <span className="duplicate-header__title">Filteroptionen</span>
              <Link
                to={`/${searchParamsArr}`}
                className="duplicate-header__link"
              >
                Alle Filter entfernen
              </Link>
            </div>
          ) : null}
          {filtered.map((el, i) => {
            let searchKey = el.split("=")[0];
            let searchValue = el.split("=")[1];
            let checkedValues = [];

            if (
              selectedFilterOptions[searchKey] &&
              selectedFilterOptions[searchKey].name
            ) {
              selectedFilterOptions[searchKey].values.forEach((el) => {
                searchValue.split(",").forEach((el2) => {
                  if (+el2 === +el.id) {
                    checkedValues.push(el);
                  }
                });
              });
            }

            const hasName =
              selectedFilterOptions[searchKey] &&
              selectedFilterOptions[searchKey].name;
            const hasValues =
              selectedFilterOptions[searchKey] &&
              selectedFilterOptions[searchKey].values;
            if (!hasName && !hasValues) return null;
            return (
              <span className="duplicate-filter" key={i}>
                {hasName ? (
                  <span className="duplicate-filter__key">
                    <img
                      src={`/images/design/aside_filter_category_icons/${mainModelGroupId}/${mainModelGroupId}-${searchKey}.svg`}
                      onError={(e) => {
                        e.target.src =
                          "/images/design/aside_filter_category_icons/default-icon.svg";
                      }}
                    />
                    {selectedFilterOptions[searchKey].name}:
                  </span>
                ) : null}
                {hasValues ? (
                  <span className="duplicate-filter__values">
                    {checkedValues.map((item, i2) => (
                      <span key={i2}>
                        {item.name}
                        <i
                          data-target-key={searchKey}
                          data-target-id={item.id}
                          onClick={(e) => this.goTo(e)}
                          className="fa fa-times"
                          style={{ fontSize: "12px", paddingLeft: "10px" }}
                          aria-hidden="true"
                        />
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      );
    }
  };

  goTo = (e) => {
    let { pathname: path } = this.props.location;
    let searchParamsArr = path.split("/").filter((x) => x);
    let targetParam = e.target.dataset.targetId;
    let targetKey = e.target.dataset.targetKey;

    let searchParams;
    let searchKey;
    let replasedParam;
    let filteredOption;

    for (let i = 0; i < searchParamsArr.length; i++) {
      searchKey = searchParamsArr[i].split("=")[0];
      searchParams = searchParamsArr[i].split("=")[1];

      if (searchParamsArr[i].substr(0, targetKey.length) === targetKey) {
        searchParamsArr.splice(i, 1);

        if (searchKey === targetKey) {
          replasedParam = searchParams
            .split(",")
            .filter((elem) => elem !== targetParam && elem !== ",");

          if (replasedParam === "alle" || replasedParam.length === 0) {
            filteredOption = `${searchKey}=alle`;
          } else filteredOption = `${searchKey}=${replasedParam.join(",")}`;

          searchParamsArr.push(filteredOption);
          searchParamsArr = searchParamsArr.join("/");
          browserHistory.push(`/${searchParamsArr}`);
        }
      }
    }
  };

  _parseDevicesForUrl(devices) {
    let defaultDevice = devices.filter((item) => item.id === 23),
      defaultBrand = [],
      otherCategories = [];
    if (defaultDevice.length > 0) {
      defaultBrand = defaultDevice[0].submodels.filter((item) => item.id === 2);
      otherCategories.push(
        defaultBrand[0].name.replace(/ /g, "-").toLowerCase()
      );
    }
    if (defaultDevice.length === 0) {
      defaultDevice = [devices[0]];
      mapSubmodels(defaultDevice[0].submodels);
    }
    let strOtherCategories = otherCategories.join("/");
    browserHistory.push(
      `/kaufen/${defaultDevice[0].name.toLowerCase()}/${strOtherCategories}/filter`
    );

    function mapSubmodels(submodels) {
      otherCategories.push(submodels[0].name.replace(/ /g, "-").toLowerCase());
      if (submodels[0].submodels) mapSubmodels(submodels[0].submodels);
    }
  }

  _setSelectedFilterOption(selectedFilterOptions, data) {
    for (let key in selectedFilterOptions) {
      if (
        (key === "modell" && data.meta.namesList) ||
        (key === "garantie" && data.meta.conditionsList) ||
        (key === "zustand" && data.meta.warrantiesList) ||
        (key === "lagerort" && data.meta.placesList)
      ) {
        let arrayList = "",
          tmpArr = selectedFilterOptions[key];

        if (key === "modell") arrayList = "namesList";
        else if (key === "lagerort") arrayList = "placesList";
        else if (key === "zustand") arrayList = "conditionsList";
        else if (key === "garantie") arrayList = "warrantiesList";

        if (selectedFilterOptions[key][0] === "alle") {
          selectedFilterOptions[key] = { ...data.meta[arrayList] };
        } else if (selectedFilterOptions[key].length > 0) {
          selectedFilterOptions[key] = { ...data.meta[arrayList] };
          selectedFilterOptions[key].values = selectedFilterOptions[
            key
          ].values.filter((element) => {
            return tmpArr.some((itemId) => +itemId === element.id);
          });
        } else selectedFilterOptions[key] = { ...data.meta[arrayList] };
      } else {
        let idOfKey = key.slice(key.lastIndexOf("-") + 1);
        if (key.includes("kategorie") || key.includes("spezifikation")) {
          let arrayList = key.includes("kategorie")
              ? "criteriasList"
              : "specificationsList",
            filterTypePrefix = key.includes("kategorie")
              ? "kategorie-"
              : "spezifikation-";
          if (data.meta[arrayList].some((item) => item.id == idOfKey)) {
            data.meta[arrayList].forEach((item) => {
              if (item.id == idOfKey) {
                if (selectedFilterOptions[key][0] === "alle") {
                  selectedFilterOptions[filterTypePrefix + item.id] = {
                    ...item,
                  };
                } else {
                  let tmpIds = selectedFilterOptions[key];
                  selectedFilterOptions[filterTypePrefix + item.id] = {
                    ...item,
                  };
                  selectedFilterOptions[filterTypePrefix + item.id].values =
                    selectedFilterOptions[
                      filterTypePrefix + item.id
                    ].values.filter((element) => {
                      return tmpIds.some((itemId) => +itemId === element.id);
                    });
                }
              }
            });
          } else if (key !== "price" && key !== "sort" && key !== "page")
            delete selectedFilterOptions[key];
        } else if (key !== "price" && key !== "sort" && key !== "page")
          delete selectedFilterOptions[key];
      }
    }

    return selectedFilterOptions;
  }

  _getObjForRequest(selectedFilterOptions, page, deviceName) {
    let objForRequest = { ...selectedFilterOptions };

    Object.keys(objForRequest).map((key) => {
      if (key !== "price" && key !== "sort" && key !== "page") {
        objForRequest[key] =
          selectedFilterOptions[key].length > 0
            ? selectedFilterOptions[key]
            : [...selectedFilterOptions[key].values];
      }
    });

    objForRequest["criterias"] = {};
    objForRequest["specifications"] = {};
    objForRequest["deviceName"] = deviceName;
    objForRequest["page"] = page;
    let arrKeys = [
      "lagerort",
      "modell",
      "deviceName",
      "page",
      "price",
      "zustand",
      "garantie",
      "sort",
      "page",
      "criterias",
      "specifications",
    ];
    for (let key in objForRequest) {
      if (arrKeys.every((item) => item !== key)) {
        let name = key.slice(key.lastIndexOf("-") + 1),
          currentFilterName = key.slice(0, key.lastIndexOf("-")),
          filterType =
            currentFilterName === "kategorie" ? "criterias" : "specifications";

        objForRequest[filterType][name] = objForRequest[key];
        delete objForRequest[key];
      }
    }
    return objForRequest;
  }

  _getObjForRequestByCategoryId(selectedFilterOptions, page, modelCategoryId) {
    let objForRequest = { ...selectedFilterOptions };

    Object.keys(objForRequest).map((key) => {
      if (key !== "price" && key !== "sort" && key !== "page") {
        objForRequest[key] =
          selectedFilterOptions[key].length > 0
            ? selectedFilterOptions[key]
            : [...selectedFilterOptions[key].values];
      }
    });

    objForRequest["criterias"] = {};
    objForRequest["specifications"] = {};
    objForRequest["page"] = page;
    objForRequest["modelCategoryId"] = parseInt(modelCategoryId);
    objForRequest["sort"] = "popular";
    let arrKeys = [
      "lagerort",
      "modell",
      "deviceName",
      "modelCategoryId",
      "page",
      "price",
      "zustand",
      "garantie",
      "sort",
      "page",
      "criterias",
    ];
    for (let key in objForRequest) {
      if (arrKeys.every((item) => item !== key)) {
        let name = key.slice(key.lastIndexOf("-") + 1),
          currentFilterName = key.slice(0, key.lastIndexOf("-")),
          filterType =
            currentFilterName === "kategorie" ? "criterias" : "specifications";

        objForRequest[filterType][name] = [...objForRequest[key]];
        delete objForRequest[key];
      }
    }
    return objForRequest;
  }

  _getBrowserUrl(
    selectedFilterOptions,
    availableFilterOptions = this.state.availableFilterOptions
  ) {
    let s = "",
      { params } = this.props;
    for (let key in params) {
      if (key.includes("deviceCategory") && params[key]) s += params[key] + "/";
    }
    s += "filter/";

    for (let key in params) {
      if (
        key.includes("param") &&
        params[key] &&
        params[key].includes("kategorie-compatibility-brand")
      )
        s += params[key] + "/";
    }

    for (let key in selectedFilterOptions) {
      if (key === "price") {
        if (
          selectedFilterOptions[key].minSearch > 0 ||
          selectedFilterOptions[key].maxSearch < selectedFilterOptions[key].max
        ) {
          s += `preis=${selectedFilterOptions[key].minSearch}-${selectedFilterOptions[key].maxSearch}/`;
        }
      } else if (key === "sort" || key === "page") {
        s += `${key}=${selectedFilterOptions[key]}/`;
      } else {
        let categoryName = key;

        if (
          selectedFilterOptions[key].values.length ===
          availableFilterOptions[key].values.length
        ) {
          s += `${categoryName}=alle/`;
        } else if (selectedFilterOptions[key].values.length > 0) {
          selectedFilterOptions[key].values.forEach((item, i) => {
            if (i === 0) {
              if (selectedFilterOptions[key].values.length === 1) {
                s += `${categoryName}=${item.id || "alle"}/`;
              } else s += `${categoryName}=${item.id}`;
            } else if (i === selectedFilterOptions[key].values.length - 1) {
              s += `,${item.id}/`;
            } else s += `,${item.id}`;
          });
        }
      }
    }
    return s;
  }

  _parseUrl(nextPropsParams) {
    let urlParams = nextPropsParams,
      selectedFilterOptions = {
        page: 1,
        price: {
          min: 0,
          max: 1,
          maxSearch: 0,
          minSearch: 0,
        },
        lagerort: { values: [] },
        modell: { values: [] },
        zustand: { values: [] },
        sort:
          nextPropsParams.deviceCategory1 === "zubehör" ? "popular" : "popular",
      },
      storageLocationData = JSON.parse(
        window.localStorage.getItem("locationData")
      ),
      currentLocationData = {};
    this.props.places
      ? (currentLocationData = this.props.places)
      : storageLocationData
      ? storageLocationData.data.forEach((item) => {
          if (item.active === true) {
            currentLocationData = item;
          }
        })
      : (currentLocationData = null);
    for (let key in urlParams) {
      if (key.includes("param") && urlParams[key]) {
        let name = urlParams[key].slice(0, urlParams[key].indexOf("=")),
          paramsArr = [];

        if (name === "preis") {
          paramsArr = urlParams[key]
            .slice(urlParams[key].indexOf("=") + 1)
            .split("-");
          selectedFilterOptions.price.minSearch = paramsArr[0];
          selectedFilterOptions.price.maxSearch = paramsArr[1];
        } else if (name === "sort" || name === "page") {
          paramsArr = urlParams[key].slice(urlParams[key].indexOf("=") + 1);
          selectedFilterOptions[name] = paramsArr;
        } else {
          paramsArr = urlParams[key]
            .slice(urlParams[key].indexOf("=") + 1)
            .split(",");
          paramsArr.forEach(
            (item, i) =>
              (paramsArr[i] = item.replace(/-/g, " ").replace(/\|/g, "/"))
          );
          selectedFilterOptions[name] = paramsArr;
        }
      }
    }

    /*!selectedFilterOptions.lagerort ?
            !currentLocationData ?
            selectedFilterOptions.lagerort = {values: []}
                :
            selectedFilterOptions.lagerort = [currentLocationData.id]
                :
             selectedFilterOptions.lagerort = selectedFilterOptions.lagerort*/

    return selectedFilterOptions;
  }

  handleChooseFilterItemMobile(e, name, value) {
    e.preventDefault();
    let { filterOptions } = this.props,
      { selectedFilterOptions } = this.state;

    if (value === "allValues") {
      selectedFilterOptions[name]
        ? (selectedFilterOptions[name].values = [...filterOptions[name].values])
        : null;
    } else {
      if (
        selectedFilterOptions[name] &&
        selectedFilterOptions[name].values.length ===
          filterOptions[name].values.length
      ) {
        selectedFilterOptions[name].values = [];
        selectedFilterOptions[name].values.push(value);
      } else {
        if (
          selectedFilterOptions[name] &&
          selectedFilterOptions[name].values.some(
            (option) => option.id === value.id
          )
        ) {
          if (selectedFilterOptions[name].values.length === 1)
            selectedFilterOptions[name].values = [];
          else
            selectedFilterOptions[name].values = selectedFilterOptions[
              name
            ].values.filter((item) => item.id !== value.id);
        } else if (selectedFilterOptions[name]) {
          selectedFilterOptions[name].values.push(value);
        }
      }
    }
    this.setState({ selectedFilterOptions });
  }

  handleApplyFiltersMobile() {
    let { selectedFilterOptions } = this.state;

    browserHistory.push(
      `/kaufen/${this._getBrowserUrl(selectedFilterOptions)}`
    );

    $(".modelInnerPage-inner .contentPart").css({ display: "block" });
    $(".modelInnerPage #devicesListSmall").css({ display: "block" });
    // $('.modelInnerPage-inner .asideFilter').css({ display: 'none' })
    this.props.defineTitleHeadMobile(
      this.props.params.deviceCategory1 || "Categories"
    );
    this.props.handleBackFilter();
  }

  openQuickView(model) {
    let { models } = this.props;
    this.setState({
      quickViewPage: (
        <QuickViewPage
          model={model}
          allModels={models}
          openSuccessAddToBasket={this.openSuccessAddToBasket}
          capacityName={this.state.capacityName}
          closeQuickView={this.closeQuickView}
          deviceName={this.props.params.deviceCategory1}
        />
      ),
    });
  }

  closeQuickView() {
    this.setState({ quickViewPage: null });
  }

  openSuccessAddToBasket(item, source) {
    let { successAddToBasket } = this.state;
    let promise = new Promise((resolve, reject) => {
      if (item.modelId) {
        axios
          .get("/api/loadRecommendProducts?modelId=" + item.modelId)
          .then((result) => {
            resolve(result.data.data.length ? result.data.data : null);
          });
      } else if (source === "gridPage") {
        axios
          .get(
            "/api/loadBestBuyProducts?shortcode=" +
              item.shortcode +
              "&deviceName=" +
              encodeURIComponent(item.deviceName)
          )
          .then((result) => {
            resolve(result.data.data.length ? result.data.data : null);
          });
      } else {
        resolve(null);
      }
    });
    promise.then((result) => {
      if (result && successAddToBasket == null && result.length > 0) {
        this.setState({ recommendProducts: result });

        this.setState({
          successAddToBasket: (
            <SuccessAddToBasket
              addModelToBasket={this.addModelToBasket}
              basketData={this.props.basketData}
              source={source}
              model={item}
              recommendProducts={this.state.recommendProducts}
              closeSuccessAddToBasket={this.closeSuccessAddToBasket}
            />
          ),
        });
      }
    });
  }

  closeSuccessAddToBasket() {
    this.setState({ successAddToBasket: null });
  }

  addModelToBasket(e, item) {
    e.stopPropagation();
    e.preventDefault();
    let status = e.target.getAttribute("data-status"),
      source = e.target.getAttribute("data-source"),
      { basketData, params } = this.props,
      newBasketData = null;
    if (item.categoryName) {
      newBasketData = [...basketData, item];
    } else if (basketData.every((itemBasket) => itemBasket.id != item.id)) {
      newBasketData = [...basketData, item];
    } else {
      newBasketData = basketData.filter(
        (itemBasket) => itemBasket.shortcode != item.shortcode
      );
    }
    this.props.basketActions.changeBasketData(newBasketData);

    let brands, brand, category;
    if (source == "relevantProduct" || params.deviceCategory1 == "zubehör") {
      (brands = item.criterias.find(
        (item) => item.id === "manufacturer"
      ).values),
        (brand = brands.length ? brands[0].name : ""),
        (category = item.categoryName);
    } else {
      (brand = item.deviceName), (category = params.deviceCategory1 || "");
    }
    if (status === "out") {
      gtag("event", "add_to_cart", {
        items: [
          {
            id: item.shortcode,
            list_name: "Kaufen",
            quantity: 1,
            price: item.discountPrice || item.price,
            name: item.descriptionLong || item.model || "",
            brand: brand,
            category: category,
          },
        ],
      });
      if (!window.isMobile) {
        this.props.basketActions.basketAddEffect(
          <AddToBasketEffect
            startPosition={$(e.target).offset()}
            image={item.deviceImages.mainImg.src}
            basketType="kaufen"
          />
        );
        setTimeout(() => {
          if (source !== "relevantProduct") {
            this.openSuccessAddToBasket(item, source);
          }
          this.props.basketActions.basketAddEffect(null);
        }, 2000);
      } else {
        this.openSuccessAddToBasket(item, source);
        // browserHistory.push('/warenkorb')
      }
    }
    if (status === "in") {
      gtag("event", "remove_from_cart", {
        items: [
          {
            id: item.shortcode,
            list_name: "Kaufen",
            quantity: 1,
            price: item.discountPrice || item.price,
            name: item.descriptionLong || item.model || "",
            brand: brand,
            category: category,
          },
        ],
      });
      if (
        !newBasketData.length ||
        !newBasketData.filter((item) => item.productTypeId == 7).length
      ) {
        var deadline = JSON.parse(window.localStorage.getItem("deadline"));
        if (deadline) {
          deadline.isActive = 0;
          window.localStorage.setItem("deadline", JSON.stringify(deadline));
          newBasketData = newBasketData.filter(
            (item) => item.shortcode != deadline.couponShortcode
          );
          this.props.basketActions.changeBasketData(newBasketData);
        }
      }
    }

    this.props.basketData.map((el) => {
      return snaptr("track", "ADD_CART", {
        shortcode: el.shortcode,
        name: el.name,
      });
    });
  }

  addModelToWishlist(e, item) {
    e.stopPropagation();
    e.preventDefault();
    let { wishlistData } = this.props,
      newWishlistData = null;
    let status = "";
    if (wishlistData.every((itemWishlist) => itemWishlist.id != item.id)) {
      newWishlistData = [...wishlistData, item];
      status = "add";
    } else {
      newWishlistData = wishlistData.filter(
        (itemWishlist) => itemWishlist.shortcode != item.shortcode
      );
      status = "remove";
    }
    this.props.basketActions.changeWishlisteData(newWishlistData);
    if (!window.isMobile && status === "add") {
      this.props.basketActions.wishlistAddEffect(
        <AddToWishlistEffect
          startPosition={$(e.target).offset()}
          image={item.deviceImages.mainImg.src}
        />
      );
      setTimeout(() => {
        this.props.basketActions.wishlistAddEffect(null);
      }, 2000);
    }
  }

  handleClickItemGroup(e) {
    let { selectedFilterOptions, capacityName } = this.state,
      { params } = this.props,
      model = e.currentTarget.getAttribute("data-model"),
      capacity = e.currentTarget.getAttribute("data-capacity"),
      color = e.currentTarget.getAttribute("data-color");

    selectedFilterOptions.farbe = [color];
    selectedFilterOptions[capacityName] = [capacity];
    selectedFilterOptions.modell = [model];

    browserHistory.push(
      `/kaufen/${this._getBrowserUrl(selectedFilterOptions)}`
    );

    this.setState({ viewMode: "List" });
  }

  handlePageChange(pageNumber) {
    let { params } = this.props,
      selectedFilterOptions = this._parseUrl(this.props.params),
      deviceName = "",
      url = "";
    /*find device name*/
    for (let key in params) {
      if (key.includes("deviceCategory") && params[key])
        deviceName = params[key].replace(/-/g, " ");
    }

    document.getElementById("spinner-box-load").style.display = "block";
    selectedFilterOptions.page = pageNumber.selected + 1;
    let objForRequest = this._getObjForRequest(
      selectedFilterOptions,
      pageNumber.selected + 1,
      deviceName
    );
    this.props.params.deviceCategory1 === "zubehör"
      ? (url = "/api/getShopCategoryProducts")
      : (url = "/api/models");
    api.getModels(url, objForRequest).then(({ data }) => {
      $(window, document).scrollTop(0);
      document.getElementById("spinner-box-load").style.display = "none";
      this.setState({
        pagination: {
          ...this.state.pagination,
          activePage: pageNumber.selected,
        },
        infoNoModels: data.data.length === 0,
        selectedFilterOptions: {
          ...this.state.selectedFilterOptions,
          page: pageNumber.selected + 1,
        },
      });
      this.props.shopActions.loadModels(data.data, data.meta.categoriesList);
      browserHistory.push(
        `/kaufen/${this._getBrowserUrl(this.state.selectedFilterOptions)}`
      );
    });
  }

  gtagEnhancedEcommerce() {
    let data = this.props,
      gTagItems = data.models.map((item) => {
        let brand = "";
        if (data.params.deviceCategory1 == "zubehör") {
          let brands = item.criterias.find(
            (item) => item.id === "manufacturer"
          ).values;
          brand = brands.length ? brands[0].name : "";
        }
        return {
          id: item.shortcode,
          name: item.descriptionLong || item.model || "",
          list_name: "Kaufen",
          quantity: 1,
          brand:
            data.params.deviceCategory1 == "zubehör" ? brand : item.deviceName,
          category:
            data.params.deviceCategory1 == "zubehör"
              ? data.params.deviceCategory2
              : data.params.deviceCategory1 || "",
          price: item.discountPrice || item.price,
        };
      });

    gtag("event", "view_item_list", {
      items: gTagItems,
    });
  }

  changeViewMode(e) {
    let viewMode = e.target.getAttribute("data-mode");
    this.setState({ viewMode });
  }

  changePrice(e) {
    let { selectedFilterOptions } = this.state;
    if ((+e.min).toFixed(0) !== (+e.max).toFixed(0)) {
      selectedFilterOptions.price.minSearch = (+e.min).toFixed(0);
      selectedFilterOptions.price.maxSearch = (+e.max).toFixed(0);
      this.setState({ inputPriceMin: (+e.min).toFixed(0) });
      this.setState({ inputPriceMax: (+e.max).toFixed(0) });
      selectedFilterOptions.page = 1;
      if (!window.isMobile) this.inputPriceCallback(e);
      this.setState({ selectedFilterOptions });
    }
  }

  changeInputPrice(e, type) {
    if (type === "min") {
      this.setState({ inputPriceMin: e.target.value });
    }
    if (type === "max") {
      this.setState({ inputPriceMax: e.target.value });
    }
  }

  applyInputPrice(e, type) {
    let { inputPriceMin, inputPriceMax, selectedFilterOptions } = this.state;
    inputPriceMin =
      inputPriceMin != 0
        ? inputPriceMin
        : selectedFilterOptions.price.minSearch;
    inputPriceMax =
      inputPriceMax != 0
        ? inputPriceMax
        : selectedFilterOptions.price.maxSearch;
    this.setState({
      inputPriceErr: {
        min: false,
        max: false,
      },
    });
    if (
      type === "min" &&
      (parseInt(inputPriceMin) > parseInt(inputPriceMax) ||
        parseInt(inputPriceMin) < parseInt(selectedFilterOptions.price.min))
    ) {
      this.setState({
        inputPriceErr: {
          min: true,
          max: false,
        },
      });
      this.setState({ inputPriceMin: selectedFilterOptions.price.minSearch });
      $("#price_min").focus();
      return;
    }
    if (
      type === "max" &&
      (parseInt(inputPriceMax) < parseInt(inputPriceMin) ||
        parseInt(inputPriceMax) > parseInt(selectedFilterOptions.price.max))
    ) {
      this.setState({
        inputPriceErr: {
          min: false,
          max: true,
        },
      });
      this.setState({ inputPriceMax: selectedFilterOptions.price.maxSearch });
      $("#price_max").focus();
      return;
    }

    if (
      parseInt(inputPriceMin) !=
        parseInt(selectedFilterOptions.price.minSearch) ||
      parseInt(inputPriceMax) != parseInt(selectedFilterOptions.price.maxSearch)
    ) {
      selectedFilterOptions.price.minSearch = (+inputPriceMin).toFixed(0);
      selectedFilterOptions.price.maxSearch = (+inputPriceMax).toFixed(0);
      this.setState({ selectedFilterOptions });
      if (!window.isMobile) this.inputPriceCallback(e);
    }
  }

  changeInputPrice1(e, type) {
    let { inputPriceMin, inputPriceMax, selectedFilterOptions } = this.state;
    this.setState({
      inputPriceErr: {
        min: false,
        max: false,
      },
    });
    if (
      type === "min" &&
      (parseInt(e.target.value) >
        parseInt(
          inputPriceMax != 0
            ? inputPriceMax
            : selectedFilterOptions.price.maxSearch
        ) ||
        parseInt(e.target.value) < parseInt(selectedFilterOptions.price.min))
    ) {
      this.setState({
        inputPriceErr: {
          min: true,
          max: false,
        },
      });
      return;
    }
    if (
      type === "max" &&
      (parseInt(e.target.value) <
        parseInt(
          inputPriceMin != 0
            ? inputPriceMin
            : selectedFilterOptions.price.minSearch
        ) ||
        parseInt(e.target.value) > parseInt(selectedFilterOptions.price.max))
    ) {
      this.setState({
        inputPriceErr: {
          min: false,
          max: true,
        },
      });
      return;
    }
    if (type === "min") {
      this.setState({ inputPriceMin: e.target.value });
      selectedFilterOptions.price.minSearch = (+e.target.value).toFixed(0);
      this.setState({ selectedFilterOptions });
    }

    if (type === "max") {
      this.setState({ inputPriceMax: e.target.value });
      selectedFilterOptions.price.maxSearch = (+e.target.value).toFixed(0);
      this.setState({ selectedFilterOptions });
    }
  }

  mapSelectedCriteria = (all, selected) => {
    let filtered = [];
    let newAll = [];
    let diff = new Set();

    for (let item in selected) {
      for (let item2 in all) {
        if (typeof all[item2] === "object") newAll.push(all[item2]);

        newAll = newAll.filter(function (property) {
          return typeof property.name !== "undefined";
        });
      }

      if (typeof selected[item] === "object") filtered.push(selected[item]);
      filtered = filtered.filter(function (property) {
        return typeof property.name !== "undefined";
      });
    }
  };

  changeSortBy(e) {
    let { value } = e,
      { selectedFilterOptions } = this.state,
      { params } = this.props;

    selectedFilterOptions.sort = value;
    // if (!window.isMobile) {
    browserHistory.push(
      `/kaufen/${this._getBrowserUrl(selectedFilterOptions)}`
    );
    // }
    this.setState({ selectedFilterOptions });
  }

  showFilters(event) {
    event.preventDefault();

    $(".modelInnerPage-inner .asideFilter").css({ display: "block" });

    if (!window.isMobile) {
      $(".modelInnerPage-inner .filters-btn-mobile").css({ display: "none" });
    } else {
      $(".modelInnerPage-inner .contentPart").css({ display: "none" });
      $(".modelInnerPage #devicesListSmall").css({ display: "none" });

      let height = $(".mobileFixedBtn").outerHeight() + 30;
      $("#intercom-container .intercom-launcher-frame").attr(
        "style",
        "bottom:" + height + "px !important"
      );
      height -= 30;
      $("#tidio-chat #tidio-chat-iframe").css({
        bottom: height,
        right: "10px",
      });
    }
  }

  render() {
    let {
        viewMode,
        availableFilterOptions,
        selectedFilterOptions,
        quickViewPage,
        addBasketEffect,
        capacityName,
        pagination,
        seoData,
        totalCountModels,
        showSidebar,
        mainModelGroupId,
        options,
        successAddToBasket,
        seoAccessoriesData,
        productModels,
        inputPriceMin,
        inputPriceMax,
        inputPriceErr,
      } = this.state,
      {
        filterOptions,
        models,
        modelsGroup,
        basketData,
        wishlistData,
        devices,
      } = this.props,
      { deviceCategory1: deviceName } = this.props.params,
      content;

    if (viewMode === "Group")
      content = (
        <ModelsGrid
          models={models}
          basketData={basketData}
          wishlistData={wishlistData}
          addModelToBasket={this.addModelToBasket}
          addModelToWishlist={this.addModelToWishlist}
        />
      );
    else
      content = (
        <DeviceModelsGrid
          models={models}
          openQuickView={this.openQuickView}
          capacityName={capacityName}
          basketData={basketData}
          wishlistData={wishlistData}
          addModelToBasket={this.addModelToBasket}
          addModelToWishlist={this.addModelToWishlist}
          deviceName={deviceName}
        />
      );
    // else content = <ModelsList models={models}
    //     openQuickView={this.openQuickView}
    //     capacityName={capacityName}
    //     basketData={basketData}
    //     addModelToBasket={this.addModelToBasket}
    //     deviceName={deviceName}/>
    return (
      <div className="modelInnerPage">
        {/*{this.state.seoData && <Helmet> {seoData.title && <title>{seoData.title}</title>}*/}
        {/*{seoData.title && <meta property="og:title" content={seoData.title} />}*/}
        {/*{seoData.title && <meta name="twitter:title" content={seoData.title} />}*/}
        {/*{seoData.title && <meta itemprop="name" content={seoData.title} />}*/}
        {/*{seoData.description && <meta name="description" content={seoData.description} />}*/}
        {/*{seoData.description && <meta itemprop="description" content={seoData.description} />}*/}
        {/*{seoData.description && <meta property="og:description" content={seoData.description} />}*/}
        {/*{seoData.description && <meta name="twitter:description" content={seoData.description} />}*/}
        {/*{seoData.keywords && <meta name="keywords" content={seoData.keywords} />}*/}
        {/*</Helmet>*/}
        {/*}*/}
        {this.state.seoAccessoriesData && (
          <Helmet
            title={seoAccessoriesData.title || ""}
            meta={[
              {
                name: "description",
                content: seoAccessoriesData.meta_description || "",
              },
              {
                name: "keywords",
                content: seoAccessoriesData.meta_keywords || "",
              },
            ]}
          />
        )}
        <div className="container-fluid">
          <div className="row">
            {deviceName && (
              <TopDeviceMenu
                filterOptions={filterOptions}
                devices={devices}
                params={this.props.params}
                currentDevice={deviceName}
                models={
                  this.state.availableFilterOptions.modell
                    ? this.state.availableFilterOptions.modell.values
                    : ""
                }
                productModels={this.state.productModels}
                modelCategoryId={this.state.modelCategoryId}
              />
            )}
          </div>
        </div>
        <div className="modelInnerPage-inner">
          <div className="container-fluid">
            <div style={{ width: "95%", margin: "0 auto" }}>
              <div className="row row-flex">
                {showSidebar && (
                  <AsideFilter
                    filterOptions={filterOptions}
                    mainModelGroupId={mainModelGroupId}
                    selectedFilterOptions={selectedFilterOptions}
                    availableFilterOptions={availableFilterOptions}
                    inputPriceMin={inputPriceMin}
                    inputPriceMax={inputPriceMax}
                    inputPriceErr={inputPriceErr}
                    changePrice={this.changePrice}
                    changeInputPrice={this.changeInputPrice}
                    applyInputPrice={this.applyInputPrice}
                    mobileApply={this.handleApplyFiltersMobile}
                    mobileChoseItemFilter={this.handleChooseFilterItemMobile}
                    routeParams={this.props.params}
                    changeSortBy={this.changeSortBy}
                    viewMode={viewMode}
                    totalItems={totalCountModels}
                    currentValue={selectedFilterOptions.sort}
                    options={options}
                    handleBackFilter={this.props.handleBackFilter}
                  />
                )}

                <div className="col-md-9 contentPart">
                  {window.isMobile && this.mapDuplicateFilter()}
                  {window.isMobile && (
                    <div className="topFilter-mobile">
                      <div
                        className="filters-btn-mobile"
                        onClick={
                          this.showFilters
                        } /*onClick={this.props.showFiltersMobile}*/
                      >
                        Filter
                      </div>
                      <div className="text-right sortBy for-mobile">
                        <div className={"select"}>
                          <Select
                            options={options}
                            onChange={this.changeSortBy}
                            value={selectedFilterOptions.sort}
                            searchable={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="redisplay">
                    {this.mapSelectedCriteria(
                      availableFilterOptions,
                      selectedFilterOptions
                    )}
                  </div>
                  <TopFilter
                    changeSortBy={this.changeSortBy}
                    //    showSearchBar={this.props.params.deviceCategory1}
                    showSearchBar={false}
                    viewMode={viewMode}
                    changeViewMode={this.changeViewMode}
                    totalItems={pagination.totalItemsCount}
                    currentValue={selectedFilterOptions.sort}
                    options={options}
                    mapDuplicateFilter={this.mapDuplicateFilter()}
                    valueSelected={this.valueSelected}
                  />
                  <div>
                    {models.length > 0 && content}
                    {this.state.infoNoModels && (
                      <div className="col-md-12 text-center">
                        <h1>Information</h1>
                        <p>
                          Aktuell sind von diesem Typ keine Produkte an Lager.
                        </p>
                      </div>
                    )}
                    {models.length > 0 && (
                      <div className="col-md-12 text-center">
                        <ReactPaginate
                          previousLabel={"<"}
                          nextLabel={">"}
                          breakLabel={<a href="">...</a>}
                          breakClassName={"break-me"}
                          pageCount={this.state.pagination.pageCount}
                          forcePage={pagination.activePage}
                          marginPagesDisplayed={5}
                          pageRangeDisplayed={5}
                          onPageChange={this.handlePageChange}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container margin-line-20">
          <div className="col-sm-12">
            <p className="seo">
              {this.state.seoAccessoriesData
                ? this.state.seoAccessoriesData.html_description
                : ""}
            </p>
          </div>
        </div>
        <div className="container customersAboutUs">
          <CustomerAboutUs notShowLoader="true" />
        </div>
        <div className="container banner-area">
          <Banner />
        </div>
        {addBasketEffect}
        {quickViewPage}
        {successAddToBasket}
      </div>
    );
  }
}

ModelsInnerPage.propTypes = {};
ModelsInnerPage.defaultProps = {};

function mapStateToProps(state) {
  return {
    filterOptions: state.shop.filterOptions,
    models: state.shop.models,
    devices: state.shop.devices,
    modelsGroup: state.shop.modelsGroup,
    basketData: state.basket.basketData,
    places: state.places.currentLocation,
    wishlistData: state.basket.wishlistData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    shopActions: bindActionCreators(shopActions, dispatch),
    basketActions: bindActionCreators(basketActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsInnerPage);
