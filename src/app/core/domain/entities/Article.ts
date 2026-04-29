import { ArticleTypes } from '../types/ArticleTypes';

export class Article {
  public readonly id: string;
  public readonly companyId: string;
  public name: string;

  private constructor(props: ArticleTypes) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.name = props.name;
  }

  /**
   * Factory Method para crear un nuevo artículo con validaciones de dominio.
   */
  static create(props: ArticleTypes): Article {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('El nombre del artículo no puede estar vacío.');
    }
    
    // Aquí podrían ir más reglas de negocio, como longitud mínima, caracteres prohibidos, etc.
    
    return new Article(props);
  }

  /**
   * Método para reconstituir la entidad desde una fuente externa (API/DB).
   * No aplica validaciones de creación, ya que el dato ya existe.
   */
  static reconstitute(props: ArticleTypes): Article {
    return new Article(props);
  }

  /**
   * Actualiza el nombre aplicando las mismas reglas de negocio.
   */
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('El nombre del artículo no puede estar vacío.');
    }
    this.name = newName;
  }

  // Ejemplo de lógica de negocio adicional accesible en la UI
  getDisplayName(): string {
    return `ART-${this.name.toUpperCase()}`;
  }
}
