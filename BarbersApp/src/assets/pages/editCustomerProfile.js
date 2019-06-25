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
    buttonSave: {
        backgroundColor: "rgb(209, 165, 71)",
        borderColor: "transparent",
        width: 320,
        height: 50,
        borderWidth: 0,
        borderRadius: 8,
        marginTop: 20
    },
    editContainer: {
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#ede8e8",
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        width: "88%",
        padding: 20
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: common.whiteColor
    },
    profileContainer: {
        height: 120,
        width: 120,
        borderRadius: 60,
        overflow: "hidden"
    },
    dialogItemBtn: {
        backgroundColor: common.whiteColor,
        borderColor: "transparent"
    }
}));
