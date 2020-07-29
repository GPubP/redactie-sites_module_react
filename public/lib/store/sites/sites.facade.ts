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

	// TODO: check why this isn't working
	// public getSitesPaginated(
	// 	payload: GetSitesPayload,
	// 	clearCache = false
	// ): Observable<PaginationResponse<SiteModel>> {
	// 	if (clearCache) {
	// 		this.paginator.clearCache();
	// 	}

	// 	this.store.setIsFetching(true);
	// 	this.paginator.setPage(payload.page);

	// 	const getSites$ = from(
	// 		this.service
	// 			.getSites(payload)
	// 			.then(response => {
	// 				this.store.setIsFetching(false);
	// 				const meta = response._page;

	// 				this.store.update({
	// 					meta,
	// 				});

	// 				return {
	// 					perPage: parseInt(response._page.size, 10),
	// 					currentPage: parseInt(response._page.number, 10),
	// 					lastPage: response._page.totalPages,
	// 					total: response._page.totalElements,
	// 					data: response._embedded,
	// 				};
	// 			})
	// 			.catch(error => {
	// 				this.store.setIsFetching(false);
	// 				this.store.setError(error);
	// 				return error;
	// 			})
	// 	);

	// 	return this.paginator.getPage(() => getSites$);
	// }

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
					});

					this.store.setIsFetching(false);

					return {
						perPage: parseInt(response._page.size, 10),
						currentPage: parseInt(response._page.number, 10),
						lastPage: response._page.totalPages,
						total: response._page.totalElements,
						data: response._embedded,
					};
				})
				.catch(error => {
					this.store.setIsFetching(false);
					this.store.setError(error);
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
				});
			})
			.catch(err => {
				this.store.setError(err);
			})
			.finally(() => this.store.setIsFetching(false));
	}

	public createSite(payload: CreateSitePayload): Promise<SiteResponse | undefined> {
		this.store.setIsCreating(true);

		return this.service
			.createSite(payload)
			.then(site => {
				this.store.setIsCreating(false);

				return site;
			})
			.catch(err => {
				this.store.setError(err);

				throw err;
			})
			.finally(() => this.store.setIsCreating(false));
	}

	public updateSite(payload: UpdateSitePayload): Promise<boolean> {
		this.store.setIsUpdating(true);
		return this.service
			.updateSite(payload)
			.then(() => {
				return true;
			})
			.catch(err => {
				this.store.setError(err);

				return false;
			})
			.finally(() => this.store.setIsUpdating(false));
	}

	public updateSiteActivation(payload: UpdateSiteActivationPayload): void {
		this.store.setIsActivating(true);
		this.service
			.updateSiteActivation(payload)
			.then(response => {
				this.store.setLoading(false);
				this.store.update({
					site: response,
				});
			})
			.catch(err => {
				this.store.setError(err);
			})
			.finally(() => this.store.setIsActivating(false));
	}

	public archiveSite(id: string): Promise<null> {
		this.store.setIsArchiving(true);

		return this.service.archiveSite(id).finally(() => this.store.setIsArchiving(false));
	}
}

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery, sitesPaginator);
