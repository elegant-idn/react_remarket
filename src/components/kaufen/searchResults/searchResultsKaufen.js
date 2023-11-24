import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import Select from "react-styled-select";
import { bindActionCreators } from "redux";
import * as basketActions from "../../../actions/basket";
import * as shopActions from "../../../actions/shop";
import AddToBasketEffect from "../../common/addToBasketEffect";
import QuickViewPage from "../innerPage/quickViewPage";
import ItemModelSearchResult from "./itemModelSearchResult";

const options = [
  { label: "Beliebteste Produkte", value: "popular" },
  { label: "Günstige Preise zuerst anzeigen", value: "niedrighoch" },
  { label: "Hohe Preise zuerst anzeigen", value: "hochniedrig" },
  { label: "Nach Einstelldatum sortieren", value: "neu" },
];

export class SearchResultsKaufen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagination: {
        activePage: 0,
        totalItemsCount: 0,
        pageCount: 0,
      },
      currentValueSort: "popular",
      infoNoModels: false,
      quickPreview: null,
      capacityName: "",
    };

    this.goBack = this.goBack.bind(this);
    this.changeSortBy = this.changeSortBy.bind(this);
    this.mapModels = this.mapModels.bind(this);
    this.addModelToBasket = this.addModelToBasket.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.openQuickView = this.openQuickView.bind(this);
    this.closeQuickView = this.closeQuickView.bind(this);
  }
  componentWillUnmount() {
    this.props.shopActions.setSearchResult(
      { data: [], meta: { totalCount: 0 } },
      ""
    );
  }
  componentDidMount() {
    document.getElementById("spinner-box-load").style.display = "block";
    axios
      .post(`/api/models`, {
        search: this.props.params.searchParam,
        sort: "popular",
        page: 1,
      })
      .then((result) => {
        document.getElementById("spinner-box-load").style.display = "none";
        let pagination = result.data.meta.pagination;
        this.props.shopActions.setSearchResult(
          result.data,
          this.props.params.searchParam
        );
        this.setState({
          pagination: {
            ...this.state.pagination,
            activePage: 0,
            totalItemsCount: pagination.total,
            pageCount: Math.ceil(pagination.total / pagination.per_page),
          },
          infoNoModels: result.data.data.length === 0,
          capacityName: result.data.meta.capacityName,
        });
        if (window.isGoogleConnection) this.gtagEnhancedEcommerce();
      });
  }
  gtagEnhancedEcommerce() {
    let data = this.props.searchResults.data,
      gTagItems = data.map((item) => {
        return {
          id: item.shortcode,
          name: item.descriptionLong || item.model || "",
          list_name: "Kaufen",
          quantity: 1,
          brand: item.deviceName,
          price: item.discountPrice || item.price,
        };
      });

    gtag("event", "view_item_list", {
      items: gTagItems,
    });
  }
  openQuickView(model) {
    let { data } = this.props.searchResults;
    this.setState({
      quickPreview: (
        <QuickViewPage
          model={model}
          allModels={data}
          capacityName={this.state.capacityName}
          closeQuickView={this.closeQuickView}
        />
      ),
    });
  }
  closeQuickView() {
    this.setState({ quickPreview: null });
  }
  handlePageChange(pageNumber) {
    let body = {
      search: this.props.params.searchParam,
      sort: this.state.currentValueSort,
      page: pageNumber.selected + 1,
    };
    document.getElementById("spinner-box-load").style.display = "block";
    axios.post(`/api/models`, body).then((result) => {
      document.getElementById("spinner-box-load").style.display = "none";
      window.scrollTo(0, 0);
      this.props.shopActions.setSearchResult(
        result.data,
        this.props.params.searchParam
      );
      this.setState({
        pagination: {
          ...this.state.pagination,
          activePage: pageNumber.selected,
        },
      });
      if (window.isGoogleConnection) this.gtagEnhancedEcommerce();
    });
  }
  addModelToBasket(e, data) {
    e.stopPropagation();
    let status = e.target.getAttribute("data-status"),
      { basketData } = this.props,
      newBasketData = null;

    if (basketData.every((item) => item.id != data.id))
      newBasketData = [...basketData, data];
    else {
      let shortcode = "";
      newBasketData = basketData.filter((item) => {
        if (item.id != data.id) return true;
        else {
          shortcode = item.shortcode;
          return false;
        }
      });
      if (shortcode)
        newBasketData = newBasketData.filter(
          (item) => item.deviceShortcode != shortcode
        );
    }

    this.props.basketActions.changeBasketData(newBasketData);

    if (status === "out") {
      if (!window.isMobile) {
        this.props.basketActions.basketAddEffect(
          <AddToBasketEffect
            startPosition={$(e.target).offset()}
            image={data.deviceImages.mainImg.src}
            basketType="kaufen"
          />
        );
        setTimeout(() => {
          browserHistory.push("/warenkorb");
          this.props.basketActions.basketAddEffect(null);
        }, 2000);
      } else browserHistory.push("/warenkorb");
    }
  }
  changeSortBy(e) {
    let value = e,
      data = {
        search: this.props.searchResults.searchValue,
        sort: value,
        page: 1,
      };
    document.getElementById("spinner-box-load").style.display = "block";
    axios.post(`/api/models`, data).then((result) => {
      document.getElementById("spinner-box-load").style.display = "none";
      let pagination = result.data.meta.pagination;
      this.setState({
        pagination: {
          ...this.state.pagination,
          activePage: 0,
          totalItemsCount: pagination.total,
          pageCount: Math.ceil(pagination.total / pagination.per_page),
        },
        currentValueSort: value,
      });
      this.props.shopActions.setSearchResult(
        result.data,
        this.props.searchResults.searchValue
      );
      if (window.isGoogleConnection) this.gtagEnhancedEcommerce();
    });
  }
  goBack() {
    this.props.shopActions.setSearchResult(
      { data: [], meta: { totalCount: 0 } },
      ""
    );
    browserHistory.push("/kaufen");
  }
  mapModels(item, i) {
    return (
      <ItemModelSearchResult
        data={item}
        openQuickView={this.openQuickView}
        status={
          this.props.basketData.some((value) => value.id === item.id)
            ? "in"
            : "out"
        }
        addModelToBasket={this.addModelToBasket}
        key={i}
      />
    );
  }
  render() {
    let { data } = this.props.searchResults,
      { pagination, infoNoModels, quickPreview } = this.state;
    return (
      <div>
        <div className="searchResults">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <div className="div topRow">
                  <button onClick={this.goBack}>zurück</button>
                  <div className="sort">
                    <span>Sortieren nach</span>
                    <Select
                      options={options}
                      onChange={this.changeSortBy}
                      value={this.state.currentValueSort}
                      searchable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                <div className="wrapModels">
                  {data.map(this.mapModels)}
                  {infoNoModels && (
                    <p>
                      Zum aktuellen Zeitpunkt haben vom Modell:{" "}
                      {this.props.searchResults.searchValue} keine Produkte an
                      Lager.
                    </p>
                  )}
                </div>
                {data.length > 0 && (
                  <div className="col-md-12 text-center">
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={<a href="">...</a>}
                      breakClassName={"break-me"}
                      pageCount={pagination.pageCount}
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
        {quickPreview}
      </div>
    );
  }
}

SearchResultsKaufen.propTypes = {};
SearchResultsKaufen.defaultProps = {};

function mapStateToProps(state) {
  return {
    searchResults: state.shop.searchResults,
    basketData: state.basket.basketData,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    shopActions: bindActionCreators(shopActions, dispatch),
    basketActions: bindActionCreators(basketActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsKaufen);
