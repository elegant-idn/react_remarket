export function _googleAutocomplete(domainId, basketType){
    let countries = []

    domainId === 2 ? countries = ["ch","li"] : countries = ["de"];
    [...document.querySelectorAll('#route, #locality, #postal_code, #customer_route, #customer_locality, #customer_postal_code')].forEach( (item, i) => {
        window['autocomplete' + i] = new google.maps.places.Autocomplete(
            item,            
            // {types: ['geocode'], componentRestrictions: {country: countries}}
            {types: ['address'], componentRestrictions: {country: countries}}
        );
        window['autocomplete' + i].addListener('place_changed', () => {
            let componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                country: 'short_name',
                postal_code: 'short_name'
            }
            let formData = { ...this.state.formData}

            let place = window['autocomplete' + i].getPlace();
            for (let component in componentForm) {
                if(component !== 'country' && (component === item.id || 'customer_' + component === item.id)) {
                    item.id.indexOf('customer') >= 0 ? document.getElementById('customer_' + component).value = null : document.getElementById(component).value = null
                    if(formData){
                        let prop = item.id.indexOf('customer') >= 0
                                        ? document.getElementById('customer_' + component).name
                                        : document.getElementById(component).name
                        formData[prop] = ''
                    }
                }
            }

            for (let i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0];
                if(item.id.indexOf('customer') >= 0){
                    if( addressType === 'country' ){
                        if(this.state.formData){
                            formData.RechnungLand = place.address_components[i][ componentForm[addressType ]].toLowerCase()
                        }
                        else{
                            this.setState({
                                country: { ...this.state.country,
                                           currentCountry: {...this.state.country.currentCountry,
                                                            customer_inputCountry: place.address_components[i][ componentForm[addressType ]]}
                                         }
                            })
                        }
                    }
                    else{
                        if (componentForm[addressType]) {
                            switch(item.id){
                                case('customer_route'):
                                    let val = place.address_components[i][componentForm[addressType]];
                                    document.getElementById('customer_' + addressType).value = val;
                                    $('#customer_' + addressType).removeClass('error');
                                    if(formData) formData[document.getElementById('customer_' + addressType).name] = val;
                                    break
                                case('customer_locality'):
                                    if (item.id.includes(addressType)) {
                                        let val = place.address_components[i][componentForm[addressType]];
                                        document.getElementById('customer_' + addressType).value = val;
                                        $('#customer_' + addressType).removeClass('error');
                                        if(formData) formData[document.getElementById('customer_' + addressType).name] = val;
                                    }
                                    break
                                case('customer_postal_code'):
                                    if (item.id.includes(addressType) || 'customer_locality'.includes(addressType)) {
                                        let val = place.address_components[i][componentForm[addressType]];
                                        document.getElementById('customer_' + addressType).value = val;
                                        $('#customer_' + addressType).removeClass('error');
                                        if(formData) formData[document.getElementById('customer_' + addressType).name] = val;
                                    }
                                    break
                            }
                        }
                    }
                }
                else{
                    if( addressType === 'country' ){
                        if(this.state.formData){
                            formData.LieferLand = place.address_components[i][ componentForm[addressType ]].toLowerCase()
                        }
                        else {
                            this.setState({
                                country: { ...this.state.country,
                                           currentCountry: {...this.state.country.currentCountry,
                                                               inputCountry: place.address_components[i][componentForm[addressType]]
                                                           }
                                }
                            })
                        }
                    }
                    else{
                        if (componentForm[addressType]) {
                            switch(item.id){
                                case('route'):
                                    let val = place.address_components[i][componentForm[addressType]];
                                    document.getElementById(addressType).value = val;
                                    $('#' + addressType).removeClass('error');
                                    if(formData) formData[document.getElementById(addressType).name] = val;
                                    break
                                case('locality'):
                                    if (addressType === item.id) {
                                        let val = place.address_components[i][componentForm[addressType]];
                                        document.getElementById(addressType).value = val;
                                        $('#' + addressType).removeClass('error');
                                        if(formData) formData[document.getElementById(addressType).name] = val;
                                    }
                                    break
                                case('postal_code'):
                                    if (addressType === item.id || addressType === 'locality') {
                                        let val = place.address_components[i][componentForm[addressType]];
                                        document.getElementById(addressType).value = val;
                                        $('#' + addressType).removeClass('error');
                                        if(formData) formData[document.getElementById(addressType).name] = val;
                                    }
                                    break
                            }
                        }
                    }
                }

            }
            if( formData ) this.setState({ formData })
            if(basketType){
                let personalData = _getPersonalDataFields()
                window.localStorage.setItem(basketType, JSON.stringify(personalData))
            }
        })
    })
}

