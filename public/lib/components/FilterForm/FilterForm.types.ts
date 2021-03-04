export interface FilterFormState {
	[a: string]: unknown;
	name: string;
	status: string;
}

export interface FilterFormProps {
	initialState: FilterFormState;
	onCancel: () => void;
	onSubmit: (values: FilterFormState) => void;
	deleteActiveFilter: (item: any) => void;
	activeFilters: Array<object>;
}

export enum FilterFormStatus {
	Active = 'active',
	NonActive = 'non-active',
}
