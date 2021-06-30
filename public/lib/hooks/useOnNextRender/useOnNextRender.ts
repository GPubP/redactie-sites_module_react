import { useEffect, useState } from 'react';

// Be aware!
// This will trigger an extra render so use with caution!
const useOnNextRender = <Params extends unknown[] = [], Response = void>(
	fn: (...params: Params) => Response
): ((...params: Params) => void) => {
	const [runOnNextRender, setRunOnNextRender] = useState<boolean>(false);
	const [params, setParams] = useState<Params>();

	useEffect(() => {
		if (runOnNextRender) {
			fn(...((params || []) as Params));
			setRunOnNextRender(false);
		}
	}, [fn, runOnNextRender]); // eslint-disable-line

	return (...params) => {
		setParams(params);
		setRunOnNextRender(true);
	};
};

export default useOnNextRender;
