import { connect } from "react-redux";
import LoginComponent from "./Login";
import {} from "../ActionsLogin";

const mapStateProps = state => ({
    login: Object.assign({}, state.login)
});

const mapDispatchToProps = dispatch => ({});

const Login = connect(
    mapStateProps,
    mapDispatchToProps
)(LoginComponent);

export default Login;
