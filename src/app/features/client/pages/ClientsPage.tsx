import FusePageSimple from '@fuse/core/FusePageSimple';
import ClientsTable from '../components/ClientsTable';
import { useBusiness } from '@/app/contexts/BusinessContext';
import Box from '@mui/material/Box';
import PageHeader from '@/app/components/PageHeader';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { ClientDialog } from '../components/ClientDialog';
import { useClients } from '../hooks/useClients';
import { ClientFormData } from '../schemas/ClientSchema';
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
 * ClientsPage Component
 * Main page for managing business clients.
 * Optimized for Dark Mode.
 */
export default function ClientsPage() {
  const { activeCompany } = useBusiness();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clients, isLoading, createClient, isCreating } = useClients();

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (data: ClientFormData) => {
    await createClient(data);
  };

  return (
    <>
      <Root
        header={
          <PageHeader
            title={<Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Gestión de Clientes</Typography>}
            subtitle={`Administrando la cartera de clientes para ${activeCompany?.name || 'la organización'}`}
            actions={
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                sx={{ borderRadius: '8px', fontWeight: 800, textTransform: 'none' }}
                size="large"
                onClick={handleOpenDialog}
              >
                Nuevo Cliente
              </Button>
            }
          />
        }
        content={
          <Box className="w-full h-full flex flex-col" sx={{ bgcolor: 'background.default' }}>
             {isLoading ? (
                <Box className="flex-1 flex items-center justify-center"><CircularProgress /></Box>
            ) : clients.length === 0 ? (
                <Box className="flex-1 flex items-center justify-center"><WatermarkView /></Box>
            ) : (
                <ClientsTable />
            )}
          </Box>
        }
      />

      <ClientDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
      />
    </>
  );
}
