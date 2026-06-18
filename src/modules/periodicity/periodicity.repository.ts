import type { Knex } from 'knex';
import type { Periodicity, InputPeriodicity } from './periodicity.types.js';

export class PeriodicityRepository {
  private db: Knex;
  private readonly periodicityTable = 'periodicity';

  constructor(db: Knex) {
    this.db = db;
  }

  async getAll(): Promise<Periodicity[]> {
    try {
      return await this.db<Periodicity>(this.periodicityTable).select('*');
    } catch (error: any) {
      console.error(`[PeriodicityRepository.getAll] Erro ao buscar periodicidades: ${error.message}`);
      throw error;
    }
  }

  async getById(id: number): Promise<Periodicity | undefined> {
    try {
        const periodicity = await this.db(this.periodicityTable)
          .where({ id })
          .first();
        if (!periodicity) return undefined;
        return {
          id: periodicity.id,
          time: periodicity.time,
          status: periodicity.status,
          createdAt: periodicity.created_at,
          updatedAt: periodicity.updated_at,
        };
    } catch (error: any) {
      console.error(`[PeriodicityRepository.getById] Erro ao buscar periodo por id: ${error.message}`);
      throw error;
    }
  }

  async getByTime(time: string): Promise<Periodicity | undefined> {
    try {
      const periodicity = await this.db(this.periodicityTable)
        .where('time', time)
        .first();
  
      if (!periodicity) return undefined;
  
      return {
        id: periodicity.id,
        time: periodicity.time,
        status: periodicity.status,
        createdAt: periodicity.created_at,
        updatedAt: periodicity.updated_at,
      };
    } catch (error: any) {
      console.error(`[PeriodicityRepository.getByTime] Erro ao buscar periodo pelo periodo: ${error.message}`);
      throw error;
    }
  }

  async create(inputPeriodicity: InputPeriodicity): Promise<Periodicity> {
    try {
      const [newPeriodicity] = await this.db(this.periodicityTable)
        .insert({
          time: inputPeriodicity.time,
          status: inputPeriodicity.status
        })
        .returning('*'); 

      return {
        id: newPeriodicity.id,
        time: newPeriodicity.time,
        status: newPeriodicity.status,
        createdAt: newPeriodicity.created_at,
        updatedAt: newPeriodicity.updated_at,
      };
    } catch (error: any) {
      console.error(`[PeriodicityRepository.create] Erro ao inserir periodicidade: ${error.message}`);
      throw error;
    }
  }
}