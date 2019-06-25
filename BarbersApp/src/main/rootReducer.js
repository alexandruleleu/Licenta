import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

// Reducers for all pages
import barberWizardFirstStep from "../components/barbersComponents/barberWizard/steps/firstStep/ReducerFirstStep";
import barberWizardSecondStep from "../components/barbersComponents/barberWizard/steps/secondStep/ReducerSecondStep";
import customerProfile from "../containers/customerProfile/ReducerCustomerProfile";

// "root reducer"
export default combineReducers({
    form: formReducer,
    barberWizardFirstStep: barberWizardFirstStep,
    barberWizardSecondStep: barberWizardSecondStep,
    customerProfile: customerProfile
});
