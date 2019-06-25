import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import common from "../../assets/core/common";

//routes
import HomeCustomer from "../../containers/homeCustomer/HomeCustomer";
import CustomerProfile from "../../containers/customerProfile/CustomerProfile";

export default createMaterialBottomTabNavigator(
    {
        Home: {
            screen: HomeCustomer,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="home" color={tintColor} size={21} />
                )
            }
        },
        Profile: {
            screen: CustomerProfile,
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
