import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { PeriodicityRepository } from './periodicity.repository.js';
import type { InputPeriodicity, Periodicity } from './periodicity.types.js';

export class PeriodicityService {
  private readonly periodicityRepository: PeriodicityRepository;

  constructor(
    periodicityRepository: PeriodicityRepository,
  ) {
    this.periodicityRepository = periodicityRepository;
  }

  async getAll(): Promise<Periodicity[]> { 
    return await this.periodicityRepository.getAll();
  }

  async getById(periodicityId: number): Promise<Periodicity | undefined> {
      const periodicity = await this.periodicityRepository.getById(periodicityId);
      if(!periodicity) {
        throw new NotFoundError(`Periodo com ID ${periodicityId} não encontrado.`);
      }
      return periodicity;
  }

  async create(inputPeriodicity: InputPeriodicity): Promise<Periodicity> {
    try {
      const existingPeriodicity = await this.periodicityRepository.getByTime(inputPeriodicity.time); 
      if (existingPeriodicity) {
        throw new ConflictError('Já existe um periodo cadastrado com este periodo. Escolha outro, por favor.');
      }
      
      return await this.periodicityRepository.create(inputPeriodicity);
    }catch(error: any) {
      if (!(error instanceof ConflictError)) {
        console.error(`[RepositoryService.create] Erro inesperado: ${error.message}`);
      }
      throw error;
    }
  }
}