import { LoadingState } from '@redactie/utils';

export interface SitesLoadingStates {
	isCreating: LoadingState | null;
	isFetching: LoadingState | null;
	isUpdating: LoadingState | null;
	isActivating: LoadingState | null;
	isArchiving: LoadingState | null;
}
