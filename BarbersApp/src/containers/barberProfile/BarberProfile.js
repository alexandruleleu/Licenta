import React, { Component } from "react";
import { ConfirmDialog, Dialog } from "react-native-simple-dialogs";
import {
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ImageBackground,
    YellowBox,
    ScrollView
} from "react-native";
import { Button } from "native-base";
import ImagePicker from "react-native-image-crop-picker";

//icons
import Icon from "react-native-vector-icons/FontAwesome";
import IconEdit from "react-native-vector-icons/Entypo";
import IconSettings from "react-native-vector-icons/Feather";
import IconArrow from "react-native-vector-icons/SimpleLineIcons";
import IconSignOut from "react-native-vector-icons/SimpleLineIcons";

//styles
import styles from "../../assets/pages/barberProfile";
import common from "../../assets/core/common";

import firebase from "react-native-firebase";
import RNFetchBlob from "react-native-fetch-blob";

//components
import ProfileInfoForm from "../../components/barbersComponents/profileInfo/ProfileInfoForm";
import ProfileBookingInfo from "../../components/barbersComponents/profileInfo/ProfileBookingInfo";
import ProfileInfo from "../../components/barbersComponents/profileInfo/ProfileInfo";

YellowBox.ignoreWarnings(["Require cycle:"]);

