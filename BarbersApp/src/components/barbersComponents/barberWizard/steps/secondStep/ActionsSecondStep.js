export const actionTypes = {
    SET_START_HOUR_VALUE: "SET_START_HOUR_VALUE",
    SET_FINISH_HOUR_VALUE: "SET_FINISH_HOUR_VALUE",
    SET_BREAK_HOUR_VALUE: "SET_BREAK_HOUR_VALUE",
    SET_START_HOUR: "SET_START_HOUR",
    SET_FINISH_HOUR: "SET_FINISH_HOUR",
    SET_BREAK_HOUR: "SET_BREAK_HOUR"
};

export const setStartHourValue = startHourValue => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_START_HOUR_VALUE,
            value: startHourValue
        });
    };
};

export const setFinishHourValue = finishHourValue => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_FINISH_HOUR_VALUE,
            value: finishHourValue
        });
    };
};

export const setBreakHourValue = breakHourValue => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_BREAK_HOUR_VALUE,
            value: breakHourValue
        });
    };
};

export const setStartHour = startAt => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_START_HOUR,
            value: startAt
        });
    };
};

export const setFinishHour = finishAt => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_FINISH_HOUR,
            value: finishAt
        });
    };
};

export const setBreakHour = breakHour => {
    return dispatch => {
        dispatch({
            type: actionTypes.SET_BREAK_HOUR,
            value: breakHour
        });
    };
};
