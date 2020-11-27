import { AlertProps } from '@redactie/utils';

export type AlertMessages = Record<
	'create' | 'update' | 'fetch' | 'fetchOne',
	{ [key in 'success' | 'error']: AlertProps }
>;

export const getAlertMessages = (name?: string): AlertMessages => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt een nieuwe site ${name} aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van de site ${name} is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt de site ${name} succesvol gewijzigd`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van de site ${name} is mislukt`,
		},
	},
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van sites is mislukt',
		},
		success: {
			title: 'Ophalen',
			message: 'Ophalen van sites is gelukt',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van site is mislukt',
		},
		success: {
			title: 'Ophalen',
			message: 'Ophalen van site is gelukt',
		},
	},
});
