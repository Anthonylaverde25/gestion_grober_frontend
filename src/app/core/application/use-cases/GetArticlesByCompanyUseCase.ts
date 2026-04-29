import { Article } from "../../domain/entities/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";

export class GetArticlesByCompanyUseCase {
    constructor(private articleRepository: ArticleRepository) {}

    async execute(companyId: string): Promise<Article[]> {
        if (!companyId) {
            return [];
        }
        return this.articleRepository.getByCompany(companyId);
    }
}
