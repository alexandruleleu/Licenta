import React, { Component } from "react";
import { View, Text } from "react-native";

//styles
import styles from "../../../../assets/pages/infoComponent";
import common from "../../../../assets/core/common";

export default class InfoComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { icon, info } = this.props;
        return (
            <View style={styles.infoContainer}>
                <View style={styles.infoIcon}>{icon}</View>
                <View style={styles.infoData}>
                    <Text
                        style={{
                            flex: 1,
                            flexWrap: "wrap",
                            fontSize: 17
                        }}
                    >
                        {info}
                    </Text>
                </View>
            </View>
        );
    }
}
