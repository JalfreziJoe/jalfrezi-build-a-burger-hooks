import React, { useState } from 'react';
import Aux from '../Auxillery/Auxillery';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import { connect } from 'react-redux';

const Layout = (props) => {
	const [ sideDrawerVisible, setSideDrawerVisibility ] = useState(false);

	const sideDrawerClosedHandler = () => {
		setSideDrawerVisibility(false);
	};

	const sideDrawerOpenHandler = () => {
		setSideDrawerVisibility(!sideDrawerVisible);
	};

	return (
		<Aux>
			<Toolbar menuClick={sideDrawerOpenHandler} isAuth={props.isAuthenticated} />
			<SideDrawer closed={sideDrawerClosedHandler} open={sideDrawerVisible} isAuth={props.isAuthenticated} />
			<main className={classes.content}>{props.children}</main>
		</Aux>
	);
};

const mapState = (state) => {
	return {
		isAuthenticated: state.auth.idToken !== null
	};
};

export default connect(mapState)(Layout);
