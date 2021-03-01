import { SelectOption } from '@redactie/utils';

import { FilterFormState } from '../../components/FilterForm';
import { OverviewFilterItem } from '../../sites.types';

export const generateSitesFilters = (
	statusOptions: SelectOption[],
	{ name, status }: FilterFormState
): OverviewFilterItem[] => {
	return [
		...(name
			? [
					{
						filterKey: 'search',
						valuePrefix: 'Zoekterm',
						value: name,
					},
			  ]
			: []),
		...(status
			? [
					{
						filterKey: 'active',
						valuePrefix: 'Status',
						value: statusOptions.find(option => option.value === status)?.label || '',
					},
			  ]
			: []),
	];
};
