export interface UserAliasProps {
  id: string;
  userId: number;
  name: string;
  legajo: string;
  isActive: boolean;
}

export class UserAlias {
  public readonly id: string;
  public readonly userId: number;
  public readonly name: string;
  public readonly legajo: string;
  public readonly isActive: boolean;

  constructor(props: UserAliasProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.legajo = props.legajo;
    this.isActive = props.isActive;
  }

  static create(props: UserAliasProps): UserAlias {
    return new UserAlias(props);
  }
}
