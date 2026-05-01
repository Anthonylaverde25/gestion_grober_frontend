export interface LineYieldProps {
  id?: string;
  companyId?: string;
  campaignId: string;
  formingYield: number;
  packingYield: number;
  recordedAt?: string;
  notes?: string;
}

export class LineYield {
  public readonly id: string;
  public readonly companyId: string;
  public readonly campaignId: string;
  public readonly formingYield: number;
  public readonly packingYield: number;
  public readonly recordedAt: Date;
  public readonly notes: string | null;

  private constructor(props: LineYieldProps) {
    this.id = props.id || crypto.randomUUID();
    this.companyId = props.companyId || '';
    this.campaignId = props.campaignId;
    this.formingYield = props.formingYield;
    this.packingYield = props.packingYield;
    this.recordedAt = props.recordedAt ? new Date(props.recordedAt) : new Date();
    this.notes = props.notes ?? null;
  }

  static create(props: LineYieldProps): LineYield {
    if (props.formingYield < 0 || props.formingYield > 100) {
      throw new Error("Forming Yield debe estar entre 0 y 100%");
    }
    if (props.packingYield < 0 || props.packingYield > 100) {
      throw new Error("Packing Yield debe estar entre 0 y 100%");
    }

    return new LineYield(props);
  }

  static reconstitute(props: any): LineYield {
    return new LineYield({
        id: props.id,
        companyId: props.companyId || props.company_id,
        campaignId: props.campaignId || props.campaign_id,
        formingYield: props.formingYield || props.forming_yield,
        packingYield: props.packingYield || props.packing_yield,
        recordedAt: props.recordedAt || props.recorded_at,
        notes: props.notes
    });
  }

  getFormattedFormingYield(): string {
    return `${this.formingYield.toFixed(2)}%`;
  }

  getFormattedPackingYield(): string {
    return `${this.packingYield.toFixed(2)}%`;
  }

  getLossPercentage(): number {
    return Math.max(0, this.formingYield - this.packingYield);
  }
}
