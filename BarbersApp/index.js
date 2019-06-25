import React from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";

import store from "./src/main/store";
import App from "./src/main/App";
import { name as appName } from "./app.json";

const Main = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => Main);
