import React, { Suspense, lazy } from 'react'
import { Route, IndexRoute } from 'react-router'

import * as userActions from '../actions/user'
// import WishlistPage from "../components/wishlist/WishlistPage";

const Application = lazy(() => import(/* webpackChunkName: "js/lazy/application" */ '../components/index'));
const VerkaufenBeta = lazy(() => import(/* webpackChunkName: "js/lazy/verkaufenBeta" */ '../components/verkaufenBeta/verkaufenBeta'));
const Kaufen = lazy(() => import(/* webpackChunkName: "js/lazy/kaufen" */ '../components/kaufen/kaufen'));
const CategoriesPage = lazy(() => import(/* webpackChunkName: "js/lazy/categoriesPage" */ '../components/kaufen/categoriesPage'));
const SellPageOverview = lazy(() => import(/* webpackChunkName: "js/lazy/sellPageOverview" */ '../components/verkaufen/sellPageOverview/sellPageOverview'));
const BasketVerkaufen = lazy(() => import(/* webpackChunkName: "js/lazy/basketVerkaufenPage" */ '../components/verkaufen/basket/basketVerkaufenPage'));
const ModelsInnerPage = lazy(() => import(/* webpackChunkName: "js/lazy/innerPage" */ '../components/kaufen/innerPage/innerPage'));
const FormNewPassword = lazy(() => import(/* webpackChunkName: "js/lazy/formNewPassword" */ '../components/header/loginForm/formNewPassword'));
const InfoPageRegistration = lazy(() => import(/* webpackChunkName: "js/lazy/infoPageRegistration" */ '../components/common/infoPageRegistration'));
const ConfirmRegistration = lazy(() => import(/* webpackChunkName: "js/lazy/confirmRegistration" */ '../components/common/confirmRegistration'));
const Basket = lazy(() => import(/* webpackChunkName: "js/lazy/basket" */ '../components/basket/basket'));
const NewCounterOffer = lazy(() => import(/* webpackChunkName: "js/lazy/newCounterOffer" */ '../components/verkaufen/newCounterOffer/newCounterOffer'));
const ThankYouPage = lazy(() => import(/* webpackChunkName: "js/lazy/thankYouPage" */ '../components/common/thankYouPage'));
const ThankYouPageRepair = lazy(() => import(/* webpackChunkName: "js/lazy/thankYouPageRepair" */ '../components/repair/paymentInfo/thankYouPage'));
const ErrorPaymentPageRepair = lazy(() => import(/* webpackChunkName: "js/lazy/errorPaymentPageRepair" */ '../components/repair/paymentInfo/errorPaymentPage'));
const ErrorPaymentPage = lazy(() => import(/* webpackChunkName: "js/lazy/errorPaymentPage" */ '../components/common/errorPaymentPage'));
const CancelPaymentPageRepair = lazy(() => import(/* webpackChunkName: "js/lazy/cancelPaymentPageRepair" */ '../components/repair/paymentInfo/cancelPaymentPage'));
const CancelPaymentPage = lazy(() => import(/* webpackChunkName: "js/lazy/cancelPaymentPage" */ '../components/common/cancelPaymentPage'));
const AccountPage = lazy(() => import(/* webpackChunkName: "js/lazy/accountPage" */ '../components/myAccount/accountPage'));
const ChangePasswordForm = lazy(() => import(/* webpackChunkName: "js/lazy/changePasswordForm" */ '../components/myAccount/changePasswordForm'));
const MainPage = lazy(() => import(/* webpackChunkName: "js/lazy/mainPage" */ '../components/mainPage/mainPage'));
const AboutUs = lazy(() => import(/* webpackChunkName: "js/lazy/aboutUs" */ '../components/aboutUs/aboutUs'));
const Qualitaet = lazy(() => import(/* webpackChunkName: "js/lazy/Qualitaet" */ '../components/aboutUs/Qualitaet'));
const ContactForm = lazy(() => import(/* webpackChunkName: "js/lazy/contactForm" */ '../components/aboutUs/contactForm'));
const AGB = lazy(() => import(/* webpackChunkName: "js/lazy/agb" */ '../components/aboutUs/agb'));
const Widerrufsbelehrung = lazy(() => import(/* webpackChunkName: "js/lazy/widerrufsbelehrung" */ '../components/aboutUs/widerrufsbelehrung'));
const FaqPageOld = lazy(() => import(/* webpackChunkName: "js/lazy/faqPage" */ '../components/aboutUs/faqPage'));
const FaqPage = lazy(() => import(/* webpackChunkName: "js/lazy/faqPageComponent" */ '../components/aboutUs/faq/faqPageComponent'));
const Impressum = lazy(() => import(/* webpackChunkName: "js/lazy/impressum" */ '../components/aboutUs/impressum'));
const Datenschutzerklaerung = lazy(() => import(/* webpackChunkName: "js/lazy/datenschutzerklaerung" */ '../components/aboutUs/datenschutzerklaerung'));
const JobsComponent = lazy(() => import(/* webpackChunkName: "js/lazy/jobsComponent" */ '../components/aboutUs/jobs/jobsComponent'));
const PageDownloadCoupon = lazy(() => import(/* webpackChunkName: "js/lazy/pageDownloadCoupon" */ './../components/aboutUs/PageDownloadCoupon'));
const CompanyPage = lazy(() => import(/* webpackChunkName: "js/lazy/companyPage" */ '../components/companyPage/companyPage'));
const DetailModelPage = lazy(() => import(/* webpackChunkName: "js/lazy/detailModelPage" */ '../components/detailModelPage/detailModelPage'));
const AccessoryDetailPage = lazy(() => import(/* webpackChunkName: "js/lazy/accessoryDetailPage" */ '../components/detailModelPage/accessoryDetailPage/accessoryDetailPage'));
const EditUserProfile = lazy(() => import(/* webpackChunkName: "js/lazy/editUserProfile" */ '../components/myAccount/editUserProfile'));
const OverviewOrders = lazy(() => import(/* webpackChunkName: "js/lazy/overviewOrders" */ '../components/myAccount/overviewOrders/overviewOrders'));
const ConvertCredits = lazy(() => import(/* webpackChunkName: "js/lazy/convertCredits" */ '../components/myAccount/convertCredits/convertCredits'));
const SpinnerBox = lazy(() => import(/* webpackChunkName: "js/lazy/spinnerBox" */ '../components/spinnerBox/spinnerBox'));
const TrackingInfo = lazy(() => import(/* webpackChunkName: "js/lazy/trackingInfo" */ '../components/myAccount/trackingInfo'));
const RatingPage = lazy(() => import(/* webpackChunkName: "js/lazy/ratingPage" */ '../components/ratingPage/ratingPage'));
const SearchResultsKaufen = lazy(() => import(/* webpackChunkName: "js/lazy/searchResultsKaufen" */ '../components/kaufen/searchResults/searchResultsKaufen'));
const InviteFriend = lazy(() => import(/* webpackChunkName: "js/lazy/inviteFriend" */ '../components/inviteFriend/inviteFriend'));
const RepairPage = lazy(() => import(/* webpackChunkName: "js/lazy/repairPage" */ '../components/repair/repairPage'));
const RepairPageModelSection = lazy(() => import(/* webpackChunkName: "js/lazy/repairPageModelSection" */ '../components/repair/repairPageModelSection'));
const RepairPageDeviceSection = lazy(() => import(/* webpackChunkName: "js/lazy/repairPageDeviceSection" */ '../components/repair/repairPageDeviceSection'));
const RepairPageRepairsList = lazy(() => import(/* webpackChunkName: "js/lazy/repairPageRepairsList" */ '../components/repair/repairPageRepairsList'));
const NotFound = lazy(() => import(/* webpackChunkName: "js/lazy/notFound" */ '../components/NotFound/NotFound'));
const ProductNotFound = lazy(() => import(/* webpackChunkName: "js/lazy/productNotFound" */ '../components/NotFound/ProductNotFound'));
const Wishlist = lazy(() => import(/* webpackChunkName: "js/lazy/wishlistPage" */ '../components/wishlist/WishlistPage'));

