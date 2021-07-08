import { ModuleSettings } from '../../services/sites';
import { SiteDetailModel } from '../../store/sites';

export interface SiteUpdateMatchProps {
	tab: string;
}

export interface ExternalTabValue {
	config: ModuleSettings['config'];
	validationSchema: ModuleSettings['validationSchema'];
}

export interface ExternalTabProps {
	site: SiteDetailModel;
	value: ExternalTabValue;
	isLoading: boolean;
	onSubmit: (value: ExternalTabValue) => void;
	onCancel: () => void;
	updateSite: (e: SiteDetailModel) => void;
}
