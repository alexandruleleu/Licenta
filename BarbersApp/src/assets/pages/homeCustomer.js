import { StyleSheet } from "react-native";
import common from "../core/common";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: common.darkThemeYoutube
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: common.whiteColor
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
    searchContainer: {
        alignItems: "center"
    }
}));
