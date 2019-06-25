import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

class ProgressBar extends Component {
    static propTypes = {
        percentage: PropTypes.number.isRequired
    };

    barStyle = type => {
        const { percentage } = this.props;
        const complete = type === "complete";
        const backgroundColor = complete ? "#eeb264" : "#e6e7e8";
        const width = complete
            ? `${percentage * 100}%`
            : `${(1 - percentage) * 100}%`;

        return {
            backgroundColor,
            width,
            height: 4
        };
    };

    render() {
        return (
            <View style={{ flexDirection: "row", width: 300 }}>
                <View style={this.barStyle("complete")} />
                <View style={this.barStyle("incomplete")} />
            </View>
        );
    }
}

export default ProgressBar;
