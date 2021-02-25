import { Link as AUILink, Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	EllipsisWithTooltip,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { FilterItemSchema } from '@redactie/roles-rights-module/dist/public/lib/views/SiteUsersOverview/SiteUsersOverview.types';
import {
	DataLoader,
	LoadingState,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { SiteStatus } from '../../components';
import { FilterForm, FilterFormState } from '../../components/FilterForm';
import { STATUS_OPTIONS } from '../../components/FilterForm/FilterForm.const';
import { RolesRightsConnector } from '../../connectors/rolesRights';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';
import { useRolesRightsApi, useSitesLoadingStates, useSitesPagination } from '../../hooks';
import { OrderBy, SearchParams } from '../../services/api';
import { parseOrderBy, parseOrderByString } from '../../services/helpers';
import {
	BREADCRUMB_OPTIONS,
	DEFAULT_SITES_QUERY_PARAMS,
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
		...DEFAULT_SITES_QUERY_PARAMS,
	});
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(
		SITES_INITIAL_FILTER_STATE
	);
	const [filterItems, setFilterItems] = useState<FilterItemSchema[]>([]);
	const sitesActiveSorting = useMemo(() => parseOrderByString(query.sort), [query.sort]);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], BREADCRUMB_OPTIONS);
	const [initialLoading, setInitialLoading] = useState(LoadingState.Loading);
	const [sitesPagination] = useSitesPagination(query as SearchParams);
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
				mySecurityRightsLoading === LoadingState.Error) &&
			sitesPagination
		) {
			setInitialLoading(LoadingState.Loaded);
		}
	}, [sitesLoadingStates.isFetching, mySecurityRightsLoading, sitesPagination]);

	useEffect(() => {
		setFilterFormState({
			name: query.search || '',
			status: query.status || '',
		});
	}, [query.search, query.status]);

	useEffect(() => {
		setFilterItems([
			...(filterFormState.name
				? [
						{
							filterKey: filterFormState.name as string,
							valuePrefix: 'Zoekterm',
							value: filterFormState.name,
						},
				  ]
				: []),
			...(filterFormState.status
				? [
						{
							filterKey: filterFormState.status as string,
							valuePrefix: 'Status',
							value:
								STATUS_OPTIONS(t).find(
									option => option.value === filterFormState.status
								)?.label || '',
						},
				  ]
				: []),
		]);
	}, [filterFormState, t]);

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
				key: `${orderBy.key === 'active' ? 'meta' : 'data'}.${orderBy.key}`,
			}),
		});
	};

	const deleteAllFilters = (): void => {
		setQuery({
			...query,
			search: '',
			status: '',
		});

		setFilterFormState({
			name: '',
			status: '',
		});
	};

	const onSubmit = (filterValue: FilterFormState): void => {
		setQuery({
			...query,
			search: filterValue.name,
			status: filterValue.status || '',
		});

		setFilterFormState({
			name: filterValue.name,
			status: filterValue.status,
		});
	};

	const deleteFilter = (item: any): void => {
		setQuery({
			...query,
			...(item.filterKey === 'name' ? { search: '' } : {}),
			...(item.filterKey === 'active' || item.filterKey === 'non-active'
				? { status: '' }
				: {}),
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
				width: '70%',
				component(name: string, { userIsMember, id, description }: SitesOverviewRowData) {
					return (
						<>
							{userIsMember ? (
								<AUILink to={`sites/${id}/content`} component={Link}>
									<EllipsisWithTooltip>{name}</EllipsisWithTooltip>
								</AUILink>
							) : (
								<label>
									<EllipsisWithTooltip>{name}</EllipsisWithTooltip>
								</label>
							)}
							<p className="small">
								{description ? (
									<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
								) : (
									<span className="u-text-italic">
										{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
									</span>
								)}
							</p>
						</>
					);
				},
			},
			{
				label: t(CORE_TRANSLATIONS.TABLE_STATUS),
				value: 'active',
				width: '30%',
				component(value: string) {
					const isActive = !!value;
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
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--xs"
					columns={sitesColumns}
					rows={sitesRows}
					currentPage={sitesPagination?.currentPage ?? 1}
					itemsPerPage={query.pagesize}
					onPageChange={handlePageChange}
					orderBy={handleOrderBy}
					activeSorting={sitesActiveSorting}
					totalValues={sitesPagination?.total ?? 0}
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