export function _getPersonalDataFields(){
    let form = document.forms.basketForm,
        data = {}
    if(form){
        data.shippingAddress = {
            city: form.city.value,
            companyName: form.companyName.value,
            email: form.email.value,
            firstname: form.firstname.value,
            gender: form.gender.value,
            inputCountry: form.inputCountry && form.inputCountry.value,
            lastname: form.lastname.value,
            number: form.number.value,
            phone: form.phone.value,
            street: form.street.value,
            zip: form.zip.value,
            company: form.company.checked,
        }
        data.billingAddress = {
            customer_city: form.customer_city.value,
            customer_companyName: form.customer_companyName.value,
            customer_email: form.customer_email.value,
            customer_firstname: form.customer_firstname.value,
            customer_gender: form.customer_gender.value,
            customer_inputCountry: form.customer_inputCountry && form.customer_inputCountry.value,
            customer_lastname: form.customer_lastname.value,
            customer_number: form.customer_number.value,
            customer_phone: form.customer_phone.value,
            customer_street: form.customer_street.value,
            customer_zip: form.customer_zip.value,
            customerCompanyName: form.customerCompanyName.checked,
        }
        data.usingShippingAddress = form.shippingAddress.checked
    }
    return data
}

export function _setPersonalDataFields(data){
    let shippingAddressForm = document.forms.basketForm,
        { country, inputCheckbox } = this.state
    if(shippingAddressForm){
        for(let key in data.billingAddress){
            if(key === 'customer_inputCountry'){
                country.currentCountry.customer_inputCountry = data.billingAddress[key]
            }
            else if (key === 'customer_companyName') {
                if(data.billingAddress[key]){
                    inputCheckbox.customerCompanyName = true
                    shippingAddressForm[key].value = data.billingAddress[key]
                }
                else{
                    inputCheckbox.customerCompanyName = false
                    shippingAddressForm[key].value = data.billingAddress[key]
                }
            }
            else if (shippingAddressForm[key]) shippingAddressForm[key].value = data.billingAddress[key]

        }
        for(let key in data.shippingAddress){
            if(key === 'inputCountry'){
                country.currentCountry.inputCountry = data.shippingAddress[key]
            }
            else if (key === 'companyName' ) {
                if( data.shippingAddress[key]){
                    inputCheckbox.company = true
                    shippingAddressForm[key].value = data.shippingAddress[key]
                }
                else{
                    inputCheckbox.company = false
                    shippingAddressForm[key].value = data.shippingAddress[key]
                }
            }
            else if (shippingAddressForm[key]) shippingAddressForm[key].value = data.shippingAddress[key]
        }
        this.setState({ country, inputCheckbox,
            autoloadPersonalData: {...this.state.autoloadPersonalData, element: null, data: null}
        })
    }
}

export function _setPersonalDataFormMyAccount(data, formName){
    let form = document.forms[formName],
        { country, inputCheckbox } = this.state
    if(form){
        for ( let key in data ){
            switch (key){
                case 'company':
                    if(data[key]){
                        inputCheckbox.systemCompany = true
                        form[key].value = data[key]
                    }
                    else{
                        inputCheckbox.systemCompany = false
                        form[key].value = data[key]
                    }
                    break
                case 'LieferFirmenname':
                    if(data[key]){
                        inputCheckbox.shippingCompany = true
                        form[key].value = data[key]
                    }
                    else{
                        inputCheckbox.shippingCompany = false
                        form[key].value = data[key]
                    }
                    break
                case 'RechnungFirmenname':
                    if(data[key]){
                        inputCheckbox.customerCompany = true
                        form[key].value = data[key]
                    }
                    else{
                        inputCheckbox.customerCompany = false
                        form[key].value = data[key]
                    }
                    break
                case 'Sprache':
                    if (form[key]) form[key].value = data[key]
                    country.currentCountry.system_inputCountry = data[key]
                    break
                case 'LieferLand':
                    if(form[key]) form[key].value = data[key]
                    country.currentCountry.inputCountry = data[key]
                    break
                case 'RechnungLand':
                    if (form[key]) form[key].value = data[key]
                    country.currentCountry.customer_inputCountry = data[key]
                    break
                default:
                    if (form[key]) form[key].value = data[key]
            }
        }
        this.setState({ inputCheckbox, country })
    }
}

