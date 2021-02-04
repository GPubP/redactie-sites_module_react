import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	EllipsisWithTooltip,
	PaginatedTable,
	TooltipTypeMap,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	DataLoader,
	LoadingState,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import { clone } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { SiteStatus } from '../../components';
import { FilterForm, FilterFormState } from '../../components/FilterForm';
import { RolesRightsConnector } from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import {
	useHomeBreadcrumb,
	useRolesRightsApi,
	useSitesLoadingStates,
	useSitesPagination,
} from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import { parseOrderBy, parseOrderByString } from '../../services/helpers';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	DEFAULT_SITES_QUERY_PARAMS,
	MODULE_PATHS,
	SITES_INITIAL_FILTER_STATE,
} from '../../sites.const';
import { FilterItemSchema, SitesRouteProps } from '../../sites.types';

import { SitesOverviewRowData } from './SitesOverview.types';

const SitesOverview: FC<SitesRouteProps> = () => {
	/**
	 * Hooks
	 */
	const { navigate } = useNavigate();
	const routes = useRoutes();
	const [query, setQuery] = useAPIQueryParams(clone(DEFAULT_SITES_QUERY_PARAMS));
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(
		SITES_INITIAL_FILTER_STATE
	);
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const sitesActiveSorting = useMemo(() => parseOrderByString(query.sort), [query.sort]);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS,
		excludePaths: [...BREADCRUMB_OPTIONS.excludePaths, ...['/:tenantId/sites']],
		extraBreadcrumbs: [useHomeBreadcrumb()],
	});
	const sitesLoadingStates = useSitesLoadingStates();
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [sitesPagination] = useSitesPagination(query as SearchParams);
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
				mySecurityRightsLoading === LoadingState.Error) &&
			sitesPagination
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [sitesLoadingStates.isFetching, mySecurityRightsLoading, sitesPagination]);

	useEffect(() => {
		setFilterFormState({
			name: query.search || '',
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
			...query,
			page: pageNumber,
		});
	};

	const handleOrderBy = (orderBy: OrderBy): void => {
		setQuery({
			...query,
			sort: parseOrderBy({
				...orderBy,
				key: `${orderBy.key === 'active' ? 'meta' : 'data'}.${orderBy.key}`,
			}),
		});
	};

	const deleteAllFilters = (): void => {
		setQuery({
			...query,
			page: 1,
			search: '',
		});

		setFilterFormState({
			name: '',
		});
	};

	const onSubmit = (filterValue: FilterFormState): void => {
		setQuery({
			...query,
			page: 1,
			search: filterValue.name || '',
		});

		setFilterFormState({
			name: filterValue.name,
		});
	};

	const deleteFilter = (item: any): void => {
		setQuery({
			...query,
			page: 1,
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
		const sitesRows: SitesOverviewRowData[] = (sitesPagination?.data || []).map(site => ({
			id: site.uuid,
			name: site.data.name,
			active: site.meta.active,
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
								<AUILink to={`${rowData?.id}/content`} component={Link}>
									<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
										{value}
									</EllipsisWithTooltip>
								</AUILink>
							) : (
								<label>
									<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
										{value}
									</EllipsisWithTooltip>
								</label>
							)}
							<p className="u-text-light u-margin-top-xs">
								<EllipsisWithTooltip type={TooltipTypeMap.PRIMARY}>
									{rowData?.description}
								</EllipsisWithTooltip>
							</p>
						</>
					);
				},
			},
			{
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
				value: 'active',
				width: '120px',
				component(value: string) {
					const isActive = !!value;
					return <SiteStatus active={isActive} />;
				},
			},
			{
				label: '',
				classList: ['u-text-right'],
				disableSorting: true,
				width: '100px',
				component(value: unknown, rowData: unknown) {
					const { id } = rowData as SitesOverviewRowData;

					return (
						<rolesRightsApi.components.SecurableRender
							userSecurityRights={mySecurityrights as string[]}
							requiredSecurityRights={[RolesRightsConnector.securityRights.update]}
						>
							<Button
								ariaLabel="Edit"
								icon="edit"
								onClick={() =>
									navigate(`${MODULE_PATHS.root}${MODULE_PATHS.detailEdit}`, {
										siteId: id,
									})
								}
								type="primary"
								transparent
							></Button>
						</rolesRightsApi.components.SecurableRender>
					);
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
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--xs"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={sitesPagination?.currentPage ?? 1}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					noDataMessage="Er zijn geen resultaten voor de ingestelde filters"
					loadDataMessage="Sites ophalen"
					activeSorting={sitesActiveSorting}
					totalValues={sitesPagination?.total ?? 0}
					loading={sitesLoadingStates.isFetching === LoadingState.Loading}
				></PaginatedTable>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Sites">
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
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.fetch}
				/>
				<DataLoader
					loadingState={initialLoading}
					render={renderOverview}
					notFoundMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
				/>
			</Container>
		</>
	);
};

export default SitesOverview;
