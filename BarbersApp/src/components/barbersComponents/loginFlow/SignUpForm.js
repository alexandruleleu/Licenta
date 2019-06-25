import React, { Component } from "react";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Form, Item, Input, Text, View } from "native-base";
import { Field, reduxForm } from "redux-form";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import IconEmail from "react-native-vector-icons/Zocial";
import IconPass from "react-native-vector-icons/FontAwesome5";

//styles
import styles from "../../../assets/pages/loginStyles";
import common from "../../../assets/core/common";

const validateName = text => {
    var re = /^[A-Za-z]+$/;
    if (re.test(text)) return true;
    return false;
};

const validate = values => {
    const error = {};
    error.firstName = "";
    error.lastName = "";
    error.email = "";
    error.password = "";
    let myFirstName = values.firstName;
    let myLastName = values.lastName;
    let myEmail = values.email;
    let myPass = values.password;

    if (values.firstName === undefined) {
        myFirstName = "";
    }
    if (values.lastName === undefined) {
        myLastName = "";
    }
    if (values.email === undefined) {
        myEmail = "";
    }
    if (values.password === undefined) {
        myPass = "";
    }

    if (!validateName(myFirstName) && myFirstName !== "") {
        error.firstName = "only letters";
    }
    if (!validateName(myLastName) && myLastName !== "") {
        error.lastName = "only letters";
    }
    if (myEmail.length < 11 && myEmail !== "") {
        error.email = "too short";
    }
    if (!myEmail.includes("@") && myEmail !== "") {
        error.email = "@ not included";
    }
    if (myPass.length < 4 && myPass != "") {
        error.password = "min 4 characters";
    }

    return error;
};

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: true
        };
        this.renderEmailInput = this.renderEmailInput.bind(this);
        this.renderPasswordInput = this.renderPasswordInput.bind(this);
    }

    renderFirstNameInput({
        input,
        label,
        type,
        meta: { touched, error, warning }
    }) {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <Item
                rounded
                style={{
                    padding: 5,
                    width: "50%",
                    backgroundColor: "rgba(52, 52, 52, 0.4)"
                }}
                error={hasError}
            >
                <Icon
                    active
                    name="user"
                    size={18}
                    color="#fff"
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.whiteColor
                    }}
                    placeholder="First Name"
                    placeholderTextColor={common.whiteColor}
                    {...input}
                />
                {hasError ? (
                    <Text style={{ color: common.redColor }}>{error}</Text>
                ) : (
                    <Text />
                )}
            </Item>
        );
    }

    renderLastNameInput({
        input,
        label,
        type,
        meta: { touched, error, warning }
    }) {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <Item
                rounded
                style={{
                    width: "50%",
                    padding: 5,
                    backgroundColor: "rgba(52, 52, 52, 0.4)"
                }}
                error={hasError}
            >
                <Icon
                    active
                    name="user"
                    size={18}
                    color="#fff"
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.whiteColor
                    }}
                    placeholder="Last Name"
                    placeholderTextColor={common.whiteColor}
                    {...input}
                />
                {hasError ? (
                    <Text style={{ color: common.redColor }}>{error}</Text>
                ) : (
                    <Text />
                )}
            </Item>
        );
    }

    renderEmailInput({
        input,
        label,
        type,
        meta: { touched, error, warning }
    }) {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <Item
                rounded
                style={{
                    marginTop: 10,
                    width: "90%",
                    padding: 5,
                    backgroundColor: "rgba(52, 52, 52, 0.4)"
                }}
                error={hasError}
            >
                <IconEmail
                    active
                    name="email"
                    size={18}
                    color="#fff"
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.whiteColor
                    }}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={common.whiteColor}
                    {...input}
                />
                {hasError ? (
                    <Text style={{ color: common.redColor }}>{error}</Text>
                ) : (
                    <Text />
                )}
            </Item>
        );
    }

    renderPasswordInput({
        input,
        label,
        type,
        meta: { touched, error, warning }
    }) {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <Item
                rounded
                style={{
                    marginTop: 10,
                    width: "90%",
                    padding: 5,
                    backgroundColor: "rgba(52, 52, 52, 0.4)"
                }}
                error={hasError}
            >
                <IconPass
                    active
                    name="unlock-alt"
                    size={18}
                    color="#fff"
                    style={{ padding: 9 }}
                />
                <Input
                    secureTextEntry={true}
                    style={{
                        color: common.whiteColor
                    }}
                    placeholder="Password"
                    autoCapitalize="none"
                    placeholderTextColor={common.whiteColor}
                    {...input}
                />
                {hasError ? (
                    <Text style={{ color: common.redColor }}>{error}</Text>
                ) : (
                    <Text />
                )}
            </Item>
        );
    }

    render() {
        const {
            handleSubmit,
            firstNameField,
            lastNameField,
            emailField,
            passwordField,
            valid
        } = this.props;
        return (
            <Form>
                <View style={{ alignItems: "center", marginTop: 35 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "90%"
                        }}
                    >
                        <Field
                            name="firstName"
                            component={this.renderFirstNameInput}
                        />
                        <Field
                            name="lastName"
                            component={this.renderLastNameInput}
                        />
                    </View>
                    <Field name="email" component={this.renderEmailInput} />
                    <Field
                        name="password"
                        component={this.renderPasswordInput}
                    />
                    <Button
                        disabled={
                            firstNameField !== "" &&
                            lastNameField !== "" &&
                            emailField !== "" &&
                            passwordField !== "" &&
                            valid === true
                                ? false
                                : true
                        }
                        title="REGISTER"
                        buttonStyle={styles.buttonRegisterBarber}
                        onPress={() =>
                            handleSubmit(
                                firstNameField,
                                lastNameField,
                                emailField,
                                passwordField
                            )
                        }
                    />
                </View>
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    firstNameField:
        formValueSelector("registerNewAccount")(state, "firstName") || "",
    lastNameField:
        formValueSelector("registerNewAccount")(state, "lastName") || "",
    emailField: formValueSelector("registerNewAccount")(state, "email") || "",
    passwordField:
        formValueSelector("registerNewAccount")(state, "password") || ""
});

SignUpForm = connect(mapStateToProps)(SignUpForm);

export default reduxForm({
    form: "registerNewAccount",
    validate
})(SignUpForm);
