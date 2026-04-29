import { Article } from "../entities/Article";

export interface ArticleRepository {
    getByCompany(companyId: string): Promise<Article[]>;
    save(article: Article): Promise<Article>;
    delete(id: number): Promise<void>;
}
