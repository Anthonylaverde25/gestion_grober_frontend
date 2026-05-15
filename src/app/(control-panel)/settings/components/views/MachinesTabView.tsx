import { SettingsHeader } from "../ui/SettingsHeader";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { useFurnaces } from "../../api/hooks/furnaces/useFurnaces";
import { useMachines } from "../../api/hooks/machines/useMachines";
import { useArticles } from "@/app/features/articles/hooks/useArticles";
import { Machine } from "@/app/core/domain/entities/Machine";
import { MachineArticleDialog } from "../MachineArticleDialog";
import { MachineDialog } from "../MachineDialog";
import { MachinesTable } from "../MachinesTable";
import { MachineFormData } from "../../schemas/MachineSchema";

function MachinesTabView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const { furnaces, isLoading: isLoadingFurnaces } = useFurnaces();
  const { articles, isLoading: isLoadingArticles } = useArticles();
  const {
    machines,
    isLoading,
    createMachine,
    isCreating,
    updateMachine,
    isUpdating,
    changeMachineArticle,
    isChangingArticle,
  } = useMachines();

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateMachine({ id, data: { status } });
  };

  const furnaceNamesById = useMemo(
    () =>
      furnaces.reduce<Record<string, string>>((accumulator, furnace) => {
        accumulator[furnace.id] = furnace.name;
        return accumulator;
      }, {}),
    [furnaces],
  );

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleOpenArticleDialog = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsArticleDialogOpen(true);
  };
  const handleCloseArticleDialog = () => {
    setSelectedMachine(null);
    setIsArticleDialogOpen(false);
  };

  const articleNamesById = useMemo(
    () =>
      articles.reduce<Record<string, string>>((accumulator, article) => {
        accumulator[article.id] = article.name;
        return accumulator;
      }, {}),
    [articles],
  );

  const handleSubmit = async (data: MachineFormData) => {
    await createMachine({
      furnaceId: data.furnaceId!,
      name: data.name!,
      status: data.status!,
    });
  };

  const handleChangeArticle = async (articleId: string | null) => {
    if (!selectedMachine) {
      return;
    }

    await changeMachineArticle({
      machineId: selectedMachine.id,
      articleId,
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <SettingsHeader
          title="Configuración de Máquinas"
          description="Gestione la maquinaria conectada a los hornos de producción."
          action={{
            label: "Nueva Máquina",
            icon: <AddIcon />,
            onClick: handleOpenDialog,
            disabled: furnaces.length === 0
          }}
        />

        <Box className="w-full">
          <MachinesTable
            data={machines}
            furnaceNamesById={furnaceNamesById}
            articleNamesById={articleNamesById}
            isLoading={isLoading || isLoadingFurnaces || isLoadingArticles}
            onChangeArticle={handleOpenArticleDialog}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={isUpdating}
          />
        </Box>
      </div>

      <MachineDialog
        open={isDialogOpen}
        furnaces={furnaces}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
      />

      <MachineArticleDialog
        open={isArticleDialogOpen}
        machine={selectedMachine}
        articles={articles}
        currentArticleName={
          selectedMachine?.currentArticleId
            ? articleNamesById[selectedMachine.currentArticleId]
            : undefined
        }
        onClose={handleCloseArticleDialog}
        onSubmit={handleChangeArticle}
        isSubmitting={isChangingArticle}
      />
    </div>
  );
}

export default MachinesTabView;
