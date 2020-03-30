import { SitesDetailFormState } from '../../sites.types';

export interface SitesDetailFormProps {
	initialState: SitesDetailFormState;
	onCancel: () => void;
	onSubmit: (values: SitesDetailFormState) => void;
	onActiveToggle?: () => void;
}
