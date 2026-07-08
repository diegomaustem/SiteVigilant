import type { LogRepository } from './log.repository.js';
import type { Log } from './log.types.js';

export class LogService {
  private readonly logRepository: LogRepository;

  constructor(logRepository: LogRepository) {
    this.logRepository = logRepository;
  }

  async getAll(): Promise<Log[]> { 
    return await this.logRepository.getAll();
  }
}