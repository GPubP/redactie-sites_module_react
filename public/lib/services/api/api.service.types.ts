export interface SearchParams {
	page: number;
	pagesize: number;
	sort?: string;
	search?: string;
}

export interface OrderBy {
	key: string;
	order: 'asc' | 'desc';
}
