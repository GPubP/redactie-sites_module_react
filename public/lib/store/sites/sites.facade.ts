import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { from, Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import { SiteResponse, SitesApiService, sitesApiService } from '../../services/sites';

import {
	SiteDetailModel,
	SiteDetailUIModel,
	sitesDetailQuery,
	SitesDetailQuery,
	sitesDetailStore,
	SitesDetailStore,
} from './detail';
import {
	SiteListModel,
	sitesListPaginator,
	sitesListQuery,
	SitesListQuery,
	SitesListState,
	SitesListStore,
	sitesListStore,
} from './list';
import { getAlertMessages } from './sites.alertMessages';
import { SITES_ALERT_CONTAINER_IDS } from './sites.const';
import {
	CreateSitePayload,
	CreateSitePayloadOptions,
	GetSitePayload,
	GetSitePayloadOptions,
	GetSitesPayload,
	UpdateSiteActivationPayload,
	UpdateSitePayload,
	UpdateSitePayloadOptions,
} from './sites.types';

export class SitesFacade {
	constructor(
		protected listStore: SitesListStore,
		protected listQuery: SitesListQuery,
		public listPaginator: PaginatorPlugin<SitesListState>,
		protected detailStore: SitesDetailStore,
		protected detailQuery: SitesDetailQuery,
		protected service: SitesApiService
	) {}

	// LIST STATES
	public readonly sites$ = this.listQuery.sites$;
	public readonly listError$ = this.listQuery.error$;
	public readonly listIsFetching$ = this.listQuery.isFetching$;
	public readonly listUIState$ = this.listQuery.selectUIState();

	// DETAIL STATES
	// TODO: check if we use this one
	public readonly isCreating$ = this.detailQuery.isCreating$;

	// LIST FUNCTIONS
	public setListIsFetching(isFetching: boolean): void {
		this.listStore.setIsFetching(isFetching);
	}

	public getListIsFetching(): boolean {
		return this.listQuery.getIsFetching();
	}

	public getSitesPaginated(
		payload: GetSitesPayload,
		clearCache = false
	): Observable<PaginationResponse<SiteListModel>> {
		if (clearCache) {
			this.listPaginator.clearCache();
		}
		const alertMessages = getAlertMessages();

		return from(
			this.service
				.getSites(payload)
				.then(response => {
					if (!response || !response._page || !response._embedded) {
						throw new Error('Fetching sites failed');
					}
					const paging = response._page;

					this.listStore.update({
						paging,
						error: null,
					});

					return {
						perPage: paging.size,
						currentPage: sitesListPaginator.currentPage,
						lastPage: paging.totalPages,
						total: paging.totalElements,
						data: response._embedded,
					};
				})
				.catch(error => {
					showAlert(SITES_ALERT_CONTAINER_IDS.fetch, 'error', alertMessages.fetch.error);
					this.listStore.update({
						error,
						isFetching: false,
					});
					throw error;
				})
		);
	}

	// DETAIL FUNCTIONS
	public setIsUpdating(siteId: string, isUpdating: boolean): void {
		this.detailStore.setIsUpdatingEntity(isUpdating, siteId);
	}

	public selectSite(siteId: string): Observable<SiteDetailModel> {
		return this.detailQuery.selectEntity(siteId);
	}

	public selectSiteUIState<T extends string | string[]>(
		siteIds?: T
	): T extends string ? Observable<SiteDetailUIModel> : Observable<SiteDetailUIModel[]>;
	public selectSiteUIState(
		siteIds: string | string[]
	): Observable<SiteDetailUIModel> | Observable<SiteDetailUIModel[]> {
		if (typeof siteIds === 'string') {
			return this.detailQuery.ui.selectEntity(siteIds);
		}

		return this.detailQuery.ui.selectMany(siteIds);
	}

	public hasSite(siteId: string): boolean {
		return this.detailQuery.hasEntity(siteId);
	}

	public getSite(
		payload: GetSitePayload,
		options: GetSitePayloadOptions = {
			alertContainerId: SITES_ALERT_CONTAINER_IDS.fetchOne,
		}
	): void {
		if (this.hasSite(payload.id)) {
			return;
		}
		const alertMessages = getAlertMessages();

		this.detailStore.setIsFetchingEntity(true, payload.id);
		this.service
			.getSite(payload)
			.then(response => {
				this.detailStore.upsert(response.uuid, response);
				this.detailStore.ui.upsert(response.uuid, { error: null, isFetching: false });
			})
			.catch(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.fetchOne.error);
				this.detailStore.ui.upsert(payload.id, {
					error,
					isFetching: false,
				});
			});
	}

	public createSite(
		payload: CreateSitePayload,
		options: CreateSitePayloadOptions = {
			successAlertContainerId: SITES_ALERT_CONTAINER_IDS.update,
			errorAlertContainerId: SITES_ALERT_CONTAINER_IDS.create,
		}
	): Promise<SiteResponse | undefined> {
		this.detailStore.setIsCreating(true);
		const alertMessages = getAlertMessages(payload.name);

		return this.service
			.createSite(payload)
			.then(site => {
				this.detailStore.update({
					isCreating: false,
					error: null,
				});
				this.detailStore.upsert(site.uuid, site);
				this.listPaginator.clearCache();

				// NOTE!: Wait till the update container exists
				// The update container does not exist on the create page
				// A success message is shown to the user after the system has navigated to the detail page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.create.success
					);
				}, 300);
				return site;
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.create.error);
				this.detailStore.update({
					isCreating: false,
					error,
				});
				return error;
			});
	}

	public updateSite(
		payload: UpdateSitePayload,
		options: UpdateSitePayloadOptions = {
			alertContainerId: SITES_ALERT_CONTAINER_IDS.update,
		}
	): Promise<SiteResponse | void> {
		this.detailStore.setIsUpdatingEntity(true, payload.id);
		const alertMessages = getAlertMessages(payload.body.name);

		return this.service
			.updateSite(payload)
			.then(response => {
				this.detailStore.upsert(response.uuid, response);
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error: null,
				});
				this.listPaginator.clearCache();

				// NOTE!: Wait till the update container exists
				// The update container does not exist on the create page
				// A success message is shown to the user after the system has navigated to the detail page
				setTimeout(
					() =>
						showAlert(
							options.alertContainerId,
							'success',
							alertMessages.update.success
						),
					300
				);

				return response;
			})
			.catch(error => {
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error,
				});
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);

				throw error;
			});
	}

	public updateSiteActivation(payload: UpdateSiteActivationPayload): void {
		this.detailStore.ui.update(payload.id, {
			isActivating: true,
		});
		this.service
			.updateSiteActivation(payload)
			.then(response => {
				this.detailStore.update(response.uuid, response);
				this.detailStore.ui.update(response.uuid, {
					isActivating: false,
				});
				this.listPaginator.clearCache();
			})
			.catch(error => {
				this.detailStore.ui.update(payload.id, {
					error,
					isActivating: false,
				});
			});
	}

	public archiveSite(siteId: string): Promise<null> {
		this.detailStore.ui.update(siteId, {
			isArchiving: true,
		});

		return this.service.archiveSite(siteId).finally(() => {
			this.detailStore.ui.update(siteId, {
				isArchiving: false,
			});
			this.listPaginator.clearCache();
		});
	}
}

export const sitesFacade = new SitesFacade(
	sitesListStore,
	sitesListQuery,
	sitesListPaginator,
	sitesDetailStore,
	sitesDetailQuery,
	sitesApiService
);
