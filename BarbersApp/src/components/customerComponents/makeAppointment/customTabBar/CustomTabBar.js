import React from "react";
import { ViewPropTypes, StyleSheet, Text, View, Animated } from "react-native";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import Button from "./Button";
import common from "../../../../assets/core/common";
import IconCircle from "react-native-vector-icons/FontAwesome";

const CustomTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style
    },

    getDefaultProps() {
        return {
            activeTextColor: common.darkColor,
            inactiveTextColor: common.darkThemeYoutube,
            backgroundColor: null
        };
    },

    renderTab(name, page, isTabActive, onPressHandler, pointColor) {
        const { activeTextColor, inactiveTextColor, textStyle } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? "bold" : "normal";
        const backgroundColor = isTabActive ? "#eaeaed" : null;
        return (
            <Button
                style={{ flex: 1 }}
                key={name}
                accessible={true}
                accessibilityLabel={name}
                accessibilityTraits="button"
                onPress={() => onPressHandler(page)}
            >
                <View
                    style={[
                        { backgroundColor: backgroundColor },
                        styles.tab,
                        this.props.tabStyle
                    ]}
                >
                    <Text
                        style={[
                            { color: textColor, fontWeight, fontSize: 12 },
                            textStyle
                        ]}
                    >
                        {name.split(" ")[0]}
                    </Text>
                    <Text
                        style={[
                            { color: textColor, fontWeight, fontSize: 18 },
                            textStyle
                        ]}
                    >
                        {name.split(" ")[1]}
                    </Text>
                    <View style={{ paddingTop: 8 }}>
                        <IconCircle name="circle" size={7} color={pointColor} />
                    </View>
                </View>
            </Button>
        );
    },

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: "absolute",
            width: containerWidth / numberOfTabs,
            height: 0,
            backgroundColor: "navy",
            bottom: 0
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs]
        });
        return (
            <View
                style={[
                    styles.tabs,
                    { backgroundColor: this.props.backgroundColor },
                    this.props.style
                ]}
            >
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    let pointColor =
                        page % 2 === 0 ? "#761596" : common.primaryColor;
                    return renderTab(
                        name,
                        page,
                        isTabActive,
                        this.props.goToPage,
                        pointColor
                    );
                })}
                <Animated.View
                    style={[
                        tabUnderlineStyle,
                        {
                            transform: [{ translateX }]
                        },
                        this.props.underlineStyle
                    ]}
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 8,
        paddingTop: 8,
        borderRadius: 5
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: "#ccc"
    }
});

module.exports = CustomTabBar;
