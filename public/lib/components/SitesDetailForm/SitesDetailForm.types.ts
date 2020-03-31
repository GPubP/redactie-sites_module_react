import { SitesDetailFormState } from '../../sites.types';

export interface SitesDetailFormProps {
	initialState: SitesDetailFormState;
	active?: boolean;
	activeLoading?: boolean;
	onCancel: () => void;
	onSubmit: (values: SitesDetailFormState) => void;
	onActiveToggle?: () => void;
}
