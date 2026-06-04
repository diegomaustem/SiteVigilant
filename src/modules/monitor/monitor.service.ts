import { MonitorRepository } from './monitor.repository.js';
import type { InputMonitor, CreatedMonitor, ListMonitors } from './monitor.types.js';

export class MonitorService {

  private readonly monitorRepository: MonitorRepository;

  constructor(monitorRepository: MonitorRepository) {
    this.monitorRepository = monitorRepository;
  }

  async getAll(): Promise<ListMonitors[]> { 
    return await this.monitorRepository.getAll();
  }

  async create(inputMonitor: InputMonitor): Promise<CreatedMonitor> {
    try {
      return await this.monitorRepository.create(inputMonitor);
    }catch(error: any) {
      console.error(`[MonitorService.create] Erro ao criar monitor: ${error.message}`);
      throw error;
    }
  }
}