export  let LoginModalController = {
    tabsElementName: ".login-box-tabs li",
    tabElementName: ".login-box-tab",
    inputElementsName: ".login-box-form .input",
    hidePasswordName: ".hide-password",

    inputElements: null,
    tabsElement: null,
    tabElement: null,
    hidePassword: null,

    activeTab: null,
    tabSelection: 0, // 0 - first, 1 - second

    findElements: function () {
        var base = this;

        base.tabsElement = $(base.tabsElementName);
        base.tabElement = $(base.tabElementName);
        base.inputElements = $(base.inputElementsName);
        base.hidePassword = $(base.hidePasswordName);

        return base;
    },

    setState: function (state) {
        var base = this,
            elem = null;

        if (!state) {
            state = 0;
        }

        if (base.tabsElement) {
            elem = $(base.tabsElement[state]);
            elem.addClass("current");
            $("." + elem.attr("data-tabtar")).addClass("show");
        }

        return base;
    },

    getActiveTab: function () {
        var base = this;

        base.tabsElement.each(function (i, el) {
            if ($(el).hasClass("current")) {
                base.activeTab = $(el);
            }
        });

        return base;
    },

    addClickEvents: function () {
        var base = this;

        base.hidePassword.on("click", function (e) {
            var $this = $(this),
                $pwInput = $this.prev("span").find("input");

            if ($pwInput.attr("type") == "password") {
                $pwInput.attr("type", "text");
                $this.text("Verstecken");
            } else {
                $pwInput.attr("type", "password");
                $this.text("Anzeigen");
            }
        });

        base.tabsElement.on("click", function (e) {
            var targetTab = $(this).attr("data-tabtar");

            e.preventDefault();
            base.activeTab.removeClass("current");
            base.activeTab = $(this);
            base.activeTab.addClass("current");

            base.tabElement.each(function (i, el) {
                el = $(el);
                el.removeClass("show");
                if (el.hasClass(targetTab)) {
                    el.addClass("show");
                }
            });
        });

        base.inputElements.find("label").on("click", function (e) {
            var $this = $(this),
                $input = $this.next("input");

            $input.focus();
        });

        return base;
    },
    initialize: function () {
        var base = this;
        base.findElements().setState().getActiveTab().addClickEvents();
        $("#op,#forgotPassword").on("change", (event) => {
            if(event.target.checked) {
                document.body.classList.add("login-form-opened");
            } else {
                document.body.classList.remove("login-form-opened");
            }
        });
    }
}

export let headerController = {
    initialize: function () {
        var scrollingHeader = window.isMobile ? '.scrolling-header.header-mobile' : '.scrolling-header'
        var fakeHeader = window.isMobile ? '.fake-header.header-mobile' : '.fake-header'
        var px = window.isMobile ? 60 : 30
        var $header_real_height = $(scrollingHeader).height();
        // var $header_fake_height = $(fakeHeader).height();
        // $('#header-fake').removeClass('header-scrolling');

        $(document, window).on('scroll',
            function()
            {
                if(!window.isMobile && $(document).scrollTop() >= 100) 
                {
                    // $(fakeHeader).height($header_real_height + px);
                    $(scrollingHeader).addClass('scroll');
                }
                else if(window.isMobile && $(document).scrollTop() >= 70){
                    $(scrollingHeader).addClass('scroll');
                }
                // else if(document.documentElement.clientHeight >= 618 && document.documentElement.clientHeight <= 700) {
                    
                // }
                else
                {
                    // $(fakeHeader).height($header_fake_height);
                    $(scrollingHeader).removeClass('scroll')
                }
            }).trigger('scroll');
    }
}

