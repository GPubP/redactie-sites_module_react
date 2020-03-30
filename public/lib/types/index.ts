export enum LoadingState {
	Loading = 'loading',
	Loaded = 'loaded',
	Error = 'error',
}

export interface DefaultComponentProps {
	className?: string;
}

export interface Tab {
	name: string;
	target: string;
	active: boolean;
	disabled?: boolean;
}

export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
