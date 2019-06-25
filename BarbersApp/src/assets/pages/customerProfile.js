import { StyleSheet } from "react-native";
import common from "../../assets/core/common";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start"
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        backgroundColor: common.darkThemeYoutube,
        height: 70,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 6
    },
    profilePicture: {
        width: 38,
        height: 38,
        borderRadius: 50
    },
    appointmentCover: {
        height: 120,
        alignItems: "center",
        justifyContent: "center"
    },
    appointmentCoverText: {
        flexDirection: "row",
        alignItems: "center"
    }
}));
