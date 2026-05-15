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
import Typography from '@mui/material/Typography';

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

import WatermarkView from '@/app/components/ui/WatermarkView';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * CampaignsPage Component
 * Standardized with corporate PageHeader format from Articles.
 * Optimized for Dark Mode.
 */
export default function CampaignsPage() {
  const { activeCompany } = useBusiness();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { campaigns, isLoading, startCampaign, isStarting } = useCampaigns();

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
            title={<Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Monitoreo de Campañas</Typography>}
            subtitle={`Control de producción en tiempo real para ${activeCompany?.name || 'la organización'}`}
            actions={
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{ borderRadius: '8px', fontWeight: 800, textTransform: 'none' }}
                size="large"
                onClick={handleOpenDialog}
              >
                Iniciar Campaña
              </Button>
            }
          />
        }
        content={
          <Box className="w-full h-full flex flex-col" sx={{ bgcolor: 'background.default' }}>
            {isLoading ? (
                <Box className="flex-1 flex items-center justify-center"><CircularProgress /></Box>
            ) : campaigns.length === 0 ? (
                <Box className="flex-1 flex items-center justify-center"><WatermarkView /></Box>
            ) : (
                <CampaignsTable />
            )}
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
