export type StatusType = 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';

export interface StatusProps {
	label: string;
	type: StatusType;
}

export type TypeMap = {
	[key in StatusType]: string;
};
