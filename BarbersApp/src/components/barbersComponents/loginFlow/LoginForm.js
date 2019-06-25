import React, { Component } from "react";
import { View } from "react-native";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Form, Item, Input, Text } from "native-base";
import { Field, reduxForm } from "redux-form";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Zocial";
import IconPass from "react-native-vector-icons/FontAwesome5";

//styles
import styles from "../../../assets/pages/loginStyles";
import common from "../../../assets/core/common";

const validate = values => {
    const error = {};
    error.email = "";
    error.password = "";
    let myEmail = values.email;
    if (values.email === undefined) {
        myEmail = "";
    }
    if (!myEmail.includes("@") && myEmail !== "") {
        error.email = "@ not included";
    }

    return error;
};

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: true
        };
        this.renderEmailInput = this.renderEmailInput.bind(this);
        this.renderPasswordInput = this.renderPasswordInput.bind(this);
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
                    marginTop: 50,
                    width: "90%",
                    padding: 5,
                    backgroundColor: "rgba(52, 52, 52, 0.4)"
                }}
                error={hasError}
            >
                <Icon
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
                    placeholderTextColor={common.whiteColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
        const { handleSubmit, emailField, passwordField, valid } = this.props;
        return (
            <Form>
                <View style={{ alignItems: "center" }}>
                    <Field name="email" component={this.renderEmailInput} />
                    <Field
                        name="password"
                        component={this.renderPasswordInput}
                    />
                </View>
                <View style={{ alignItems: "center" }}>
                    <Button
                        disabled={
                            emailField !== "" &&
                            passwordField !== "" &&
                            valid === true
                                ? false
                                : true
                        }
                        title="LOGIN"
                        buttonStyle={styles.buttonLoginBarber}
                        onPress={() => handleSubmit(emailField, passwordField)}
                    />
                </View>
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    emailField:
        formValueSelector("loginBarberOrCustomer")(state, "email") || "",
    passwordField:
        formValueSelector("loginBarberOrCustomer")(state, "password") || ""
});

LoginForm = connect(mapStateToProps)(LoginForm);

export default reduxForm({
    form: "loginBarberOrCustomer",
    validate
})(LoginForm);
