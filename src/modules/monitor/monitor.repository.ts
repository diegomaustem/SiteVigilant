import type { Knex } from 'knex';
import type { CreatedMonitor, InputMonitor, ListMonitors } from './monitor.types.js';

export class MonitorRepository {
  private db: Knex;
  private readonly monitorTable = 'monitor';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<ListMonitors[]>{
    try {
      return await this.db<ListMonitors>(this.monitorTable).select('*');
    } catch (error: any) {
      console.error(`[MonitorRepository.getActiveMonitors] Erro ao buscar monitores: ${error.message}`);
      throw error;
    }
  }

  async create(inputMonitor: InputMonitor): Promise<CreatedMonitor> {
    try {
      const [newMonitor] = await this.db(this.monitorTable)
        .insert({
          periodicity_id: inputMonitor.periodicityId,
          name: inputMonitor.name,
          description: inputMonitor.description,
          url: inputMonitor.url
        })
        .returning('*'); 
      return newMonitor;
    } catch (error: any) {
      console.error(`[MonitorRepository.create] Erro ao inserir monitor: ${error.message}`);
      throw error;
    }
  }
}