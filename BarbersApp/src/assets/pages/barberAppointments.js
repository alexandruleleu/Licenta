import { StyleSheet } from "react-native";
import common from "../../assets/core/common";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: common.whiteColor
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        height: 70,
        alignItems: "center",
        justifyContent: "center"
    },
    logoutBtn: {
        backgroundColor: "rgb(209, 165, 71)",
        width: 250,
        height: 80,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        marginTop: 20
    },
    homeBarberCoverText: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    }
}));
