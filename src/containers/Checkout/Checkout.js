import React, { Component } from "react";
import {Route, Redirect} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';


import {connect} from 'react-redux';

class Checkout extends Component {

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        let summary = <Redirect to='/' />;
        
        if (this.props.ings) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" />:null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary
                    ingredients={this.props.ings}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinue={this.checkoutContinueHandler} />
                    <Route path={this.props.match.url+'/contact-data'} component={ContactData} />
                    {/* without redux method <Route path={this.props.match.url+'/contact-data'} render={(props)=> (<ContactData ingredients={this.props.ings} price={this.state.price} {...props} />)} /> */}
                </div>
            );
        }
        return summary;
    }
}

const mapState = state => {
    return {
        ings:state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    };
}



export default connect(mapState)(Checkout);