export function showMap (plId){

    function CustomMarker(latlng, map, args) {
        this.latlng = latlng
        this.args = args
        this.setMap(map)
    }

    CustomMarker.prototype = new google.maps.OverlayView()
    CustomMarker.prototype.draw = function () {
        let div = this.div
        if (!div) {
            div = this.div = document.createElement('div')
            div.className = 'mapMarker'
            var panes = this.getPanes()
            panes.overlayImage.appendChild(div)
        }

        var point = this.getProjection().fromLatLngToDivPixel(this.latlng)
        if (point) {
            div.style.left = point.x - 20 + 'px'
            div.style.top = point.y + 'px'
        }
    }

    let map = new google.maps.Map(document.querySelector('.mapContainer'), {
        zoom: 17
    })
    let placeId;
    if (plId === 1) {
        placeId = 'ChIJ6Woipq25kUcRoqB8dyvAvKA';
    } else if (plId === 6) {
        placeId = 'ChIJgbNYYHowjkcRov-ad_r1N60';
    } else if (plId === 5) {
        placeId = 'ChIJRdBteii4kUcRXyiwKqJ0ALM';
    } else if (plId === 4) {
        placeId = 'ChIJxwhr9H6xkUcRzxmAyoHLx8k';
    }

    let service = new google.maps.places.PlacesService(map);

    if(placeId) {
        service.getDetails(
            {placeId},
            function (result, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    map.setCenter(result.geometry.location);
                    let marker = new google.maps.Marker({
                        map: map,
                        place: {
                            placeId,
                            location: result.geometry.location
                        }
                    });
                    marker.setVisible(false)

                    let overlay = new CustomMarker(result.geometry.location, map, {})

                    let starWidth = (result.rating / 5) * 100 + '%'

                    let starsContent = ``
                    result.rating
                        ? starsContent = `<b style="color:#02ca95">${result.rating}&nbsp;</b>
                                    <div class="back-stars">
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <div class="front-stars" style="width: ${starWidth}">
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                        </div>
                                    </div>`
                        : null
                    let content = `<div class="map-info-block">
                            <p><b>${result.name}</b></p>
                            <p>${result.adr_address.replace(/,/g, '')}</p>
                            ${starsContent}
                           </div>`

                    let infoWindow = new google.maps.InfoWindow({content: content});
                    window.setTimeout(function () {
                        infoWindow.open(map, marker);
                    }, 200);
                    $('#modalMap').modal('show');
                }
            }
        )
    }
}

export function pushKlavioIdentify() {
    var loggedUserData = JSON.parse(window.localStorage.getItem("loggedUserData"));
    var userData = JSON.parse(window.localStorage.getItem("userData"));

    if(loggedUserData && loggedUserData.systemAddress) {
        _learnq.push(['identify', {
            '$email' : loggedUserData.systemAddress.email || '',
            '$first_name': loggedUserData.systemAddress.first_name  || '',
            '$last_name': loggedUserData.systemAddress.last_name
        }]);
    }
    else if(userData && userData.billingAddress) {
        _learnq.push(['identify', {
            '$email' : userData.billingAddress.customer_email  || '',
            '$first_name': userData.billingAddress.customer_firstname  || '',
            '$last_name': userData.billingAddress.customer_lastname  || ''
        }]);
    }
    else {
        _learnq.push(['identify', {
            '$email' : '',
        }]);
    }
}

export function getLang() {
    let lang = window.localStorage.getItem('lang')
    if (typeof(lang) == 'undefined' || !lang || lang == '')
        lang = 'de'
    return lang
}

export function discountCode(message, classname) {
    var mySubString = message.substring(
        message.indexOf("*") + 1, 
        message.lastIndexOf("*")
    );
    if (mySubString.length > 0) {
        mySubString = '<span class="'+classname+'">'+mySubString+'</span>';
    }
        
        message = message.replace(/\*.*\*/, mySubString);
    return message;
}