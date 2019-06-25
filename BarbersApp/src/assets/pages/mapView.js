import { StyleSheet, Dimensions } from "react-native";
import common from "../core/common";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 8;
const CARD_WIDTH = width - 50;

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    scrollView: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        paddingVertical: 5
    },
    endPadding: {
        paddingRight: 50
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: common.grayThemeYoutube,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardImage: {
        width: 65,
        height: 65,
        borderRadius: 50,
        borderWidth: 1,
        marginRight: 5,
        borderColor: common.whiteColor
    },
    textContent: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10
    },
    cardtitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: common.grayThemeYoutube,
        flexWrap: "wrap"
    },
    cardDescription: {
        fontSize: 14
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center"
    },
    marker: {
        width: 50,
        height: 50
    }
}));
