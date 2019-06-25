import React, { Component } from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "react-navigation";
import DropdownAlert from "react-native-dropdownalert";
import IconBackArrow from "react-native-vector-icons/SimpleLineIcons";

//services
import DropdownServices from "../services/dropdownServices/DropdownServices";

//components
import LoginComponent from "../containers/login/loginComponents/ContainerLogin";
import CustomerTabs from "../components/customerComponents/CustomerTabs";
import BarberTabs from "../components/barbersComponents/BarberTabs";
import EditBarberProfile from "../components/barbersComponents/editBarberProfile/EditBarberProfile";
import BarberFirstLogin from "../containers/barberFirstLogin/BarberFirstLogin";
import ProfessionalDetails from "../components/customerComponents/professionalDetails/ProfessionalDetails";
import EditCustomerProfile from "../components/customerComponents/editCustomerProfile/EditCustomerProfile";
import MakeAppointment from "../components/customerComponents/makeAppointment/MakeAppointment";
import MapViewComponent from "../components/customerComponents/mapView/MapView";

// styles
import common from "../assets/core/common";

class App extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <AppStackNavigator />
                <DropdownAlert
                    closeInterval={2000}
                    translucent={true}
                    updateStatusBar={false}
                    showCancel={true}
                    ref={ref => DropdownServices.setDropDown(ref)}
                />
            </View>
        );
    }
}

const stackNavigatorConfig = {
    header: null,
    mode: "card",
    navigationOptions: () => ({
        gesturesEnabled: true,
        gesturesDirection: "inverted"
    }),
    transitionConfig: () => ({
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;
            const width = layout.initWidth;

            return {
                opacity: position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0, 1, 0]
                }),
                transform: [
                    {
                        translateX: position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [width, 0, -width]
                        })
                    }
                ]
            };
        },
        headerTitleInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;

            return {
                opacity: position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0, 1, 0]
                }),
                transform: [
                    {
                        translateX: position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [50, 0, -50]
                        })
                    }
                ]
            };
        }
    })
};

const AppStackNavigator = createStackNavigator(
    {
        Login: {
            screen: LoginComponent,
            navigationOptions: () => ({
                header: null
            })
        },
        HomeCustomerTabs: {
            screen: CustomerTabs,
            navigationOptions: () => ({
                header: null
            })
        },
        HomeBarberTabs: {
            screen: BarberTabs,
            navigationOptions: () => ({
                header: null
            })
        },
        BarberFirstLogin: {
            screen: BarberFirstLogin,
            navigationOptions: () => ({
                header: null
            })
        },
        EditBarberProfile: {
            screen: EditBarberProfile,
            navigationOptions: () => ({
                title: "Profile",
                headerTitleStyle: {
                    color: common.whiteColor
                },
                headerTintColor: common.whiteColor,
                headerStyle: {
                    backgroundColor: common.darkThemeYoutube
                }
            })
        },
        ProfessionalDetails: {
            screen: ProfessionalDetails,
            navigationOptions: () => ({
                header: null
            })
        },
        EditCustomerProfile: {
            screen: EditCustomerProfile,
            navigationOptions: () => ({
                title: "Profile",
                headerTitleStyle: {
                    color: common.whiteColor
                },
                headerTintColor: common.whiteColor,
                headerStyle: {
                    backgroundColor: common.darkThemeYoutube
                }
            })
        },
        MakeAppointment: {
            screen: MakeAppointment,
            navigationOptions: ({ navigation }) => ({
                headerLeft: (
                    <TouchableOpacity
                        style={{ marginLeft: 18 }}
                        onPress={() => navigation.goBack()}
                    >
                        <IconBackArrow
                            name="arrow-left"
                            color={common.whiteColor}
                            size={18}
                        />
                    </TouchableOpacity>
                ),
                headerTitle: (
                    <View style={{ marginLeft: 20 }}>
                        <Text
                            style={{
                                color: common.whiteColor,
                                fontSize: 19,
                                fontWeight: "400"
                            }}
                        >
                            Scheduling appointments
                        </Text>
                        <Text
                            style={{ fontSize: 15, color: common.whiteColor }}
                        >
                            Next 7 days
                        </Text>
                    </View>
                ),
                headerStyle: {
                    backgroundColor: common.darkThemeYoutube
                }
            })
        },
        MapView: {
            screen: MapViewComponent,
            navigationOptions: () => ({
                header: null
            })
        }
    },
    stackNavigatorConfig
);

const mapStateToProps = state => {
    return {
        app: state
    };
};

export default connect(mapStateToProps)(App);
