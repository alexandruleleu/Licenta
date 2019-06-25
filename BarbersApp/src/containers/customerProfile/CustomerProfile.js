import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { ConfirmDialog, Dialog } from "react-native-simple-dialogs";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ImageBackground
} from "react-native";
import { Button } from "native-base";
import {
    clickSubscribe,
    clickUnsubscribe,
    checkSubscription
} from "./ActionsCustomerProfile";

//icons
import IconCalendar from "react-native-vector-icons/FontAwesome";
import IconNotifications from "react-native-vector-icons/Ionicons";

//styles
import common from "../../assets/core/common";
import styles from "../../assets/pages/customerProfile";

//services
import FBSDK from "react-native-fbsdk";
import firebase from "react-native-firebase";
import HomeCustomerService from "../../services/homeCustomerServices/HomeCustomerService";
const { LoginManager } = FBSDK;

//components
import Upcoming from "../../components/customerComponents/profileTabs/Upcoming";
import Past from "../../components/customerComponents/profileTabs/Past";

class CustomerProfileComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: true,
            userProfile: "",
            upcomingAppointments: [],
            pastAppointments: [],
            dialogVisible: false,
            dialogEditProfile: false
        };
    }

    componentDidMount() {
        const { userId } = this.props.navigation.state.params;
        this.getUserData();
        this.props.onCheckSubscription(userId);
    }

    componentWillUnmount() {
        const { userId } = this.props.navigation.state.params;
        this.state = {
            showSpinner: true,
            userProfile: "",
            upcomingAppointments: [],
            pastAppointments: [],
            dialogVisible: false,
            dialogEditProfile: false
        };
        firebase
            .database()
            .ref("customers")
            .child(userId)
            .child("my_appointments")
            .off("value");
    }

    getUserData = () => {
        const { userId } = this.props.navigation.state.params;
        firebase
            .database()
            .ref("customers")
            .child(userId)
            .child("my_appointments")
            .on("value", () => {
                this.setState({ showSpinner: true });
                let homeCustomerService = new HomeCustomerService();
                homeCustomerService.getUserData(userId).then(userProfile => {
                    homeCustomerService
                        .getCustomerAppointments(userId)
                        .then(rsp => {
                            let upcomingAppointments = [];
                            let pastAppointments = [];
                            let today = new Date();

                            rsp.map(item => {
                                let day = parseInt(item.date.substring(0, 2));
                                let mon = parseInt(item.date.substring(3, 5));
                                let year = parseInt(item.date.substring(6, 10));
                                let hours = parseInt(
                                    item.startHour.substring(0, 2)
                                );
                                let minutes = parseInt(
                                    item.startHour.substring(3, 5)
                                );

                                let date = new Date(
                                    year,
                                    mon - 1,
                                    day,
                                    hours,
                                    minutes
                                );
                                item.sortDate = date;
                                if (date > today) {
                                    upcomingAppointments.push(item);
                                } else {
                                    pastAppointments.push(item);
                                }
                            });
                            upcomingAppointments.sort((a, b) => {
                                return a.sortDate - b.sortDate;
                            });
                            pastAppointments.sort((a, b) => {
                                return b.sortDate - a.sortDate;
                            });
                            console.log(upcomingAppointments);
                            console.log(pastAppointments);
                            this.setState({
                                userProfile: userProfile,
                                upcomingAppointments: upcomingAppointments,
                                pastAppointments: pastAppointments,
                                showSpinner: false
                            });
                        });
                });
            });
    };

    afterSave = rsp => {
        if (rsp.saved === true) {
            this.getUserData();
        }
    };

    onClickLogoutBtn = () => {
        this.setState({
            dialogVisible: false
        });

        const { navigate } = this.props.navigation;

        LoginManager.logOut();
        this.setState({ showSpinner: true });
        firebase
            .auth()
            .signOut()
            .then(() => {
                this.setState({ showSpinner: false });
                navigate("Login");
            });
    };

    onPressLogoutIcon = () => {
        this.setState({
            dialogVisible: true
        });
    };

    handleEditProfileClick = () => {
        this.setState({
            dialogEditProfile: true
        });
    };

    onClickCloseDialog = () => {
        this.setState({
            dialogVisible: false
        });
    };

    onClickCloseEditProfileDialog = () => {
        this.setState({
            dialogEditProfile: false
        });
    };

    onClickSubscribe = () => {
        const { userId } = this.props.navigation.state.params;
        this.props.onClickSubscribe(userId);
    };

    onClickUnsubscribe = () => {
        const { userId } = this.props.navigation.state.params;
        this.props.onClickUnsubscribe(userId);
    };

    editBarberProfile = () => {
        this.setState({
            dialogEditProfile: false
        });
        const { navigate } = this.props.navigation;
        const { userId } = this.props.navigation.state.params;
        navigate("EditCustomerProfile", {
            userProfile: this.state.userProfile,
            userId: userId,
            afterSave: this.afterSave
        });
    };

    renderEditProfileDialog = () => {
        return (
            <Dialog
                visible={true}
                onTouchOutside={() =>
                    this.setState({ dialogEditProfile: false })
                }
                overlayStyle={
                    {
                        //backgroundColor: "rgba(52, 52, 52, 0.4)"
                    }
                }
                animationType={"slide"}
            >
                <View>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.editBarberProfile()}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                    </Button>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.onClickCloseEditProfileDialog()}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </Button>
                </View>
            </Dialog>
        );
    };

    renderConfirmDialog = () => {
        return (
            <ConfirmDialog
                title="Sign out:"
                message="Are you sure about that?"
                visible={this.state.dialogVisible}
                onTouchOutside={() => this.setState({ dialogVisible: false })}
                positiveButton={{
                    title: "YES",
                    onPress: () => this.onClickLogoutBtn()
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => this.onClickCloseDialog()
                }}
            />
        );
    };

    render() {
        const { userId } = this.props.navigation.state.params;
        const { subscribed, isFetchingSubscribe } = this.props.customerProfile;
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
                    barStyle={"light-content"}
                />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.profileContainer}
                        onPress={this.handleEditProfileClick}
                    >
                        <Image
                            source={
                                this.state.userProfile.profile_picture === ""
                                    ? require("../../assets/images/barberDefaultProfile.jpg")
                                    : {
                                          uri: this.state.userProfile
                                              .profile_picture
                                      }
                            }
                            style={styles.profilePicture}
                        />

                        <Text
                            style={{
                                color: common.whiteColor,
                                fontSize: 18,
                                paddingLeft: 10
                            }}
                        >
                            {this.state.userProfile.first_name}{" "}
                            {this.state.userProfile.last_name}
                        </Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            position: "absolute",
                            bottom: 12,
                            right: 10
                        }}
                    >
                        <TouchableOpacity onPress={this.onPressLogoutIcon}>
                            <Icon
                                name="sign-out"
                                color={common.whiteColor}
                                size={21}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ImageBackground
                    source={require("../../assets/images/blurBack.jpg")}
                    style={styles.appointmentCover}
                >
                    <View style={styles.appointmentCoverText}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "500",
                                color: common.whiteColor,
                                paddingEnd: 10
                            }}
                        >
                            MY APPOINTMENTS
                        </Text>
                        <IconCalendar
                            name="calendar"
                            color={common.whiteColor}
                            size={20}
                        />
                    </View>
                    {isFetchingSubscribe ? (
                        <ActivityIndicator
                            size={24}
                            color={common.whiteColor}
                            animating={isFetchingSubscribe}
                            style={{
                                position: "absolute",
                                bottom: 15,
                                right: 13
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={
                                subscribed
                                    ? this.onClickUnsubscribe
                                    : this.onClickSubscribe
                            }
                            style={{
                                position: "absolute",
                                bottom: 15,
                                right: 15
                            }}
                        >
                            <IconNotifications
                                name={
                                    subscribed
                                        ? "ios-notifications"
                                        : "ios-notifications-off"
                                }
                                color={common.whiteColor}
                                size={25}
                            />
                        </TouchableOpacity>
                    )}
                </ImageBackground>
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
                    <Upcoming
                        navigation={this.props.navigation}
                        tabLabel={`UPCOMING (${
                            this.state.upcomingAppointments.length
                        })`}
                        upcomingAppointments={this.state.upcomingAppointments}
                        customerId={userId}
                    />
                    <Past
                        navigation={this.props.navigation}
                        tabLabel={`PAST (${
                            this.state.pastAppointments.length
                        })`}
                        pastAppointments={this.state.pastAppointments}
                    />
                </ScrollableTabView>

                {this.renderConfirmDialog()}
                {this.state.dialogEditProfile ? (
                    this.renderEditProfileDialog()
                ) : (
                    <Text />
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    customerProfile: Object.assign({}, state.customerProfile)
});

const mapDispatchToProps = dispatch => ({
    onClickSubscribe: userId => {
        dispatch(clickSubscribe(userId));
    },
    onClickUnsubscribe: userId => {
        dispatch(clickUnsubscribe(userId));
    },
    onCheckSubscription: userId => {
        dispatch(checkSubscription(userId));
    }
});

const CustomerProfile = connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerProfileComponent);

export default CustomerProfile;
