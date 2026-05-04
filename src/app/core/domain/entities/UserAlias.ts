export interface UserAliasProps {
  id: string;
  name: string;
  legajo: string;
}

export class UserAlias {
  public readonly id: string;
  public readonly name: string;
  public readonly legajo: string;

  constructor(props: UserAliasProps) {
    this.id = props.id;
    this.name = props.name;
    this.legajo = props.legajo;
  }

  static create(props: UserAliasProps): UserAlias {
    return new UserAlias(props);
  }
}
