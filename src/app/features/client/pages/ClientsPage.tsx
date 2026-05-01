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

/**
 * ClientsPage Component
 * Main page for managing business clients.
 */
export default function ClientsPage() {
  const { activeCompany } = useBusiness();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createClient, isCreating } = useClients();

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
            title="Gestión de Clientes"
            subtitle={`Administrando la cartera de clientes para ${activeCompany?.name || 'la organización'}`}
            actions={
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                className="rounded-8 font-bold"
                size="large"
                onClick={handleOpenDialog}
              >
                Nuevo Cliente
              </Button>
            }
          />
        }
        content={
          <Box className="w-full h-full flex flex-col">
            <ClientsTable />
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
