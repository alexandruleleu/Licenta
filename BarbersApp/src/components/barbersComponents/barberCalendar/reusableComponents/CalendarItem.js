import React, { Component } from "react";
import { Text, View } from "react-native";

//components
import IconCircle from "react-native-vector-icons/FontAwesome";
import IconCheck from "react-native-vector-icons/FontAwesome";

import styles from "../../../../assets/pages/calendarList";
import common from "../../../../assets/core/common";

export default class CalendarItem extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    checkIfAppointmentIsPassed = (appointmentTime, dayIndex) => {
        let currentTime,
            currentHour,
            currentMinutes,
            appointmentHour,
            appointmentMinutes;
        currentTime = new Date();
        currentHour = currentTime.getHours();
        currentMinutes = currentTime.getMinutes();
        appointmentHour = Number(appointmentTime.split(":")[0]);
        appointmentMinutes = Number(appointmentTime.split(":")[1]);
        if (dayIndex !== 0) {
            return false;
        }
        if (currentHour > appointmentHour) {
            return true;
        }
        if (
            currentHour === appointmentHour &&
            currentMinutes > appointmentMinutes
        ) {
            return true;
        }
        return false;
    };

    render() {
        const {
            startHour,
            time,
            service,
            price,
            firstName,
            lastName,
            dayIndex
        } = this.props;
        return (
            <View style={styles.appointmentContainer}>
                <View style={styles.iconContainer}>
                    {this.checkIfAppointmentIsPassed(startHour, dayIndex) ? (
                        <IconCheck name="check" size={14} color={"#10cc58"} />
                    ) : (
                        <IconCircle
                            name="circle"
                            size={12}
                            color={common.primaryColor}
                        />
                    )}
                </View>
                <View style={styles.timeContainer}>
                    <View>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: "500",
                                color: common.darkThemeYoutube
                            }}
                        >
                            {startHour}
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "500"
                            }}
                        >
                            {time.concat(" min")}
                        </Text>
                    </View>
                </View>
                <View style={styles.mainContainer}>
                    <View>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: "500",
                                color: common.darkThemeYoutube
                            }}
                        >
                            {firstName.concat(" ", lastName)}
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "500"
                            }}
                        >
                            {service.concat(", $", price)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
