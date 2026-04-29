import { ExtractionTypes } from "../types/ExtractionTypes";
import { Article } from "../entities/Article";

export class Extraction {
  public readonly id: string;
  public readonly machineId: string;
  public readonly articleId: string;
  public readonly articleName: string;
  public readonly article?: Article;
  public readonly percentage: number;
  public readonly measuredAt: Date;
  public readonly isActive: boolean;

  private constructor(props: ExtractionTypes) {
    this.id = props.id;
    this.machineId = props.machineId;
    this.articleId = props.articleId;
    this.articleName = props.article?.name ?? props.articleName ?? 'N/A';
    this.article = props.article;
    this.percentage = props.percentage;
    this.measuredAt = props.measuredAt instanceof Date ? props.measuredAt : new Date(props.measuredAt);
    this.isActive = props.isActive ?? true;
  }

  static create(props: ExtractionTypes): Extraction {
    if (props.percentage < 0 || props.percentage > 100) {
      throw new Error("El porcentaje de extracción debe estar entre 0 y 100.");
    }

    return new Extraction(props);
  }

  static reconstitute(props: ExtractionTypes): Extraction {
    return new Extraction(props);
  }

  get formattedPercentage(): string {
    return `${this.percentage.toFixed(2)}%`;
  }
}
