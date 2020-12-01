import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { AlertProps, alertService, BaseEntityFacade } from '@redactie/utils';
import { from, Observable } from 'rxjs';

import {
	CreateSitePayload,
	GetSitePayload,
	GetSitesPayload,
	SiteResponse,
	SitesApiService,
	sitesApiService,
	UpdateSiteActivationPayload,
	UpdateSitePayload,
} from '../../services/sites';
import { ALERT_CONTAINER_IDS } from '../../sites.const';

import { getAlertMessages } from './sites.alertMessages';
import { SiteModel, SitesState } from './sites.model';
import { sitesPaginator } from './sites.paginator';
import { SitesQuery, sitesQuery } from './sites.query';
import { SitesStore, sitesStore } from './sites.store';

export class SitesFacade extends BaseEntityFacade<SitesStore, SitesApiService, SitesQuery> {
	constructor(
		protected store: SitesStore,
		protected service: SitesApiService,
		protected query: SitesQuery,
		private paginator: PaginatorPlugin<SitesState>
	) {
		super(store, service, query);
	}

	public readonly meta$ = this.query.meta$;
	public readonly sites$ = this.query.sites$;
	public readonly site$ = this.query.selectActive() as Observable<SiteModel>;
	public readonly isActivating$ = this.query.isActivating$;
	public readonly isArchiving$ = this.query.isArchiving$;

	public setActive(siteId: string): void {
		this.store.setActive(siteId);
	}

	public hasActive(siteId: string): boolean {
		return this.query.hasActive(siteId);
	}

	public setIsFetching(isFetching = false): void {
		this.store.setIsFetching(isFetching);
	}

	public getSitesPaginated(
		payload: GetSitesPayload,
		clearCache = false
	): Observable<PaginationResponse<SiteModel>> {
		if (clearCache) {
			this.paginator.clearCache();
		}
		const alertMessages = getAlertMessages();

		return from(
			this.service
				.getSites(payload)
				.then(response => {
					const meta = response._page;

					this.store.update({
						meta,
					});

					return {
						perPage: parseInt(response._page.size, 10),
						currentPage: parseInt(response._page.number, 10),
						lastPage: response._page.totalPages,
						total: response._page.totalElements,
						data: response._embedded,
					};
				})
				.catch(error => {
					this.alertService(alertMessages.fetch.error, 'fetch', 'error');
					this.store.update({
						error,
						isFetching: false,
					});
					throw error;
				})
		);
	}

	public getSites(): void {
		const { isFetching } = this.query.getValue();
		if (isFetching) {
			return;
		}
		const alertMessages = getAlertMessages();
		this.store.setIsFetching(true);

		this.service
			.getSites({
				// TODO: It is not possible to fetch all sites
				// at once
				pagesize: 1000,
			} as any)
			.then(response => {
				if (response) {
					this.store.update({
						meta: response._page,
						isFetching: false,
					});
					this.store.set(response._embedded);
				}
			})
			.catch(error => {
				this.alertService(alertMessages.fetch.error, 'fetch', 'error');
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public getSite(payload: GetSitePayload): void {
		if (this.query.hasDetailEntity(payload.id)) {
			return;
		}
		const alertMessages = getAlertMessages();

		this.store.setIsFetching(true);
		this.service
			.getSite(payload)
			.then(response => {
				this.store.upsert(response.uuid, response);
				this.store.update(state => ({
					detailIds: state.detailIds.includes(response.uuid)
						? state.detailIds
						: [...state.detailIds, response.uuid],
					isFetching: false,
				}));
			})
			.catch(error => {
				this.alertService(alertMessages.fetchOne.error, 'fetchOne', 'error');
				this.store.update({
					error,
					isFetching: false,
				});
			});
	}

	public createSite(payload: CreateSitePayload): Promise<SiteResponse | undefined> {
		this.store.setIsCreating(true);
		const alertMessages = getAlertMessages(payload.name);

		return this.service
			.createSite(payload)
			.then(site => {
				this.store.setIsCreating(false);
				this.store.upsert(site.uuid, site);
				// NOTE!: Wait till the update container exists
				// The update container does not exist on the create page
				// A success message is shown to the user after the system has navigated to the detail page
				setTimeout(() => {
					this.alertService(alertMessages.create.success, 'update', 'success');
				}, 300);
				return site;
			})
			.catch(error => {
				this.store.setIsCreating(false);
				this.alertService(alertMessages.create.error, 'create', 'error');
				return error;
			});
	}

	public updateSite(payload: UpdateSitePayload): Promise<SiteResponse | void> {
		this.store.setIsUpdating(true);
		const alertMessages = getAlertMessages(payload.body.name);

		return this.service
			.updateSite(payload)
			.then(response => {
				this.store.update(response.uuid, response);
				this.store.update({
					isUpdating: false,
				});
				this.alertService(alertMessages.update.success, 'update', 'success');
				return response;
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
				});
				this.alertService(alertMessages.update.error, 'update', 'error');
			});
	}

	public updateSiteActivation(payload: UpdateSiteActivationPayload): void {
		this.store.setIsActivating(true);
		this.service
			.updateSiteActivation(payload)
			.then(response => {
				this.store.update(response.uuid, response);
				this.store.update({
					isActivating: false,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isActivating: false,
				});
			});
	}

	public archiveSite(siteId: string): Promise<null> {
		this.store.setIsArchiving(true);

		return this.service.archiveSite(siteId).finally(() => this.store.setIsArchiving(false));
	}

	private alertService(
		alertProps: AlertProps,
		containerId: 'create' | 'update' | 'fetch' | 'fetchOne',
		type: 'success' | 'error'
	): void {
		const alertType = type === 'error' ? 'danger' : type;
		const alertOptions = { containerId: ALERT_CONTAINER_IDS[containerId] };

		alertService[alertType](alertProps, alertOptions);
	}
}

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery, sitesPaginator);
