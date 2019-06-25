import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import common from "../../assets/core/common";

//routes
import HomeBarber from "../../containers/homeBarber/HomeBarber";
import BarberProfile from "../../containers/barberProfile/BarberProfile";
import BarberAppointments from "../../containers/barberAppointments/BarberAppointments";

export default createMaterialBottomTabNavigator(
    {
        Home: {
            screen: HomeBarber,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="home" color={tintColor} size={21} />
                )
            }
        },
        BarberAppointments: {
            screen: BarberAppointments,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="calendar" color={tintColor} size={21} />
                )
            }
        },
        Profile: {
            screen: BarberProfile,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="user" color={tintColor} size={21} />
                )
            }
        }
    },
    {
        initialRouteName: "Home",
        activeTintColor: common.whiteColor,
        inactiveTintColor: common.innactiveTabColor,
        labeled: false,
        barStyle: {
            backgroundColor: common.darkThemeYoutube
        }
        //shifting: true
    }
);
