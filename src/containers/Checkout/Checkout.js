import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

import { connect } from 'react-redux';

const Checkout = (props) => {
	const checkoutCancelledHandler = () => {
		props.history.goBack();
	};

	const checkoutContinueHandler = () => {
		props.history.replace('/checkout/contact-data');
	};

	let summary = <Redirect to="/" />;

	if (props.ings) {
		const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
		summary = (
			<div>
				{purchasedRedirect}
				<CheckoutSummary
					ingredients={props.ings}
					checkoutCancelled={checkoutCancelledHandler}
					checkoutContinue={checkoutContinueHandler}
				/>
				<Route path={props.match.url + '/contact-data'} component={ContactData} />
				{/* without redux method <Route path={this.props.match.url+'/contact-data'} render={(props)=> (<ContactData ingredients={this.props.ings} price={this.state.price} {...props} />)} /> */}
			</div>
		);
	}
	return summary;
};

const mapState = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		purchased: state.order.purchased
	};
};

export default connect(mapState)(Checkout);
