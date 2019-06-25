import firebase from "react-native-firebase";

export default class FirstLoginService {
    constructor(userId, payload) {
        this.userId = userId;
        this.payload = payload;
    }

    addBarberInfoAndWorkAvailability() {
        return firebase
            .database()
            .ref("barbers")
            .child(this.userId)
            .update({ ...this.payload });
    }
}
