import { StyleSheet } from "react-native";
import common from "../core/common";

export default (styles = StyleSheet.create({
    serviceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingLeft: 18,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 0.7,
        borderBottomColor: "#b6bbc4"
    },
    infoContainer: { flexDirection: "row", alignItems: "flex-start" },
    serviceName: { color: common.darkColor, fontSize: 18 },
    timeAndPrice: { fontSize: 16 },
    bookBtn: {
        width: 100,
        height: 35,
        borderColor: common.primaryColor,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: common.primaryColor
    }
}));
