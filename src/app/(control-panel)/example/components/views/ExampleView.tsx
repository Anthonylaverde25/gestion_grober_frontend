import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

import PageHeader from '@/app/components/PageHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function ExampleView() {
	const { t } = useTranslation('examplePage');

	return (
		<Root
			header={
				<PageHeader 
					title={t('TITLE')} 
					subtitle="Página de ejemplo del sistema."
				/>
			}
			content={
				<div className="p-6">
					<h4>Content</h4>
					<br />
					<DemoContent />
				</div>
			}
		/>
	);
}

export default ExampleView;
