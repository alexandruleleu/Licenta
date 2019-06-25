import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { List, ListItem, Button } from "react-native-elements";

import common from "../../../assets/core/common";
import StarRating from "react-native-star-rating";
import IconNotFound from "react-native-vector-icons/MaterialCommunityIcons";
import IconLocationPin from "react-native-vector-icons/Entypo";
import IconTime from "react-native-vector-icons/MaterialIcons";

//services
import HomeCustomerService from "../../../services/homeCustomerServices/HomeCustomerService";
import firebase from "react-native-firebase";

class FavoriteBarbers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: false,
            data: [],
            starCount: 5,
            notFoundVisible: false
        };
    }

    componentDidMount() {
        this.getFavoriteBarbers();
    }

    afterReview = rsp => {
        if (rsp.modified) {
            this.getFavoriteBarbers();
        } else {
            console.log("nup");
        }
    };

    componentWillUnmount() {
        const { customerId } = this.props.userProfile.userId;
        this.setState({
            fetching: false,
            data: [],
            starCount: 5,
            notFoundVisible: false
        });
        firebase
            .database()
            .ref("customers")
            .child(customerId)
            .child("favorite_barbers")
            .off("value");
    }

    getFavoriteBarbers = () => {
        let customerId = this.props.userProfile.userId;
        let homeCustomerServices = new HomeCustomerService();
        this.setState({ fetching: true });

        firebase
            .database()
            .ref("customers")
            .child(customerId)
            .child("favorite_barbers")
            .on("value", snapshot => {
                homeCustomerServices.getFavoriteBarbers(snapshot).then(
                    rsp => {
                        this.setState({
                            data: rsp,
                            fetching: false,
                            notFoundVisible: false
                        });
                    },
                    err => {
                        console.log(err);
                        this.setState({
                            data: [],
                            fetching: false,
                            notFoundVisible: true
                        });
                    }
                );
            });
    };

    onPressListItem = barber => {
        let customerId = this.props.userProfile.userId;
        const { navigate } = this.props.navigation;
        navigate("ProfessionalDetails", {
            barber,
            customerId,
            afterReview: this.afterReview
        });
    };

    onStarRatingPress = rating => {
        this.setState({
            starCount: rating
        });
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "75%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "25%",
                    marginTop: 5,
                    marginBottom: 5
                }}
            />
        );
    };

    renderTitle = item => {
        const capitalize = s => {
            return s[0].toUpperCase() + s.slice(1);
        };

        return (
            <View>
                <Text
                    style={{
                        marginLeft: 30,
                        fontSize: 21,
                        fontWeight: "100",
                        color: "#000"
                    }}
                >{`${capitalize(item.firstName)} ${capitalize(
                    item.lastName
                )}`}</Text>
            </View>
        );
    };

    renderSubtitle = item => {
        return (
            <View>
                <View
                    style={{
                        marginLeft: 32,
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={15}
                        fullStarColor={"rgb(209, 165, 71)"}
                        containerStyle={{ width: 90 }}
                        rating={this.state.starCount}
                        selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                    <Text
                        style={{
                            marginLeft: 10,
                            fontSize: 14
                        }}
                    >
                        {item.reviews} reviews
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: 32,
                        flexDirection: "column",
                        alignItems: "flex-start"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "400",
                            color: "#000"
                        }}
                    >
                        {item.address}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <IconLocationPin
                            active
                            name="location-pin"
                            size={18}
                            color="#b2adad"
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "400",
                                color: "#000"
                            }}
                        >
                            16.2 km
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        marginLeft: 32,
                        marginTop: 8,
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <IconTime
                        active
                        name="access-time"
                        size={19}
                        color="#15912c"
                    />
                    <Text
                        style={{ marginLeft: 10, fontSize: 15, color: "#000" }}
                    >
                        {item.startAt} - {item.finishAt}
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: 20,
                        marginTop: 8,
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Button
                        title="Check Availability"
                        color={common.primaryColor}
                        buttonStyle={{
                            paddingLeft: 25,
                            paddingRight: 25,
                            height: 30,
                            borderColor: common.primaryColor,
                            borderWidth: 1,
                            borderRadius: 4,
                            backgroundColor: "transparent"
                        }}
                        onPress={() => this.onPressListItem(item)}
                    />
                </View>
            </View>
        );
    };

    render() {
        return this.state.fetching ? (
            <View
                style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    justifyContent: "center"
                }}
            >
                <ActivityIndicator
                    size={30}
                    color={common.primaryColor}
                    animating={this.state.fetching}
                />
            </View>
        ) : (
            <View
                style={{
                    backgroundColor: "#fff",
                    flex: 1
                }}
            >
                <List
                    containerStyle={{
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        marginTop: 0,
                        paddingBottom: 8
                    }}
                >
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item, index }) => (
                            <ListItem
                                avatar={
                                    item.profilePicture === ""
                                        ? require("../../../assets/images/barberDefaultProfile.jpg")
                                        : { uri: item.profilePicture }
                                }
                                avatarStyle={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 80,
                                    marginRight: 20
                                }}
                                title={this.renderTitle(item)}
                                subtitle={this.renderSubtitle(item, index)}
                                imageSize="100"
                                containerStyle={{
                                    borderBottomWidth: 0,
                                    paddingLeft: 35,
                                    justifyContent: "center",
                                    imageSize: "60"
                                }}
                            />
                        )}
                        keyExtractor={item => item.barberId}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </List>
                {this.state.notFoundVisible ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e0e0e0"
                        }}
                    >
                        <IconNotFound
                            active
                            name="heart-broken"
                            size={80}
                            color="#878181"
                        />
                        <Text style={{ fontSize: 18 }}>
                            No favorite barber yet!
                        </Text>
                    </View>
                ) : (
                    <Text />
                )}
            </View>
        );
    }
}

export default FavoriteBarbers;
