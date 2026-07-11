import type { Knex } from 'knex';
import type { Periodicity, InputPeriodicity } from './periodicity.types.js';
import { NotFoundError } from '../../utils/errors.js';

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
      return periodicity;
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
      return periodicity;
    } catch (error: any) {
      console.error(`[PeriodicityRepository.getByTime] Erro ao buscar periodo pelo nome: ${error.message}`);
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

      return newPeriodicity;
    } catch (error: any) {
      console.error(`[PeriodicityRepository.create] Erro ao inserir periodicidade: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, data: InputPeriodicity): Promise<Periodicity> {
    try {
      const updateData: any = {};
      if (data.time) updateData.time = data.time;
      if (data.status) updateData.status = data.status;
              
      const [updated] = await this.db(this.periodicityTable)
        .where({ id })
        .update(updateData)
        .returning('*');
  
      return updated;
    } catch(error: any) {
      console.error(`[PeriodicityRepository.update] Erro ao atualizar periodicidade: ${error.message}`);
      throw error;
    }
  }
  
  async delete(id: number): Promise<void> {
    try {
      const deleted = await this.db(this.periodicityTable).where({ id }).del();
      if(deleted === 0) {
        throw new NotFoundError(`Periodicidade com ID ${id} não encontrada.`);
      }
    } catch(error: any) {
      console.error(`[PeriodicityRepository.delete] Erro ao deletar periodicidade: ${error.message}`);
      throw error;
    }
  }
}