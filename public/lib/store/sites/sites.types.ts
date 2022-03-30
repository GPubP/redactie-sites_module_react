import { SearchParams } from '@redactie/utils';

import { AlertMessages } from './sites.alertMessages';

// CREATE
export interface CreateSitePayload {
	name: string;
	description: string;
	contentTypes: string[];
	languages: string[];
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
	alertType?: keyof AlertMessages;
	alertName?: string;
}

// SITE ACTIVATION
export interface UpdateSiteActivationPayload {
	id: string;
	activate: boolean;
}
