import React, { Component } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import IconCircle from "react-native-vector-icons/FontAwesome";

//styles
import styles from "../../../../assets/pages/serviceComponent";
import common from "../../../../assets/core/common";

export default class ServiceComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            color,
            serviceName,
            time,
            price,
            active,
            handlePressBook
        } = this.props;
        return (
            <View style={styles.serviceContainer}>
                <View style={styles.infoContainer}>
                    <View style={{ paddingTop: 8 }}>
                        <IconCircle name="circle" size={9} color={color} />
                    </View>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={styles.serviceName}>{serviceName}</Text>
                        <Text style={styles.timeAndPrice}>
                            {time} min , ${price}
                        </Text>
                    </View>
                </View>
                <Button
                    title="BOOK"
                    color={common.whiteColor}
                    buttonStyle={styles.bookBtn}
                    disabled={!active}
                    onPress={() => handlePressBook(time, price, serviceName)}
                />
            </View>
        );
    }
}
