import React, { Component } from "react";
import {
    View,
    Text,
    ImageBackground,
    ActivityIndicator,
    StatusBar
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Button } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";

//styles
import styles from "../../../assets/pages/loginStyles";
import { MyButton } from "../../../components/Button";

//loginWithFb
import FBSDK from "react-native-fbsdk";
import firebase from "react-native-firebase";
import SignUpForm from "../../../components/barbersComponents/loginFlow/SignUpForm";
import LoginForm from "../../../components/barbersComponents/loginFlow/LoginForm";
import LoginPageService from "../../../services/loginPageServices/LoginPageService";

const { LoginManager, AccessToken } = FBSDK;
EStyleSheet.build();

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstStepVisibility: true,
            secondStepChoice: "",
            registerVisibility: false,
            loginWithEmailAndPassword: true,
            showSpinner: true
        };
    }

    componentDidMount() {
        const { navigate } = this.props.navigation;
        const firebaseAuth = firebase.auth();

        firebaseAuth.onAuthStateChanged(auth => {
            let currentUser = firebaseAuth.currentUser;
            let signInProvider = "";

            if (currentUser != null) {
                currentUser.providerData.forEach(function(profile) {
                    signInProvider = profile.providerId;
                });
            }

            if (signInProvider === "facebook.com") {
                let userId = auth.uid;
                let name = auth.displayName;
                let email = auth.email;
                let profilePicture = auth.photoURL;
                navigate("HomeCustomerTabs", {
                    userId,
                    name,
                    email,
                    profilePicture
                });
            }

            if (
                signInProvider === "password" &&
                this.state.loginWithEmailAndPassword === true
            ) {
                new LoginPageService(auth.uid)
                    .getAccountType()
                    .then(userType => {
                        if (userType === "customers") {
                            let userId = auth.uid;
                            let displayName = auth.displayName;
                            let email = auth.email;

                            navigate("HomeCustomerTabs", {
                                userId,
                                displayName,
                                email
                            });
                        } else {
                            let userId = auth.uid;
                            let displayName = auth.displayName;
                            let email = auth.email;

                            new LoginPageService(userId)
                                .getFirstLoginValue()
                                .then(firstLogin => {
                                    if (firstLogin) {
                                        navigate("BarberFirstLogin", {
                                            userId,
                                            displayName,
                                            email
                                        });
                                    } else {
                                        navigate("HomeBarberTabs", {
                                            userId,
                                            displayName,
                                            email
                                        });
                                    }
                                });
                        }
                    });
            } else {
                this.setState({ showSpinner: false });
            }
        });
    }

    onClickCustomerBtn = () => {
        setTimeout(() => {
            this.setState(() => ({
                firstStepVisibility: false,
                secondStepChoice: "customer"
            }));
        }, 100);
    };

    onClickBarberBtn = () => {
        setTimeout(() => {
            this.setState(() => ({
                firstStepVisibility: false,
                secondStepChoice: "barber"
            }));
        }, 100);
    };

    //facebook login
    onClickFacebookBtn = () => {
        this.setState({ showSpinner: true });
        LoginManager.logInWithReadPermissions([
            "public_profile",
            "user_birthday",
            "email",
            "user_photos",
            "user_hometown",
            "user_location"
        ]).then(
            accessTokenRsp => this.handleLoginFlow(accessTokenRsp),
            err => {
                console.log("An error occured: " + err);
            }
        );
    };

    handleLoginFlow = result => {
        if (result.isCancelled) {
            console.log("Login cancelled");
            this.setState({ showSpinner: false });
        } else {
            AccessToken.getCurrentAccessToken().then(data => {
                const token = data.accessToken;
                fetch(
                    "https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name,gender,birthday&access_token=" +
                        token
                )
                    .then(response => response.json())
                    .then(json => {
                        const imageSize = 300;
                        const facebookID = json.id;
                        const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`;
                        this.authenticate(data.accessToken).then(
                            result => {
                                const { additionalUserInfo, user } = result;
                                const uid = user.uid;
                                const email = additionalUserInfo.profile.email;
                                const name = additionalUserInfo.profile.name;
                                const location =
                                    additionalUserInfo.profile.location;
                                this.createUser(
                                    json,
                                    name,
                                    uid,
                                    token,
                                    email,
                                    location,
                                    fbImage
                                );
                            },
                            err => {
                                console.log(err);
                            }
                        );
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        }
    };

    authenticate = token => {
        const provider = firebase.auth.FacebookAuthProvider;
        const credential = provider.credential(token);
        let ret = firebase.auth().signInWithCredential(credential);
        return ret;
    };

    createUser = (
        userData,
        name,
        uid,
        token,
        email,
        location,
        profile_picture
    ) => {
        const defaults = {
            uid,
            name,
            token,
            email,
            location,
            profile_picture
        };
        firebase
            .database()
            .ref("customers")
            .child(uid)
            .update({ ...userData, ...defaults });
        this.setState({ firstStepVisibility: true });
    };

    //back buttons
    onClickBackCustomer = () => {
        this.setState(() => ({
            firstStepVisibility: true,
            secondStepChoice: ""
        }));
    };

    onClickBackBarber = () => {
        this.setState(() => ({
            firstStepVisibility: true,
            secondStepChoice: ""
        }));
    };

    onClickBackRegister = () => {
        this.setState(() => ({
            registerVisibility: false
        }));
    };

    onClickCreateNewAcc = () => {
        this.setState(() => ({
            registerVisibility: true
        }));
    };

    //register new customer
    onClickRegisterCustomer = (firstName, lastName, email, password) => {
        this.setState({
            showSpinner: true,
            loginWithEmailAndPassword: false
        });
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .then(rsp => {
                //update auth profile
                let currentUser = auth.currentUser;
                currentUser.updateProfile({
                    displayName: firstName.concat(" ", lastName)
                });

                const { user } = rsp;
                let userId = user.uid;
                let email = user.email;
                this.createCustomerAccount(userId, firstName, lastName, email);
                const message = "Your account it was successfully registered!";
                this.dropdown.alertWithType("success", "Success", message);
                this.setState({
                    showSpinner: false,
                    registerVisibility: false,
                    loginWithEmailAndPassword: true
                });
            })
            .catch(err => {
                this.setState({
                    showSpinner: false
                });
                console.log(err);
                const error =
                    "This email address is already in use by another account.";
                this.dropdown.alertWithType("error", "Error", error);
            });
    };

    createCustomerAccount = (uid, firstName, lastName, email) => {
        const defaults = {
            active: false,
            first_name: firstName,
            last_name: lastName,
            email,
            profile_picture: "",
            favorite_barbers: []
        };
        firebase
            .database()
            .ref("customers")
            .child(uid)
            .update({ ...defaults });
    };

    //register new barber
    onClickRegisterBarber = (firstName, lastName, email, password) => {
        this.setState({
            showSpinner: true,
            loginWithEmailAndPassword: false
        });
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .then(rsp => {
                //update auth profile
                let currentUser = auth.currentUser;
                currentUser.updateProfile({
                    displayName: firstName.concat(" ", lastName)
                });

                const { user } = rsp;
                let userId = user.uid;
                let email = user.email;
                this.createBarberAccount(userId, firstName, lastName, email);
                const message = "Your account it was successfully registered!";
                this.dropdown.alertWithType("success", "Success", message);
                this.setState({
                    showSpinner: false,
                    registerVisibility: false,
                    loginWithEmailAndPassword: true
                });
            })
            .catch(err => {
                this.setState({
                    showSpinner: false
                });
                console.log(err);
                const error =
                    "This email address is already in use by another account.";
                this.dropdown.alertWithType("error", "Error", error);
            });
    };

    createBarberAccount = (uid, firstName, lastName, email) => {
        const defaults = {
            firstLogin: true,
            active: false,
            reviews: 0,
            firstName,
            lastName,
            email,
            profilePicture: "",
            description: "",
            phoneNumber: "",
            address: "",
            startAt: "",
            finishAt: "",
            breakHour: "",
            startHourValue: 0,
            finishHourValue: 0,
            breakHourValue: 0
        };
        firebase
            .database()
            .ref("barbers")
            .child(uid)
            .update({ ...defaults });
    };

    //login customer
    onClickLoginCustomer = (email, password) => {
        const { navigate } = this.props.navigation;
        this.setState({
            showSpinner: true
        });
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise
            .then(rsp => {
                const { user } = rsp;
                let userId = user.uid;
                let email = user.email;
                let displayName = user.displayName;

                this.setState({
                    firstStepVisibility: true,
                    secondStepChoice: "",
                    registerVisibility: false
                });

                navigate("HomeCustomerTabs", {
                    userId,
                    displayName,
                    email
                });
            })
            .catch(err => {
                this.setState({
                    showSpinner: false,
                    loginWithEmailAndPassword: false
                });
                console.log(err);
                const error = "Email or password are wrong!";
                this.dropdown.alertWithType("error", "Error", error);
            });
    };

    //login barber
    onClickLoginBarber = (email, password) => {
        const { navigate } = this.props.navigation;
        this.setState({
            showSpinner: true
        });
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise
            .then(rsp => {
                const { user } = rsp;
                let userId = user.uid;
                let email = user.email;
                let displayName = user.displayName;
                let firstLogin = true;

                firebase
                    .database()
                    .ref("barbers")
                    .child(userId)
                    .once("value", snapshot => {
                        firstLogin = snapshot.val().firstLogin;
                    })
                    .then(() => {
                        this.setState({
                            firstStepVisibility: true,
                            secondStepChoice: "",
                            registerVisibility: false
                        });
                        if (firstLogin) {
                            navigate("BarberFirstLogin", {
                                userId,
                                displayName,
                                email
                            });
                        } else {
                            navigate("HomeBarberTabs", {
                                userId,
                                displayName,
                                email
                            });
                        }
                    });
            })
            .catch(err => {
                this.setState({
                    showSpinner: false,
                    loginWithEmailAndPassword: false
                });
                console.log(err);
                const error = "Email or password are wrong!";
                this.dropdown.alertWithType("error", "Error", error);
            });
    };

    renderFirstStep = () => {
        return (
            <View style={styles.constainerFirstStep}>
                <Text style={styles.title}>Please select:</Text>
                <Button
                    large
                    icon={{ name: "users", type: "entypo" }}
                    title="CONSUMER"
                    buttonStyle={styles.consumerBtn}
                    onPress={this.onClickCustomerBtn}
                />
                <Text style={styles.body}>─────── or ───────</Text>
                <MyButton
                    text="PROFESSIONAL"
                    subtext="Barbers and Barbershops"
                    onPress={this.onClickBarberBtn}
                />
            </View>
        );
    };

    renderSecondStep = () => {
        if (this.state.secondStepChoice === "customer") {
            return (
                <View style={styles.constainerSecondStep}>
                    {this.state.registerVisibility ? (
                        <View>
                            <SignUpForm
                                handleSubmit={this.onClickRegisterCustomer}
                            />
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={styles.backSecondStep}
                                    onPress={this.onClickBackRegister}
                                >
                                    ───── back ─────
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <LoginForm
                                handleSubmit={this.onClickLoginCustomer}
                            />
                            <View style={styles.containerLoginButtons}>
                                <Button
                                    title="CREATE NEW ACCOUNT"
                                    buttonStyle={styles.buttonCreateNewAcc}
                                    onPress={this.onClickCreateNewAcc}
                                />
                                <Text style={styles.orSecondStep}>
                                    ───── or ─────
                                </Text>
                                <Button
                                    medium
                                    icon={{
                                        name: "facebook",
                                        type: "font-awesome"
                                    }}
                                    title="LOGIN WITH FACEBOOK"
                                    buttonStyle={styles.facebookBtn}
                                    onPress={this.onClickFacebookBtn}
                                />
                                <Text
                                    style={styles.backSecondStep}
                                    onPress={this.onClickBackCustomer}
                                >
                                    ───── back ─────
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            );
        }

        if (this.state.secondStepChoice === "barber") {
            return (
                <View style={styles.secondStepBarbers}>
                    {this.state.registerVisibility ? (
                        <View>
                            <SignUpForm
                                handleSubmit={this.onClickRegisterBarber}
                            />
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={styles.backSecondStep}
                                    onPress={this.onClickBackRegister}
                                >
                                    ───── back ─────
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <LoginForm handleSubmit={this.onClickLoginBarber} />
                            <View style={styles.containerLoginButtons}>
                                <Button
                                    title="CREATE NEW ACCOUNT"
                                    buttonStyle={styles.buttonCreateNewAcc}
                                    onPress={this.onClickCreateNewAcc}
                                />
                                <Text
                                    style={styles.backSecondStep}
                                    onPress={this.onClickBackBarber}
                                >
                                    ───── back ─────
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            );
        }
    };

    render() {
        return this.state.showSpinner ? (
            <ImageBackground
                source={require("../../../assets/images/loginBackground.jpg")}
                style={styles.containerLoading}
            >
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
            </ImageBackground>
        ) : (
            <ImageBackground
                source={require("../../../assets/images/loginBackground.jpg")}
                style={styles.container}
            >
                <StatusBar
                    translucent={true}
                    backgroundColor={"transparent"}
                    barStyle={"dark-content"}
                />
                {this.state.firstStepVisibility
                    ? this.renderFirstStep()
                    : this.renderSecondStep()}
                <DropdownAlert
                    closeInterval={4000}
                    translucent={true}
                    updateStatusBar={false}
                    showCancel={true}
                    ref={ref => (this.dropdown = ref)}
                />
            </ImageBackground>
        );
    }
}

export default LoginComponent;
