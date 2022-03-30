import { parseSearchParams } from '@redactie/utils';
import { propOr } from 'ramda';

import apiService from '../api/api.service';

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
	public async getSites(searchParams: GetSitesPayload): Promise<SitesResponse> {
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
		return await apiService
			.put(`sites/${id}`, {
				json: {
					...body,
					languages: (body.languages || []).map(language =>
						propOr(language, 'uuid')(language)
					),
				},
			})
			.json();
	}

	public async updateSiteActivation({
		id,
		activate,
	}: UpdateSiteActivationPayload): Promise<SiteResponse> {
		const updateType = activate ? 'activate' : 'deactivate';
		return await apiService.put(`sites/${id}/${updateType}`).json();
	}

	public async archiveSite(id: string): Promise<null> {
		return await apiService.delete(`sites/${id}`).json();
	}
}

export const sitesApiService = new SitesApiService();
