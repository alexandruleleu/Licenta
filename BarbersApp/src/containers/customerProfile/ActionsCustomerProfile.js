import firebase from "react-native-firebase";
export const actionTypes = {
    REQUEST_ON_SUBSCRIBE: "REQUEST_ON_SUBSCRIBE",
    RECEIVE_ON_SUBSCRIBE: "RECEIVE_ON_SUBSCRIBE",
    REQUEST_ON_UNSUBSCRIBE: "REQUEST_ON_UNSUBSCRIBE",
    RECEIVE_ON_UNSUBSCRIBE: "RECEIVE_ON_UNSUBSCRIBE",
    REQUEST_CHECK_SUBSCRIPTION: "REQUEST_CHECK_SUBSCRIPTION",
    RECEIVE_CHECK_SUBSCRIPTION: "RECEIVE_CHECK_SUBSCRIPTION"
};

export const requestOnSubscribe = () => {
    return {
        type: actionTypes.REQUEST_ON_SUBSCRIBE
    };
};

export const receiveOnSubscribe = (data, fcmToken) => {
    return {
        type: actionTypes.RECEIVE_ON_SUBSCRIBE,
        data: data,
        fcmToken
    };
};

export const requestOnUnsubscribe = () => {
    return {
        type: actionTypes.REQUEST_ON_UNSUBSCRIBE
    };
};

export const receiveOnUnsubscribe = () => {
    return {
        type: actionTypes.RECEIVE_ON_UNSUBSCRIBE
    };
};

export const clickSubscribe = userId => {
    return dispatch => {
        dispatch(requestOnSubscribe());
        const FIREBASE_MESSAGING = firebase.messaging();
        const FIREBASE_DATABASE = firebase.database();
        FIREBASE_MESSAGING.requestPermission()
            .then(() => {
                return FIREBASE_MESSAGING.getToken();
            })
            .then(token => {
                FIREBASE_DATABASE.ref("customers")
                    .child(userId)
                    .update({
                        subscribed: true,
                        fcmToken: token
                    })
                    .then(() => {
                        dispatch(receiveOnSubscribe(true, token));
                    });
            })
            .catch(() => {
                console.log("User didn't give permission...");
                dispatch(receiveOnSubscribe(false, null));
            });
    };
};

export const clickUnsubscribe = userId => {
    return dispatch => {
        dispatch(requestOnUnsubscribe());
        const FIREBASE_MESSAGING = firebase.messaging();
        const FIREBASE_DATABASE = firebase.database();
        FIREBASE_MESSAGING.getToken()
            .then(token => {
                FIREBASE_MESSAGING.deleteToken(token);
            })
            .then(() => {
                FIREBASE_DATABASE.ref("customers")
                    .child(userId)
                    .update({
                        subscribed: false,
                        fcmToken: ""
                    })
                    .then(() => {
                        dispatch(receiveOnUnsubscribe());
                    });
            });
    };
};

export const checkSubscription = userId => {
    return dispatch => {
        dispatch({
            type: actionTypes.REQUEST_CHECK_SUBSCRIPTION
        });
        const FIREBASE_DATABASE = firebase.database();
        const ref = FIREBASE_DATABASE.ref("customers").child(userId);
        ref.once("value", snapshot => {
            dispatch({
                type: actionTypes.RECEIVE_CHECK_SUBSCRIPTION,
                data: snapshot.val().subscribed
                    ? snapshot.val().subscribed
                    : false,
                fcmToken: snapshot.val().fcmToken ? snapshot.val().fcmToken : ""
            });
        });
    };
};
