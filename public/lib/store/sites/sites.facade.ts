import {
	CreateSitePayload,
	GetSitePayload,
	GetSitesPayload,
	sitesApiService,
	SitesApiService,
	UpdateSiteActivationPayload,
	UpdateSitePayload,
} from '../../services/sites';

import { SitesQuery, sitesQuery } from './sites.query';
import { SitesStore, sitesStore } from './sites.store';

export class SitesFacade {
	constructor(
		private store: SitesStore,
		private service: SitesApiService,
		private query: SitesQuery
	) {}

	public readonly meta$ = this.query.meta$;
	public readonly sites$ = this.query.sites$;
	public readonly site$ = this.query.site$;
	public readonly isFetching$ = this.query.isFetching$;
	public readonly isCreating$ = this.query.isCreating$;
	public readonly isUpdating$ = this.query.isUpdating$;
	public readonly isActivating$ = this.query.isActivating$;
	public readonly error$ = this.query.error$;

	public getSites(payload: GetSitesPayload): void {
		this.store.setIsFetching(true);
		this.service
			.getSites(payload)
			.then(response => {
				this.store.setIsFetching(false);
				const sites = response._embedded;
				const meta = response._page;

				this.store.set(sites);
				this.store.update({
					meta,
				});
			})
			.catch(err => {
				this.store.setIsFetching(false);
				this.store.setError(err);
			});
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

	public createSite(payload: CreateSitePayload): Promise<boolean> {
		this.store.setIsCreating(true);
		return this.service
			.createSite(payload)
			.then(() => {
				this.store.setIsCreating(false);

				return true;
			})
			.catch(err => {
				this.store.setError(err);
				return false;
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
}

export const sitesFacade = new SitesFacade(sitesStore, sitesApiService, sitesQuery);
