import React, { Component } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { StatusBar, TouchableOpacity, Image, YellowBox } from "react-native";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Form, Item, Input } from "native-base";
import { Field, reduxForm } from "redux-form";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import { Dialog } from "react-native-simple-dialogs";
import ImagePicker from "react-native-image-crop-picker";

//styles
import styles from "../../../assets/pages/editCustomerProfile";
import common from "../../../assets/core/common";

//services
import firebase from "react-native-firebase";
import RNFetchBlob from "react-native-fetch-blob";

YellowBox.ignoreWarnings(["Require cycle:"]);

const validateName = text => {
    var re = /^[A-Za-z]+$/;
    if (re.test(text)) return true;
    return false;
};

const validate = values => {
    const error = {};
    error.firstName = "";
    error.lastName = "";
    let myFirstName = values.firstName;
    let myLastName = values.lastName;

    if (values.firstName === undefined) {
        myFirstName = "";
    }
    if (values.lastName === undefined) {
        myLastName = "";
    }

    if (!validateName(myFirstName) && myFirstName !== "") {
        error.firstName = "only letters";
    }
    if (!validateName(myLastName) && myLastName !== "") {
        error.lastName = "only letters";
    }

    return error;
};

class EditCustomerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSpinner: false,
            dialogChangeProfilePicture: false,
            profile_picture: ""
        };
    }

    componentDidMount() {
        this.handleInitialize();
    }

    handleInitialize = () => {
        const {
            first_name,
            last_name,
            profile_picture
        } = this.props.navigation.state.params.userProfile;
        const initData = {
            firstName: first_name,
            lastName: last_name
        };

        this.setState({
            profile_picture: profile_picture
        });
        this.props.initialize(initData);
    };

    onPressChangeProfilePicture = () => {
        this.setState({
            dialogChangeProfilePicture: true
        });
    };

    onClickCloseChangeProfileDialog = () => {
        this.setState({
            dialogChangeProfilePicture: false
        });
    };

    removeProfilePicture = () => {
        const { userId } = this.props.navigation.state.params;
        this.setState({
            profile_picture: "",
            dialogChangeProfilePicture: false
        });
        firebase
            .database()
            .ref("customers")
            .child(userId)
            .update({ profile_picture: "" });
    };

    changeProfilePicture = () => {
        const { userId } = this.props.navigation.state.params;
        this.setState({ showSpinner: true });
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        const uid = userId;
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            mediaType: "photo"
        })
            .then(image => {
                const imagePath = image.path;
                let uploadBlob = null;
                const imageRef = firebase
                    .storage()
                    .ref(uid)
                    .child("profile.jpg");
                let mime = "image/jpg";
                fs.readFile(imagePath, "base64")
                    .then(data => {
                        return Blob.build(data, { type: `${mime};BASE64` });
                    })
                    .then(blob => {
                        uploadBlob = blob;
                        return imageRef.putFile(imagePath, {
                            contentType: mime
                        });
                    })
                    .then(() => {
                        uploadBlob.close();
                        return imageRef.getDownloadURL();
                    })
                    .then(url => {
                        this.setState({
                            showSpinner: false,
                            profile_picture: url,
                            dialogChangeProfilePicture: false
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    showSpinner: false
                });
            });
    };

    onClickSaveButton = () => {
        const { goBack, state } = this.props.navigation;
        const { userId } = this.props.navigation.state.params;
        const payload = {
            first_name: this.props.firstNameField,
            last_name: this.props.lastNameField,
            profile_picture: this.state.profile_picture
        };
        this.setState({
            showSpinner: true
        });
        firebase
            .database()
            .ref("customers")
            .child(userId)
            .update({ ...payload })
            .then(() => {
                this.setState({
                    showSpinner: false
                });
                state.params.afterSave({ saved: true });
                goBack();
            });
    };

    renderChangeProfilePictureDialog = () => {
        return (
            <Dialog
                visible={true}
                onTouchOutside={() =>
                    this.setState({ dialogChangeProfilePicture: false })
                }
                overlayStyle={
                    {
                        //backgroundColor: "rgba(52, 52, 52, 0.4)"
                    }
                }
                animationType={"slide"}
            >
                <View>
                    <Button
                        title="Upload Photo"
                        buttonStyle={styles.dialogItemBtn}
                        textStyle={{ color: common.darkThemeYoutube }}
                        onPress={this.changeProfilePicture}
                    />
                    <Button
                        title="Remove Photo"
                        buttonStyle={styles.dialogItemBtn}
                        textStyle={{ color: common.darkThemeYoutube }}
                        onPress={this.removeProfilePicture}
                    />
                    <Button
                        title="Cancel"
                        buttonStyle={styles.dialogItemBtn}
                        textStyle={{ color: common.darkThemeYoutube }}
                        onPress={this.onClickCloseChangeProfileDialog}
                    />
                </View>
            </Dialog>
        );
    };

    renderFirstNameInput = ({
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
                style={{
                    padding: 5
                }}
                error={hasError}
            >
                <Icon
                    active
                    name="user"
                    size={18}
                    color={common.darkThemeYoutube}
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.darkThemeYoutube
                    }}
                    placeholder="First Name"
                    placeholderTextColor={common.darkThemeYoutube}
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

    renderLastNameInput = ({
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
                style={{
                    marginTop: 15,
                    padding: 5
                }}
                error={hasError}
            >
                <Icon
                    active
                    name="user"
                    size={18}
                    color={common.darkThemeYoutube}
                    style={{ padding: 8 }}
                />
                <Input
                    style={{
                        color: common.darkThemeYoutube
                    }}
                    placeholder="Last Name"
                    placeholderTextColor={common.darkThemeYoutube}
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

    render() {
        const { firstNameField, lastNameField, valid } = this.props;
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
                        <View style={styles.editContainer}>
                            <TouchableOpacity
                                onPress={this.onPressChangeProfilePicture}
                                style={styles.profileContainer}
                            >
                                <Image
                                    source={
                                        this.state.profile_picture === ""
                                            ? require("../../../assets/images/barberDefaultProfile.jpg")
                                            : {
                                                  uri: this.state
                                                      .profile_picture
                                              }
                                    }
                                    style={styles.profilePicture}
                                />
                            </TouchableOpacity>
                            <Field
                                name="firstName"
                                component={this.renderFirstNameInput}
                            />
                            <Field
                                name="lastName"
                                component={this.renderLastNameInput}
                            />
                        </View>

                        <Button
                            disabled={
                                firstNameField !== "" &&
                                lastNameField !== "" &&
                                valid === true
                                    ? false
                                    : true
                            }
                            title="SAVE CHANGES"
                            buttonStyle={styles.buttonSave}
                            onPress={this.onClickSaveButton}
                        />
                    </View>
                </Form>
                {this.state.dialogChangeProfilePicture ? (
                    this.renderChangeProfilePictureDialog()
                ) : (
                    <Text />
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    firstNameField: formValueSelector("editCustomer")(state, "firstName") || "",
    lastNameField: formValueSelector("editCustomer")(state, "lastName") || ""
});

export default connect(mapStateToProps)(
    reduxForm({
        form: "editCustomer",
        validate
    })(EditCustomerProfile)
);
