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
    appointmentContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1.5,
        borderBottomColor: "#ede8e8"
    },
    serviceContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dateContainer: {
        paddingVertical: 3
    },
    barberContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 10
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: common.whiteColor
    }
}));
