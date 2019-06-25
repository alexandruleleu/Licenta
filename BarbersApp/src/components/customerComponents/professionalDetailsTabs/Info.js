import React, { Component } from "react";
import { ScrollView, View } from "react-native";

//components
import InfoComponent from "./reusableComponents/InfoComponent";

//styles
import common from "../../../assets/core/common";

//icons
import IconEmail from "react-native-vector-icons/MaterialCommunityIcons";
import IconHeart from "react-native-vector-icons/AntDesign";
import IconLocation from "react-native-vector-icons/SimpleLineIcons";
import IconPhone from "react-native-vector-icons/SimpleLineIcons";
import IconBreak from "react-native-vector-icons/Entypo";

export default class Info extends Component {
    constructor(props) {
        super(props);
    }

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
        const { barberInfo } = this.props;
        return (
            <ScrollView
                style={{
                    backgroundColor: "#fff",
                    flex: 1
                }}
            >
                <View style={{ alignItems: "center", paddingBottom: 20 }}>
                    <InfoComponent
                        icon={
                            <IconHeart
                                name="hearto"
                                color={common.primaryColor}
                                size={23}
                            />
                        }
                        info={`${barberInfo.reviews} likes`}
                    />
                    <InfoComponent
                        icon={
                            <IconEmail
                                name="email-outline"
                                color={common.primaryColor}
                                size={23}
                            />
                        }
                        info={barberInfo.email}
                    />
                    <InfoComponent
                        icon={
                            <IconLocation
                                name="location-pin"
                                color={common.primaryColor}
                                size={23}
                            />
                        }
                        info={barberInfo.address}
                    />
                    <InfoComponent
                        icon={
                            <IconPhone
                                name="phone"
                                color={common.primaryColor}
                                size={23}
                            />
                        }
                        info={barberInfo.phoneNumber}
                    />
                    <InfoComponent
                        icon={
                            <IconBreak
                                name="block"
                                color={common.primaryColor}
                                size={23}
                            />
                        }
                        info={`${this.breakHourIntervalPipe(
                            barberInfo.breakHourValue
                        )} off`}
                    />
                </View>
            </ScrollView>
        );
    }
}