export default class BarberProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: false,
            showSpinner: false,
            dialogLogoutVisible: false,
            dialogChangeProfilePicture: false,
            dialogEditProfile: false,
            dialogActiveProfile: false,
            profileInfoFormVisible: false,
            profilePicture: "",
            accountInfo: {
                userId: "",
                reviews: 0,
                accountActive: false,
                firstName: "",
                lastName: "",
                description: "",
                email: "",
                phoneNumber: "",
                address: "",
                startAt: "",
                finishAt: "",
                breakHour: ""
            }
        };
    }

    componentDidMount() {
        const { userId } = this.props.navigation.state.params;
        this.setState({
            isFetching: true,
            showSpinner: true
        });
        firebase
            .database()
            .ref("barbers")
            .child(userId)
            .once("value", snapshot => {
                this.setState({
                    profilePicture: snapshot.val().profilePicture,
                    accountInfo: {
                        userId: userId,
                        reviews: snapshot.val().reviews,
                        accountActive: snapshot.val().active,
                        firstName: snapshot.val().firstName,
                        lastName: snapshot.val().lastName,
                        description: snapshot.val().description,
                        email: snapshot.val().email,
                        phoneNumber: snapshot.val().phoneNumber,
                        address: snapshot.val().address,
                        startAt: snapshot.val().startAt,
                        finishAt: snapshot.val().finishAt,
                        breakHour: snapshot.val().breakHour,
                        startHourValue: snapshot.val().startHourValue,
                        finishHourValue: snapshot.val().finishHourValue,
                        breakHourValue: snapshot.val().breakHourValue
                    },
                    isFetching: false,
                    showSpinner: false
                });
            });
    }

    onPressLogoutIcon = () => {
        this.setState({
            dialogLogoutVisible: true
        });
    };

    onPressChangeProfilePicture = () => {
        this.setState({
            dialogChangeProfilePicture: true
        });
    };

    onClickLogoutBtn = () => {
        const { navigate } = this.props.navigation;
        this.setState({
            dialogLogoutVisible: false,
            showSpinner: true
        });
        firebase
            .auth()
            .signOut()
            .then(() => {
                this.setState({ showSpinner: false });
                navigate("Login");
            });
    };

    onClickCloseDialog = () => {
        this.setState({
            dialogLogoutVisible: false
        });
    };

    onClickCloseChangeProfileDialog = () => {
        this.setState({
            dialogChangeProfilePicture: false
        });
    };

    onClickCloseEditProfileDialog = () => {
        this.setState({
            dialogEditProfile: false
        });
    };

    onClickCloseActiveProfileDialog = () => {
        this.setState({
            dialogActiveProfile: false
        });
    };

    removeProfilePicture = () => {
        const { userId } = this.props.navigation.state.params;
        this.setState({
            profilePicture: "",
            dialogChangeProfilePicture: false
        });
        firebase
            .database()
            .ref("barbers")
            .child(userId)
            .update({ profilePicture: "" });
    };

    afterSave = rsp => {
        if (rsp.saved === true) {
            const { userId } = this.props.navigation.state.params;
            this.setState({
                isFetching: true,
                showSpinner: true
            });
            firebase
                .database()
                .ref("barbers")
                .child(userId)
                .once("value", snapshot => {
                    this.setState({
                        profilePicture: snapshot.val().profilePicture,
                        accountInfo: {
                            userId: userId,
                            reviews: snapshot.val().reviews,
                            accountActive: snapshot.val().active,
                            firstName: snapshot.val().firstName,
                            lastName: snapshot.val().lastName,
                            description: snapshot.val().description,
                            email: snapshot.val().email,
                            phoneNumber: snapshot.val().phoneNumber,
                            address: snapshot.val().address,
                            startAt: snapshot.val().startAt,
                            finishAt: snapshot.val().finishAt,
                            breakHour: snapshot.val().breakHour,
                            startHourValue: snapshot.val().startHourValue,
                            finishHourValue: snapshot.val().finishHourValue,
                            breakHourValue: snapshot.val().breakHourValue
                        },
                        isFetching: false,
                        showSpinner: false
                    });
                });
        }
    };

    editBarberProfile = () => {
        this.setState({
            dialogEditProfile: false
        });
        const { navigate } = this.props.navigation;
        navigate("EditBarberProfile", {
            accountInfo: this.state.accountInfo,
            afterSave: this.afterSave
        });
    };

    renderLogoutDialog = () => {
        return (
            <ConfirmDialog
                title="Sign out:"
                message="Are you sure about that?"
                visible={true}
                onTouchOutside={() =>
                    this.setState({ dialogLogoutVisible: false })
                }
                positiveButton={{
                    title: "YES",
                    onPress: () => this.onClickLogoutBtn()
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => this.onClickCloseDialog()
                }}
            />
        );
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
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.changeProfilePicture()}
                        >
                            <Text>Upload Photo</Text>
                        </TouchableOpacity>
                    </Button>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.removeProfilePicture()}
                        >
                            <Text>Remove Photo</Text>
                        </TouchableOpacity>
                    </Button>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() =>
                                this.onClickCloseChangeProfileDialog()
                            }
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </Button>
                </View>
            </Dialog>
        );
    };

    renderEditProfileDialog = () => {
        return (
            <Dialog
                visible={true}
                onTouchOutside={() =>
                    this.setState({ dialogEditProfile: false })
                }
                overlayStyle={
                    {
                        //backgroundColor: "rgba(52, 52, 52, 0.4)"
                    }
                }
                animationType={"slide"}
            >
                <View>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.editBarberProfile()}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity>
                    </Button>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.onClickCloseEditProfileDialog()}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </Button>
                </View>
            </Dialog>
        );
    };

    renderActiveProfileDialog = () => {
        return (
            <Dialog
                visible={true}
                onTouchOutside={() =>
                    this.setState({ dialogActiveProfile: false })
                }
                overlayStyle={
                    {
                        //backgroundColor: "rgba(52, 52, 52, 0.4)"
                    }
                }
                animationType={"slide"}
            >
                <View>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.handlePickerChange("active")}
                        >
                            <Text>Active</Text>
                        </TouchableOpacity>
                    </Button>
                    <Button transparent dark>
                        <TouchableOpacity
                            onPress={() => this.handlePickerChange("invisible")}
                        >
                            <Text>Invisible</Text>
                        </TouchableOpacity>
                    </Button>
                </View>
            </Dialog>
        );
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
                            profilePicture: url,
                            dialogChangeProfilePicture: false
                        });
                        firebase
                            .database()
                            .ref("barbers")
                            .child(uid)
                            .update({ profilePicture: url });
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

    onPressEditAccountInfo = () => {
        this.setState({
            profileInfoFormVisible: true
        });
    };

    onPressSaveAccountInfo = (firstName, lastName, description) => {
        const { userId } = this.props.navigation.state.params;
        firebase
            .database()
            .ref("barbers")
            .child(userId)
            .update({ description })
            .then(() => {
                if (firstName !== "" && lastName !== "") {
                    firebase
                        .database()
                        .ref("barbers")
                        .child(userId)
                        .update({ firstName, lastName })
                        .then(() => {
                            this.setState(prevState => {
                                return {
                                    profileInfoFormVisible: false,
                                    accountInfo: {
                                        ...prevState.accountInfo,
                                        firstName: firstName,
                                        lastName: lastName,
                                        description: description
                                    }
                                };
                            });
                        });
                }
            });
    };

    handleProfileInfoClick = () => {
        this.setState({
            dialogEditProfile: true
        });
    };

    handleActiveButtonClick = () => {
        this.setState({
            dialogActiveProfile: true
        });
    };

    handlePickerChange = value => {
        const { userId } = this.props.navigation.state.params;
        let active = value === "active" ? true : false;

        this.setState({
            accountInfo: {
                ...this.state.accountInfo,
                accountActive: active
            },
            dialogActiveProfile: false,
            showSpinner: true
        });

        firebase
            .database()
            .ref("barbers")
            .child(userId)
            .update({ active: active })
            .then(() => {
                this.setState({
                    showSpinner: false
                });
            });
    };

    render() {
        return this.state.showSpinner ? (
            <View style={styles.containerSpinner}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"dark-content"}
                />
                <ActivityIndicator
                    size={35}
                    color="rgb(209, 165, 71)"
                    animating={this.state.showSpinner}
                />
            </View>
        ) : (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"light-content"}
                />
                <ImageBackground
                    source={require("../../assets/images/barberBack.jpg")}
                    style={styles.header}
                />

                <TouchableOpacity
                    onPress={this.onPressChangeProfilePicture}
                    style={styles.profileContainer}
                >
                    {!this.state.isFetching ? (
                        <Image
                            source={
                                this.state.profilePicture === ""
                                    ? require("../../assets/images/barberDefaultProfile.jpg")
                                    : { uri: this.state.profilePicture }
                            }
                            style={styles.profilePicture}
                        />
                    ) : (
                        <Text />
                    )}
                    <View style={styles.accountActive}>
                        {!this.state.accountInfo.accountActive ? (
                            <Icon
                                name="stop-circle"
                                color={common.redColor}
                                size={20}
                            />
                        ) : (
                            <View style={styles.profileActiveGreen} />
                        )}
                    </View>
                </TouchableOpacity>

                <View style={styles.accountInformations}>
                    {!this.state.profileInfoFormVisible ? (
                        <View style={{ alignItems: "center", width: "60%" }}>
                            <Text style={styles.displayName}>
                                {this.state.accountInfo.firstName}{" "}
                                {this.state.accountInfo.lastName}
                            </Text>
                            <Text style={styles.description}>
                                {this.state.accountInfo.description !== ""
                                    ? this.state.accountInfo.description
                                    : "Tell what you're able to"}
                            </Text>
                        </View>
                    ) : (
                        <ProfileInfoForm
                            firstName={this.state.accountInfo.firstName}
                            lastName={this.state.accountInfo.lastName}
                            description={this.state.accountInfo.description}
                            handleSubmit={this.onPressSaveAccountInfo}
                        />
                    )}

                    {!this.state.profileInfoFormVisible ? (
                        <TouchableOpacity
                            onPress={this.onPressEditAccountInfo}
                            style={styles.editProfileBtn}
                        >
                            <IconEdit name="edit" size={25} color="#7d7d7d" />
                        </TouchableOpacity>
                    ) : (
                        <Text />
                    )}

                    <View>
                        {this.state.accountInfo.accountActive ? (
                            <Button
                                rounded
                                style={styles.activeBtn}
                                onPress={this.handleActiveButtonClick}
                            >
                                <Text style={{ color: "#000" }}>Active</Text>
                            </Button>
                        ) : (
                            <Button
                                rounded
                                style={styles.invisibleBtn}
                                onPress={this.handleActiveButtonClick}
                            >
                                <Text style={{ color: "#000" }}>Invisible</Text>
                            </Button>
                        )}
                    </View>
                </View>

                <ScrollView style={{ flex: 1, width: "100%" }}>
                    <Text
                        style={{
                            margin: 15,
                            marginTop: 20,
                            fontSize: 16,
                            fontWeight: "bold"
                        }}
                    >
                        PROFILE
                    </Text>
                    <ProfileInfo
                        accountInfo={this.state.accountInfo}
                        navigation={this.props.navigation}
                        handleProfileInfoClick={this.handleProfileInfoClick}
                    />
                    <Text
                        style={{
                            margin: 15,
                            marginTop: 20,
                            fontSize: 16,
                            fontWeight: "bold"
                        }}
                    >
                        APPOINTMENTS
                    </Text>
                    <ProfileBookingInfo
                        accountInfo={this.state.accountInfo}
                        navigation={this.props.navigation}
                        handleProfileInfoClick={this.handleProfileInfoClick}
                    />
                    <Text
                        style={{
                            margin: 15,
                            marginTop: 20,
                            fontSize: 16,
                            fontWeight: "bold"
                        }}
                    >
                        OTHER
                    </Text>
                    <View style={styles.profileInfoContainer}>
                        <View style={styles.labelContainer}>
                            <IconSettings
                                name="settings"
                                size={30}
                                color={common.darkColor}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: common.darkColor,
                                    paddingStart: 10
                                }}
                            >
                                Settings
                            </Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <IconArrow name="arrow-right" size={20} />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.profileInfoContainer}
                        onPress={this.onPressLogoutIcon}
                    >
                        <View style={styles.labelContainer}>
                            <IconSignOut
                                name="close"
                                size={30}
                                color={common.redColor}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: common.redColor,
                                    paddingStart: 10
                                }}
                            >
                                Sign out
                            </Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <IconArrow name="arrow-right" size={20} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                {this.state.dialogLogoutVisible ? (
                    this.renderLogoutDialog()
                ) : (
                    <Text />
                )}
                {this.state.dialogChangeProfilePicture ? (
                    this.renderChangeProfilePictureDialog()
                ) : (
                    <Text />
                )}
                {this.state.dialogEditProfile ? (
                    this.renderEditProfileDialog()
                ) : (
                    <Text />
                )}
                {this.state.dialogActiveProfile ? (
                    this.renderActiveProfileDialog()
                ) : (
                    <Text />
                )}
            </View>
        );
    }
}
