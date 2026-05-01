import { MachineTypes } from "../types/MachineTypes";

export class Machine {
  public readonly id: string;
  public readonly companyId: string;
  public readonly furnaceId: string;
  public currentArticleId: string | null;
  public currentArticleName: string;
  public currentCampaignId: string | null;
  public currentClientName: string;
  public readonly name: string;
  public status: "operational" | "maintenance" | "shutdown";

  private constructor(props: MachineTypes) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.furnaceId = props.furnaceId;
    this.currentArticleId = props.currentArticleId ?? null;
    this.currentArticleName = props.currentArticleName ?? 'N/A';
    this.currentCampaignId = props.currentCampaignId ?? null;
    this.currentClientName = props.currentClientName ?? 'N/A';
    this.name = props.name;
    this.status = props.status ?? "operational";
  }

  static create(props: MachineTypes): Machine {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("El nombre de la máquina no puede estar vacío.");
    }

    return new Machine(props);
  }

  static reconstitute(props: MachineTypes): Machine {
    return new Machine(props);
  }

  updateStatus(newStatus: "operational" | "maintenance" | "shutdown"): void {
    const validStatuses = ["operational", "maintenance", "shutdown"];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Estado de máquina inválido: ${newStatus}`);
    }

    this.status = newStatus;
  }

  assignCurrentArticle(articleId: string | null): void {
    this.currentArticleId = articleId;
  }
}
