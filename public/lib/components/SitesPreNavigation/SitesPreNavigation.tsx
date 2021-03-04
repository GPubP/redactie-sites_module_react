import classnames from 'classnames/bind';
import React, { FC } from 'react';
import { generatePath, Link, matchPath, useLocation } from 'react-router-dom';

import { useSite } from '../../hooks';
import { MODULE_PATHS, TENANT_ROOT } from '../../sites.const';

import styles from './SitesPreNavigation.module.scss';

const cx = classnames.bind(styles);

const SitesPreNavigation: FC = () => {
	const { pathname } = useLocation();
	const match = matchPath(pathname, {
		path: '/:tenantId/sites/:siteId',
		strict: false,
		exact: false,
	});
	const { siteId, tenantId } = (match?.params as { siteId: string; tenantId: string }) ?? {};
	const [site] = useSite(siteId);

	if (!match || !site) {
		return null;
	}

	const path = generatePath(`${TENANT_ROOT}${MODULE_PATHS.root}${MODULE_PATHS.detail}/content`, {
		tenantId,
		siteId,
	});

	return (
		<div className={cx('sites-pre-navigation')}>
			<Link className="u-text-bold" to={path}>
				{site.data.name}
			</Link>
		</div>
	);
};

export default SitesPreNavigation;
