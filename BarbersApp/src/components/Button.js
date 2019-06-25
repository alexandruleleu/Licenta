import React from "react";
import { View, TouchableNativeFeedback, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
    $buttonColor: "rgb(14, 14, 15)",
    $buttonTextColor: "#ffffff",
    $buttonUnderlayColor: "#fff",
    button: {
        marginTop: 25,
        backgroundColor: "$buttonColor",
        width: 260,
        height: 70,
        borderColor: "#FFF",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 20,
        flexDirection: "row"
    },
    iconContainer: {
        width: "28%",
        fontSize: 30,
        color: "#FFF",
        textAlignVertical: "center",
        textAlign: "center"
    },
    textContainer: {
        textAlignVertical: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 18,
        color: "$buttonTextColor"
    },
    subtitle: {
        fontSize: 14,
        color: "$buttonTextColor"
    }
});

export const MyButton = ({ text, subtext, onPress }) => {
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            background={TouchableNativeFeedback.Ripple(
                styles.$buttonUnderlayColor
            )}
        >
            <View style={styles.button}>
                <Icon style={styles.iconContainer} name="cut" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{text}</Text>
                    <Text style={styles.subtitle}>{subtext}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};