// const Versichern = lazy(() => import(/* webpackChunkName: "js/lazy/Versichern" */ '../components/versichern/Versichern'));



//mobile components
const ApplicationMobile = lazy(() => import(/* webpackChunkName: "js/lazy/applicationMobile" */ '../components/mobile/applicationMobile'));
const LoginMobile = lazy(() => import(/* webpackChunkName: "js/lazy/loginMobile" */ './../components/mobile/loginRegister/loginMobile'));
const MainMobile = lazy(() => import(/* webpackChunkName: "js/lazy/mainMobile" */ '../components/mobile/main/mainMobile'));
const KaufenMobile = lazy(() => import(/* webpackChunkName: "js/lazy/kaufenMobile" */ '../components/mobile/kaufen/kaufenMobile'));
const VerkaufenBetaMobile = lazy(() => import(/* webpackChunkName: "js/lazy/verkaufenBetaMobile" */ '../components/mobile/verkaufenBeta/verkaufenBetaMobile'));
const NewCounterOfferMobileBeta = lazy(() => import(/* webpackChunkName: "js/lazy/newCounterOfferMobileBeta" */ '../components/mobile/verkaufenBeta/newCounterOfferMobileBeta'));
const DetailModelPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/detailModelPageMobile" */ '../components/mobile/kaufen/detailModelPageMobile'));
const DetailAccessoryPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/detailAccessoryPageMobile" */ '../components/mobile/kaufen/detailAccessoryPageMobile'));
const ErrorPaymentPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/errorPaymentPageMobile" */ '../components/mobile/common/errorPaymentPageMobile'));
const CancelPaymentPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/cancelPaymentPageMobile" */ '../components/mobile/common/cancelPaymentPageMobile'));
const ThankYouPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/thankYouPageMobile" */ '../components/mobile/common/thankYouPageMobile'));
const ErrorPaymentPageRepairMobile = lazy(() => import(/* webpackChunkName: "js/lazy/errorPaymentPageRepairMobile" */ '../components/mobile/repair/paymentInfo/errorPaymentPageMobile'));
const CancelPaymentPageRepairMobile = lazy(() => import(/* webpackChunkName: "js/lazy/cancelPaymentPageRepairMobile" */ '../components/mobile/repair/paymentInfo/cancelPaymentPageMobile'));
const ThankYouPageRepairMobile = lazy(() => import(/* webpackChunkName: "js/lazy/thankYouPageRepairMobile" */ '../components/mobile/repair/paymentInfo/thankYouPageMobile'));
const BasketKaufenMobile = lazy(() => import(/* webpackChunkName: "js/lazy/basketKaufenMobile" */ '../components/mobile/basketKaufen/basketKaufenMobile'));
const BasketVerkaufenMobile = lazy(() => import(/* webpackChunkName: "js/lazy/basketVerkaufenMobile" */ '../components/mobile/basketVerkaufen/basketVerkaufenMobile'));
const MyAccountMobiile = lazy(() => import(/* webpackChunkName: "js/lazy/myAccountMobiile" */ '../components/mobile/myAccount/myAccountMobiile'));
const InfoPageRegistrationMobile = lazy(() => import(/* webpackChunkName: "js/lazy/infoPageRegistrationMobile" */ '../components/mobile/common/infoPageRegistrationMobile'));
const ConfirmRegistrationMobile = lazy(() => import(/* webpackChunkName: "js/lazy/confirmRegistrationMobile" */ '../components/mobile/common/confirmRegistrationMobile'));
const PageDownloadCouponMobile = lazy(() => import(/* webpackChunkName: "js/lazy/pageDownloadCouponMobile" */ '../components/mobile/common/pageDownloadCouponMobile'));
const TrackingInfoMobile = lazy(() => import(/* webpackChunkName: "js/lazy/trackingInfoMobile" */ '../components/mobile/common/trackingInfoMobile'));
const MobileAGB = lazy(() => import(/* webpackChunkName: "js/lazy/mobileAGB" */ '../components/mobile/common/mobileAGB'));
const MobileWiderrufsbelehrung = lazy(() => import(/* webpackChunkName: "js/lazy/mobileWiderrufsbelehrung" */ './../components/mobile/common/mobileWiderrufsbelehrung'));
const MobileImpressum = lazy(() => import(/* webpackChunkName: "js/lazy/mobileImpressum" */ '../components/mobile/common/mobileImpressum'));
const MobileContactForm = lazy(() => import(/* webpackChunkName: "js/lazy/mobileContactForm" */ '../components/mobile/common/mobileContactForm'));
const RatingPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/ratigPageMobile" */ '../components/mobile/ratingPage/ratigPageMobile'));
const FormNewPasswordMobile = lazy(() => import(/* webpackChunkName: "js/lazy/formNewPasswordMobile" */ '../components/mobile/common/formNewPasswordMobile'));
const SearchResultsMobile = lazy(() => import(/* webpackChunkName: "js/lazy/searchResultsMobile" */ '../components/mobile/kaufen/searchResultsMobile'));
const CompanyPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/companyPageMobile" */ '../components/mobile/common/companyPageMobile'));
const InviteFriendMobile = lazy(() => import(/* webpackChunkName: "js/lazy/inviteFriendMobile" */ '../components/mobile/common/inviteFriendMobile'));
const RepairPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/repairPageMobile" */ '../components/mobile/repair/repairPageMobile'));
const MobileDatenschutzerklaerung = lazy(() => import(/* webpackChunkName: "js/lazy/mobileDatenschutzerklaerung" */ '../components/mobile/common/mobileDatenschutzerklaerung'));
const JobsPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/jobsPageMobile" */ '../components/mobile/common/jobsPageMobile'));
const FaqPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/faqPageMobile" */ '../components/mobile/common/faqPageMobile'));
const NotFoundMobile = lazy(() => import(/* webpackChunkName: "js/lazy/notFoundMobile" */ '../components/mobile/notFound/notFoundMobile'));
const WishlistPageMobile = lazy(() => import(/* webpackChunkName: "js/lazy/WishlistPageMobile" */ '../components/mobile/common/wishlistPageMobile'));



