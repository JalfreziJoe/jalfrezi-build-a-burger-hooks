import React, { Component } from 'react';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Spinner from '../../components/ui/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Login'
				},
				value: '',
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Pass'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		},
		isSignup: true
	};

	componentDidMount() {
		if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
			this.props.onSetAuthRedirectPath();
		}
	}

	switchAuthMode = () => {
		this.setState((prevState) => {
			return { isSignup: !prevState.isSignup };
		});
	};

	inputChangedHandler = (event, controlName) => {
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: event.target.value,
				valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			})
		});
		this.setState({ controls: updatedControls });
	};

	submitHandler = (event) => {
		event.preventDefault();
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	};

	render() {
		const formElementsArray = [];
		for (let ele in this.state.controls) {
			formElementsArray.push({
				id: ele,
				config: this.state.controls[ele]
			});
		}

		let form = formElementsArray.map((formEle) => (
			<Input
				key={formEle.id}
				elementType={formEle.config.elementType}
				elementConfig={formEle.config.elementConfig}
				value={formEle.config.value}
				inValid={!formEle.config.valid}
				shouldValidate={formEle.config.validation}
				touched={formEle.config.touched}
				changed={(event) => this.inputChangedHandler(event, formEle.id)}
			/>
		));

		if (this.props.loading) form = <Spinner />;

		let errorMsg = null;
		if (this.props.error) errorMsg = <p>{this.props.error}</p>;

		let authRedirect = null;
		if (this.props.isAuth) authRedirect = <Redirect to={this.props.authRedirectPath} />;
		return (
			<div className={classes.Auth}>
				{authRedirect}
				<h2>{this.state.isSignup ? 'Sign up' : 'Login'}</h2>
				{errorMsg}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">Submit</Button>
				</form>
				<Button btnType="Danger" clicked={this.switchAuthMode}>
					Switch to {this.state.isSignup ? 'Login' : 'Sign up'}
				</Button>
			</div>
		);
	}
}

const mapProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuth: state.auth.idToken !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath
	};
};

const mapDispatch = (dispatch) => {
	return {
		onAuth: (user, pass, isSignup) => dispatch(actions.auth(user, pass, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	};
};

export default connect(mapProps, mapDispatch)(Auth);
