import { Article } from "../entities/Article";

export interface ExtractionTypes {
  id: string;
  machineId: string;
  articleId: string;
  articleName?: string;
  article?: Article;
  percentage: number;
  measuredAt: string | Date;
  isActive?: boolean;
}
