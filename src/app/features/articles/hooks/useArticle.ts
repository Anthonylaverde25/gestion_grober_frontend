import { useQuery } from "@tanstack/react-query";
import { ApiArticleRepository } from "@/app/core/infrastructure/repositories/ApiArticleRepository";
import { GetArticleByIdUseCase } from "@/app/core/application/use-cases/GetArticleByIdUseCase";

const articleRepository = new ApiArticleRepository();
const getArticleByIdUseCase = new GetArticleByIdUseCase(articleRepository);

export function useArticle(articleId?: string) {
  const { data: article, isLoading, error, refetch } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticleByIdUseCase.execute(articleId!),
    enabled: !!articleId,
  });

  return {
    article,
    isLoading,
    error,
    refetch,
  };
}
