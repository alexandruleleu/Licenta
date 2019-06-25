import { StyleSheet } from "react-native";
import common from "../../assets/core/common";

export default (styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
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
    locationsAutocomplete: {
        position: "absolute",
        top: 76,
        width: "90%",
        height: 280,
        zIndex: 999,
        backgroundColor: common.whiteColor,
        borderColor: common.primaryColor,
        borderWidth: 1,
        alignItems: "center",
        borderRadius: 5
    },
    locationAutocompleteItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: common.primaryColor,
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
