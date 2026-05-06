import { axiosInstance } from "../../../di/container";
import { Article } from "../../domain/entities/Article";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { ArticleMapper } from "../mappers/ArticleMapper";

export class ApiArticleRepository implements ArticleRepository {
    async getByCompany(companyId: string): Promise<Article[]> {
        const response = await axiosInstance.get('/api/v1/articles', {
            params: { company_id: companyId }
        });
        
        const data = response.data.data || response.data;
        return data.map((dto: any) => ArticleMapper.toDomain(dto));
    }

    async findById(id: string): Promise<Article | null> {
        const response = await axiosInstance.get(`/api/v1/articles/${id}`);
        const data = response.data.data || response.data;
        if (!data) return null;
        return ArticleMapper.toDomain(data);
    }

    async save(article: Article): Promise<Article> {
        const dto = ArticleMapper.toDTO(article);
        const response = await axiosInstance.post('/api/v1/articles', dto);
        return ArticleMapper.toDomain(response.data.data || response.data);
    }

    async delete(id: string): Promise<void> {
        await axiosInstance.delete(`/api/v1/articles/${id}`);
    }
}
