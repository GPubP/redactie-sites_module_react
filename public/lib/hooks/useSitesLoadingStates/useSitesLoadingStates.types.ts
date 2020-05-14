import { LoadingState } from '../../sites.types';

export interface SitesLoadingStates {
	isCreating: LoadingState;
	isFetching: LoadingState;
	isUpdating: LoadingState;
	isActivating: LoadingState;
}
