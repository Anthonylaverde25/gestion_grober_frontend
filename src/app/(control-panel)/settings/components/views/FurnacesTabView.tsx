import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useFurnaces } from "../../api/hooks/furnaces/useFurnaces";
import { FurnacesTable } from "../FurnacesTable";
import { FurnaceDialog } from "../FurnaceDialog";
import { FurnaceFormData } from "../../schemas/FurnaceSchema";
import { Box } from "@mui/material";

function FurnacesTabView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { furnaces, isLoading, createFurnace, isCreating } = useFurnaces();

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (data: FurnaceFormData) => {
    await createFurnace({
      name: data.name!,
      glassTypeId: data.glassTypeId!,
      maxCapacityTons: data.maxCapacityTons!,
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between w-full">
          <div>
            <Typography className="text-xl font-medium">
              Configuración de Hornos
            </Typography>
            <Typography color="text.secondary">
              Gestione los parámetros técnicos y operativos de los hornos de la
              planta.
            </Typography>
          </div>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Nuevo Horno
          </Button>
        </div>

        <Box className="w-full">
          <FurnacesTable data={furnaces} isLoading={isLoading} />
        </Box>
      </div>

      <FurnaceDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
      />
    </div>
  );
}

export default FurnacesTabView;
