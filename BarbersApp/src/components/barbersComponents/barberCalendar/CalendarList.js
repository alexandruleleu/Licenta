import React, { Component } from "react";
import { View, ActivityIndicator, Text, ScrollView, Image } from "react-native";

//styles
import common from "../../../assets/core/common";
import styles from "../../../assets/pages/calendarList";

//services
import BarberCalendarServices from "../../../services/barberCalendarServices/BarberCalendarServices";
import firebase from "react-native-firebase";
import CalendarItem from "./reusableComponents/CalendarItem";

class CalendarList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            appointmentsList: [],
            messageVisibility: false
        };
        this.barberCalendarServices = new BarberCalendarServices();
    }

    componentDidMount() {
        this.initializeAppointmentsList();
    }

    componentWillUnmount() {
        const { barberInfo } = this.props;
        this.setState({
            showSpinner: false,
            appointmentsList: []
        });
        firebase
            .database()
            .ref("barbers")
            .child(barberInfo.barberId)
            .child(my_calendar)
            .off("value");
    }

    initializeAppointmentsList = () => {
        const { barberInfo, listDate } = this.props;
        firebase
            .database()
            .ref("barbers")
            .child(barberInfo.userId)
            .child("my_calendar")
            .child(listDate)
            .on("value", () => {
                this.setState({ showSpinner: true });
                this.barberCalendarServices
                    .getAppointmentsByDay(barberInfo.userId, listDate)
                    .then(
                        rsp => {
                            this.setState({
                                showSpinner: false,
                                messageVisibility: false,
                                appointmentsList: rsp
                            });
                        },
                        err => {
                            console.log(err);
                            this.setState({
                                showSpinner: false,
                                messageVisibility: true
                            });
                        }
                    );
            });
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.dateContainer}>
                    <Text style={styles.detailedDate}>
                        {this.props.detailedDate}
                    </Text>
                </View>
                {this.state.showSpinner ? (
                    <View style={styles.containerSpinner}>
                        <ActivityIndicator
                            size={35}
                            color={common.primaryColor}
                            animating={this.state.showSpinner}
                        />
                    </View>
                ) : this.state.messageVisibility ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Image
                            source={require("../../../assets/images/no_appointments.png")}
                            style={styles.noAppointmentsImg}
                        />
                        <Text style={{ fontSize: 15 }}>No Appointments</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.calendarListContainer}>
                        {this.state.appointmentsList
                            .sort((a, b) => {
                                return a.start - b.start;
                            })
                            .map((item, index) => (
                                <CalendarItem
                                    key={index}
                                    startHour={item.startHour}
                                    time={item.time}
                                    service={item.serviceName}
                                    price={item.price}
                                    firstName={item.first_name}
                                    lastName={item.last_name}
                                    dayIndex={this.props.dayIndex}
                                />
                            ))}
                    </ScrollView>
                )}
            </View>
        );
    }
}

export default CalendarList;
