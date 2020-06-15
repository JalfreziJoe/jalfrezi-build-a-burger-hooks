import React, { useEffect, useState } from 'react';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Spinner from '../../components/ui/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = (props) => {
	const [ authForm, setAuthForm ] = useState({
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
	});
	const [ isSignup, setIsSignup ] = useState(true);
	const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;
	useEffect(
		() => {
			if (!buildingBurger && authRedirectPath !== '/') {
				onSetAuthRedirectPath();
			}
		},
		[ buildingBurger, authRedirectPath, onSetAuthRedirectPath ]
	);

	const switchAuthMode = () => {
		setIsSignup(!isSignup);
	};

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = updateObject(authForm, {
			[controlName]: updateObject(authForm[controlName], {
				value: event.target.value,
				valid: checkValidity(event.target.value, authForm[controlName].validation),
				touched: true
			})
		});
		setAuthForm(updatedControls);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		props.onAuth(authForm.email.value, authForm.password.value, isSignup);
	};

	const formElementsArray = [];
	for (let ele in authForm) {
		formElementsArray.push({
			id: ele,
			config: authForm[ele]
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
			changed={(event) => inputChangedHandler(event, formEle.id)}
		/>
	));

	if (props.loading) form = <Spinner />;

	let errorMsg = null;
	if (props.error) errorMsg = <p>{props.error}</p>;

	let authRedirect = null;
	if (props.isAuth) authRedirect = <Redirect to={props.authRedirectPath} />;
	return (
		<div className={classes.Auth}>
			{authRedirect}
			<h2>{isSignup ? 'Sign up' : 'Login'}</h2>
			{errorMsg}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success">Submit</Button>
			</form>
			<Button btnType="Danger" clicked={switchAuthMode}>
				Switch to {isSignup ? 'Login' : 'Sign up'}
			</Button>
		</div>
	);
};

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
