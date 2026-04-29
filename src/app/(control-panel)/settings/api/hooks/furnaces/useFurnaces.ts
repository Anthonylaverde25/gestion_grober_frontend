import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiFurnaceRepository } from "@/app/core/infrastructure/repositories/ApiFurnaceRepository";
import { GetFurnacesByCompanyUseCase } from "@/app/core/application/use-cases/GetFurnacesByCompanyUseCase";
import { CreateFurnaceUseCase } from "@/app/core/application/use-cases/CreateFurnaceUseCase";
import { useSnackbar } from "notistack";

const furnaceRepository = new ApiFurnaceRepository();
const getFurnacesUseCase = new GetFurnacesByCompanyUseCase(furnaceRepository);
const createFurnaceUseCase = new CreateFurnaceUseCase(furnaceRepository);

export function useFurnaces() {
  const { activeCompany, isLoadingContext } = useBusiness();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: furnaces = [], isLoading, error } = useQuery({
    queryKey: ['furnaces', activeCompany?.id],
    queryFn: () => getFurnacesUseCase.execute(activeCompany!.id),
    enabled: !!activeCompany?.id && !isLoadingContext,
  });

  const createFurnaceMutation = useMutation({
    mutationFn: (data: { name: string; glassTypeId: number; maxCapacityTons: number }) => {
      if (!activeCompany?.id) throw new Error("No hay una empresa activa seleccionada");
      return createFurnaceUseCase.execute({ ...data, companyId: activeCompany.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furnaces', activeCompany?.id] });
      enqueueSnackbar("Horno creado correctamente", { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || "Error al crear el horno", { variant: 'error' });
    }
  });

  return {
    furnaces,
    isLoading: isLoading || isLoadingContext,
    error,
    createFurnace: createFurnaceMutation.mutateAsync,
    isCreating: createFurnaceMutation.isPending,
    activeCompany
  };
}
