import { ReactElement } from 'react';

import { LoadingState } from '../../sites.types';

export interface DataLoaderProps {
	errorMessage?: string;
	loadingState: LoadingState;
	notFoundMessage?: string;
	render: () => ReactElement | null;
}
