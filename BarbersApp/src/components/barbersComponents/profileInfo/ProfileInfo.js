import React, { Component } from "react";
import { View, Text } from "react-native";
import IconEmail from "react-native-vector-icons/MaterialCommunityIcons";
import IconPhone from "react-native-vector-icons/Feather";
import IconHeart from "react-native-vector-icons/Feather";
import IconLocation from "react-native-vector-icons/SimpleLineIcons";
import { TouchableOpacity } from "react-native";

//styles

import styles from "../../../assets/pages/barberProfile";
import common from "../../../assets/core/common";

class ProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.editPhoneNumber = this.editPhoneNumber.bind(this);
        this.editAddress = this.editAddress.bind(this);
    }

    editPhoneNumber = () => {
        const { accountInfo } = this.props;
        const { navigate } = this.props.navigation;
        if (accountInfo.phoneNumber === "") {
            navigate("EditBarberProfile", {
                accountInfo
            });
        } else {
            this.props.handleProfileInfoClick();
        }
    };

    editAddress = () => {
        const { accountInfo } = this.props;
        const { navigate } = this.props.navigation;
        if (accountInfo.address === "") {
            navigate("EditBarberProfile", {
                accountInfo
            });
        } else {
            this.props.handleProfileInfoClick();
        }
    };

    render() {
        const { accountInfo } = this.props;
        return (
            <View>
                <View style={styles.profileInfoContainer}>
                    <View style={styles.labelContainer}>
                        <IconHeart
                            name="heart"
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
                            Reviews
                        </Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {accountInfo.reviews}
                        </Text>
                    </View>
                </View>
                <View style={styles.profileInfoContainer}>
                    <View style={styles.labelContainer}>
                        <IconEmail
                            name="email-outline"
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
                            Signed in as
                        </Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={{ fontSize: 15 }}>
                            {accountInfo.email}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.profileInfoContainer}
                    onPress={() => this.editPhoneNumber()}
                >
                    <View style={styles.labelContainer}>
                        <IconPhone
                            name="phone"
                            size={28}
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
                            Mobile
                        </Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={{ fontSize: 15 }}>
                            {accountInfo.phoneNumber !== ""
                                ? accountInfo.phoneNumber
                                : "Add your phone number"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.profileInfoContainer}
                    onPress={() => this.editAddress()}
                >
                    <View style={styles.labelContainer}>
                        <IconLocation
                            name="location-pin"
                            size={28}
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
                            Address
                        </Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={{ fontSize: 15 }}>
                            {accountInfo.address !== ""
                                ? accountInfo.address.length > 29
                                    ? accountInfo.address
                                          .substr(0, 29)
                                          .concat("...")
                                    : accountInfo.address
                                : "Add your address"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ProfileInfo;
