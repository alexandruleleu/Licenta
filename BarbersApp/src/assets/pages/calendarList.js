import { StyleSheet } from "react-native";
import common from "../../assets/core/common";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: common.whiteColor
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: common.whiteColor
    },
    dateContainer: {
        width: "100%",
        backgroundColor: "#f1f6f4",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    detailedDate: {
        color: common.primaryColor,
        fontSize: 15
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: common.whiteColor
    },
    calendarListContainer: {
        flex: 1,
        backgroundColor: common.whiteColor
    },
    appointmentContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 5,
        paddingVertical: 10,
        borderColor: "#f1f6f4",
        backgroundColor: common.whiteColor,
        width: "100%"
    },
    iconContainer: {
        width: "15%",
        paddingLeft: 20
    },
    timeContainer: {
        width: "25%",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    mainContainer: {
        width: "60%"
    },
    noAppointmentsImg: {
        width: "50%",
        height: "50%"
    }
}));
