import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { List, ListItem } from "react-native-elements";

import common from "../../../assets/core/common";
import StarRating from "react-native-star-rating";
import IconNotFound from "react-native-vector-icons/MaterialCommunityIcons";
import IconInfo from "react-native-vector-icons/SimpleLineIcons";

//services
import firebase from "react-native-firebase";

class TopBarbers extends Component {
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
        this.getTop10Barbers();
    }

    componentWillUnmount() {
        this.setState({
            fetching: false,
            data: [],
            starCount: 5,
            notFoundVisible: false
        });
        firebase
            .database()
            .ref("barbers")
            .off("value");
    }

    getTop10Barbers = () => {
        this.setState({ fetching: true });
        firebase
            .database()
            .ref("barbers")
            .orderByChild("reviews", "desc")
            .limitToLast(10)
            .on("value", snapshot => {
                if (snapshot.val() !== null) {
                    this.setState({
                        data: this.snapshotToArray(snapshot).reverse(),
                        fetching: false,
                        notFoundVisible: false
                    });
                } else {
                    this.setState({
                        fetching: false,
                        notFoundVisible: true
                    });
                }
            });
    };

    snapshotToArray = snapshot => {
        let returnArr = [];

        snapshot.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.barberId = childSnapshot.key;

            returnArr.push(item);
        });

        return returnArr;
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

    renderSubtitle = (item, index) => {
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
                        starSize={18}
                        fullStarColor={"rgb(209, 165, 71)"}
                        containerStyle={{ width: 100 }}
                        rating={this.state.starCount}
                        selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                    <Text
                        style={{
                            marginLeft: 10,
                            fontSize: 16,
                            fontWeight: "600"
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
                        {item.address === ""
                            ? "-"
                            : item.address.length > 28
                            ? item.address.substr(0, 28).concat("...")
                            : item.address}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingRight: 33
                        }}
                    >
                        <IconInfo
                            active
                            name="info"
                            size={17}
                            color="#b2adad"
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "400",
                                color: "#000",
                                paddingLeft: 5
                            }}
                        >
                            {item.description !== ""
                                ? item.description
                                : "No description"}
                        </Text>
                    </View>
                </View>

                <View
                    style={{ position: "absolute", right: 12, paddingTop: 3 }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>
                        {index + 1}
                    </Text>
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
                                hideChevron
                                avatar={
                                    item.profilePicture === ""
                                        ? require("../../../assets/images/barberDefaultProfile.jpg")
                                        : { uri: item.profilePicture }
                                }
                                avatarStyle={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 70,
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
                            justifyContent: "center"
                        }}
                    >
                        <IconNotFound
                            active
                            name="map-search-outline"
                            size={80}
                            color="#878181"
                        />
                        <Text style={{ fontSize: 18 }}>Sorry!</Text>
                        <Text style={{ fontSize: 18 }}>
                            No results for this location
                        </Text>
                    </View>
                ) : (
                    <Text />
                )}
            </View>
        );
    }
}

export default TopBarbers;
