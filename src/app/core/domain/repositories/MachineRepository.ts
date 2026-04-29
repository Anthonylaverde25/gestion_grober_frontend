import { Machine } from "../entities/Machine";

export interface MachineRepository {
  getByCompany(companyId: string): Promise<Machine[]>;
  save(machine: Machine): Promise<Machine>;
  changeCurrentArticle(
    machineId: string,
    articleId: string | null,
  ): Promise<Machine>;
}
