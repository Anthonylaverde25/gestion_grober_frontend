import { Article } from "../../domain/entities/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";

export class CreateArticleUseCase {
  constructor(private repository: ArticleRepository) {}

  async execute(companyId: string, name: string, clientId?: string): Promise<Article> {
    const article = Article.create({
        id: '', 
        companyId,
        clientId,
        name
    });
    return this.repository.save(article);
  }
}
