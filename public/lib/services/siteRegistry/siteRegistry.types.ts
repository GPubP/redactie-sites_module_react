import { RouteComponentProps } from 'react-router-dom';

export interface RouteConfigComponentProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteComponentProps<Params> {
	route?: SiteConfig;
}

export interface SiteConfig {
	component:
		| React.ComponentType<RouteConfigComponentProps<any>>
		| React.ComponentType
		| React.ComponentType<{ route: SiteConfig }>;
	label: string;
	path: string;
	[propName: string]: any;
}

export default interface Sites {
	register: (siteConfig: SiteConfig) => void;
	getAll: () => SiteConfig[];
}
