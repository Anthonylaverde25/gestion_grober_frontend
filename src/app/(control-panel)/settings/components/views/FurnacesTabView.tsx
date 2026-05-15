import { SettingsHeader } from "../ui/SettingsHeader";
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
        <SettingsHeader
          title="Configuración de Hornos"
          description="Gestione los parámetros técnicos y operativos de los hornos de la planta."
          action={{
            label: "Nuevo Horno",
            icon: <AddIcon />,
            onClick: handleOpenDialog
          }}
        />

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
