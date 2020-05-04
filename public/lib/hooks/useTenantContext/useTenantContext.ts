import { useContext } from 'react';

import { TenantContext, TenantContextValue } from '../../context';

const useTenantContext = (): TenantContextValue => {
	return useContext(TenantContext);
};

export default useTenantContext;
