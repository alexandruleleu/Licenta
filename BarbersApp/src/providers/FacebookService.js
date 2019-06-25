import firebase from "react-native-firebase";
import FBSDK from "react-native-fbsdk";

const { AccessToken } = FBSDK;

class FacebookService {
    constructor() {}

    handleLoginFlow = result => {
        if (result.isCancelled) {
            console.log("Login cancelled");
        } else {
            AccessToken.getCurrentAccessToken().then(data => {
                const token = data.accessToken;
                fetch(
                    "https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name,gender,birthday&access_token=" +
                        token
                )
                    .then(response => response.json())
                    .then(json => {
                        const imageSize = 120;
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
    };
}

export const facebookService = new FacebookService();
