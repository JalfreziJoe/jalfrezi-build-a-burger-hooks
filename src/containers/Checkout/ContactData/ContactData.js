import React, { useState } from 'react';
import classes from './ContactData.module.css';
import Button from '../../../components/ui/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/ui/Spinner/Spinner';
import Input from '../../../components/ui/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';

import { updateObject, checkValidity } from '../../../shared/utility';

const ContactData = (props) => {
	const [ orderForm, setOrderForm ] = useState({
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Full name'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Email'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		line1: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Address 1'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		line2: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Address 2'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		town: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Town'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		postcode: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Postcode'
			},
			value: '',
			validation: {
				required: true,
				minLength: 5,
				maxLength: 7
			},
			valid: false,
			touched: false
		},
		delivery: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'ASAP', displayValue: 'As soon as possible' },
					{ value: '1Hour', displayValue: 'In 1 hour' }
				]
			},
			value: 'ASAP',
			validation: {},
			valid: true
		}
	});

	const [ formValidity, setFormValidity ] = useState(false);
	//const [ updatingDb, setUpdatingDb ] = useState(false);

	const orderHandler = (event) => {
		event.preventDefault();
		//setUpdatingDb(true);
		//console.log('purchase continue');
		const formData = {};
		for (let formEle in orderForm) {
			formData[formEle] = orderForm[formEle].value;
		}
		const thisOrder = {
			ingredients: props.ings,
			price: props.price, // not a setup on a production app. Price should be totalled on the backend
			orderData: formData,
			userId: props.userId
		};
		props.onOrderBurger(thisOrder, props.token);
		// axios.post('/orders.json', thisOrder) // the .json is just for firebase DB only
		//     .then(response =>  {
		//         //this.setState({loading:false, moveToOrder:false})
		//         this.props.history.replace('/');
		//     })
		//     .catch(error => {
		//         this.setState({updatingDb:false})
		//     });
	};

	const inputChangedHandler = (event, inputId) => {
		const updatedFormElement = updateObject(orderForm[inputId], {
			value: event.target.value,
			valid: checkValidity(event.target.value, orderForm[inputId].validation),
			touched: true
		});

		const updatedOrderForm = updateObject(orderForm, {
			[inputId]: updatedFormElement
		});

		let formIsValid = true;
		for (let formEle in updatedOrderForm) {
			formIsValid = updatedOrderForm[formEle].valid && formIsValid;
		}
		console.log(formIsValid);

		setOrderForm(updatedOrderForm);
		setFormValidity(formIsValid);
	};

	let form = <Spinner />;
	const formElementsArray = [];
	for (let ele in orderForm) {
		formElementsArray.push({
			id: ele,
			config: orderForm[ele]
		});
	}
	if (!props.loading) {
		form = (
			<form onSubmit={orderHandler}>
				{formElementsArray.map((formEle) => (
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
				))}
				<Button btnType="Success" disabled={!formValidity}>
					Continue
				</Button>
			</form>
		);
	}
	return (
		<div className={classes.ContactData}>
			<h4>Please enter your details</h4>
			{form}
		</div>
	);
};

const mapState = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.idToken,
		userId: state.auth.userId
	};
};

const mapDispatch = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
	};
};

export default connect(mapState, mapDispatch)(withErrorHandler(ContactData, axios));
