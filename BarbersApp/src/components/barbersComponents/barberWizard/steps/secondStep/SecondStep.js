import React, { Component } from "react";
import { View, Text } from "react-native";
import { StatusBar, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import TimePicker from "react-native-modal-datetime-picker";
import DropdownAlert from "react-native-dropdownalert";
import IconClock from "react-native-vector-icons/SimpleLineIcons";

//styles
import styles from "../../../../../assets/pages/barberWizardFirstStep";
import common from "../../../../../assets/core/common";

//actions
import {
    setStartHourValue,
    setFinishHourValue,
    setBreakHourValue,
    setStartHour,
    setFinishHour,
    setBreakHour
} from "./ActionsSecondStep";

class SecondStep extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            startTimePickerVisible: false,
            finishTimePickerVisible: false,
            breakHourPickerVisible: false,
            startHourValue: 0,
            finishHourValue: 0,
            breakHourValue: 0,
            startAt: "",
            finishAt: "",
            breakHour: ""
        };

        this.showStartTimePicker = this.showStartTimePicker.bind(this);
        this.showFinishTimePicker = this.showFinishTimePicker.bind(this);
        this.showBreakHourPicker = this.showBreakHourPicker.bind(this);
        this.hideStartTimePicker = this.hideStartTimePicker.bind(this);
        this.hideFinishTimePicker = this.hideFinishTimePicker.bind(this);
        this.hideBreakHourPicker = this.hideBreakHourPicker.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleFinishTime = this.handleFinishTime.bind(this);
        this.handleBreakHour = this.handleBreakHour.bind(this);
    }

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
        this.props.onSetStartHourValue(startHourValue);
        this.props.onSetStartHour(startAt);
        this.hideStartTimePicker();
    };

    handleFinishTime = date => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const finishAt = this.timePipe(hours, minutes);
        const finishHourValue = this.timeValuePipe(hours, minutes);
        const error =
            'Incorrect value! It has to be greater than "start hour".';
        this.hideFinishTimePicker();
        if (finishHourValue < this.state.startHourValue) {
            this.dropdown.alertWithType("error", "Error", error);
        } else {
            this.setState({
                finishAt: finishAt,
                finishHourValue: finishHourValue
            });
            this.props.onSetFinishHourValue(finishHourValue);
            this.props.onSetFinishHour(finishAt);
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
            this.props.onSetBreakHourValue(breakHourValue);
            this.props.onSetBreakHour(breakHour);
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

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={false}
                    backgroundColor={common.darkThemeYoutube}
                    barStyle={"light-content"}
                />

                <View style={{ alignItems: "center" }}>
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
                        <IconClock
                            name="clock"
                            style={{ fontSize: 45, padding: 10 }}
                        />
                        <Text
                            style={{
                                fontSize: 18,
                                paddingLeft: 10,
                                paddingRight: 10,
                                textAlign: "center",
                                fontWeight: "bold"
                            }}
                        >
                            Select the daily interval of availability for your
                            job:
                        </Text>
                        <View style={{ marginTop: 10, flexDirection: "row" }}>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 8,
                                    borderColor: "gray",
                                    backgroundColor: "rgba(52, 52, 52, 0.08)"
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
                                    backgroundColor: "rgba(52, 52, 52, 0.08)"
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
                                fontSize: 18,
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
                            disabled={
                                this.state.startAt === "" ||
                                this.state.finishAt === ""
                                    ? true
                                    : false
                            }
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
                </View>

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
    barberWizardSecondStep: Object.assign({}, state.barberWizardSecondStep)
});

const mapDispatchToProps = dispatch => ({
    onSetStartHourValue: startHourValue => {
        dispatch(setStartHourValue(startHourValue));
    },
    onSetFinishHourValue: finishHourValue => {
        dispatch(setFinishHourValue(finishHourValue));
    },
    onSetBreakHourValue: breakHourValue => {
        dispatch(setBreakHourValue(breakHourValue));
    },
    onSetStartHour: startAt => {
        dispatch(setStartHour(startAt));
    },
    onSetFinishHour: finishAt => {
        dispatch(setFinishHour(finishAt));
    },
    onSetBreakHour: breakHour => {
        dispatch(setBreakHour(breakHour));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SecondStep);
