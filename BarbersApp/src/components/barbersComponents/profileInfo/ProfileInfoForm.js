import React, { Component } from "react";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Form, Item, Input, View } from "native-base";
import { Field, reduxForm } from "redux-form";
import { TouchableOpacity } from "react-native";
import IconSave from "react-native-vector-icons/Entypo";

//styles

import styles from "../../../assets/pages/barberProfile";
import common from "../../../assets/core/common";

class ProfileInfoForm extends Component {
    constructor(props) {
        super(props);
        this.renderFirstNameInput = this.renderFirstNameInput.bind(this);
        this.renderLastNameInput = this.renderLastNameInput.bind(this);
        this.renderDescriptionInput = this.renderDescriptionInput.bind(this);
    }

    componentDidMount() {
        this.handleInitialize();
    }

    handleInitialize = () => {
        const initData = {
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            description: this.props.description
        };

        this.props.initialize(initData);
    };

    renderFirstNameInput = field => {
        return (
            <Item
                style={{
                    width: "50%"
                }}
            >
                <Input
                    style={{
                        color: common.darkColor,
                        fontSize: 19,
                        fontWeight: "bold",
                        paddingBottom: 0,
                        textAlign: "center"
                    }}
                    placeholder="First Name"
                    placeholderTextColor={common.darkColor}
                    {...field.input}
                />
            </Item>
        );
    };

    renderLastNameInput = field => {
        return (
            <Item
                style={{
                    width: "50%"
                }}
            >
                <Input
                    style={{
                        color: common.darkColor,
                        fontSize: 19,
                        fontWeight: "bold",
                        paddingBottom: 0,
                        textAlign: "center"
                    }}
                    placeholder="Last Name"
                    placeholderTextColor={common.darkColor}
                    {...field.input}
                />
            </Item>
        );
    };

    renderDescriptionInput = field => {
        return (
            <Item>
                <Input
                    style={{
                        fontSize: 17,
                        paddingBottom: 0,
                        textAlign: "center"
                    }}
                    placeholder="Tell what you're able to"
                    {...field.input}
                />
            </Item>
        );
    };

    render() {
        const {
            handleSubmit,
            firstNameField,
            lastNameField,
            descriptionField
        } = this.props;

        return (
            <Form style={{ width: "100%", alignItems: "center" }}>
                <View
                    style={{
                        width: "70%"
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center"
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
                    <Field
                        name="description"
                        component={this.renderDescriptionInput}
                    />
                </View>
                <TouchableOpacity
                    onPress={() =>
                        handleSubmit(
                            firstNameField,
                            lastNameField,
                            descriptionField
                        )
                    }
                    style={styles.editProfileBtn}
                >
                    <IconSave name="check" size={25} color="#7d7d7d" />
                </TouchableOpacity>
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    firstNameField:
        formValueSelector("editProfileBarber")(state, "firstName") || "",
    lastNameField:
        formValueSelector("editProfileBarber")(state, "lastName") || "",
    descriptionField:
        formValueSelector("editProfileBarber")(state, "description") || ""
});

export default connect(mapStateToProps)(
    reduxForm({
        form: "editProfileBarber"
    })(ProfileInfoForm)
);
