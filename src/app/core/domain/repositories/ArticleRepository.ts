import { Article } from "../entities/Article";

export interface ArticleRepository {
    getByCompany(companyId: string): Promise<Article[]>;
    findById(id: string): Promise<Article | null>;
    save(article: Article): Promise<Article>;
    delete(id: string): Promise<void>;
}
