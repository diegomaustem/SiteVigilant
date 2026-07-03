import type { Knex } from 'knex';
import type { InputMonitor, Monitor } from './monitor.types.js';

export class MonitorRepository {
  private db: Knex;
  private readonly monitorTable = 'monitor';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Monitor[]>{
    try {
      return await this.db(this.monitorTable).select('*');
    } catch (error: any) {
      console.error(`[MonitorRepository.getAll] Erro ao buscar monitores: ${error.message}`);
      throw error;
    }
  }

  async getById(id: number): Promise<Monitor | undefined> {
    try {
      const monitor = await this.db(this.monitorTable)
        .where({ id })
        .first();
      if (!monitor) return undefined;
      return monitor;
    } catch (error: any) {
      console.error(`[MonitorRepository.getById] Erro ao buscar monitor por id: ${error.message}`);
      throw error;
    }
  }

  async getByName(name: string): Promise<Monitor | undefined> {
    try {
      const monitor = await this.db(this.monitorTable)
        .where('name', name)
        .first();

      if (!monitor) return undefined;
      return monitor;
    } catch (error: any) {
      console.error(`[MonitorRepository.getByName] Erro ao buscar monitor por nome: ${error.message}`);
      throw error;
    }
  }

  async create(inputMonitor: InputMonitor): Promise<Monitor> {
    try {
      const [newMonitor] = await this.db(this.monitorTable)
        .insert({
          user_id: inputMonitor.userId,
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

  async update(id: number, data: InputMonitor): Promise<Monitor> {
    try {
      const updateData: any = {};
      if (data.userId) updateData.user_id = data.userId;
      if (data.periodicityId) updateData.periodicity_id = data.periodicityId;
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.url) updateData.url = data.url;
                
      const [updated] = await this.db(this.monitorTable)
        .where({ id })
        .update(updateData)
        .returning('*');
    
      return updated;
    } catch(error: any) {
      console.error(`[MonitorRepository.update] Erro ao atualizar monitor: ${error.message}`);
      throw error;
    }
  }
    
  async delete(id: number): Promise<boolean> {
    try {
      const deleted = await this.db(this.monitorTable).where({ id }).del();
      return deleted > 0;
    } catch(error: any) {
      console.error(`[MonitorRepository.delete] Erro ao deletar monitor: ${error.message}`);
      throw error;
    }
  }
}