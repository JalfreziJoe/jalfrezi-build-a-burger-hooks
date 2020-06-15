import React from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import Logout from './containers/Auth/logout/Logout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncCheckout = asyncComponent(() => {
	return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
	return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
	return import('./containers/Auth/Auth');
});

function App(props) {
	props.onAutoLogin();
	let routes = (
		<Switch>
			<Route path="/auth" component={asyncAuth} />
			<Route path="/" exact component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuth) {
		routes = (
			<Switch>
				<Route path="/checkout" component={asyncCheckout} />
				<Route path="/orders" component={asyncOrders} />
				<Route path="/logout" component={Logout} />
				<Route path="/auth" component={asyncAuth} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		);
	}
	return (
		<div>
			<Layout>{routes}</Layout>
		</div>
	);
}

const mapState = (state) => {
	return {
		isAuth: state.auth.idToken !== null
	};
};

const mapDispatch = (dispatch) => {
	return {
		onAutoLogin: () => dispatch(actions.authCheckState())
	};
};
export default connect(mapState, mapDispatch)(withRouter(App));
