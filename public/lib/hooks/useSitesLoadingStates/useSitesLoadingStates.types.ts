import { LoadingState } from '../../sites.types';

export interface SitesLoadingStates {
	isCreating: LoadingState | null;
	isFetching: LoadingState | null;
	isUpdating: LoadingState | null;
	isActivating: LoadingState | null;
}
