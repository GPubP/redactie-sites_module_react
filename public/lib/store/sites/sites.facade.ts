import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
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

		return this.service
			.createSite(payload)
			.then(site => {
				this.store.setIsCreating(false);
				return site;
			})
			.catch(error => {
				this.store.update({
					error,
					isCreating: false,
				});
				throw error;
			});
	}

	public updateSite(payload: UpdateSitePayload): void {
		this.store.setIsUpdating(true);
		this.service
			.updateSite(payload)
			.then(response => {
				this.store.update({
					site: response,
					isUpdating: false,
				});
			})
			.catch(error => {
				this.store.update({
					error,
					isUpdating: false,
				});
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

	public archiveSite(id: string): Promise<null> {
		this.store.setIsArchiving(true);

		return this.service.archiveSite(id).finally(() => this.store.setIsArchiving(false));
	}
}

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery, sitesPaginator);
