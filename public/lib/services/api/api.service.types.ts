export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
	[key: string]: any;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
