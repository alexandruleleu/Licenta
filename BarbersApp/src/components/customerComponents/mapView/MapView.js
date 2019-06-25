import React, { Component } from "react";
import {
    Text,
    View,
    Animated,
    Image,
    Dimensions,
    ScrollView,
    StatusBar,
    TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";

import MapView from "react-native-maps";

//icons
import IconBack from "react-native-vector-icons/Ionicons";
import IconTriangleDown from "react-native-vector-icons/Octicons";
import IconSearch from "react-native-vector-icons/Octicons";
import IconCar from "react-native-vector-icons/Ionicons";

//styles
import styles from "../../../assets/pages/mapView";
import common from "../../../assets/core/common";
import { mapStyle } from "../../../utils/utils";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 30;

export default class MapViewComponent extends Component {
    state = {
        showSpinner: false,
        region: {
            latitude: 45.52220671242907,
            longitude: -122.6653281029795,
            latitudeDelta: 0.04864195044303443,
            longitudeDelta: 0.040142817690068
        }
    };

    componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0);
        this.markerRefs = [];
        this.scrollRef = null;
    }

    componentDidMount() {
        const { filteredProfessionals } = this.props.navigation.state.params;
        this.animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3);
            if (index >= filteredProfessionals.length) {
                index = filteredProfessionals.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(this.regionTimeout);
            this.regionTimeout = setTimeout(() => {
                if (this.index !== index) {
                    this.index = index;
                    const { location } = filteredProfessionals[index];
                    this.map.animateToRegion(
                        {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        },
                        350
                    );
                    this.markerRefs[index].showCallout();
                }
            }, 10);
        });

        const LATITUDE = this.props.navigation.state.params.currentLatitude;
        const LONGITUDE = this.props.navigation.state.params.currentLongitude;
        const LATITUDE_DELTA = 0.28;
        const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

        this.setState({
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        });
    }

    onPressBackArrow = () => {
        const { goBack } = this.props.navigation;
        goBack();
    };

    onPressSearchIcon = () => {
        console.log("search");
    };

    onPressBook = barber => {
        let customerId = this.props.navigation.state.params.userProfile.userId;
        const { navigate } = this.props.navigation;
        navigate("ProfessionalDetails", {
            barber,
            customerId,
            afterReview: () => {}
        });
    };

    displayDistance = distance => {
        const roundedDist = Math.round(distance * 100) / 100;
        return roundedDist.toString().concat(" km");
    };

    handleOnMarkerPress = (marker, index) => {
        this.scrollRef.getNode().scrollTo({
            x: index * CARD_WIDTH,
            y: 0,
            animated: false
        });
    };

    secondsToHms = d => {
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor((d % 3600) / 60);
        let s = Math.floor((d % 3600) % 60);

        const hDisplay = h > 0 ? h + " h " : "";
        s > 30 && m++;
        const mDisplay = m > 0 ? m + " min" : "";

        return hDisplay + mDisplay;
    };

    render() {
        const {
            filteredProfessionals,
            currentWeatherForecast,
            travelTimes
        } = this.props.navigation.state.params;
        const interpolations = filteredProfessionals.map((marker, index) => {
            const inputRange = [
                (index - 1) * CARD_WIDTH,
                index * CARD_WIDTH,
                (index + 1) * CARD_WIDTH
            ];
            const scale = this.animation.interpolate({
                inputRange,
                outputRange: [1, 2.5, 1],
                extrapolate: "clamp"
            });
            const opacity = this.animation.interpolate({
                inputRange,
                outputRange: [0.35, 1, 0.35],
                extrapolate: "clamp"
            });
            return { scale, opacity };
        });

        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"dark-content"}
                />
                <ActivityIndicator
                    size={35}
                    color="rgb(209, 165, 71)"
                    animating={this.state.showSpinner}
                />
            </View>
        ) : (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"dark-content"}
                />
                <MapView
                    ref={map => (this.map = map)}
                    initialRegion={this.state.region}
                    style={styles.container}
                    customMapStyle={mapStyle}
                    rotateEnabled={false}
                    showsUserLocation={true}
                    userLocationAnnotationTitle={"Your location"}
                >
                    {filteredProfessionals.map((marker, index) => {
                        const scaleStyle = {
                            transform: [
                                {
                                    scale: interpolations[index].scale
                                }
                            ]
                        };
                        const opacityStyle = {
                            opacity: interpolations[index].opacity
                        };
                        return (
                            <MapView.Marker
                                key={index}
                                ref={ref => {
                                    this.markerRefs[index] = ref;
                                }}
                                coordinate={{
                                    latitude: marker.location.latitude,
                                    longitude: marker.location.longitude
                                }}
                                onPress={() =>
                                    this.handleOnMarkerPress(marker, index)
                                }
                            >
                                <Animated.View
                                    style={[styles.markerWrap, opacityStyle]}
                                >
                                    <Animated.View
                                        style={[styles.ring, scaleStyle]}
                                    />
                                    <View>
                                        <Image
                                            source={require("../../../assets/images/barber-shop.png")}
                                            style={styles.marker}
                                        />
                                    </View>
                                </Animated.View>
                                <MapView.Callout
                                    style={{
                                        alignItems: "center",
                                        minWidth: 250
                                    }}
                                    tooltip={true}
                                >
                                    <View
                                        style={{
                                            paddingVertical: 5,
                                            paddingHorizontal: 35,
                                            alignItems: "center",
                                            borderRadius: 10,
                                            backgroundColor: "#FFF",
                                            marginBottom: 12
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: 15,
                                                fontWeight: "bold",
                                                color: common.grayThemeYoutube
                                            }}
                                        >
                                            {marker.firstName.concat(
                                                " ",
                                                marker.lastName
                                            )}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}
                                        >
                                            <IconCar
                                                name="ios-car"
                                                color={common.grayThemeYoutube}
                                                size={22}
                                                style={{ marginHorizontal: 4 }}
                                            />
                                            <Text
                                                numberOfLines={1}
                                                style={{ fontSize: 13 }}
                                            >
                                                {this.secondsToHms(
                                                    travelTimes[index]
                                                        .travelTime
                                                ).concat(" without traffic")}
                                            </Text>
                                        </View>
                                        <IconTriangleDown
                                            name="triangle-down"
                                            color={"#FFF"}
                                            size={35}
                                            style={{
                                                position: "absolute",
                                                bottom: -20
                                            }}
                                        />
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        );
                    })}
                </MapView>
                <Animated.ScrollView
                    ref={c => {
                        this.scrollRef = c;
                    }}
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: this.animation
                                    }
                                }
                            }
                        ],
                        { useNativeDriver: true }
                    )}
                    style={styles.scrollView}
                    contentContainerStyle={styles.endPadding}
                >
                    {filteredProfessionals.map((marker, index) => (
                        <View style={styles.card} key={index}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "70%"
                                }}
                            >
                                <Image
                                    source={
                                        marker.profilePicture === ""
                                            ? require("../../../assets/images/barberDefaultProfile.jpg")
                                            : {
                                                  uri: marker.profilePicture
                                              }
                                    }
                                    style={styles.cardImage}
                                />
                                <View style={styles.textContent}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.cardtitle}
                                    >
                                        {marker.firstName.concat(
                                            " ",
                                            marker.lastName
                                        )}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.cardDescription}
                                    >
                                        {this.displayDistance(marker.distance)}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    width: "30%"
                                }}
                            >
                                <Button
                                    icon={{
                                        name: "calendar",
                                        type: "font-awesome",
                                        color: "rgb(209, 165, 71)",
                                        size: 15
                                    }}
                                    title="Book"
                                    color={common.primaryColor}
                                    buttonStyle={{
                                        height: 35,
                                        borderColor: common.primaryColor,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        backgroundColor: "transparent"
                                    }}
                                    onPress={() => this.onPressBook(marker)}
                                />
                            </View>
                        </View>
                    ))}
                </Animated.ScrollView>
                <View
                    style={{
                        position: "absolute",
                        top: 22,
                        right: 0,
                        left: 0,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        borderBottomColor: "#FFF",
                        borderBottomWidth: 0.5,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <TouchableOpacity
                            onPress={this.onPressBackArrow}
                            style={{}}
                        >
                            <IconBack
                                name="ios-arrow-back"
                                color={"#FFF"}
                                size={35}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onPressSearchIcon}
                            style={{ marginHorizontal: 15 }}
                        >
                            <IconSearch
                                name="search"
                                color={"#FFF"}
                                size={27}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Image
                            source={{ uri: currentWeatherForecast.iconLink }}
                            style={{
                                width: 24,
                                height: 24,
                                paddingHorizontal: 8
                            }}
                        />
                        <Text style={{ fontSize: 17, color: "#FFF" }}>
                            {currentWeatherForecast.temperature
                                .substr(0, 4)
                                .concat(" ", "\u2103")}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
