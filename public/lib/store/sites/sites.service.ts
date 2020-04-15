import {
	CreateSitePayload,
	GetSitePayload,
	GetSitesPayload,
	SitesApiService,
	sitesApiService,
	UpdateSiteActivationPayload,
	UpdateSitePayload,
} from '../../services/sites';

import { SitesStore, sitesStore } from './sites.store';

export class SitesService {
	constructor(private store: SitesStore, private sitesService: SitesApiService) {}

	public getSites(payload: GetSitesPayload): void {
		this.store.setIsFetching(true);
		this.sitesService
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
		this.sitesService
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
		return this.sitesService
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
		return this.sitesService
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
		this.sitesService
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

export const sitesService = new SitesService(sitesStore, sitesApiService);
