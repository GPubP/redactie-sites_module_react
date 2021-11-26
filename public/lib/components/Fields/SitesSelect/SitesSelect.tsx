import { FieldOption, InputFieldProps } from '@redactie/form-renderer-module';
import { DataLoader } from '@redactie/utils';
import React, { ReactElement, useMemo } from 'react';

import formRendererConnector from '../../../connectors/formRenderer';
import { usePaginatedSites } from '../../../hooks';

const SitesSelect: React.FC<InputFieldProps> = ({
	fieldSchema,
	fieldProps,
	fieldHelperProps,
}: InputFieldProps) => {
	/**
	 * HOOKS
	 */
	const { loading, pagination } = usePaginatedSites({
		page: 1,
		pagesize: -1,
	});
	const siteOptions: FieldOption[] = useMemo(() => {
		if (loading || !pagination?.data) {
			return [];
		}

		return pagination.data.map(
			site =>
				({
					value: {
						value: site.uuid,
						key: site.uuid,
						label: site.data.name,
					},
				} as FieldOption)
		);
	}, [loading, pagination]);

	/**
	 * FORM COMPONENT FETCH
	 */
	const CheckBoxList = formRendererConnector.api.fieldRegistry.get('core', 'checkboxList')
		?.component;

	if (!CheckBoxList) {
		return null;
	}

	const renderCheckboxList = (): ReactElement => (
		<>
			<CheckBoxList
				fieldSchema={{
					...fieldSchema,
					config: {
						...(fieldSchema.config || {}),
						options: (siteOptions as unknown) as FieldOption[],
					},
				}}
				fieldHelperProps={fieldHelperProps}
				fieldProps={fieldProps}
			/>
		</>
	);

	return <DataLoader loadingState={loading} render={renderCheckboxList} />;
};

export default SitesSelect;
