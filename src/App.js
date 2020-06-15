import React, { useEffect, Suspense } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import Logout from './containers/Auth/logout/Logout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions';

const Checkout = React.lazy(() => {
	return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
	return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
	return import('./containers/Auth/Auth');
});

const App = (props) => {
	const { onAutoLogin } = props;
	useEffect(
		() => {
			onAutoLogin();
		},
		[ onAutoLogin ]
	);

	let routes = (
		<Switch>
			<Route path="/auth" render={(props) => <Auth {...props} />} />
			<Route path="/" exact component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuth) {
		routes = (
			<Switch>
				<Route path="/checkout" render={(props) => <Checkout {...props} />} />
				<Route path="/orders" render={(props) => <Orders {...props} />} />
				<Route path="/logout" component={Logout} />
				<Route path="/auth" render={(props) => <Auth {...props} />} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		);
	}
	return (
		<div>
			<Layout>
				<Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
			</Layout>
		</div>
	);
};

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
