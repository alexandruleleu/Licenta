import React, { Component } from "react";
import { View, ActivityIndicator, Text, ScrollView, Image } from "react-native";

//styles
import common from "../../../assets/core/common";
import styles from "../../../assets/pages/past";

//services
import HomeCustomerService from "../../../services/homeCustomerServices/HomeCustomerService";

export default class Past extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            dialogVisible: false,
            notFoundVisible: false
        };
    }

    componentDidMount() {}

    convertDate = (startHour, date) => {
        let homeCustomerService = new HomeCustomerService();
        let rsp = homeCustomerService.convertDate(date);
        let convertedDate = startHour.concat(
            ", ",
            rsp[0],
            ", ",
            rsp[1],
            " ",
            rsp[2],
            ", ",
            rsp[3]
        );
        return convertedDate;
    };

    render() {
        const { pastAppointments } = this.props;
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
                <View
                    style={{
                        alignItems: "center",
                        paddingBottom: 10
                    }}
                >
                    {pastAppointments.map((item, index) => {
                        return (
                            <View
                                style={styles.appointmentContainer}
                                key={index}
                            >
                                <View style={styles.serviceContainer}>
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            color: common.grayThemeYoutube
                                        }}
                                    >
                                        {item.serviceName}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "500",
                                            color: common.grayThemeYoutube
                                        }}
                                    >
                                        {"$".concat(item.price, ".00")}
                                    </Text>
                                </View>
                                <View style={styles.dateContainer}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: common.grayThemeYoutube
                                        }}
                                    >
                                        {this.convertDate(
                                            item.startHour,
                                            item.date
                                        )}
                                    </Text>
                                </View>
                                <View style={styles.barberContainer}>
                                    <Image
                                        source={
                                            item.barber.profilePicture === ""
                                                ? require("../../../assets/images/barberDefaultProfile.jpg")
                                                : {
                                                      uri:
                                                          item.barber
                                                              .profilePicture
                                                  }
                                        }
                                        style={styles.profilePicture}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            marginLeft: 12
                                        }}
                                    >
                                        {item.barber.firstName.concat(
                                            " ",
                                            item.barber.lastName
                                        )}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                    {/* {this.renderConfirmDialog()} */}
                </View>
            </ScrollView>
        );
    }
}
