import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/PlayArrow';
import PageHeader from '@/app/components/PageHeader';
import FusePageSimple from '@fuse/core/FusePageSimple';
import CampaignsTable from '../components/CampaignsTable';
import CampaignDialog from '../components/CampaignDialog';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignFormData } from '../schemas/CampaignSchema';
import { useBusiness } from '@/app/contexts/BusinessContext';

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    padding: 24,
    backgroundColor: theme.palette.background.default,
  },
}));

export default function CampaignsPage() {
  const { activeCompany } = useBusiness();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { startCampaign, isStarting } = useCampaigns();

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (data: CampaignFormData) => {
    await startCampaign(data);
  };

  return (
    <>
      <Root
        header={
          <PageHeader
            title="Monitoreo de Campañas"
            subtitle={`Control de producción en tiempo real para ${activeCompany?.name || 'la organización'}`}
            actions={
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                className="rounded-8 font-bold"
                size="large"
                onClick={handleOpenDialog}
              >
                Iniciar Campaña
              </Button>
            }
          />
        }
        content={
          <Box className="w-full h-full flex flex-col">
            <CampaignsTable />
          </Box>
        }
      />

      <CampaignDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        isSubmitting={isStarting}
      />
    </>
  );
}
