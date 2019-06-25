import React, { Component } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { Form, Item, Input } from "native-base";
import { Field, reduxForm } from "redux-form";
import IconPhone from "react-native-vector-icons/Feather";
import IconLocation from "react-native-vector-icons/SimpleLineIcons";

//styles
import styles from "../../../../../assets/pages/barberWizardFirstStep";
import common from "../../../../../assets/core/common";

//actions
import { setPhoneNumber, setAddress, setLocationId } from "./ActionsFirstStep";
import LocationServices from "../../../../../services/locationServices/LocationServices";

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

class FirstStep extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            showSpinnerLocations: false,
            locationOptions: [],
            locationsEmpty: false,
            locationsVisible: false
        };

        this.renderPhoneNumberInput = this.renderPhoneNumberInput.bind(this);
        this.renderAddressInput = this.renderAddressInput.bind(this);
        this.handleChangeAddressInput = this.handleChangeAddressInput.bind(
            this
        );
        this.handleChangePhoneNumberInput = this.handleChangePhoneNumberInput.bind(
            this
        );

        this.locationServices = new LocationServices();
    }

    handleChangePhoneNumberInput = value => {
        this.props.onSetPhoneNumber(value);
    };

    handleChangeAddressInput = value => {
        this.props.onSetAddress(value);
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
                    borderColor: common.darkColor
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
                    onChangeText={value =>
                        this.handleChangePhoneNumberInput(value)
                    }
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
            locationsVisible: false
        });
        this.props.onSetLocationId(
            locationOptions[index].id,
            locationOptions[index].title
        );
        this.props.change("address", locationOptions[index].title);
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
                    borderColor: common.darkColor,
                    marginTop: 30
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
                    onChangeText={value => this.handleChangeAddressInput(value)}
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
        return (
            <View style={styles.container}>
                <Form>
                    <View style={{ alignItems: "center", marginTop: 70 }}>
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
                    </View>
                </Form>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    barberWizardFirstStep: Object.assign({}, state.barberWizardFirstStep)
});

const mapDispatchToProps = dispatch => ({
    onSetPhoneNumber: phoneNumber => {
        dispatch(setPhoneNumber(phoneNumber));
    },
    onSetAddress: address => {
        dispatch(setAddress(address));
    },
    onSetLocationId: (locationId, address) => {
        dispatch(setLocationId(locationId, address));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    reduxForm({
        form: "barberWizardFirstStep",
        validate
    })(FirstStep)
);