export const getDecktopRoutes = (store, isTablet) => {
    const checkLoginStatus = (nextState, replace) => {
        const state = store.getState();
        if(!state.user.isLogin) {
            replace('/')
            if(nextState.location.pathname.includes('profile')){
                store.dispatch(userActions.setRedirectTo('/kundenkonto/profile'))
            }
            else if(nextState.location.pathname.includes('auszahlung')){
                store.dispatch(userActions.setRedirectTo('/kundenkonto/auszahlung'))
            }
            else if(nextState.location.pathname.includes('passwort-aendern')){
                store.dispatch(userActions.setRedirectTo('/kundenkonto/passwort-aendern'))
            }
            else store.dispatch(userActions.setRedirectTo('/kundenkonto'))
        }
    }
    const onEnterNotFound = ( nextState, replace ) => {
        replace('/404')
    }
    window.isMobile = false
    window.isTablet = isTablet
    window.isDesktop = !isTablet ? true : false
    return (
        <Route>
            <Suspense fallback={<SpinnerBox/>}>
                <Route component={ Application }>
                    <Route path="/" component={MainPage}/>
                    <Route exact path="kaufen" component={Kaufen}>
                        <IndexRoute exact component={CategoriesPage}/>
                        <Route exact path='search/:searchParam' component={SearchResultsKaufen}/>
                        <Route exact path="detail/zubehoer/:device/:model/:currentModelId" component={ AccessoryDetailPage }/>
                        <Route exact path="detail/:device/:model/:capacity/:color/:currentModelId" component={ DetailModelPage }/>
                        <Route exact path="(:deviceCategory1)(/:deviceCategory2)(/:deviceCategory3)(/:deviceCategory4)(/:deviceCategory5)(/:deviceCategory6)(/:deviceCategory7)(/:deviceCategory8)(/:deviceCategory9)/filter(/:param1)(/:param2)(/:param3)(/:param4)(/:param5)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)(/:param19)(/:param20)(/:param21)(/:param22)(/:param23)(/:param24)(/:param25)(/:param26)(/:param27)(/:param28)(/:param29)(/:param30)"
                               component={ ModelsInnerPage }/>
                        <Route exact path="(:deviceCategory1)(/:deviceCategory2)(/:deviceCategory3)(/:deviceCategory4)(/:deviceCategory5)(/:deviceCategory6)(/:deviceCategory7)(/:deviceCategory8)(/:deviceCategory9)"
                               component={CategoriesPage}/>
                    </Route>
                    <Route path='verkaufen' component={ VerkaufenBeta }/>
                    <Route path="verkaufen/warenkorb" component={ BasketVerkaufen }/>
                    <Route path='verkaufen'>
                        <Route path="gegenofferte-(:shortcode)" component={ NewCounterOffer }/>
                        <Route path="sell-overview" component={ SellPageOverview }/>
                        <Route  path="(:device)(/:brand)/sub-(:submodel)(/:model)(/:condition)/defects-(:defects)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBeta }/>
                        <Route  path="(:device)(/:brand)/sub-(:submodel)(/:model)(/:condition)(/:param5)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBeta }/>
                        <Route  path="(:device)(/:brand)(/:model)(/:condition)/defects-(:defects)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBeta }/>
                        <Route  path="(:device)(/:brand)(/:model)(/:condition)(/:param4)(/:param5)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBeta }/>
                    </Route>
                    <Route path="reset/:hash" component={FormNewPassword}/>
                    <Route path="confirm-email" component={InfoPageRegistration}/>
                    <Route path="email-confirmed" component={ConfirmRegistration}/>
                    <Route path="warenkorb" component={Basket}/>
                    <Route path="danke" component={ThankYouPage}/>
                    <Route path="error-payment" component={ErrorPaymentPage}/>
                    <Route path="cancel-payment" component={CancelPaymentPage}/>
                    <Route path="reparieren/danke" component={ThankYouPageRepair}/>
                    <Route path="reparieren/error-payment" component={ErrorPaymentPageRepair}/>
                    <Route path="reparieren/cancel-payment" component={CancelPaymentPageRepair}/>
                    <Route path="firmenkunden" component={CompanyPage}/>
                    <Route path="weiterempfehlen" component={InviteFriend}/>
                    <Route path="reparieren" component={RepairPage}>
                        <IndexRoute component={RepairPageDeviceSection}/>
                        <Route path=":device" component={ RepairPageModelSection }/>
                        <Route path=":device/:model" component={ RepairPageRepairsList }/>
                    </Route>
                    <Route path="wunschliste" component={Wishlist}/>
                    <Route path="ueber-uns" >
                        <IndexRoute component={AboutUs}/>
                        <Route path="qualitaet" component={Qualitaet}/>
                        <Route path="agb" component={AGB}/>
                        <Route path="widerrufsbelehrung" component={Widerrufsbelehrung}/>
                        <Route path="faq" component={FaqPageOld} />
                        <Route path="datenschutzerklaerung" component={Datenschutzerklaerung} />
                        <Route path="impressum" component={Impressum} />
                        <Route path="coupon/:shortcode" component={PageDownloadCoupon} />
                        <Route path="404" component={NotFound}/>
                        <Route path="*" onEnter={onEnterNotFound}/>
                    </Route>
                    <Route path="kontakt" component={ContactForm}/>
                    <Route path="jobs" component={JobsComponent}/>
                    <Route path="faq" component={FaqPage}/>
                    <Route path="kundenkonto/bestellung/:type/:shortcode" component={TrackingInfo} onEnter={checkLoginStatus} />
                    <Route path="kundenkonto" component={AccountPage} onEnter={checkLoginStatus}>
                        <IndexRoute component={OverviewOrders}/>
                        <Route path="passwort-aendern" component={ChangePasswordForm} />
                        <Route path="profile" component={EditUserProfile} />
                        <Route path="auszahlung" component={ConvertCredits} />
                    </Route>
                    <Route path="bewertungen" component={RatingPage}/>
                    {/*<Route path='versichern' component={Versichern}/>*/}
                    <Route path="produkt-nicht-verfügbar" component={ProductNotFound}/>
                    <Route path="produkt-nicht-verf%C3%BCgbar" component={ProductNotFound}/>
                </Route>
                <Route path='load-pdf' component={SpinnerBox}/>
                <Route path="404" component={NotFound}/>
                <Route path="*" onEnter={onEnterNotFound}/>
            </Suspense>
        </Route>
    )
}

