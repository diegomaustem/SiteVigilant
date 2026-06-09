import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { MonitorRepository } from './monitor.repository.js';
import type { InputMonitor, CreatedMonitor, ListMonitors, Monitor } from './monitor.types.js';
export class MonitorService {

  private readonly monitorRepository: MonitorRepository;

  constructor(monitorRepository: MonitorRepository) {
    this.monitorRepository = monitorRepository;
  }

  async getAll(): Promise<ListMonitors[]> { 
    return await this.monitorRepository.getAll();
  }

  async getById(monitorId: number): Promise<Monitor | undefined> {
    const monitor = await this.monitorRepository.getById(monitorId);
    if(!monitor) {
      throw new NotFoundError(`Monitor com ID ${monitorId} não encontrado.`);
    }
    return monitor;
  }

  async create(inputMonitor: InputMonitor): Promise<CreatedMonitor> {
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
}