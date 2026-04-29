import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiArticleRepository } from "@/app/core/infrastructure/repositories/ApiArticleRepository";
import { GetArticlesByCompanyUseCase } from "@/app/core/application/use-cases/GetArticlesByCompanyUseCase";
import { CreateArticleUseCase } from "@/app/core/application/use-cases/CreateArticleUseCase";
import { useSnackbar } from "notistack";

const articleRepository = new ApiArticleRepository();
const getArticlesUseCase = new GetArticlesByCompanyUseCase(articleRepository);
const createArticleUseCase = new CreateArticleUseCase(articleRepository);

export function useArticles() {
  const { activeCompany, isLoadingContext } = useBusiness();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['articles', activeCompany?.id],
    queryFn: () => getArticlesUseCase.execute(activeCompany!.id),
    enabled: !!activeCompany?.id && !isLoadingContext,
  });

  const createArticleMutation = useMutation({
    mutationFn: (name: string) => {
      if (!activeCompany?.id) throw new Error("No hay una empresa activa seleccionada");
      return createArticleUseCase.execute(activeCompany.id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles', activeCompany?.id] });
      enqueueSnackbar("Artículo creado correctamente", { variant: 'success' });
    },
    onError: (error: any) => {
      console.error("Error creating article:", error);
      enqueueSnackbar(error.message || "Error al crear el artículo", { variant: 'error' });
    }
  });

  return {
    articles,
    isLoading: isLoading || isLoadingContext,
    error,
    refetch,
    activeCompany,
    createArticle: createArticleMutation.mutateAsync,
    isCreating: createArticleMutation.isPending
  };
}
