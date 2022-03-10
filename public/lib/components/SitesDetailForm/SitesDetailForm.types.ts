import { LanguageModel } from '@redactie/language-module';
import { FormikHelpers, FormikProps } from 'formik';
import { ReactNode } from 'react';

import { SitesDetailFormState } from '../../sites.types';

export type SitesDetailFormChildrenFn = (
	formikProps: FormikProps<SitesDetailFormState>
) => ReactNode;

export interface SitesDetailFormProps {
	initialState: SitesDetailFormState;
	active?: boolean;
	activeLoading?: boolean;
	archiveLoading?: boolean;
	loading?: boolean;
	isChanged?: boolean;
	children?: SitesDetailFormChildrenFn;
	onCancel?: (resetForm: FormikProps<SitesDetailFormState>['resetForm']) => void;
	onSubmit?: (values: SitesDetailFormState, helpers: FormikHelpers<SitesDetailFormState>) => void;
	onActiveToggle?: () => void;
	onArchive?: () => void;
	onChange?: (data: SitesDetailFormState) => void;
}
