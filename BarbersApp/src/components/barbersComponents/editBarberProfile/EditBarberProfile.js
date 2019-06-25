import React, { Component } from "react";
import { View, ActivityIndicator, Text, ScrollView } from "react-native";
import { StatusBar, TouchableOpacity } from "react-native";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Form, Item, Input } from "native-base";
import { Field, reduxForm } from "redux-form";
import { Button } from "react-native-elements";
import IconPhone from "react-native-vector-icons/Feather";
import IconLocation from "react-native-vector-icons/SimpleLineIcons";
import TimePicker from "react-native-modal-datetime-picker";
import DropdownAlert from "react-native-dropdownalert";

//styles
import styles from "../../../assets/pages/editBarberProfile";
import common from "../../../assets/core/common";

import firebase from "react-native-firebase";
import LocationServices from "../../../services/locationServices/LocationServices";

const validatePhoneNumber = text => {
    var re = /^[0-9]+$/;
    if (re.test(text)) return true;
    return false;
};

const validate = values => {
    const error = {};
    error.phoneNumber = "";
    let myPhoneNumber = values.phoneNumber;

    if (values.phoneNumber === undefined) {
        myPhoneNumber = "";
    }

    if (!validatePhoneNumber(myPhoneNumber) && myPhoneNumber !== "") {
        error.phoneNumber = "only digits";
    }

    return error;
};

class EditBarberProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            showSpinnerLocations: false,
            startTimePickerVisible: false,
            finishTimePickerVisible: false,
            breakHourPickerVisible: false,
            startHourValue: 0,
            finishHourValue: 0,
            breakHourValue: 0,
            startAt: "",
            finishAt: "",
            breakHour: "",
            locationOptions: [],
            locationsEmpty: false,
            locationsVisible: false,
            selectedLocationId: ""
        };

        this.renderPhoneNumberInput = this.renderPhoneNumberInput.bind(this);
        this.renderAddressInput = this.renderAddressInput.bind(this);
        this.onClickSaveButton = this.onClickSaveButton.bind(this);
        this.showStartTimePicker = this.showStartTimePicker.bind(this);
        this.showFinishTimePicker = this.showFinishTimePicker.bind(this);
        this.showBreakHourPicker = this.showBreakHourPicker.bind(this);
        this.hideStartTimePicker = this.hideStartTimePicker.bind(this);
        this.hideFinishTimePicker = this.hideFinishTimePicker.bind(this);
        this.hideBreakHourPicker = this.hideBreakHourPicker.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleFinishTime = this.handleFinishTime.bind(this);
        this.handleBreakHour = this.handleBreakHour.bind(this);

        this.locationServices = new LocationServices();
    }

    componentDidMount() {
        this.handleInitialize();
    }

    handleInitialize = () => {
        const {
            phoneNumber,
            address,
            startAt,
            finishAt,
            breakHour,
            startHourValue,
            finishHourValue,
            breakHourValue
        } = this.props.navigation.state.params.accountInfo;
        const initData = {
            phoneNumber: phoneNumber,
            address: address
        };
        this.setState({
            startAt: startAt,
            finishAt: finishAt,
            breakHour: breakHour,
            startHourValue: startHourValue,
            finishHourValue: finishHourValue,
            breakHourValue: breakHourValue
        });

        this.props.initialize(initData);
    };

    showStartTimePicker = () => this.setState({ startTimePickerVisible: true });

    showFinishTimePicker = () =>
        this.setState({ finishTimePickerVisible: true });

    showBreakHourPicker = () => {
        this.setState({ breakHourPickerVisible: true });
    };

    hideStartTimePicker = () =>
        this.setState({ startTimePickerVisible: false });

    hideFinishTimePicker = () =>
        this.setState({ finishTimePickerVisible: false });

    hideBreakHourPicker = () => {
        this.setState({ breakHourPickerVisible: false });
    };

    handleStartTime = date => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const startAt = this.timePipe(hours, minutes);
        const startHourValue = this.timeValuePipe(hours, minutes);
        this.setState({
            startAt: startAt,
            startHourValue: startHourValue
        });
        this.hideStartTimePicker();
    };

    handleFinishTime = date => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const finishAt = this.timePipe(hours, minutes);
        const finishHourValue = this.timeValuePipe(hours, minutes);
        const error =
            'Incorrect value! It has to be greater than "start hour."';
        this.hideFinishTimePicker();
        if (finishHourValue < this.state.startHourValue) {
            this.dropdown.alertWithType("error", "Error", error);
            console.log("here");
        } else {
            this.setState({
                finishAt: finishAt,
                finishHourValue: finishHourValue
            });
        }
    };

    handleBreakHour = date => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const breakHour = this.timePipe(hours, minutes);
        const breakHourValue = this.timeValuePipe(hours, minutes);
        const error =
            'Incorrect value! It has to be greater than "start hour" and less that "finish hour"';
        this.hideBreakHourPicker();
        if (
            breakHourValue < this.state.startHourValue ||
            breakHourValue > this.state.finishHourValue
        ) {
            this.dropdown.alertWithType("error", "Error", error);
        } else {
            this.setState({
                breakHour: breakHour,
                breakHourValue: breakHourValue
            });
        }
    };

    timePipe = (hours, minutes) => {
        if (minutes <= 30 && minutes > 0) {
            return hours + ":" + "30";
        }
        if (minutes > 30 && minutes <= 59) {
            return hours + 1 + ":" + "00";
        }
        if (minutes === 0) {
            return hours + ":" + "00";
        }
        return hours + ":" + minutes;
    };

    timeValuePipe = (hours, minutes) => {
        if (minutes <= 30 && minutes > 0) {
            return hours + 0.5;
        }
        if (minutes > 30 && minutes <= 59) {
            return hours + 1;
        }
        if (minutes === 0) {
            return hours;
        }
        return hours;
    };

    async onClickSaveButton() {
        const { goBack, state } = this.props.navigation;
        const { userId } = this.props.navigation.state.params.accountInfo;
        const payload = {
            phoneNumber: this.props.phoneNumber,
            address: this.props.address,
            startAt: this.state.startAt,
            finishAt: this.state.finishAt,
            breakHour: this.state.breakHour,
            startHourValue: this.state.startHourValue,
            finishHourValue: this.state.finishHourValue,
            breakHourValue: this.state.breakHourValue
        };
        if (this.state.selectedLocationId !== "") {
            await this.locationServices
                .getLatAndLong(this.state.selectedLocationId)
                .then(rsp => {
                    payload.location = {
                        id: this.state.selectedLocationId,
                        title: this.props.address,
                        latitude: rsp.latitude,
                        longitude: rsp.longitude
                    };
                });
        }

        this.setState({
            showSpinner: true
        });
        firebase
            .database()
            .ref("barbers")
            .child(userId)
            .update({ ...payload })
            .then(() => {
                this.setState({
                    showSpinner: false
                });
                state.params.afterSave({ saved: true });
                goBack();
            });
    }

    renderPhoneNumberInput = ({
        input,
        label,
        type,
        meta: { touched, error, warning }
    }) => {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <Item
                rounded
                style={{
                    padding: 5,
                    width: "80%",
                    backgroundColor: "#e9e9ef",
                    borderColor: common.primaryColor
                }}
                error={hasError}
            >
                <IconPhone
                    active
                    name="phone"
                    size={18}
                    color={common.darkColor}
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.darkColor
                    }}
                    placeholder="Phone Number"
                    placeholderTextColor={common.darkColor}
                    keyboardType="phone-pad"
                    {...input}
                />
                {hasError ? (
                    <Text style={{ color: common.redColor }}>{error}</Text>
                ) : (
                    <Text />
                )}
            </Item>
        );
    };

    onSelectLocation = index => {
        const { locationOptions } = this.state;
        this.setState({
            locationsVisible: false,
            selectedLocationId: locationOptions[index].id
        });
        this.props.change("address", locationOptions[index].title);
    };

    onChangeAddressInput = value => {
        if (value !== "") {
            this.setState({
                showSpinnerLocations: true
            });
            this.locationServices.getLocationOptions(value).then(rsp => {
                const locations = rsp.suggestions.map(item => {
                    return {
                        id: item.locationId,
                        title: item.label
                    };
                });
                const empty = rsp.suggestions.length > 0 ? false : true;
                this.setState({
                    locationsVisible: true,
                    locationOptions: locations,
                    locationsEmpty: empty,
                    showSpinnerLocations: false
                });
            });
        }
    };

    renderAutocompleteItem = (locationName, index) => {
        return (
            <TouchableOpacity
                style={styles.locationAutocompleteItem}
                key={index}
                onPress={() => this.onSelectLocation(index)}
            >
                <IconLocation
                    active
                    name="location-pin"
                    size={16}
                    color={common.darkColor}
                    style={{ paddingHorizontal: 8 }}
                />
                <Text
                    style={{
                        fontSize: 17,
                        color: common.darkColor
                    }}
                >
                    {locationName}
                </Text>
            </TouchableOpacity>
        );
    };

    renderAddressInput = field => {
        return (
            <Item
                rounded
                style={{
                    padding: 5,
                    width: "80%",
                    backgroundColor: "#e9e9ef",
                    borderColor: common.primaryColor,
                    marginTop: 10
                }}
            >
                <IconLocation
                    active
                    name="location-pin"
                    size={18}
                    color={common.darkColor}
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.darkColor
                    }}
                    placeholder="Address"
                    placeholderTextColor={common.darkColor}
                    autoCapitalize="none"
                    onChangeText={value => this.onChangeAddressInput(value)}
                    {...field.input}
                />
                {this.state.showSpinnerLocations ? (
                    <ActivityIndicator
                        size={20}
                        color={common.primaryColor}
                        animating={this.state.showSpinnerLocations}
                    />
                ) : (
                    <Text />
                )}
            </Item>
        );
    };

    render() {
        const { valid } = this.props;
        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <StatusBar
                    translucent={false}
                    backgroundColor={common.darkThemeYoutube}
                    barStyle={"light-content"}
                />
                <ActivityIndicator
                    size={35}
                    color={common.primaryColor}
                    animating={this.state.showSpinner}
                />
            </View>
        ) : (
            <View style={styles.container}>
                <StatusBar
                    translucent={false}
                    backgroundColor={common.darkThemeYoutube}
                    barStyle={"light-content"}
                />

                <Form>
                    <View style={{ alignItems: "center", marginTop: 35 }}>
                        <Field
                            name="phoneNumber"
                            component={this.renderPhoneNumberInput}
                        />
                        <View style={{ alignItems: "center" }}>
                            <Field
                                name="address"
                                component={this.renderAddressInput}
                            />
                            {this.state.locationsVisible ? (
                                !this.state.locationsEmpty ? (
                                    <View style={styles.locationsAutocomplete}>
                                        <ScrollView style={{ width: "100%" }}>
                                            {this.state.locationOptions.map(
                                                (item, index) =>
                                                    this.renderAutocompleteItem(
                                                        item.title,
                                                        index
                                                    )
                                            )}
                                        </ScrollView>
                                    </View>
                                ) : (
                                    <View
                                        style={
                                            styles.locationsAutocompleteEmpty
                                        }
                                    >
                                        <Text
                                            style={{
                                                fontSize: 17,
                                                color: common.darkColor
                                            }}
                                        >
                                            No results found.
                                        </Text>
                                    </View>
                                )
                            ) : (
                                <Text />
                            )}
                        </View>
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                marginTop: 30,
                                paddingTop: 30,
                                paddingBottom: 30,
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderColor: "gray"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}
                            >
                                Select the daily interval of availability:
                            </Text>
                            <View
                                style={{ marginTop: 10, flexDirection: "row" }}
                            >
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        padding: 8,
                                        borderColor: "gray",
                                        backgroundColor:
                                            "rgba(52, 52, 52, 0.08)"
                                    }}
                                    onPress={this.showStartTimePicker}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Start at{" "}
                                        {this.state.startAt === ""
                                            ? "--:--"
                                            : this.state.startAt}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        padding: 8,
                                        marginLeft: 10,
                                        borderColor: "gray",
                                        backgroundColor:
                                            "rgba(52, 52, 52, 0.08)"
                                    }}
                                    onPress={this.showFinishTimePicker}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Finish at{" "}
                                        {this.state.finishAt === ""
                                            ? "--:--"
                                            : this.state.finishAt}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                paddingTop: 30,
                                paddingBottom: 30,
                                borderBottomWidth: 1,
                                borderColor: "gray"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    textAlign: "center",
                                    fontWeight: "bold"
                                }}
                            >
                                Select when you want to have a break hour:
                            </Text>

                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 8,
                                    borderColor: "gray",
                                    backgroundColor: "rgba(52, 52, 52, 0.08)"
                                }}
                                onPress={this.showBreakHourPicker}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold"
                                    }}
                                >
                                    Start at{" "}
                                    {this.state.breakHour === ""
                                        ? "--:--"
                                        : this.state.breakHour}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Button
                            disabled={valid === true ? false : true}
                            title="SAVE CHANGES"
                            buttonStyle={styles.buttonSave}
                            onPress={this.onClickSaveButton}
                        />
                    </View>
                </Form>
                {this.state.startTimePickerVisible ? (
                    <TimePicker
                        mode="time"
                        datePickerModeAndroid="spinner"
                        isVisible={true}
                        onConfirm={this.handleStartTime}
                        onCancel={this.hideStartTimePicker}
                    />
                ) : (
                    <Text />
                )}
                {this.state.finishTimePickerVisible ? (
                    <TimePicker
                        mode="time"
                        datePickerModeAndroid="spinner"
                        isVisible={true}
                        onConfirm={this.handleFinishTime}
                        onCancel={this.hideFinishTimePicker}
                    />
                ) : (
                    <Text />
                )}
                {this.state.breakHourPickerVisible ? (
                    <TimePicker
                        mode="time"
                        datePickerModeAndroid="spinner"
                        isVisible={true}
                        onConfirm={this.handleBreakHour}
                        onCancel={this.hideBreakHourPicker}
                    />
                ) : (
                    <Text />
                )}
                <DropdownAlert
                    closeInterval={4000}
                    translucent={true}
                    updateStatusBar={false}
                    showCancel={true}
                    ref={ref => (this.dropdown = ref)}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    phoneNumber: formValueSelector("editBarber")(state, "phoneNumber") || "",
    address: formValueSelector("editBarber")(state, "address") || ""
});

export default connect(mapStateToProps)(
    reduxForm({
        form: "editBarber",
        validate
    })(EditBarberProfile)
);
