import React from 'react';
import classes from './Ingredient.module.css';

import PropTypes from 'prop-types';

const Ingredient = (props) => {
	let item = null;
	switch (props.type) {
		case 'base':
			item = <div className={classes.BreadBottom} />;
			break;
		case 'top':
			item = (
				<div className={classes.BreadTop}>
					<div className={classes.Seeds1} />
					<div className={classes.Seeds2} />
				</div>
			);
			break;
		case 'patty':
			item = <div className={classes.Meat} />;
			break;
		case 'cheese':
			item = <div className={classes.Cheese} />;
			break;
		case 'salad':
			item = <div className={classes.Salad} />;
			break;
		case 'bacon':
			item = <div className={classes.Bacon} />;
			break;
		default:
			item = null;
	}

	return item;
};

Ingredient.propTypes = {
	type: PropTypes.string.isRequired
};

export default Ingredient;
