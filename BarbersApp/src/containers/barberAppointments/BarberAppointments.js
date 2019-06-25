import React, { Component } from "react";
import {
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    ImageBackground
} from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import CustomTabBar from "../../components/customerComponents/makeAppointment/customTabBar/CustomTabBar";
import CalendarList from "../../components/barbersComponents/barberCalendar/CalendarList";

//icons

//services
import BarberCalendarServices from "../../services/barberCalendarServices/BarberCalendarServices";

//styles
import styles from "../../assets/pages/barberAppointments";
import common from "../../assets/core/common";

export default class BarberAppointments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            formattedDates: []
        };

        this.barberCalendarServices = new BarberCalendarServices();
    }

    componentDidMount() {}

    static getDerivedStateFromProps() {
        let today = new Date();
        let barberCalendarServices = new BarberCalendarServices();
        let formattedDates = barberCalendarServices.getNextNDays(7, today);
        return { formattedDates: formattedDates };
    }

    render() {
        const { params } = this.props.navigation.state;
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
                <ImageBackground
                    source={require("../../assets/images/blurBack.jpg")}
                    style={styles.header}
                >
                    <View style={styles.homeBarberCoverText}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "500",
                                color: common.whiteColor,
                                paddingEnd: 10
                            }}
                        >
                            Calendar
                        </Text>
                    </View>
                </ImageBackground>
                <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
                    {this.state.formattedDates.map((item, index) => {
                        return (
                            <CalendarList
                                tabLabel={item.tabDate}
                                listDate={item.listDate}
                                detailedDate={this.barberCalendarServices.convertDate(
                                    item.listDate,
                                    index
                                )}
                                barberInfo={params}
                                key={item.listDate}
                                dayIndex={index}
                            />
                        );
                    })}
                </ScrollableTabView>
            </View>
        );
    }
}
