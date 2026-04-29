import { Article } from "../../domain/entities/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { ArticleMapper } from "../mappers/ArticleMapper";
import api from "@/utils/api";

export class ApiArticleRepository implements ArticleRepository {
    async getByCompany(companyId: string): Promise<Article[]> {
        const response: any = await api.get('v1/articles', {
            searchParams: { company_id: companyId }
        }).json();
        
        const data = response.data || response;
        return data.map((dto: any) => ArticleMapper.toDomain(dto));
    }

    async save(article: Article): Promise<Article> {
        const dto = ArticleMapper.toDTO(article);
        const response: any = await api.post('v1/articles', { json: dto }).json();
        return ArticleMapper.toDomain(response.data || response);
    }

    async delete(id: number): Promise<void> {
        await api.delete(`v1/articles/${id}`);
    }
}
