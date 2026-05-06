import { Article } from "../../domain/entities/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";

export class GetArticleByIdUseCase {
    constructor(private articleRepository: ArticleRepository) {}

    async execute(id: string): Promise<Article | null> {
        return this.articleRepository.findById(id);
    }
}
