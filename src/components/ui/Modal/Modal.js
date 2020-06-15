import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/Auxillery/Auxillery';

const Modal = (props) => {
	// shouldComponentUpdate(nextProps, nextState) {
	// 	return nextProps.visible !== this.props.visible || nextProps.children !== this.props.children;
	// }

	return (
		<Aux>
			<Backdrop visible={props.visible} clicked={props.modalClosed} />
			<div
				className={classes.Modal}
				style={{
					transform: props.visible ? 'translateY(0)' : 'translateY(-100vh)',
					opacity: props.visible ? '1' : '0'
				}}
			>
				{props.children}
			</div>
		</Aux>
	);
};

export default React.memo(
	Modal,
	(prevProps, nextProps) => nextProps.visible === prevProps.visible && nextProps.children === prevProps.children
);
