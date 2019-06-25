import { actionTypes } from "./ActionsFirstStep";

export default function barberWizardSecondStepReducer(
    state = {
        phoneNumber: "",
        address: "",
        selectedLocationId: ""
    },
    action
) {
    switch (action.type) {
        case actionTypes.SET_PHONE_NUMBER:
            return {
                ...state,
                phoneNumber: action.value
            };

        case actionTypes.SET_ADDRESS:
            return {
                ...state,
                address: action.value
            };
        case actionTypes.SET_LOCATION_ID:
            return {
                ...state,
                address: action.address,
                selectedLocationId: action.locationId
            };
        default:
            return state;
    }
}
