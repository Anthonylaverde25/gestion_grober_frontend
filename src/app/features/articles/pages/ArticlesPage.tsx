import FusePageSimple from '@fuse/core/FusePageSimple';
import ArticlesTable from '../components/ArticlesTable';
import { useBusiness } from '@/app/contexts/BusinessContext';
import Box from '@mui/material/Box';
import PageHeader from '@/app/components/PageHeader';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { ArticleDialog } from '../components/ArticleDialog';
import { useArticles } from '../hooks/useArticles';
import { ArticleFormData } from '../schemas/ArticleSchema';

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
 * ArticlesPage Component
 * Standardized with PageHeader and corporate layout.
 */
export default function ArticlesPage() {
  const { activeCompany } = useBusiness();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createArticle, isCreating } = useArticles();

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (data: ArticleFormData) => {
    await createArticle(data.name);
  };

  return (
    <>
      <Root
        header={
          <PageHeader
            title="Gestión de Artículos"
            subtitle={`Visualizando el catálogo de envases para ${activeCompany?.name || 'la organización'}`}
            actions={
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                className="rounded-8 font-bold"
                size="large"
                onClick={handleOpenDialog}
              >
                Nuevo Artículo
              </Button>
            }
          />
        }
        content={
          <Box className="w-full h-full flex flex-col">
            <ArticlesTable />
          </Box>
        }
      />

      <ArticleDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
      />
    </>
  );
}
