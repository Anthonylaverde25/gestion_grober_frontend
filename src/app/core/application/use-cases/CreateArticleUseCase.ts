import { Article } from "../../domain/entities/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";

export class CreateArticleUseCase {
  constructor(private repository: ArticleRepository) {}

  async execute(companyId: string, name: string): Promise<Article> {
    const article = Article.create({
        id: '', 
        companyId,
        name
    });
    return this.repository.save(article);
  }
}
