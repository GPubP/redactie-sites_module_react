import apiService, { parseSearchParams } from '../api/api.service';

import { DEFAULT_SITES_SEARCH_PARAMS } from './sites.service.const';
import {
	CreateSitePayload,
	GetSitePayload,
	GetSitesPayload,
	SiteResponse,
	SitesResponse,
	UpdateSiteActivationPayload,
	UpdateSitePayload,
} from './sites.service.types';

export class SitesApiService {
	public async getSites(
		searchParams: GetSitesPayload = DEFAULT_SITES_SEARCH_PARAMS
	): Promise<SitesResponse> {
		return await apiService
			.get('sites', {
				searchParams: parseSearchParams(searchParams),
			})
			.json<SitesResponse>();
	}

	public async getSite({ id }: GetSitePayload): Promise<SiteResponse> {
		return await apiService.get(`sites/${id}`).json<SiteResponse>();
	}

	public async createSite(payload: CreateSitePayload): Promise<SiteResponse> {
		return await apiService.post('sites', { json: payload }).json();
	}

	public async updateSite({ body, id }: UpdateSitePayload): Promise<SiteResponse> {
		return await apiService.put(`sites/${id}`, { json: body }).json();
	}

	public async updateSiteActivation({
		id,
		activate,
	}: UpdateSiteActivationPayload): Promise<SiteResponse> {
		const updateType = activate ? 'activate' : 'deactivate';
		return await apiService.put(`sites/${id}/${updateType}`).json();
	}
}

export const sitesApiService = new SitesApiService();
