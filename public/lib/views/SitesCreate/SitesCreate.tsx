import { ContextHeader } from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { SitesDetailForm } from '../../components';
import { generateDetailFormState } from '../../sites.helpers';
import { createSite } from '../../sites.service';
import { SitesDetailFormState, SitesRouteProps } from '../../sites.types';
import { Tab } from '../../types';

const TABS: Tab[] = [{ name: 'Instellingen', target: 'instellingen', active: true }];

const SitesCreate: FC<SitesRouteProps> = ({ basePath }) => {
	/**
	 * Hooks
	 */
	const history = useHistory();

	/**
	 * Methods
	 */
	const navigateToOverview = (): void => {
		history.push(`${basePath}/beheer`);
	};

	const onSubmit = ({ name }: SitesDetailFormState): void => {
		const request = { name, description: name };
		const response = createSite(request);

		if (response) {
			// Create was succesful, go back to the overview
			navigateToOverview();
		}
	};

	/**
	 * Render
	 */
	return (
		<>
			<ContextHeader tabs={TABS} title="Site aanmaken" />
			<div className="u-margin-top u-container u-wrapper">
				<SitesDetailForm
					initialState={generateDetailFormState()}
					onCancel={navigateToOverview}
					onSubmit={onSubmit}
				/>
			</div>
		</>
	);
};

export default SitesCreate;
