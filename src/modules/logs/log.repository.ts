import type { Knex } from 'knex';
import type { Log, InputLog } from './log.types.js';

export class LogRepository {
  private db: Knex;
  private readonly logsTable = 'monitor_logs';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Log[]> {
    try {
      return await this.db<Log>(this.logsTable).select('*');
    } catch (error: any) {
      console.error(`[LogRepository.getAll] Erro ao buscar monitor logs: ${error.message}`);
      throw error;
    }
  }

  async getLogByMonitorId(monitor_id: number): Promise<Log | undefined> {
    try {
      const log = await this.db(this.logsTable)
        .where({ monitor_id })
        .first();
      if (!log) return undefined;
      return {
        id: log.id,
        monitorId: log.monitor_id,
        url: log.url,
        isUp: log.is_up,
        statusCode: log.status_code,
        responseTimeMs: log.response_time_ms,
        errorMessage: log.error_message,
        checkedAt: log.checked_at,
      };
    } catch (error: any) {
      console.error(`[LogRepository.getLogByMonitorId] Erro ao buscar monitor log por id: ${error.message}`);
      throw error;
    }
  }

  async upsert(logData: InputLog): Promise<Log> {
    try {
      const existingMonitor = await this.db(this.logsTable)
        .where('monitor_id', logData.monitorId)
        .first();

      let saved: any;
      if (existingMonitor) {
        [saved] = await this.db(this.logsTable)
          .where('monitor_id', logData.monitorId)
          .update({
            url: logData.url,
            is_up: logData.isUp,
            status_code: logData.statusCode,
            response_time_ms: logData.responseTimeMs,
            error_message: logData.errorMessage,
            checked_at: logData.checkedAt,
          })
          .returning('*');
      } else {
        [saved] = await this.db(this.logsTable)
          .insert({
            monitor_id: logData.monitorId,
            url: logData.url,
            is_up: logData.isUp,
            status_code: logData.statusCode,
            response_time_ms: logData.responseTimeMs,
            error_message: logData.errorMessage,
            checked_at: logData.checkedAt,
          })
          .returning('*');
      }

      return {
        id: saved.id,
        monitorId: saved.monitor_id,
        url: saved.url,
        isUp: saved.is_up,
        statusCode: saved.status_code,
        responseTimeMs: saved.response_time_ms,
        errorMessage: saved.error_message,
        checkedAt: saved.checked_at,
      };
    } catch (error: any) {
      console.error(`[LogRepository.upsert] Erro ao atualizar/inserir log do monitor ${logData.monitorId}: ${error.message}`);
      throw error;
    }
  }
}