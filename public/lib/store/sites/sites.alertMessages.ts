import { AlertProps } from '@redactie/utils';

export type AlertMessages = Record<
	'create' | 'update' | 'fetch' | 'fetchOne' | 'activateLanguage' | 'deactivateLanguage',
	{ [key in 'success' | 'error']: AlertProps }
>;

export const getAlertMessages = (name?: string): AlertMessages => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `Je hebt een nieuwe site ${name} aangemaakt.`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van de site ${name} is mislukt.`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `Je hebt de site ${name} succesvol gewijzigd.`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van de site ${name} is mislukt.`,
		},
	},
	activateLanguage: {
		success: {
			title: 'Taal geactiveerd',
			message: `Je hebt de taal ${name} geactiveerd. Vanaf nu kan je in het formulier velden instellen die een variant hebben per taal. Je herkent deze velden aan de grijze achtergrond.`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Activeren van de taal ${name} is mislukt.`,
		},
	},
	deactivateLanguage: {
		success: {
			title: 'Taal gedactiveerd',
			message: `Je hebt de taal ${name} gedeactiveerd. De content items in deze taal zijn niet meer beschikbaar in de redactie en de frontend. Heractiveer de taal om de content items opnieuw beschikbaar te maken.`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Deactiveren van de taal ${name} is mislukt.`,
		},
	},
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van sites is mislukt.',
		},
		success: {
			title: 'Ophalen',
			message: 'Ophalen van sites is gelukt.',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van site is mislukt.',
		},
		success: {
			title: 'Ophalen',
			message: 'Ophalen van site is gelukt.',
		},
	},
});
