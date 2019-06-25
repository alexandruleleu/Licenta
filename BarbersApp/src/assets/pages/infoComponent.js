import { StyleSheet } from "react-native";
import common from "../core/common";

export default (styles = StyleSheet.create({
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ede8e8",
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        width: "90%",
        marginTop: 20,
        padding: 10
    },
    infoIcon: {
        padding: 5,
        borderRadius: 50,
        borderColor: common.primaryColor,
        borderWidth: 2,
        marginRight: 15
    },
    infoData: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 15,
        borderLeftWidth: 2,
        borderLeftColor: "#b6bbc4"
    }
}));
