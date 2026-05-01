export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'FINISHED' | 'CANCELLED';

export interface CampaignProps {
  id: string;
  companyId: string;
  codigo?: string;
  machineId: string;
  articleId: string;
  clientId: string;
  operatorId?: string;
  status: CampaignStatus;
  startedAt: string;
  finishedAt?: string;
  totalYieldRecords: number;
  observaciones?: string;
  clientName?: string;
  articleName?: string;
  machine?: { id: string; name: string };
  client?: { id: string; name: string };
  article?: { id: string; name: string };
}

export class Campaign {
  public readonly id: string;
  public readonly companyId: string;
  public readonly codigo: string;
  public readonly machineId: string;
  public readonly articleId: string;
  public readonly clientId: string;
  public readonly operatorId: string | null;
  public status: CampaignStatus;
  public readonly startedAt: Date;
  public finishedAt: Date | null;
  public totalYieldRecords: number;
  public observaciones: string | null;
  public readonly clientName: string | null;
  public readonly articleName: string | null;
  public readonly machine: { id: string; name: string } | null;
  public readonly client: { id: string; name: string } | null;
  public readonly article: { id: string; name: string } | null;

  private constructor(props: CampaignProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.codigo = props.codigo ?? 'N/A';
    this.machineId = props.machineId;
    this.articleId = props.articleId;
    this.clientId = props.clientId;
    this.operatorId = props.operatorId ?? null;
    this.status = props.status;
    this.startedAt = new Date(props.startedAt);
    this.finishedAt = props.finishedAt ? new Date(props.finishedAt) : null;
    this.totalYieldRecords = props.totalYieldRecords;
    this.observaciones = props.observaciones ?? null;
    this.clientName = props.clientName ?? null;
    this.articleName = props.articleName ?? null;
    this.machine = props.machine ?? null;
    this.client = props.client ?? null;
    this.article = props.article ?? null;
  }

  static create(props: CampaignProps): Campaign {
    return new Campaign(props);
  }

  static reconstitute(props: CampaignProps): Campaign {
    return new Campaign(props);
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  isFinished(): boolean {
    return this.status === 'FINISHED';
  }

  canRecordYield(): boolean {
    return this.isActive();
  }

  getDurationInMinutes(): number {
    const end = this.finishedAt || new Date();
    return Math.floor((end.getTime() - this.startedAt.getTime()) / 60000);
  }
}
