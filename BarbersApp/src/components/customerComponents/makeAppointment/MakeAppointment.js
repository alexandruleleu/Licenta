import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import CustomTabBar from "./customTabBar/CustomTabBar";

//components
import AppointmentsList from "./reusableComponents/AppointmentsList";

//services
import DropdownServices from "../../../services/dropdownServices/DropdownServices";

//styles
import styles from "../../../assets/pages/makeAppointment";
import common from "../../../assets/core/common";

class MakeAppointment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false
        };
    }

    componentDidMount() {}

    handleDropdownMessage = (type, message) => {
        if (type === "error") {
            DropdownServices.getDropDown().alertWithType(
                "error",
                "Error",
                message
            );
        }
        if (type === "success") {
            DropdownServices.getDropDown().alertWithType(
                "success",
                "Success",
                message
            );
        }
    };

    render() {
        const {
            barberInfo,
            customerId,
            time,
            price,
            serviceName,
            formattedDates,
            appointmentsList
        } = this.props.navigation.state.params;
        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <StatusBar
                    translucent={false}
                    backgroundColor={common.darkThemeYoutube}
                    barStyle={"light-content"}
                />
                <ActivityIndicator
                    size={35}
                    color={common.primaryColor}
                    animating={this.state.showSpinner}
                />
            </View>
        ) : (
            <View style={styles.container}>
                <StatusBar
                    translucent={false}
                    backgroundColor={common.darkThemeYoutube}
                    barStyle={"light-content"}
                />

                <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
                    {formattedDates.map(item => {
                        return (
                            <AppointmentsList
                                tabLabel={item.tabDate}
                                listDate={item.listDate}
                                barberInfo={barberInfo}
                                customerId={customerId}
                                time={time}
                                price={price}
                                serviceName={serviceName}
                                appointmentsList={appointmentsList}
                                key={item.listDate}
                                handleDropdownMessage={
                                    this.handleDropdownMessage
                                }
                            />
                        );
                    })}
                </ScrollableTabView>
            </View>
        );
    }
}

export default MakeAppointment;
