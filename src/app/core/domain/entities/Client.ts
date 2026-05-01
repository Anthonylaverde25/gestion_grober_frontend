export interface ClientProps {
  id: string;
  companyId: string;
  commercialName: string;
  businessName: string;
  taxId: string;
  technicalContact?: string;
  email?: string;
}

export class Client {
  public readonly id: string;
  public readonly companyId: string;
  public readonly commercialName: string;
  public readonly businessName: string;
  public readonly taxId: string;
  public technicalContact: string | null;
  public email: string | null;

  private constructor(props: ClientProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.commercialName = props.commercialName;
    this.businessName = props.businessName;
    this.taxId = props.taxId;
    this.technicalContact = props.technicalContact ?? null;
    this.email = props.email ?? null;
  }

  static create(props: ClientProps): Client {
    if (!props.commercialName || props.commercialName.trim().length === 0) {
      throw new Error("Commercial name is required.");
    }
    if (!props.businessName || props.businessName.trim().length === 0) {
      throw new Error("Business name is required.");
    }
    if (!props.taxId || props.taxId.trim().length < 11) {
      throw new Error("Tax ID must be valid (at least 11 digits).");
    }

    return new Client(props);
  }

  static reconstitute(props: ClientProps): Client {
    return new Client(props);
  }

  getDisplayName(): string {
    return this.commercialName || this.businessName;
  }
}
