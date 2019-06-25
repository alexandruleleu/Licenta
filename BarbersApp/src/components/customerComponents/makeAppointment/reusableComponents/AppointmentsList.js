import React, { Component } from "react";
import { ScrollView, Text, View, ActivityIndicator, Image } from "react-native";
import { Button } from "react-native-elements";
import { ConfirmDialog } from "react-native-simple-dialogs";

//components
import styles from "../../../../assets/pages/appointmentsList";
import common from "../../../../assets/core/common";

//icons
import IconMinus from "react-native-vector-icons/Entypo";
import IconBreak from "react-native-vector-icons/MaterialIcons";

//services
import AppointmentService from "../../../../services/appointmentServices/AppointmentServices";
import firebase from "react-native-firebase";

export default class AppointmentsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            dialogVisible: false,
            item: {},
            index: 0,
            appointmentsList: []
        };
    }

    componentDidMount() {
        this.initializeAppointmentsList();
    }

    componentWillUnmount() {
        const { barberInfo, listDate } = this.props;
        this.setState({
            showSpinner: false,
            dialogVisible: false,
            item: {},
            index: 0,
            appointmentsList: ""
        });
        firebase
            .database()
            .ref("appointments")
            .child(barberInfo.barberId)
            .child(listDate)
            .off("value");
    }

    initializeAppointmentsList = () => {
        const { barberInfo, listDate, appointmentsList } = this.props;
        firebase
            .database()
            .ref("appointments")
            .child(barberInfo.barberId)
            .child(listDate)
            .on("value", () => {
                this.setState({ showSpinner: true });
                let appointmentServices = new AppointmentService();
                appointmentServices
                    .getAppointmentsByDay(barberInfo.barberId, listDate)
                    .then(
                        rsp => {
                            let updatedList = appointmentsList.map(item => {
                                item.customer = "";
                                let checkVal = item.start
                                    .toString()
                                    .replace(".", ",");
                                if (rsp[checkVal] !== undefined) {
                                    item.customer = rsp[checkVal];
                                }
                                return item;
                            });
                            console.log(updatedList);
                            this.setState({
                                showSpinner: false,
                                appointmentsList: updatedList
                            });
                        },
                        err => {
                            console.log(err);
                            let updatedList = appointmentsList.map(item => {
                                item.customer = "";
                                return item;
                            });
                            console.log(updatedList);
                            this.setState({
                                showSpinner: false,
                                appointmentsList: updatedList
                            });
                        }
                    );
            });
    };

    onPressAppointmentItem = (item, index) => {
        this.setState({
            dialogVisible: true,
            item: item,
            index: index
        });
    };

    onClickCloseDialog = () => {
        this.setState({
            dialogVisible: false
        });
    };

    makeNewAppointment = (item, index) => {
        this.setState({ showSpinner: true, dialogVisible: false });
        const {
            customerId,
            barberInfo,
            serviceName,
            time,
            listDate,
            price
        } = this.props;
        const appointmentsService = new AppointmentService();
        appointmentsService.getUserData(customerId).then(customerInfo => {
            let payload = {
                customerId: customerId,
                first_name: customerInfo.first_name,
                last_name: customerInfo.last_name,
                profile_picture: customerInfo.profile_picture,
                service_name: serviceName
            };
            let payloadCalendar = {
                start: item.start,
                startHour: item.startHourValue,
                customerId: customerId,
                first_name: customerInfo.first_name,
                last_name: customerInfo.last_name,
                profile_picture: customerInfo.profile_picture,
                date: listDate,
                price: price,
                time: time,
                serviceName: serviceName
            };
            let payloadCustomer = {
                start: item.start,
                barber: barberInfo,
                startHour: item.startHourValue,
                date: listDate,
                price: price,
                time: time,
                serviceName: serviceName
            };
            let payloadBarber = this.createBarberPayload(
                item.start,
                time,
                payload
            );
            let payloadForBarberCalendar = this.createBarberCalendarPayload(
                item.start,
                payloadCalendar
            );
            if (
                this.checkIfCanMakeAppointment(
                    index,
                    time,
                    this.state.appointmentsList
                )
            ) {
                appointmentsService
                    .setNewAppointment(
                        customerId,
                        barberInfo.barberId,
                        listDate,
                        payloadBarber,
                        payloadCustomer,
                        payloadForBarberCalendar
                    )
                    .then(() => {
                        this.setState({
                            showSpinner: false
                        });
                        const message = "You have registered successfully.";
                        this.props.handleDropdownMessage("success", message);
                    });
            } else {
                this.setState({
                    showSpinner: false
                });
                const message =
                    "Unfortunately you cannot select this interval because your service takes 60 minutes.";
                this.props.handleDropdownMessage("error", message);
            }
        });
    };

    createBarberPayload = (start, time, payload) => {
        let payloadBarber = {};
        payloadBarber[start.toString().replace(".", ",")] = payload;
        if (time === "60") {
            payloadBarber[(start + 0.5).toString().replace(".", ",")] = payload;
        }
        return payloadBarber;
    };

    createBarberCalendarPayload = (start, payload) => {
        let payloadBarberCalendar = {};
        payloadBarberCalendar[start.toString().replace(".", ",")] = payload;
        return payloadBarberCalendar;
    };

    checkIfCanMakeAppointment = (selectedIndex, time, appointmentsList) => {
        if (time === "30") {
            return true;
        }
        if (time === "60" && selectedIndex === appointmentsList.length - 1) {
            return false;
        } else {
            let checkReserved = appointmentsList[selectedIndex + 1].customer;
            let checkBreak = appointmentsList[selectedIndex + 1].break;

            return time === "60" && checkReserved === "" && checkBreak === false
                ? true
                : false;
        }
    };

    renderConfirmDialog = () => {
        return (
            <ConfirmDialog
                title="Book"
                message="Do you really want a reservation?"
                visible={this.state.dialogVisible}
                onTouchOutside={() => this.setState({ dialogVisible: false })}
                positiveButton={{
                    title: "YES",
                    onPress: () =>
                        this.makeNewAppointment(
                            this.state.item,
                            this.state.index
                        )
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => this.onClickCloseDialog()
                }}
            />
        );
    };

    render() {
        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <ActivityIndicator
                    size={35}
                    color={common.primaryColor}
                    animating={this.state.showSpinner}
                />
            </View>
        ) : (
            <ScrollView style={styles.container}>
                <View style={{ alignItems: "center", paddingBottom: 20 }}>
                    {this.state.appointmentsList.map((item, index) => {
                        return !item.break ? (
                            <View
                                style={styles.appointmentContainer}
                                key={index}
                            >
                                <View style={styles.timeContainer}>
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 19,
                                                fontWeight: "500",
                                                color: common.primaryColor
                                            }}
                                        >
                                            {item.startHourValue}
                                        </Text>
                                        <IconMinus
                                            name="minus"
                                            color={common.primaryColor}
                                            size={18}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 19,
                                                fontWeight: "500",
                                                color: common.primaryColor
                                            }}
                                        >
                                            {item.finishHourValue}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.mainContainer}>
                                    <View style={styles.dataContainer}>
                                        <View style={styles.statusContainer}>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    color: "#b5b1b1",
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5
                                                }}
                                            >
                                                Status
                                            </Text>
                                            {item.customer !== "" ? (
                                                <Text
                                                    style={{
                                                        fontSize: 17,
                                                        fontWeight: "500",
                                                        color: "#a00808"
                                                    }}
                                                >
                                                    RESERVED
                                                </Text>
                                            ) : (
                                                <Text
                                                    style={{
                                                        fontSize: 17,
                                                        fontWeight: "500",
                                                        color: "#2e8c09"
                                                    }}
                                                >
                                                    FREE
                                                </Text>
                                            )}
                                        </View>
                                        {item.customer !== "" ? (
                                            <View
                                                style={styles.customerContainer}
                                            >
                                                <View
                                                    style={styles.forContainer}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            color: "#b5b1b1",
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 5
                                                        }}
                                                    >
                                                        For
                                                    </Text>
                                                </View>
                                                <View
                                                    style={
                                                        styles.profileContainer
                                                    }
                                                >
                                                    <Image
                                                        source={
                                                            item.customer
                                                                .profile_picture ===
                                                            ""
                                                                ? require("../../../../assets/images/barberDefaultProfile.jpg")
                                                                : {
                                                                      uri:
                                                                          item
                                                                              .customer
                                                                              .profile_picture
                                                                  }
                                                        }
                                                        style={
                                                            styles.profilePicture
                                                        }
                                                    />
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            color:
                                                                common.grayThemeYoutube,
                                                            fontWeight: "400"
                                                        }}
                                                    >
                                                        {item.customer.first_name.concat(
                                                            " ",
                                                            item.customer
                                                                .last_name
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={{ display: "none" }} />
                                        )}
                                    </View>
                                    <View style={styles.actionContainer}>
                                        {item.customer !== "" ? (
                                            <View
                                                style={styles.serviceContainer}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        color: "#b5b1b1",
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5
                                                    }}
                                                >
                                                    Service name
                                                </Text>

                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: "400",
                                                        color:
                                                            common.grayThemeYoutube
                                                    }}
                                                >
                                                    {item.customer.service_name}
                                                </Text>
                                            </View>
                                        ) : (
                                            <Button
                                                title="Reserve here"
                                                color={common.grayThemeYoutube}
                                                buttonStyle={{
                                                    paddingLeft: 32,
                                                    paddingRight: 32,
                                                    marginVertical: 5,
                                                    marginLeft: -5,
                                                    height: 30,
                                                    borderColor:
                                                        common.grayThemeYoutube,
                                                    borderWidth: 1,
                                                    borderRadius: 6,
                                                    backgroundColor:
                                                        "transparent"
                                                }}
                                                onPress={() =>
                                                    this.onPressAppointmentItem(
                                                        item,
                                                        index
                                                    )
                                                }
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.breakContainer} key={index}>
                                <View style={styles.timeContainer}>
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 19,
                                                fontWeight: "500",
                                                color: common.primaryColor
                                            }}
                                        >
                                            {item.startHourValue}
                                        </Text>
                                        <IconMinus
                                            name="minus"
                                            color={common.primaryColor}
                                            size={18}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 19,
                                                fontWeight: "500",
                                                color: common.primaryColor
                                            }}
                                        >
                                            {item.finishHourValue}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.messageContainer}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: "#b5b1b1",
                                            paddingHorizontal: 10,
                                            paddingVertical: 5
                                        }}
                                    >
                                        Time for a break
                                    </Text>
                                    <IconBreak
                                        name="free-breakfast"
                                        color="#b5b1b1"
                                        size={20}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
                {this.renderConfirmDialog()}
            </ScrollView>
        );
    }
}
