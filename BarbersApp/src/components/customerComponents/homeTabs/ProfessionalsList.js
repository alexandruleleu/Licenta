import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Text, Image } from "react-native";
import { List, ListItem, Button } from "react-native-elements";

import common from "../../../assets/core/common";
import StarRating from "react-native-star-rating";
import IconLocationPin from "react-native-vector-icons/Entypo";
import IconTime from "react-native-vector-icons/MaterialIcons";

//services
import HomeCustomerService from "../../../services/homeCustomerServices/HomeCustomerService";

class ProfessionalsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: false,
            data: [],
            filteredData: [],
            starCount: 5,
            notFoundVisible: false
        };

        this.homeCustomerService = new HomeCustomerService(this.props.userId);
    }

    componentDidMount() {
        this.getAllBarbers();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.searchDistanceField !== this.props.searchDistanceField) {
            this.setState({
                fetching: true
            });
            setTimeout(() => {
                const filteredData = this.homeCustomerService.filterProfessionals(
                    this.state.data,
                    this.props.searchNameField,
                    this.props.searchDistanceField
                );
                const filteredDataForMapView = this.homeCustomerService.filterProfessionals(
                    this.state.data,
                    "",
                    this.props.searchDistanceField
                );
                this.setState({
                    fetching: false,
                    filteredData: filteredData,
                    notFoundVisible: filteredData.length > 0 ? false : true
                });
                this.props.handleFilteredData(filteredDataForMapView);
            }, 0);
        }
        if (prevProps.searchNameField !== this.props.searchNameField) {
            const filteredData = this.homeCustomerService.filterProfessionals(
                this.state.data,
                this.props.searchNameField,
                this.props.searchDistanceField
            );
            this.setState({
                filteredData: filteredData,
                notFoundVisible: filteredData.length > 0 ? false : true
            });
        }
    }

    afterReview = rsp => {
        if (rsp.modified) {
            this.getAllBarbers();
        } else {
            console.log("nup");
        }
    };

    getAllBarbers = () => {
        const currentPosition = {
            currentLatitude: this.props.currentLatitude,
            currentLongitude: this.props.currentLongitude
        };
        this.setState({ fetching: true });
        this.homeCustomerService.getAllBarbers().then(
            rsp => {
                const enhancedData = this.homeCustomerService.addBarberDistanceField(
                    rsp,
                    currentPosition
                );
                const filteredData = this.homeCustomerService.filterProfessionals(
                    enhancedData,
                    "",
                    50
                );
                this.setState({
                    data: enhancedData,
                    filteredData: filteredData,
                    fetching: false,
                    notFoundVisible: filteredData.length > 0 ? false : true
                });
                this.props.handleFilteredData(filteredData);
            },
            err => {
                console.log(err);
                this.setState({
                    fetching: false,
                    notFoundVisible: true
                });
            }
        );
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

    displayDistance = distance => {
        const roundedDist = Math.round(distance * 100) / 100;
        return roundedDist.toString().concat(" km");
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
                            {this.displayDistance(item.distance)}
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
                        data={this.state.filteredData}
                        renderItem={({ item }) => (
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
                                subtitle={this.renderSubtitle(item)}
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
                        <Image
                            source={require("../../../assets/images/empty.png")}
                            style={{
                                width: "45%",
                                height: "45%"
                            }}
                        />
                        <Text style={{ fontSize: 18 }}>Sorry!</Text>
                        <Text style={{ fontSize: 18 }}>
                            No results around your location
                        </Text>
                    </View>
                ) : (
                    <Text />
                )}
            </View>
        );
    }
}

export default ProfessionalsList;
