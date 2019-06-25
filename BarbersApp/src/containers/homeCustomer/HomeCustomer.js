import React, { Component, Fragment } from "react";
import {
    View,
    BackHandler,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { StatusBar } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import Spinner from "react-native-spinkit";
import IconLocation from "react-native-vector-icons/SimpleLineIcons";

//styles
import styles from "../../assets/pages/homeCustomer";
import common from "../../assets/core/common";

//tabs
import ProfessionalsList from "../../components/customerComponents/homeTabs/ProfessionalsList";
import TopBarbers from "../../components/customerComponents/homeTabs/TopBarbers";
import FavoriteBarbers from "../../components/customerComponents/homeTabs/FavoriteBarbers";
import LocationServices from "../../services/locationServices/LocationServices";

//components
import SearchForm from "../../components/customerComponents/searchForm/SearchForm";

class HomeCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: true,
            showSpinnerFetchRoutes: false,
            userProfile: this.props.navigation.state.params,
            currentLatitude: null,
            currentLongitude: null,
            currentLocationError: null,
            currentWeatherForecast: null,
            searchNameField: "",
            searchDistanceField: 50,
            filteredProfessionals: []
        };

        this.locationServices = new LocationServices();
    }

    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                //const LATITUDE = position.coords.latitude;
                //const LONGITUDE = position.coords.longitude;
                const LATITUDE = 47.161494;
                const LONGITUDE = 27.58405;
                this.locationServices
                    .getWeatherForecast(LATITUDE, LONGITUDE)
                    .then(rsp => {
                        this.setState({
                            showSpinner: false,
                            currentLatitude: LATITUDE,
                            currentLongitude: LONGITUDE,
                            currentLocationError: null,
                            currentWeatherForecast: rsp
                        });
                        console.log(rsp);
                    });
            },
            error => this.setState({ currentLocationError: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
    }

    handleChangeNameInput = value => {
        this.setState({
            searchNameField: value
        });
    };

    handleSearch = distanceValue => {
        this.setState({
            searchDistanceField: distanceValue
        });
    };

    handleFilteredData = filteredData => {
        this.setState({
            filteredProfessionals: filteredData
        });
    };

    onPressMapButton = () => {
        const { navigate } = this.props.navigation;
        const {
            filteredProfessionals,
            currentLatitude,
            currentLongitude,
            currentWeatherForecast,
            userProfile
        } = this.state;
        this.setState({
            showSpinner: true,
            showSpinnerFetchRoutes: true
        });
        this.locationServices
            .getRoutesForAllBarbers(
                currentLatitude,
                currentLongitude,
                filteredProfessionals
            )
            .then(rsp => {
                this.setState({
                    showSpinner: false,
                    showSpinnerFetchRoutes: false
                });
                console.log(rsp);
                const travelTimes = rsp;
                navigate("MapView", {
                    filteredProfessionals,
                    currentLatitude,
                    currentLongitude,
                    currentWeatherForecast,
                    userProfile,
                    travelTimes
                });
            });
    };

    render() {
        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"dark-content"}
                />
                {this.state.showSpinnerFetchRoutes ? (
                    <ActivityIndicator
                        size={35}
                        color="rgb(209, 165, 71)"
                        animating={this.state.showSpinner}
                    />
                ) : (
                    <Fragment>
                        <Spinner
                            isVisible={true}
                            size={40}
                            type={"Bounce"}
                            color={common.primaryColor}
                        />
                        <Text style={{ fontSize: 18 }}>
                            Checking your location
                        </Text>
                    </Fragment>
                )}
            </View>
        ) : (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"light-content"}
                />
                <SearchForm
                    handleChangeNameInput={this.handleChangeNameInput}
                    handleSearch={this.handleSearch}
                />
                <ScrollableTabView
                    style={{
                        flex: 1
                    }}
                    tabBarTextStyle={{
                        color: common.whiteColor,
                        fontSize: 12
                    }}
                    tabBarUnderlineStyle={{
                        backgroundColor: common.primaryColor
                    }}
                    tabBarBackgroundColor={common.darkThemeYoutube}
                >
                    <ProfessionalsList
                        navigation={this.props.navigation}
                        tabLabel="PROFESSIONALS"
                        userProfile={this.state.userProfile}
                        currentLatitude={this.state.currentLatitude}
                        currentLongitude={this.state.currentLongitude}
                        searchNameField={this.state.searchNameField}
                        searchDistanceField={this.state.searchDistanceField}
                        handleFilteredData={this.handleFilteredData}
                    />
                    <TopBarbers
                        navigation={this.props.navigation}
                        tabLabel="TOP 10"
                    />
                    <FavoriteBarbers
                        navigation={this.props.navigation}
                        tabLabel="FAVORITE BARBERS"
                        userProfile={this.state.userProfile}
                    />
                </ScrollableTabView>
                <TouchableOpacity
                    onPress={this.onPressMapButton}
                    style={{
                        position: "absolute",
                        bottom: 15,
                        right: 15,
                        padding: 13,
                        backgroundColor: common.primaryColor,
                        borderRadius: 50,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 6
                        },
                        shadowOpacity: 0.39,
                        shadowRadius: 8.3,

                        elevation: 13
                    }}
                >
                    <IconLocation
                        name="location-pin"
                        color={common.whiteColor}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

export default HomeCustomer;
