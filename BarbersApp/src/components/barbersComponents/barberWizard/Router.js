import React, { Component } from "react";
import PropTypes from "prop-types";
import { createStackNavigator } from "react-navigation";
import { last } from "lodash";

class Router extends Component {
    componentWillMount() {
        this.Navigator = this.generateNavigator();
    }

    generateNavigator = () => {
        const { steps, title } = this.props;
        const navigationRoutes = {};
        steps.forEach((step, index) => {
            const routeOptions = { screen: () => step.component };
            navigationRoutes[step.routeName] = routeOptions;
        });

        const navigationOptions = {
            headerStyle: {
                backgroundColor: "#ffffff"
            },
            headerTintColor: "#111111",
            headerTitle: title
        };

        return createStackNavigator(navigationRoutes, { navigationOptions });
    };

    handleRef = navigator => {
        this.props.handleNavRef(navigator);
    };

    handleNavigationChange = (prevState, currentState, action) => {
        const { isTransitioning, routes } = currentState;
        if (isTransitioning) {
            const { routeName } = last(routes);
            this.props.handleNavChange(routeName);
        }
    };

    render() {
        const { Navigator } = this;
        return (
            <Navigator
                onNavigationStateChange={this.handleNavigationChange}
                ref={this.handleRef}
            />
        );
    }
}

export default Router;
