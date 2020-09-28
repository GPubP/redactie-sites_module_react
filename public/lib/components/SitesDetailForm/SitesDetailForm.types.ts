import { FormikHelpers, FormikProps } from 'formik';

import { SitesDetailFormState } from '../../sites.types';

export interface SitesDetailFormProps {
	initialState: SitesDetailFormState;
	active?: boolean;
	activeLoading?: boolean;
	archiveLoading?: boolean;
	loading?: boolean;
	isChanged?: boolean;
	onCancel?: (resetForm: FormikProps<SitesDetailFormState>['resetForm']) => void;
	onSubmit?: (values: SitesDetailFormState, helpers: FormikHelpers<SitesDetailFormState>) => void;
	onActiveToggle?: () => void;
	onArchive?: () => void;
	onChange?: (data: SitesDetailFormState) => void;
}
