import React, { Component } from "react";
import { ScrollView } from "react-native";

//components
import ServiceComponent from "./reusableComponents/ServiceComponent";
import common from "../../../assets/core/common";

import AppointmentService from "../../../services/appointmentServices/AppointmentServices";

export default class Book extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    handlePressBook = (time, price, serviceName) => {
        const { navigate } = this.props.navigation;
        const { barberInfo, customerId } = this.props;
        let today = new Date();
        let appointmentServices = new AppointmentService();
        formattedDates = appointmentServices.getNextNDays(7, today);
        appointmentsList = appointmentServices.handleAppointmentsListFormat(
            barberInfo
        );
        appointmentsList = appointmentServices.setBreakHour(
            appointmentsList,
            barberInfo
        );
        navigate("MakeAppointment", {
            barberInfo: barberInfo,
            customerId: customerId,
            time: time,
            price: price,
            serviceName: serviceName,
            formattedDates: formattedDates,
            appointmentsList: appointmentsList
        });
    };

    render() {
        const { barberInfo } = this.props;
        return (
            <ScrollView
                style={{
                    backgroundColor: "#fff",
                    flex: 1
                }}
            >
                <ServiceComponent
                    color="#761596"
                    serviceName="Speciality Haircut"
                    time="60"
                    price="80"
                    active={barberInfo.active}
                    handlePressBook={this.handlePressBook}
                />
                <ServiceComponent
                    color={common.primaryColor}
                    serviceName="Full Service Haircut"
                    time="60"
                    price="100"
                    active={barberInfo.active}
                    handlePressBook={this.handlePressBook}
                />
                <ServiceComponent
                    color="#761596"
                    serviceName="Kids cut"
                    time="30"
                    price="40"
                    active={barberInfo.active}
                    handlePressBook={this.handlePressBook}
                />
                <ServiceComponent
                    color={common.primaryColor}
                    serviceName="Haircut & beard"
                    time="60"
                    price="70"
                    active={barberInfo.active}
                    handlePressBook={this.handlePressBook}
                />
                <ServiceComponent
                    color="#761596"
                    serviceName="Regular haircut"
                    time="30"
                    price="40"
                    active={barberInfo.active}
                    handlePressBook={this.handlePressBook}
                />
            </ScrollView>
        );
    }
}
