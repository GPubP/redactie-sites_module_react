import { TranslateFunc } from '@redactie/translations-module';
import { SelectOption } from '@redactie/utils';
import { object, string } from 'yup';

import { CORE_TRANSLATIONS } from '../../connectors/translations';

import { FilterFormStatus } from './FilterForm.types';

export const FILTER_FORM_VALIDATION_SCHEMA = object().shape({
	name: string(),
});

export const STATUS_OPTIONS = (t: TranslateFunc): SelectOption[] => [
	{
		label: t(CORE_TRANSLATIONS.STATUS_ACTIVE),
		value: FilterFormStatus.Active,
	},
	{
		label: t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE']),
		value: FilterFormStatus.NonActive,
	},
];