export const getMobileRoutes = (store) => {
    const checkLoginStatus = (nextState, replace) => {
        const state = store.getState();
        if(!state.user.isLogin) {
            replace('/')
            if(nextState.location.pathname.includes('profile')){
                store.dispatch(userActions.setRedirectTo('/kundenkonto/profile'))
            }
            else if(nextState.location.pathname.includes('auszahlung')){
                store.dispatch(userActions.setRedirectTo('/kundenkonto/auszahlung'))
            }
            else if(nextState.location.pathname.includes('passwort-aendern')){
                store.dispatch(userActions.setRedirectTo('/kundenkonto/passwort-aendern'))
            }
            else store.dispatch(userActions.setRedirectTo('/kundenkonto'))
        }
    }
    const onEnterNotFound = ( nextState, replace ) => {
        replace('/404')
    }
    window.isMobile = true
    window.isTablet = false
    window.isDesktop = false
    return(
        <Route>
            <Suspense fallback={<SpinnerBox/>}>
             <Route component={ ApplicationMobile }>
                 <Route path="/" component={MainMobile}/>
                 <Route path="login" component={LoginMobile}/>
                 <Route path='kaufen/search/:searchParam' component={SearchResultsMobile}/>
                 <Route path="kaufen/detail/zubehoer/:device/:model/:currentModelId" component={ DetailAccessoryPageMobile }/>
                 <Route path="kaufen/detail/:device/:model/:capacity/:color/:currentModelId" component={ DetailModelPageMobile }/>
                 <Route path="kaufen" component={KaufenMobile}>
                     <IndexRoute component={CategoriesPage}/>
                     <Route path="(:deviceCategory1)(/:deviceCategory2)(/:deviceCategory3)(/:deviceCategory4)(/:deviceCategory5)(/:deviceCategory6)(/:deviceCategory7)(/:deviceCategory8)(/:deviceCategory9)/filter(/:param1)(/:param2)(/:param3)(/:param4)(/:param5)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)(/:param19)(/:param20)(/:param21)(/:param22)(/:param23)(/:param24)(/:param25)(/:param26)(/:param27)(/:param28)(/:param29)(/:param30)"
                           component={ ModelsInnerPage }/>
                    <Route path="(:deviceCategory1)(/:deviceCategory2)(/:deviceCategory3)(/:deviceCategory4)(/:deviceCategory5)(/:deviceCategory6)(/:deviceCategory7)(/:deviceCategory8)(/:deviceCategory9)"
                           component={CategoriesPage}/>
                    <Route path="*" component={NotFoundMobile} />
                </Route>

                <Route path="verkaufen/warenkorb" component={ BasketVerkaufenMobile }/>
                <Route path='verkaufen' component={ VerkaufenBetaMobile }/>
                <Route path='verkaufen'>
                    <Route path="gegenofferte-(:shortcode)" component={ NewCounterOfferMobileBeta }/>
                </Route>
                <Route path='verkaufen' component={ VerkaufenBetaMobile }>
                    <Route path="(:device)(/:brand)/sub-(:submodel)(/:model)(/:condition)/defects-(:defects)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBetaMobile }/>
                    <Route path="(:device)(/:brand)/sub-(:submodel)(/:model)(/:condition)(/:param5)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBetaMobile }/>
                    <Route path="(:device)(/:brand)(/:model)(/:condition)/defects-(:defects)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBetaMobile }/>
                    <Route path="(:device)(/:brand)(/:model)(/:condition)(/:param4)(/:param5)(/:param6)(/:param7)(/:param8)(/:param9)(/:param10)(/:param11)(/:param12)(/:param13)(/:param14)(/:param15)(/:param16)(/:param17)(/:param18)" component={ VerkaufenBetaMobile }/>
                </Route>

                <Route path="kundenkonto/bestellung/:type/:shortcode" component={TrackingInfoMobile} onEnter={checkLoginStatus} />
                <Route path="kundenkonto" component={MyAccountMobiile} onEnter={checkLoginStatus}>
                    <IndexRoute component={OverviewOrders}/>
                    <Route path="passwort-aendern" component={ChangePasswordForm} />
                    <Route path="profile" component={EditUserProfile} />
                    <Route path="auszahlung" component={ConvertCredits} />
                    <Route path="404" component={NotFoundMobile}/>
                    <Route path="*" onEnter={onEnterNotFound}/>
                </Route>

                <Route path="error-payment" component={ErrorPaymentPageMobile}/>
                <Route path="cancel-payment" component={CancelPaymentPageMobile}/>
                <Route path="danke" component={ThankYouPageMobile}/>
                <Route path="reparieren/error-payment" component={ErrorPaymentPageRepairMobile}/>
                <Route path="reparieren/cancel-payment" component={CancelPaymentPageRepairMobile}/>
                <Route path="reparieren/danke" component={ThankYouPageRepairMobile}/>
                <Route path="warenkorb" component={BasketKaufenMobile}/>
                <Route path="confirm-email" component={InfoPageRegistrationMobile}/>
                <Route path="email-confirmed" component={ConfirmRegistrationMobile}/>
                <Route path="reset/:hash" component={FormNewPasswordMobile}/>
                <Route path="kontakt" component={MobileContactForm}/>
                <Route path="firmenkunden" component={CompanyPageMobile}/>
                <Route path="weiterempfehlen" component={InviteFriendMobile}/>
                <Route path="jobs" component={JobsPageMobile}/>
                <Route path="faq" component={FaqPageMobile}/>
                <Route path="wunschliste" component={WishlistPageMobile}/>

                <Route path="reparieren" component={RepairPageMobile}>
                    <IndexRoute component={RepairPageDeviceSection}/>
                    <Route path=":device" component={ RepairPageModelSection }/>
                    <Route path=":device/:model" component={ RepairPageRepairsList }/>
                </Route>
                <Route path="ueber-uns">
                    <IndexRoute component={AboutUs}/>
                    <Route path="qualitaet" component={Qualitaet}/>
                    <Route path="widerrufsbelehrung" component={MobileWiderrufsbelehrung}/>
                    <Route path="agb" component={MobileAGB}/>
                    <Route path="datenschutzerklaerung" component={MobileDatenschutzerklaerung} />
                    <Route path="impressum" component={MobileImpressum} />
                    <Route path="coupon/:shortcode" component={PageDownloadCouponMobile} />
                    <Route path="404" component={NotFoundMobile}/>
                    <Route path="*" onEnter={onEnterNotFound}/>
                </Route>
                <Route path="bewertungen" component={RatingPageMobile}/>
                {/*<Route path='versichern' component={Versichern}/>*/}
                <Route path="produkt-nicht-verfügbar" component={ProductNotFound}/>
                <Route path="produkt-nicht-verf%C3%BCgbar" component={ProductNotFound}/>
            </Route>
            <Route path='load-pdf' component={SpinnerBox}/>
            <Route path="404" component={NotFoundMobile}/>
            <Route path="*" onEnter={onEnterNotFound}/>
            </Suspense>
        </Route>
            )
}
