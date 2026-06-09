import { ConflictError } from '../../utils/errors.js';
import { MonitorRepository } from './monitor.repository.js';
import type { InputMonitor, CreatedMonitor, ListMonitors } from './monitor.types.js';
export class MonitorService {

  private readonly monitorRepository: MonitorRepository;

  constructor(monitorRepository: MonitorRepository) {
    this.monitorRepository = monitorRepository;
  }

  async getAll(): Promise<ListMonitors[]> { 
    try {
      return await this.monitorRepository.getAll();
    } catch(error: any) {
      console.error(`[MonitorService.getAll] Erro ao lista monitores: ${error.message}` );
      throw error;
    }
  }

  async create(inputMonitor: InputMonitor): Promise<CreatedMonitor> {
    try {
      const existingMonitor = await this.monitorRepository.getByName(inputMonitor.name); 
      if (existingMonitor) {
        throw new ConflictError('Já existe um monitor cadastrado com este nome. Escolha outro, por favor.');
      }

      return await this.monitorRepository.create(inputMonitor);
    }catch(error: any) {
      console.error(`[MonitorService.create] Erro ao criar monitor: ${error.message}`);
      throw error;
    }
  }
}