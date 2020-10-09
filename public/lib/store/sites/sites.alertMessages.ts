import { AlertProps } from '@redactie/utils';

import { SiteResponse } from '../../services/sites';

export type AlertMessages = Record<
	'create' | 'update',
	{ [key in 'success' | 'error']: AlertProps }
>;

export const getAlertMessages = (name: string): AlertMessages => ({
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
});
