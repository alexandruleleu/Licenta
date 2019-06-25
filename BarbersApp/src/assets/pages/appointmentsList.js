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
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ede8e8",
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        width: "95%",
        marginTop: 20
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        height: "100%",
        borderRightWidth: 1.5,
        borderRightColor: "#ede8e8"
    },
    mainContainer: {
        flex: 1,
        flexDirection: "column"
    },
    dataContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: "#ede8e8"
    },
    statusContainer: { flexDirection: "row", alignItems: "center" },
    customerContainer: { flexDirection: "row", alignItems: "center" },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    actionContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 10
    },
    serviceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    profilePicture: {
        width: 25,
        height: 25,
        borderRadius: 50,
        borderWidth: 1,
        marginRight: 5,
        borderColor: common.whiteColor
    },
    breakContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: common.redColor,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        width: "95%",
        marginTop: 20
    },
    messageContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 34
    }
}));
