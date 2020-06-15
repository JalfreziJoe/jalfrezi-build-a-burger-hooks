import React from 'react';
import Modal from '../../components/ui/Modal/Modal';
import Aux from '../Auxillery/Auxillery';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
	return (props) => {
		const [ error, clearError ] = useHttpErrorHandler(axios);

		return (
			<Aux>
				<Modal visible={error} modalClosed={clearError}>
					{error ? error.message : null}
				</Modal>
				<WrappedComponent {...props} />
			</Aux>
		);
	};
};

export default withErrorHandler;
