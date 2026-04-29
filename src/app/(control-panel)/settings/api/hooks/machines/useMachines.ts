import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiMachineRepository } from "@/app/core/infrastructure/repositories/ApiMachineRepository";
import { GetMachinesByCompanyUseCase } from "@/app/core/application/use-cases/GetMachinesByCompanyUseCase";
import { CreateMachineUseCase } from "@/app/core/application/use-cases/CreateMachineUseCase";
import { ChangeMachineCurrentArticleUseCase } from "@/app/core/application/use-cases/ChangeMachineCurrentArticleUseCase";

const machineRepository = new ApiMachineRepository();
const getMachinesByCompanyUseCase = new GetMachinesByCompanyUseCase(
  machineRepository,
);
const createMachineUseCase = new CreateMachineUseCase(machineRepository);
const changeMachineCurrentArticleUseCase =
  new ChangeMachineCurrentArticleUseCase(machineRepository);

export function useMachines() {
  const { activeCompany, isLoadingContext } = useBusiness();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: machines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["machines", activeCompany?.id],
    queryFn: () => getMachinesByCompanyUseCase.execute(activeCompany!.id),
    enabled: !!activeCompany?.id && !isLoadingContext,
  });

  const createMachineMutation = useMutation({
    mutationFn: (data: {
      furnaceId: string;
      name: string;
      status: "operational" | "maintenance" | "shutdown";
    }) => {
      if (!activeCompany?.id) {
        throw new Error("No hay una empresa activa seleccionada");
      }

      return createMachineUseCase.execute({
        ...data,
        companyId: activeCompany.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["machines", activeCompany?.id],
      });
      enqueueSnackbar("Máquina creada correctamente", { variant: "success" });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || "Error al crear la máquina", {
        variant: "error",
      });
    },
  });

  const changeMachineArticleMutation = useMutation({
    mutationFn: ({
      machineId,
      articleId,
    }: {
      machineId: string;
      articleId: string | null;
    }) => changeMachineCurrentArticleUseCase.execute(machineId, articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["machines", activeCompany?.id],
      });
      enqueueSnackbar("Artículo actual actualizado correctamente", {
        variant: "success",
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || "Error al cambiar el artículo", {
        variant: "error",
      });
    },
  });

  return {
    machines,
    isLoading: isLoading || isLoadingContext,
    error,
    createMachine: createMachineMutation.mutateAsync,
    isCreating: createMachineMutation.isPending,
    changeMachineArticle: changeMachineArticleMutation.mutateAsync,
    isChangingArticle: changeMachineArticleMutation.isPending,
    activeCompany,
  };
}
