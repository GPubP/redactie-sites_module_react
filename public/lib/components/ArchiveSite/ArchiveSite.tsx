import {
	Button,
	Card,
	CardBody,
	CardDescription,
	CardTitle,
	Modal,
} from '@acpaas-ui/react-components';
import React, { FC } from 'react';

import TranslationsConnector from '../../connectors/translations';
import SitesStatus from '../SiteStatus/SiteStatus';
import { SitesDetailFormProps } from '../SitesDetailForm/SitesDetailForm.types';

const ArchiveSite: FC<SitesDetailFormProps> = ({
	active = false,
	activeLoading = false,
	archiveLoading = false,
	onArchive = () => null,
}) => {
	const [t] = TranslationsConnector.useCoreTranslation();
	const getLoadingStateBtnProps = (
		loading: boolean,
		defaultIcon?: string
	): { iconLeft: string; disabled: boolean } | null => {
		if (loading) {
			return {
				iconLeft: 'circle-o-notch fa-spin',
				disabled: true,
			};
		}

		if (defaultIcon) {
			return {
				iconLeft: defaultIcon,
				disabled: false,
			};
		}

		return null;
	};

	return (
		<Card className="u-margin-top">
			<CardBody>
				<CardTitle>
					Status: <SitesStatus active={!!active} />
				</CardTitle>
				<CardDescription>
					Bepaal of deze site actief is of niet. Het gevolg hiervan is of de site en zijn
					content en/of content types al dan niet beschikbaar zijn.
				</CardDescription>
				<Button
					{...getLoadingStateBtnProps(activeLoading)}
					onClick={activeLoading}
					className="u-margin-top u-margin-right-xs"
					type="primary"
				>
					{active ? t('BUTTON_DEACTIVATE') : t('BUTTON_ACTIVATE')}
				</Button>

				{/**
				 * TODO: move this to editorial-ui with proper div class handling and also make buttons configurable
				 */}
				<div style={{ display: 'inline-block' }}>
					<Modal
						appElement="#root"
						title="Ben je zeker dat je deze site wil archiveren?"
						confirmText={t('MODAL_CONFIRM-ARCHIVE')}
						denyText={t('MODAL_CANCEL')}
						shouldCloseOnEsc={true}
						shouldCloseOnOverlayClick={true}
						onConfirm={onArchive}
						triggerElm={
							<Button
								{...getLoadingStateBtnProps(archiveLoading, 'archive')}
								onClick={onArchive}
								className="u-margin-top"
								type="danger"
							>
								{t('BUTTON_ARCHIVE')}
							</Button>
						}
					>
						<p>
							De site archiveren betekent dat alle gegevens gekoppeld aan de site ook
							gearchiveerd worden. Deze actie kan niet ongedaan gemaakt worden zonder
							input van een systeem beheerder.
						</p>
					</Modal>
				</div>
			</CardBody>
		</Card>
	);
};

export default ArchiveSite;
