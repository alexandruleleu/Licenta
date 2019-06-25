import React, { Component } from "react";
import { View, Text } from "react-native";
import IconClock from "react-native-vector-icons/SimpleLineIcons";
import IconBreak from "react-native-vector-icons/Entypo";

import { TouchableOpacity } from "react-native";

//styles

import styles from "../../../assets/pages/barberProfile";
import common from "../../../assets/core/common";

class ProfileBookingInfo extends Component {
    constructor(props) {
        super(props);

        this.editAvailability = this.editAvailability.bind(this);
        this.breakHourIntervalPipe = this.breakHourIntervalPipe.bind(this);
    }

    editAvailability = () => {
        const { accountInfo } = this.props;
        const { navigate } = this.props.navigation;
        if (accountInfo.startAt === "" && accountInfo.finishAt === "") {
            navigate("EditBarberProfile", {
                accountInfo
            });
        } else {
            this.props.handleProfileInfoClick();
        }
    };

    editBreakHour = () => {
        const { accountInfo } = this.props;
        const { navigate } = this.props.navigation;
        if (accountInfo.breakHour === "") {
            navigate("EditBarberProfile", {
                accountInfo
            });
        } else {
            this.props.handleProfileInfoClick();
        }
    };

    breakHourIntervalPipe = value => {
        let start = "";
        let finish = "";
        let decimal = value - Math.floor(value);
        decimal > 0 ? (start = value - 0.5 + ":30") : (start = value + ":00");
        decimal > 0
            ? (finish = value + 0.5 + ":30")
            : (finish = value + 1 + ":00");

        return start + " - " + finish;
    };

    render() {
        const { accountInfo } = this.props;
        return (
            <View>
                <TouchableOpacity
                    style={styles.profileInfoContainer}
                    onPress={() => this.editAvailability()}
                >
                    <View style={styles.labelContainer}>
                        <IconClock
                            name="clock"
                            size={30}
                            color={common.darkColor}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: common.darkColor,
                                paddingStart: 10
                            }}
                        >
                            Availability
                        </Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {accountInfo.startAt !== "" &&
                            accountInfo.finishAt !== ""
                                ? accountInfo.startAt +
                                  " - " +
                                  accountInfo.finishAt
                                : "Add your work availability"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.profileInfoContainer}
                    onPress={() => this.editBreakHour()}
                >
                    <View style={styles.labelContainer}>
                        <IconBreak
                            name="block"
                            size={30}
                            color={common.darkColor}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: common.darkColor,
                                paddingStart: 10
                            }}
                        >
                            Break
                        </Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {accountInfo.breakHour !== ""
                                ? this.breakHourIntervalPipe(
                                      accountInfo.breakHourValue
                                  )
                                : "Add your break hour"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ProfileBookingInfo;
