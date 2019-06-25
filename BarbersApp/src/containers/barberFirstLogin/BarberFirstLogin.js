import React, { Component } from "react";
import { View, ActivityIndicator, BackHandler, StatusBar } from "react-native";
import { connect } from "react-redux";

//components
import BarberWizard from "../../components/barbersComponents/barberWizard/BarberWizard";
import FirstStep from "../../components/barbersComponents/barberWizard/steps/firstStep/FirstStep";
import SecondStep from "../../components/barbersComponents/barberWizard/steps/secondStep/SecondStep";
import FirstLogicService from "../../services/firstLoginServices/FirstLoginService";

//styles
import styles from "../../assets/pages/homeBarber";
import common from "../../assets/core/common";
import LocationServices from "../../services/locationServices/LocationServices";

class BarberFirstLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            userProfile: this.props.navigation.state.params
        };

        this.handleSubmitWizard = this.handleSubmitWizard.bind(this);

        this.locationServices = new LocationServices();
    }

    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
    }

    async handleSubmitWizard() {
        const { navigate } = this.props.navigation;
        const userId = this.state.userProfile.userId;
        const {
            selectedLocationId,
            address
        } = this.props.app.barberWizardFirstStep;
        const payload = {
            firstLogin: false,
            phoneNumber: this.props.app.barberWizardFirstStep.phoneNumber,
            address: this.props.app.barberWizardFirstStep.address,
            startAt: this.props.app.barberWizardSecondStep.startAt,
            finishAt: this.props.app.barberWizardSecondStep.finishAt,
            breakHour: this.props.app.barberWizardSecondStep.breakHour,
            startHourValue: this.props.app.barberWizardSecondStep
                .startHourValue,
            finishHourValue: this.props.app.barberWizardSecondStep
                .finishHourValue,
            breakHourValue: this.props.app.barberWizardSecondStep.breakHourValue
        };
        if (selectedLocationId !== "") {
            await this.locationServices
                .getLatAndLong(selectedLocationId)
                .then(rsp => {
                    payload.location = {
                        id: selectedLocationId,
                        title: address,
                        latitude: rsp.latitude,
                        longitude: rsp.longitude
                    };
                });
        }

        this.setState({
            showSpinner: true
        });
        new FirstLogicService(userId, payload)
            .addBarberInfoAndWorkAvailability()
            .then(() => {
                this.setState({
                    showSpinner: false
                });
                navigate("HomeBarberTabs", this.state.userProfile);
            });
    }

    render() {
        const steps = [
            { component: <FirstStep />, routeName: "Step1" },
            { component: <SecondStep />, routeName: "Step2" }
        ];
        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"dark-content"}
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
                    backgroundColor={"white"}
                    barStyle={"dark-content"}
                />

                <BarberWizard
                    handleSubmitWizard={this.handleSubmitWizard}
                    steps={steps}
                    title="Customize your profile"
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    app: Object.assign({}, state)
});

export default connect(mapStateToProps)(BarberFirstLogin);
