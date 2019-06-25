import firebase from "react-native-firebase";

export default class LoginPageService {
    constructor(userId) {
        this.userId = userId;
    }

    getAccountType = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("customers")
                .child(this.userId)
                .once("value", snapshot => {
                    if (snapshot.val() !== null) {
                        resolve("customers");
                    } else {
                        resolve("barbers");
                    }
                });
        });
    };

    getFirstLoginValue = () => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .child(this.userId)
                .once("value", snapshot => {
                    resolve(snapshot.val().firstLogin);
                });
        });
    };
}
