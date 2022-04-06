import { LanguageSchema } from '@redactie/language-module';
import { Language, LoadingState } from '@redactie/utils';
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
	loadingState?: LoadingState;
	activeLanguages?: LanguageSchema[] | null;
	activeLanguage?: LanguageSchema | Language;
	siteCreate?: boolean;
	children?: SitesDetailFormChildrenFn;
	onCancel?: (resetForm: FormikProps<SitesDetailFormState>['resetForm']) => void;
	onSubmit?: (values: SitesDetailFormState, helpers: FormikHelpers<SitesDetailFormState>) => void;
	onActiveToggle?: () => void;
	onArchive?: () => void;
	onChange?: (data: SitesDetailFormState) => void;
}
