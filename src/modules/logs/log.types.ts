export interface InputLog {
  monitorId: number;
  url: string;
  isUp: boolean;
  statusCode: number | null;
  responseTimeMs: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}

export interface Log extends InputLog {
  id: number;
}