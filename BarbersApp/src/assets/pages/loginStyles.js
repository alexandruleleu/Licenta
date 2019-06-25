import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    containerLoading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    constainerFirstStep: {
        alignItems: "center"
    },
    constainerSecondStep: {
        //alignItems: "center"
    },
    title: {
        fontSize: 18,
        color: "#FFF",
        textAlign: "center"
    },
    consumerBtn: {
        backgroundColor: "rgb(209, 165, 71)",
        width: 260,
        height: 65,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 8,
        marginTop: 20
    },
    facebookBtn: {
        backgroundColor: "#03A9F4",
        width: 240,
        height: 50,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 8
    },
    googleBtn: {
        backgroundColor: "#FFF",
        width: 260,
        height: 60,
        borderColor: "rgb(14, 14, 15)",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 25
    },
    body: {
        fontSize: 18,
        color: "#FFF",
        textAlign: "center",
        marginTop: 20
    },
    backSecondStep: {
        fontSize: 18,
        color: "#FFF",
        marginTop: 20
    },
    orSecondStep: {
        fontSize: 18,
        color: "#FFF",
        marginTop: 20,
        marginBottom: 20
    },
    containerLoginButtons: {
        alignItems: "center"
    },
    buttonCreateNewAcc: {
        backgroundColor: "rgb(14, 14, 15)",
        borderColor: "#FFF",
        width: 300,
        height: 60,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 20
    },
    secondStepBarbers: {
        //width: "95%"
    },
    buttonLoginBarber: {
        backgroundColor: "rgb(209, 165, 71)",
        borderColor: "transparent",
        width: 300,
        height: 60,
        borderWidth: 0,
        borderRadius: 8,
        marginTop: 20
    },
    buttonRegisterBarber: {
        backgroundColor: "rgb(209, 165, 71)",
        borderColor: "transparent",
        width: 300,
        height: 60,
        borderWidth: 0,
        borderRadius: 8,
        marginTop: 20
    }
}));
