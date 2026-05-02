import { ServerTime } from "../entities/ServerTime";

export interface SystemRepository {
  getServerTime(): Promise<ServerTime>;
}
