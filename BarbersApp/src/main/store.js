import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const initialState = {};
const middleware = [thunk];

const composedEnhancers = compose(applyMiddleware(...middleware));

export default createStore(rootReducer, initialState, composedEnhancers);
