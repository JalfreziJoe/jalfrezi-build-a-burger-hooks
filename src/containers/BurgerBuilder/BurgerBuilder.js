import React, { useState, useEffect, useCallback } from 'react';
import Aux from '../../hoc/Auxillery/Auxillery';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import Modal from '../../components/ui/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/ui/Spinner/Spinner';
import axios from '../../axios-orders';

import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const BurgerBuilder = (props) => {
	const [ moveToOrder, setMoveToOrder ] = useState(false);

	const ings = useSelector((state) => state.burgerBuilder.ingredients);
	const error = useSelector((state) => state.burgerBuilder.error);
	const price = useSelector((state) => state.burgerBuilder.totalPrice);
	const isAuth = useSelector((state) => state.burgerBuilder.isAuth !== null);

	const dispatch = useDispatch();
	const onAddIngredient = (ingredientName) => dispatch(actions.addIngredient(ingredientName));
	const onRemoveIngredient = (ingredientName) => dispatch(actions.removeIngredient(ingredientName));
	const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [ dispatch ]);
	const onInitPurchase = () => dispatch(actions.purchaseOrderInit());
	const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

	useEffect(
		() => {
			onInitIngredients();
		},
		[ onInitIngredients ]
	);

	const readyToOrderState = (ingredients) => {
		//const ingredients = this.props.ings;
		const sum = Object.keys(ingredients)
			.map((key) => {
				return ingredients[key];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		//this.setState({readyToOrder: sum >0});

		return sum > 0;
	};

	const purchaseHandler = () => {
		if (isAuth) {
			setMoveToOrder(true);
		} else {
			onSetAuthRedirectPath('/checkout');
			props.history.push('/auth');
		}
	};

	const purchaseCancelHandler = () => {
		setMoveToOrder(false);
	};

	const purschaseContinueHandler = () => {
		// const ingredientParam = [];
		// for (let i in this.state.ingredients) {
		//     ingredientParam.push(encodeURIComponent(i) + '='+ encodeURIComponent(this.props.ings[i]));
		// }
		// ingredientParam.push(encodeURIComponent('price') + '=' + encodeURIComponent(this.state.totalPrice));
		// const ingredientParamString = ingredientParam.join('&');
		// this.props.history.push({pathname:'/checkout', search:'?'+ingredientParamString});
		onInitPurchase();
		props.history.push('/checkout');
	};

	const disabledInfo = {
		...ings
	};
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}
	let orderSummary = null;
	console.log('[BurgerBuilder] error: ' + error);
	let burgerIngredients = error ? <p>ingredients can't be loaded</p> : <Spinner />;

	if (ings) {
		orderSummary = (
			<OrderSummary
				ingredients={ings}
				purchaseCancel={purchaseCancelHandler}
				purchaseContinue={purschaseContinueHandler}
				price={price}
			/>
		);
		burgerIngredients = (
			<Aux>
				<Burger ingredients={ings} />
				<BuildControls
					addIngredient={onAddIngredient}
					removeIngredient={onRemoveIngredient}
					disabledInfo={disabledInfo}
					price={price}
					readyToOrder={!readyToOrderState(ings)}
					isAuth={isAuth}
					onOrder={purchaseHandler}
				/>
			</Aux>
		);
	}

	return (
		<Aux>
			<Modal visible={moveToOrder} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burgerIngredients}
		</Aux>
	);
};

export default withErrorHandler(BurgerBuilder, axios);
