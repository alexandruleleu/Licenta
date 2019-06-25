import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { findIndex } from "lodash";
import { SafeAreaView, Text, View } from "react-native";
import { Button } from "react-native-elements";
import ProgressBar from "./ProgressBar";
import Router from "./Router";
import { connect } from "react-redux";

const styles = {
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        width: "100%"
    },
    safeAreaView: {
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderColor: "#f7f7f7",
        borderTopWidth: 1,
        paddingHorizontal: 15,
        paddingTop: 10
    },
    touchableHighlight: {
        backgroundColor: "rgb(209, 165, 71)",
        borderColor: "transparent",
        width: 300,
        height: 50,
        borderWidth: 0,
        borderRadius: 8,
        margin: 15
    }
};

class Wizard extends Component {
    state = {
        currentStepIndex: 0
    };

    currentStep = () => {
        const { currentStepIndex } = this.state;
        const { steps } = this.props;
        return steps[currentStepIndex];
    };

    handleOnPressButton = () => {
        if (this.onLastStep()) {
            this.props.handleSubmitWizard();
        } else {
            const currentStepIndex = this.state.currentStepIndex + 1;
            const { routeName } = this.props.steps[currentStepIndex];
            this.navigator.dispatch(
                NavigationActions.navigate({
                    type: "Navigation/NAVIGATE",
                    routeName
                })
            );
        }
    };

    onHandleNavChange = routeName => {
        const currentStepIndex = findIndex(
            this.props.steps,
            step => step.routeName === routeName
        );
        this.setState({ currentStepIndex });
    };

    onHandleNavRef = navigator => {
        this.navigator = navigator;
    };

    onLastStep = () => {
        const { steps } = this.props;
        const { currentStepIndex } = this.state;
        return currentStepIndex + 1 === steps.length;
    };

    handleDisableNext = () => {
        const {
            phoneNumber,
            address,
            selectedLocationId
        } = this.props.app.barberWizardFirstStep;
        if (phoneNumber !== "" && address !== "" && selectedLocationId !== "") {
            return false;
        }
        return true;
    };

    handleDisableSubmit = () => {
        const {
            startAt,
            finishAt,
            breakHour
        } = this.props.app.barberWizardSecondStep;
        if (startAt !== "" && finishAt !== "" && breakHour !== "") {
            return false;
        }
        return true;
    };

    renderNavigationActions = () => {
        const { steps } = this.props;
        const { currentStepIndex } = this.state;
        const currentStep = this.currentStep();

        return (
            <SafeAreaView style={styles.safeAreaView}>
                <Text
                    style={{
                        padding: 8,
                        fontWeight: "bold",
                        fontSize: 16
                    }}
                >
                    Step {currentStepIndex + 1} of {steps.length}
                </Text>
                <ProgressBar
                    percentage={(currentStepIndex + 1) / steps.length}
                />
                <Button
                    disabled={
                        this.onLastStep()
                            ? this.handleDisableSubmit()
                            : this.handleDisableNext()
                    }
                    onPress={this.handleOnPressButton}
                    buttonStyle={styles.touchableHighlight}
                    title={this.onLastStep() ? "SUBMIT" : "NEXT"}
                />
            </SafeAreaView>
        );
    };

    render() {
        const { steps, title } = this.props;

        return (
            <View style={styles.container}>
                <Router
                    handleNavChange={this.onHandleNavChange}
                    handleNavRef={this.onHandleNavRef}
                    steps={steps}
                    title={title}
                />

                {this.renderNavigationActions()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    app: Object.assign({}, state)
});

export default connect(mapStateToProps)(Wizard);
