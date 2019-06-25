import React, { Component, Fragment } from "react";
import { View, TouchableOpacity } from "react-native";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Form, Item, Input, Text } from "native-base";
import { Field, reduxForm } from "redux-form";
import IconSearch from "react-native-vector-icons/EvilIcons";
import IconArrow from "react-native-vector-icons/SimpleLineIcons";
import Slider from "@react-native-community/slider";
import { Button } from "react-native-elements";

//styles
import common from "../../../assets/core/common";

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderVisible: false,
            value: 50,
            max: 200,
            min: 3
        };
    }

    onChangeNameInput = value => {
        this.props.handleChangeNameInput(value);
    };

    renderSearchByNameInput = field => {
        return (
            <Item
                regular
                style={{
                    height: 55,
                    padding: 6,
                    backgroundColor: common.darkColor,
                    borderColor: common.grayThemeYoutube
                }}
            >
                <IconSearch
                    active
                    name="search"
                    size={25}
                    color="#878181"
                    style={{ padding: 4 }}
                />
                <Input
                    style={{
                        color: common.whiteColor
                    }}
                    placeholder="Search By Name : All Professionals"
                    placeholderTextColor="#878181"
                    autoCapitalize="none"
                    onChangeText={value => this.onChangeNameInput(value)}
                    {...field.input}
                />
            </Item>
        );
    };

    handleArrowPress = () => {
        this.setState(prevState => ({
            sliderVisible: !prevState.sliderVisible
        }));
    };

    handleSearch = () => {
        this.props.handleSearch(this.state.value);
    };

    render() {
        return (
            <Form>
                <View
                    style={{
                        marginTop: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <View style={{ width: "90%" }}>
                        <Field
                            name="name"
                            component={this.renderSearchByNameInput}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        {!this.state.sliderVisible ? (
                            <TouchableOpacity onPress={this.handleArrowPress}>
                                <IconArrow
                                    active
                                    name="arrow-down"
                                    size={16}
                                    color={common.whiteColor}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={this.handleArrowPress}>
                                <IconArrow
                                    active
                                    name="arrow-up"
                                    size={16}
                                    color={common.whiteColor}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {this.state.sliderVisible ? (
                    <Fragment>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            value={this.state.value}
                            minimumValue={this.state.min}
                            maximumValue={this.state.max}
                            step={1}
                            thumbTintColor={common.primaryColor}
                            minimumTrackTintColor={common.primaryColor}
                            maximumTrackTintColor="#FFFFFF"
                            onValueChange={value =>
                                this.setState({ value: value })
                            }
                        />
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{ color: common.primaryColor }}
                            >{`Distance: 0 - ${this.state.value} Km`}</Text>
                            <Button
                                title="Search By Distance"
                                color={common.whiteColor}
                                buttonStyle={{
                                    marginVertical: 5,
                                    height: 35,
                                    borderColor: common.primaryColor,
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    backgroundColor: common.primaryColor
                                }}
                                onPress={() => this.handleSearch()}
                            />
                        </View>
                    </Fragment>
                ) : (
                    <Text />
                )}
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    nameField: formValueSelector("searchByName")(state, "name") || ""
});

SearchForm = connect(mapStateToProps)(SearchForm);

export default reduxForm({
    form: "searchByName"
})(SearchForm);
