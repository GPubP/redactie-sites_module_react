import { SelectOption } from '@redactie/utils';

import { FilterFormState } from '../../components/FilterForm';
import { OverviewFilterItem } from '../../sites.types';

import { generateSitesFilters } from './generateSitesFilters';

const mockStatusOptions: SelectOption[] = [
	{
		label: 'Active',
		value: 'active',
	},
	{
		label: 'Not active',
		value: 'non-active',
	},
];
const wrappedGenerateSitesFilters = (values: FilterFormState): OverviewFilterItem[] =>
	generateSitesFilters(mockStatusOptions, values);

const mockResult: OverviewFilterItem[] = [
	{
		filterKey: 'search',
		valuePrefix: 'Zoekterm',
		value: 'John',
	},
	{
		filterKey: 'status',
		valuePrefix: 'Status',
		value: mockStatusOptions.find(status => status.value === 'active')?.label || '',
	},
];

describe('Helpers: generateSitesFilters', () => {
	it('Should return filters based on params', () => {
		const filterValues = { name: 'John', status: 'active' };
		const filterItems = wrappedGenerateSitesFilters(filterValues);

		expect(filterItems).toEqual(mockResult);
	});

	it('Should only return a filter for non falsey values', () => {
		const onlyName = { name: 'John', status: '' };
		const onlyStatus = { name: '', status: 'active' };
		const nameFilter = wrappedGenerateSitesFilters(onlyName);
		const statusFilter = wrappedGenerateSitesFilters(onlyStatus);

		expect(nameFilter).toEqual([mockResult[0]]);
		expect(statusFilter).toEqual([mockResult[1]]);
	});
});
