import { BadRequestError, ConflictError, NotFoundError } from '../../utils/errors.js';
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

  async getById(monitorId: number): Promise<Monitor | undefined> {
    const monitor = await this.monitorRepository.getById(monitorId);
    if(!monitor) {
      throw new NotFoundError(`Monitor com ID ${monitorId} não encontrado.`);
    }
    return monitor;
  }

  async create(inputMonitor: InputMonitor): Promise<Monitor> {
    try {
      const existingMonitor = await this.monitorRepository.getByName(inputMonitor.name); 
      if (existingMonitor) {
        throw new ConflictError('Já existe um monitor cadastrado com este nome. Escolha outro, por favor.');
      }
      return await this.monitorRepository.create(inputMonitor);
    }catch(error: any) {
      if (!(error instanceof ConflictError)) {
        console.error(`[MonitorService.create] Erro inesperado: ${error.message}`);
      }
      throw error;
    }
  }

  async update(id: number, data: InputMonitor): Promise<Monitor> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
    }
    
    const existingMonitor = await this.monitorRepository.getById(id);
    if (!existingMonitor) throw new NotFoundError('Monitor não encontrado para atualização.');
        
    return await this.monitorRepository.update(id, data);
  }
    
  async delete(id: number): Promise<void> { 
    if (isNaN(id)) {
      throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
    }               
    await this.monitorRepository.delete(id);
  }
}