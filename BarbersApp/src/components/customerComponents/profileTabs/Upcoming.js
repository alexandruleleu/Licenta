import React, { Component } from "react";
import {
    View,
    ActivityIndicator,
    Text,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";
import { ConfirmDialog } from "react-native-simple-dialogs";

//styles
import common from "../../../assets/core/common";
import styles from "../../../assets/pages/upcoming";

//icons
import IconDelete from "react-native-vector-icons/AntDesign";

//services
import HomeCustomerService from "../../../services/homeCustomerServices/HomeCustomerService";
import DropdownServices from "../../../services/dropdownServices/DropdownServices";

export default class Upcoming extends Component {
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

    onPressAppointmentItem = item => {
        this.setState({
            dialogVisible: true,
            item: item
        });
    };

    onClickCloseDialog = () => {
        this.setState({
            dialogVisible: false
        });
    };

    deleteAppointment = item => {
        this.setState({ dialogVisible: false });
        const { customerId } = this.props;
        let homeCustomerService = new HomeCustomerService();
        homeCustomerService
            .removeCustomerAppointment(item, customerId)
            .then(() => {
                const message = "This appointment was deleted successfully.";
                DropdownServices.getDropDown().alertWithType(
                    "success",
                    "Success",
                    message
                );
            });
    };

    renderConfirmDialog = () => {
        return (
            <ConfirmDialog
                title="Upcoming appointment:"
                message="Do you really want to delete this appointment?"
                visible={this.state.dialogVisible}
                onTouchOutside={() => this.setState({ dialogVisible: false })}
                positiveButton={{
                    title: "YES",
                    onPress: () => this.deleteAppointment(this.state.item)
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => this.onClickCloseDialog()
                }}
            />
        );
    };

    render() {
        const { upcomingAppointments } = this.props;
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
                    {upcomingAppointments.map((item, index) => {
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
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Image
                                            source={
                                                item.barber.profilePicture ===
                                                ""
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
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.onPressAppointmentItem(item)
                                        }
                                    >
                                        <IconDelete
                                            name="delete"
                                            color={common.grayThemeYoutube}
                                            size={19}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                    {this.renderConfirmDialog()}
                </View>
            </ScrollView>
        );
    }
}
