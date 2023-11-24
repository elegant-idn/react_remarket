export default{
    shop:{
        devices: [],
        devicesSell: [],
        models: [],
        modelsGroup: [],
        filterOptions: {
            modell: {values: []},
            zustand: {values: []}
        },
        searchResults: {
            data: [],
            total: 0,
            searchValue: null
        },
        helperCounter: {
            searchValue: '',
            currentSearchPage: 1,
        }
    },
    user: {
        data: {},
        isLogin: false,
        msgInfo: null,
        redirectTo: false,
        cancelRedirectToMyAccount: false
    },
    basket: {
        basketData: [],
        basketDataVerkaufen: [],
        shippingMethod: {
            selected: false,
            value: {}
        },
        count: 0,
        countVerkaufen: 0,
        basketDataRepair: {
            selectedOptions: [],
            shippingMethod: null
        },
        wishlistData: [],
        wishlistCount: 0,
    },
    places: [],
    currentPath: ''
}