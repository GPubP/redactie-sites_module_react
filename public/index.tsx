import Core from '@redactie/redactie-core';
import React, { FC } from 'react';

const SitesComponent: FC = () => (
	<div>
		<h1>Sites</h1>
	</div>
);

Core.routes.register({
	path: '/sites',
	component: SitesComponent,
	label: 'Sites',
});

export { SitesComponent };
