import { actionTypes } from "./ActionsSecondStep";

export default function barberWizardSecondStepReducer(
    state = {
        startHourValue: 0,
        finishHourValue: 0,
        breakHourValue: 0,
        startAt: "",
        finishAt: "",
        breakHour: ""
    },
    action
) {
    switch (action.type) {
        case actionTypes.SET_START_HOUR_VALUE:
            return {
                ...state,
                startHourValue: action.value
            };

        case actionTypes.SET_FINISH_HOUR_VALUE:
            return {
                ...state,
                finishHourValue: action.value
            };
        case actionTypes.SET_BREAK_HOUR_VALUE:
            return {
                ...state,
                breakHourValue: action.value
            };

        case actionTypes.SET_START_HOUR:
            return {
                ...state,
                startAt: action.value
            };

        case actionTypes.SET_FINISH_HOUR:
            return {
                ...state,
                finishAt: action.value
            };
        case actionTypes.SET_BREAK_HOUR:
            return {
                ...state,
                breakHour: action.value
            };
        default:
            return state;
    }
}
