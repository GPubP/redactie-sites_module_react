import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { CORE_TRANSLATIONS } from '@redactie/translations-module/public/lib/i18next/translations.const';
import { DataLoader, LoadingState, useAPIQueryParams } from '@redactie/utils';
import { prop } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { FilterItemSchema } from '../../../../../redactie-content-types_module_react/dist/public/lib/views/ContentTypesOverview/ContentTypesOverview.types.d';
import { SiteStatus } from '../../components';
import { FilterForm, FilterFormState } from '../../components/FilterForm';
import { RolesRightsConnector } from '../../connectors/rolesRights';
import { useCoreTranslation } from '../../connectors/translations';
import {
	useNavigate,
	useRolesRightsApi,
	useRoutes,
	useSitesLoadingStates,
	useSitesPagination,
} from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import { parseOrderBy, parseOrderByString } from '../../services/helpers';
import {
	BREADCRUMB_OPTIONS,
	DEFAULT_SITES_SORTING,
	MODULE_PATHS,
	SITES_INITIAL_FILTER_STATE,
} from '../../sites.const';
import { SitesRouteProps } from '../../sites.types';
import { SitesOverviewRowData } from '../SitesOverview/SitesOverview.types';

const Dashboard: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const { navigate } = useNavigate();
	const routes = useRoutes();
	const [query, setQuery] = useAPIQueryParams({
		...DEFAULT_SITES_SORTING,
	});
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(
		SITES_INITIAL_FILTER_STATE
	);
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const sitesActiveSorting = useMemo(() => parseOrderByString(query.sort), [query.sort]);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const sitesPagination = useSitesPagination(query as SearchParams);
	const sitesLoadingStates = useSitesLoadingStates();
	const rolesRightsApi = useRolesRightsApi();
	const [
		mySecurityRightsLoading,
		mySecurityrights,
	] = rolesRightsApi.hooks.useMySecurityRightsForTenant(true);
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (
			(sitesLoadingStates.isFetching === LoadingState.Loaded ||
				sitesLoadingStates.isFetching === LoadingState.Error) &&
			(mySecurityRightsLoading === LoadingState.Loaded ||
				mySecurityRightsLoading === LoadingState.Error)
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [sitesLoadingStates.isFetching, mySecurityRightsLoading]);

	useEffect(() => {
		setFilterFormState({
			name: query.search,
		});
	}, [query.search]);

	useEffect(() => {
		setFilterItems(
			Object.keys(filterFormState).reduce(
				(acc, key) =>
					filterFormState[key]
						? acc.concat([
								{
									filterKey: key,
									value: filterFormState[key] as string,
								},
						  ])
						: acc,
				[] as FilterItemSchema[]
			)
		);
	}, [filterFormState]);

	/**
	 * Functions
	 */
	const handlePageChange = (pageNumber: number): void => {
		setQuery({
			page: pageNumber,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			...query,
			sort: parseOrderBy({
				...orderBy,
				key: `data.${orderBy.key}`,
			}),
		});
	};

	const deleteAllFilters = (): void => {
		setQuery({
			...query,
			search: '',
		});

		setFilterFormState({
			name: '',
		});
	};

	const onSubmit = (filterValue: FilterFormState): void => {
		setQuery({
			...query,
			search: filterValue.name,
		});

		setFilterFormState({
			name: filterValue.name,
		});
	};

	const deleteFilter = (item: any): void => {
		setQuery({
			...query,
			...(item.filterKey === 'name' ? { search: '' } : {}),
		});

		setFilterFormState({
			...filterFormState,
			[item.filterKey]: '',
		});
	};

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		if (!sitesPagination) {
			return null;
		}

		const sitesRows: SitesOverviewRowData[] = (sitesPagination?.data || []).map(site => ({
			id: site.uuid,
			name: site.data.name,
			status: site.meta.active,
			description: site.data.description,
			userIsMember: !!site.userIsMember,
		}));

		const sitesColumns = [
			{
				label: t(CORE_TRANSLATIONS.TABLE_NAME),
				value: 'name',
				component(value: any, rowData: SitesOverviewRowData) {
					return (
						<>
							{rowData.userIsMember ? (
								<AUILink
									to={`sites/${prop('id')(rowData)}/content`}
									component={Link}
								>
									{prop('name')(rowData)}
								</AUILink>
							) : (
								<label>{prop('name')(rowData)}</label>
							)}
							<p className="u-text-light u-margin-top-xs">
								{prop('description')(rowData)}
							</p>
						</>
					);
				},
			},
			{
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
				value: 'status',
				component(value: string, rowData: SitesOverviewRowData) {
					const isActive = !!rowData['status'];
					return <SiteStatus active={isActive} />;
				},
			},
		];

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={filterItems}
					/>
				</div>
				<PaginatedTable
					className="u-margin-top"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={sitesPagination.currentPage}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={sitesActiveSorting}
					totalValues={sitesPagination.total}
					loading={sitesLoadingStates.isFetching === LoadingState.Loading}
				></PaginatedTable>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Dashboard">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<rolesRightsApi.components.SecurableRender
						userSecurityRights={mySecurityrights as string[]}
						requiredSecurityRights={[RolesRightsConnector.securityRights.create]}
					>
						<Button
							iconLeft="plus"
							onClick={() => navigate(`${MODULE_PATHS.root}${MODULE_PATHS.create}`)}
						>
							{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
						</Button>
					</rolesRightsApi.components.SecurableRender>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default Dashboard;
