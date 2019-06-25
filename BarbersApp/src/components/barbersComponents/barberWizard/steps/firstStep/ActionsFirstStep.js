export const actionTypes = {
    SET_PHONE_NUMBER: "SET_PHONE_NUMBER",
    SET_ADDRESS: "SET_ADDRESS",
    SET_LOCATION_ID: "SET_LOCATION_ID"
};

export const setPhoneNumber = phoneNumber => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_PHONE_NUMBER,
            value: phoneNumber
        });
    };
};

export const setAddress = address => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_ADDRESS,
            value: address
        });
    };
};

export const setLocationId = (locationId, address) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_LOCATION_ID,
            locationId: locationId,
            address: address
        });
    };
};
