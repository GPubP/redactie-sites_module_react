import { useNavigate } from '../../hooks';
import { MODULE_PATHS } from '../../sites.const';

const useHomeBreadcrumb = (): { name: string; target: string } => {
	const { generatePath } = useNavigate();

	return {
		name: 'Home',
		target: generatePath(MODULE_PATHS.dashboard),
	};
};

export default useHomeBreadcrumb;
