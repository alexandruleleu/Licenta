import React, { Component } from "react";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ImageBackground,
    YellowBox,
    ScrollView
} from "react-native";

//icons
import Icon from "react-native-vector-icons/FontAwesome";
import IconBackArrow from "react-native-vector-icons/SimpleLineIcons";
import IconHeart from "react-native-vector-icons/AntDesign";

//styles
import styles from "../../../assets/pages/professionalDetails";
import common from "../../../assets/core/common";

//tabs
import Book from "../professionalDetailsTabs/Book";
import Info from "../professionalDetailsTabs/Info";

//services
import ProfessionalDetailsService from "../../../services/professionalDetailsServices/ProfessionalDetailsService";

YellowBox.ignoreWarnings(["Require cycle:"]);

export default class ProfessionalDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: true,
            favoriteBarber: false,
            modified: false
        };
    }

    componentDidMount() {
        this.checkFavoriteList();
    }

    checkFavoriteList = () => {
        const { barber, customerId } = this.props.navigation.state.params;
        const detailsService = new ProfessionalDetailsService(
            barber.barberId,
            customerId
        );
        detailsService.checkFavoriteList().then(rsp => {
            if (rsp === true) {
                this.setState({
                    favoriteBarber: true,
                    showSpinner: false
                });
            } else {
                this.setState({ showSpinner: false });
            }
        });
    };

    onPressBackArrow = () => {
        const { goBack, state } = this.props.navigation;
        state.params.afterReview({ modified: this.state.modified });
        goBack();
    };

    onPressLikeButton = () => {
        const { barber, customerId } = this.props.navigation.state.params;
        this.setState({
            favoriteBarber: true,
            modified: true
        });
        const detailsService = new ProfessionalDetailsService(
            barber.barberId,
            customerId
        );
        detailsService.increaseBarberReviews();
        detailsService.addToFavoriteBarbers();
    };

    onPressUnlikeButton = () => {
        const { barber, customerId } = this.props.navigation.state.params;
        this.setState({
            favoriteBarber: false,
            modified: true
        });
        const detailsService = new ProfessionalDetailsService(
            barber.barberId,
            customerId
        );
        detailsService.decreaseBarberReviews();
        detailsService.removeFromFavoriteBarbers();
    };

    render() {
        const { barber, customerId } = this.props.navigation.state.params;
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
                <View style={{ alignItems: "center" }}>
                    <StatusBar
                        translucent={true}
                        backgroundColor={"transparent"}
                        barStyle={"light-content"}
                    />

                    <ImageBackground
                        source={require("../../../assets/images/barberBack.jpg")}
                        style={styles.header}
                    />

                    <TouchableOpacity
                        onPress={this.onPressBackArrow}
                        style={{ position: "absolute", top: 40, left: 15 }}
                    >
                        <IconBackArrow
                            name="arrow-left"
                            color={common.whiteColor}
                            size={21}
                        />
                    </TouchableOpacity>
                    {this.state.favoriteBarber ? (
                        <TouchableOpacity
                            onPress={this.onPressUnlikeButton}
                            style={{ position: "absolute", top: 40, right: 15 }}
                        >
                            <IconHeart
                                name="heart"
                                color={common.whiteColor}
                                size={26}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={this.onPressLikeButton}
                            style={{ position: "absolute", top: 40, right: 15 }}
                        >
                            <IconHeart
                                name="hearto"
                                color={common.whiteColor}
                                size={26}
                            />
                        </TouchableOpacity>
                    )}

                    <View style={styles.profileContainer}>
                        <Image
                            source={
                                barber.profilePicture === ""
                                    ? require("../../../assets/images/barberDefaultProfile.jpg")
                                    : { uri: barber.profilePicture }
                            }
                            style={styles.profilePicture}
                        />

                        <View style={styles.accountActive}>
                            {!barber.active ? (
                                <Icon
                                    name="stop-circle"
                                    color={common.redColor}
                                    size={20}
                                />
                            ) : (
                                <View style={styles.profileActiveGreen} />
                            )}
                        </View>
                    </View>

                    <View style={styles.accountInformations}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={styles.displayName}>
                                {barber.firstName} {barber.lastName}
                            </Text>
                            <Text style={styles.description}>
                                Barber/Stylist:{" "}
                                {barber.startAt + " - " + barber.finishAt}
                            </Text>
                            {!barber.active ? (
                                <Text style={styles.descriptionInactive}>
                                    This account is inactive
                                </Text>
                            ) : (
                                <Text />
                            )}
                        </View>
                    </View>
                </View>
                <ScrollableTabView
                    style={{
                        flex: 1
                    }}
                    tabBarTextStyle={{
                        color: common.grayThemeYoutube,
                        fontSize: 15
                    }}
                    tabBarUnderlineStyle={{
                        backgroundColor: common.primaryColor
                    }}
                    tabBarBackgroundColor={common.whiteColor}
                >
                    <Book
                        navigation={this.props.navigation}
                        barberInfo={barber}
                        customerId={customerId}
                        tabLabel="BOOK"
                    />
                    <Info
                        navigation={this.props.navigation}
                        barberInfo={barber}
                        tabLabel="INFO"
                    />
                </ScrollableTabView>
            </View>
        );
    }
}
