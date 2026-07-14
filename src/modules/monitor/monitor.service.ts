import { BadRequestError, ConflictError } from '../../utils/errors.js';
import { MonitorRepository } from './monitor.repository.js';
import type { InputMonitor, Monitor } from './monitor.types.js';
export class MonitorService {
  private readonly monitorRepository: MonitorRepository;

  constructor(monitorRepository: MonitorRepository) {
    this.monitorRepository = monitorRepository;
  }

  async getAll(): Promise<Monitor[]> { 
    return await this.monitorRepository.getAll();
  }

  async getById(monitorId: number): Promise<Monitor> {
    return this.monitorRepository.getById(monitorId);
  }

  async create(inputMonitor: InputMonitor): Promise<Monitor> {
    const existingMonitor = await this.monitorRepository.getByName(inputMonitor.name); 
    if (existingMonitor) {
      throw new ConflictError('Já existe um monitor cadastrado com este nome. Escolha outro, por favor.');
    }
    return this.monitorRepository.create(inputMonitor);
  }

  async update(id: number, data: InputMonitor): Promise<Monitor> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
    }
    
    return this.monitorRepository.update(id, data);
  }
    
  async delete(id: number): Promise<void> { 
    if (isNaN(id)) {
      throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
    }               
    await this.monitorRepository.delete(id);
  }
}