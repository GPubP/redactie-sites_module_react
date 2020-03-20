import { Spinner } from '@acpaas-ui/react-components';
import React, { FC } from 'react';

import { LoadingState } from '../../types';

import { DataLoaderProps } from './DataLoader.types';

const DataLoader: FC<DataLoaderProps> = ({
	errorMessage = 'Er ging iets mis tijdens het ophalen van de data',
	loadingState,
	notFoundMessage = 'Geen data gevonden',
	render,
}) => {
	switch (loadingState) {
		case LoadingState.Loading:
			return <Spinner />;

		case LoadingState.Loaded:
			return render() || <p>{notFoundMessage}</p>;

		case LoadingState.Error:
			return <p>{errorMessage}</p>;

		default:
			return null;
	}
};

export default DataLoader;
