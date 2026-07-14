import type { Knex } from 'knex';
import type { InputMonitor, Monitor } from './monitor.types.js';
import { NotFoundError } from '../../utils/errors.js';

export class MonitorRepository {
  private db: Knex;
  private readonly monitorTable = 'monitor';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Monitor[]>{
    const rows = await this.db(this.monitorTable).select('*');
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      periodicityId: row.periodicity_id,
      name: row.name,
      description: row.description,
      url: row.url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getById(id: number): Promise<Monitor> {
    const monitor = await this.db(this.monitorTable)
      .where({ id })
      .first();

    if (!monitor) {
      throw new NotFoundError(`Monitor com ID ${id} não encontrado.`);
    }
    return monitor;
  }

  async getByName(name: string): Promise<Monitor> {
    const monitor = await this.db(this.monitorTable)
      .where('name', name)
      .first();

    if (!monitor) {
      throw new NotFoundError(`Monitor com nome ${name} não encontrado.`);
    }
    return monitor;
  }

  async create(inputMonitor: InputMonitor): Promise<Monitor> {
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
  }

  async update(id: number, data: InputMonitor): Promise<Monitor> {
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
    
    if (!updated) {
      throw new NotFoundError(`Monitor com ID ${id} não encontrado.`);
    }

    return updated;
  }
    
  async delete(id: number): Promise<void> {
    const deleted = await this.db(this.monitorTable).where({ id }).del();
    if (deleted === 0) {
      throw new NotFoundError(`Monitor com ID ${id} não encontrado.`)
    }
  }
}