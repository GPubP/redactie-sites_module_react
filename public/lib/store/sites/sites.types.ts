import { SearchParams } from '@redactie/utils';

// CREATE
export interface CreateSitePayload {
	name: string;
	description: string;
	contentTypes: string[];
}

export interface CreateSitePayloadOptions {
	successAlertContainerId: string;
	errorAlertContainerId: string;
}

// READ ALL
export type GetSitesPayload = SearchParams;

// READ ONE
export interface GetSitePayload {
	id: string;
}

export interface GetSitePayloadOptions {
	alertContainerId: string;
}

// UPDATE
export interface UpdateSitePayload {
	id: string;
	body: CreateSitePayload;
}

export interface UpdateSitePayloadOptions {
	alertContainerId: string;
}

// SITE ACTIVATION
export interface UpdateSiteActivationPayload {
	id: string;
	activate: boolean;
}
