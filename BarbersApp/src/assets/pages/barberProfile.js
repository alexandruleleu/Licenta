import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    containerSpinner: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 120
    },
    profileContainer: {
        height: 100,
        width: 100,
        overflow: "hidden",
        marginTop: 60
    },
    profilePicture: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 3
    },
    logoutIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#000",
        paddingRight: 5,
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 2,
        borderRadius: 7
    },
    accountActive: {
        position: "absolute",
        bottom: 11,
        right: 4,
        backgroundColor: "#fff",
        borderRadius: 50
    },
    profileActiveGreen: {
        width: 18,
        height: 18,
        borderColor: "#fff",
        borderWidth: 1,
        position: "absolute",
        borderRadius: 50,
        bottom: 3,
        right: -3,
        backgroundColor: "#4ac10f"
    },
    accountInformations: {
        position: "relative",
        alignItems: "center",
        width: "100%",
        borderBottomColor: "#b6bbc4",
        borderBottomWidth: 1,
        paddingBottom: 15
    },
    invisibleBtn: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#f6f6f6",
        color: "#000",
        borderColor: "#e02d1d",
        borderWidth: 1
    },
    activeBtn: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#f6f6f6",
        color: "#000",
        borderColor: "#4ac10f",
        borderWidth: 1
    },
    editProfileBtn: {
        position: "absolute",
        top: 16,
        right: 15
    },
    displayName: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    },
    description: {
        fontSize: 16,
        marginTop: 5,
        textAlign: "center"
    },
    profileInfoContainer: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#b6bbc4",
        padding: 15
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
}));
