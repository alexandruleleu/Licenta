import { actionTypes } from "./ActionsCustomerProfile";

export default function customerProfileReducer(
    state = {
        isFetchingSubscribe: false,
        subscribed: false,
        fcmToken: null
    },
    action
) {
    switch (action.type) {
        case actionTypes.REQUEST_ON_SUBSCRIBE:
            return {
                ...state,
                isFetchingSubscribe: true
            };
        case actionTypes.RECEIVE_ON_SUBSCRIBE:
            return {
                ...state,
                isFetchingSubscribe: false,
                subscribed: action.data,
                fcmToken: action.fcmToken
            };
        case actionTypes.REQUEST_ON_UNSUBSCRIBE:
            return {
                ...state,
                isFetchingSubscribe: true
            };
        case actionTypes.RECEIVE_ON_UNSUBSCRIBE:
            return {
                ...state,
                isFetchingSubscribe: false,
                subscribed: false,
                fcmToken: null
            };
        case actionTypes.REQUEST_CHECK_SUBSCRIPTION:
            return {
                ...state,
                isFetchingSubscribe: true
            };
        case actionTypes.RECEIVE_CHECK_SUBSCRIPTION:
            return {
                ...state,
                isFetchingSubscribe: false,
                subscribed: action.data,
                fcmToken: action.fcmToken
            };
        default:
            return state;
    }
}
