import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { AlertProps, alertService } from '@redactie/utils';
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

export class SitesFacade {
	constructor(
		private store: SitesStore,
		private service: SitesApiService,
		private query: SitesQuery,
		private paginator: PaginatorPlugin<SitesState>
	) {}

	public readonly meta$ = this.query.meta$;
	public readonly sites$ = this.query.sites$;
	public readonly site$ = this.query.site$;
	public readonly isFetching$ = this.query.isFetching$;
	public readonly isCreating$ = this.query.isCreating$;
	public readonly isUpdating$ = this.query.isUpdating$;
	public readonly isActivating$ = this.query.isActivating$;
	public readonly isArchiving$ = this.query.isArchiving$;
	public readonly error$ = this.query.error$;

	public getSiteValue(): SiteResponse | undefined {
		const { site } = this.store.getValue();

		return site;
	}

	public getSitesPaginated(
		payload: GetSitesPayload,
		clearCache = false
	): Observable<PaginationResponse<SiteModel>> {
		if (clearCache) {
			this.paginator.clearCache();
		}

		this.store.setIsFetching(true);

		return from(
			this.service
				.getSites(payload)
				.then(response => {
					const meta = response._page;

					this.store.update({
						meta,
						isFetching: false,
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
					this.store.update({
						error,
						isFetching: false,
					});
					return error;
				})
		);
	}

	public getSite(payload: GetSitePayload): void {
		this.store.setIsFetching(true);
		this.service
			.getSite(payload)
			.then(response => {
				this.store.update({
					site: response,
					isFetching: false,
				});
			})
			.catch(error => {
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

	public updateSite(payload: UpdateSitePayload): Promise<SiteResponse> {
		this.store.setIsUpdating(true);
		const alertMessages = getAlertMessages(payload.body.name);

		return this.service
			.updateSite(payload)
			.then(response => {
				this.store.update({
					site: response,
					isUpdating: false,
				});
				this.alertService(alertMessages.update.success, 'update', 'success');
				return response;
			})
			.catch(error => {
				this.store.update({
					isUpdating: false,
				});
				this.alertService(alertMessages.update.error, 'update', 'error');
				return error;
			});
	}

	public updateSiteActivation(payload: UpdateSiteActivationPayload): void {
		this.store.setIsActivating(true);
		this.service
			.updateSiteActivation(payload)
			.then(response => {
				this.store.update({
					site: response,
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

	public resetSite(): void {
		this.store.update({
			site: undefined,
		});
	}

	public archiveSite(id: string): Promise<null> {
		this.store.setIsArchiving(true);

		return this.service.archiveSite(id).finally(() => this.store.setIsArchiving(false));
	}

	private alertService(
		alertProps: AlertProps,
		containerId: 'create' | 'update',
		type: 'success' | 'error'
	): void {
		const alertType = type === 'error' ? 'danger' : type;
		const alertOptions = { containerId: ALERT_CONTAINER_IDS[containerId] };

		// alertService.dismiss();
		alertService[alertType](alertProps, alertOptions);
	}
}

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery, sitesPaginator);
