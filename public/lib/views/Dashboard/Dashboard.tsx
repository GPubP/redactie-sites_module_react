import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { LanguageModel } from '@redactie/language-module';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	LoadingState,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	SearchParams,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { FilterForm, FilterFormState } from '../../components/FilterForm';
import { STATUS_OPTIONS } from '../../components/FilterForm/FilterForm.const';
import { RolesRightsConnector } from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { generateSitesFilters } from '../../helpers';
import { usePaginatedSites, useRolesRightsApi } from '../../hooks';
import { BREADCRUMB_OPTIONS, MODULE_PATHS, OVERVIEW_QUERY_PARAMS_CONIG } from '../../sites.const';
import { OverviewFilterItem, SitesOverviewRowData, SitesRouteProps } from '../../sites.types';

import { DASHBOARD_COLUMNS } from './Dashboard.const';

const Dashboard: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */

	const { navigate } = useNavigate();
	const routes = useRoutes();
	const [query, setQuery] = useAPIQueryParams(OVERVIEW_QUERY_PARAMS_CONIG);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const { pagination: sitesPagination, loading: sitesLoading } = usePaginatedSites(
		query as SearchParams
	);
	const rolesRightsApi = useRolesRightsApi();
	const [
		mySecurityRightsLoading,
		mySecurityrights,
	] = rolesRightsApi.hooks.useMySecurityRightsForTenant(true);
	const [t] = useCoreTranslation();

	useEffect(() => {
		if (
			!sitesLoading &&
			(mySecurityRightsLoading === LoadingState.Loaded ||
				mySecurityRightsLoading === LoadingState.Error) &&
			sitesPagination
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [mySecurityRightsLoading, sitesLoading, sitesPagination]);

	/**
	 * Methods
	 */

	const handlePageChange = (page: number): void => {
		setQuery({ page });
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			sort: parseOrderByToString({
				...orderBy,
				key: `${orderBy.key === 'active' ? 'meta' : 'data'}.${orderBy.key}`,
			}),
		});
	};

	const deleteAllFilters = (): void => {
		setQuery({
			page: 1,
			search: undefined,
			status: undefined,
		});
	};

	const onSubmit = (filterValue: FilterFormState): void => {
		setQuery({
			page: 1,
			search: filterValue.name || undefined,
			status: filterValue.status || undefined,
		});
	};

	const deleteFilter = (item: OverviewFilterItem): void => {
		setQuery({
			page: 1,
			[item.filterKey]: undefined,
		});
	};

	const filterFormState = {
		name: query.search ?? '',
		status: query.status ?? '',
	};
	const activeSorting = parseStringToOrderBy(query.sort ?? '');
	const activeFilters = generateSitesFilters(STATUS_OPTIONS(t), filterFormState);

	/**
	 * Render
	 */
	const renderOverview = (): ReactElement | null => {
		const sitesRows: SitesOverviewRowData[] = (sitesPagination?.data || []).map(site => ({
			id: site.uuid,
			name: site.data.name,
			active: site.meta.active,
			url: site.data.url,
			languages: site.data.languages as LanguageModel[],
			userIsMember: !!site.userIsMember,
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={deleteAllFilters}
						onSubmit={onSubmit}
						deleteActiveFilter={deleteFilter}
						activeFilters={activeFilters}
					/>
				</div>
				<PaginatedTable
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--xs"
					columns={DASHBOARD_COLUMNS(t)}
					rows={sitesRows}
					currentPage={sitesPagination?.currentPage ?? 1}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={activeSorting}
					totalValues={sitesPagination?.total ?? 0}
					loading={sitesLoading}
					loadDataMessage="Sites ophalen"
					noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
				/>
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
