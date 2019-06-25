import { StyleSheet } from "react-native";
import common from "../core/common";

export default (styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    locationsAutocomplete: {
        position: "absolute",
        top: 90,
        width: "100%",
        height: 250,
        zIndex: 999,
        backgroundColor: common.whiteColor,
        borderColor: common.darkThemeYoutube,
        borderWidth: 1,
        alignItems: "center",
        borderRadius: 5
    },
    locationAutocompleteItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: common.darkThemeYoutube,
        width: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    locationsAutocompleteEmpty: {
        position: "absolute",
        top: 76,
        width: "90%",
        height: 50,
        zIndex: 999,
        backgroundColor: common.whiteColor,
        borderColor: common.primaryColor,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    }
}));
