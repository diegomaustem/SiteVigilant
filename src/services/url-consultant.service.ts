import axios, { AxiosError } from 'axios';
import { LogRepository } from '../modules/logs/log.repository.js';
import type { InputLog, Log } from '../modules/logs/log.types.js';
import type { Monitor } from '../modules/monitor/monitor.types.js';
import type { PeriodicityRepository } from '../modules/periodicity/periodicity.repository.js';

export interface CheckResult {
  log: Log;           // log atualizado ou existente
  wasChecked: boolean; // true se houve nova requisição, false se reutilizou log existente
}

export class UrlConsultantService {
  private readonly logRepository: LogRepository;
  private readonly periodicityRepository: PeriodicityRepository

  constructor(logRepository: LogRepository, periodicityRepository: PeriodicityRepository) {
    this.logRepository = logRepository;
    this.periodicityRepository = periodicityRepository;
  }

  async checkAddress(monitor: Monitor): Promise<CheckResult> {
    const monitorLog = await this.logRepository.getLogByMonitorId(monitor.id);

    if(monitorLog) {
      if (!monitor.periodicityId) {
        throw new Error(`Monitor ${monitor.id} não possui periodicidade associada`);
      }

      const periodicity = await this.periodicityRepository.getById(monitor.periodicityId);
     
      if(!periodicity) {
        throw new Error(`Periodicidade com ID ${monitor.periodicityId} não encontrada`);
      }

      const shouldRun = this.shouldRunCheck(monitorLog.checkedAt, periodicity.time);

      if (!shouldRun) {
        return { log: monitorLog, wasChecked: false };
      }
    }

    const startTime = Date.now();
    const logData: InputLog = {
      monitorId: monitor.id,
      url: monitor.url,
      isUp: false,
      statusCode: null,
      responseTimeMs: null,
      errorMessage: null,
      checkedAt: new Date(),
    };

    try {
      const response = await axios.get(monitor.url, {
        timeout: 10000,
        validateStatus: () => true, 
      });

      const endTime = Date.now();
      logData.isUp = response.status >= 200 && response.status < 400;
      logData.statusCode = response.status;
      logData.responseTimeMs = endTime - startTime;
    } catch (error) {
      const endTime = Date.now();
      logData.responseTimeMs = endTime - startTime;
      logData.isUp = false;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNABORTED') {
          logData.errorMessage = 'Timeout ao conectar';
        } else if (axiosError.response) {
          logData.statusCode = axiosError.response.status;
          logData.errorMessage = `Erro HTTP ${axiosError.response.status}`;
        } else if (axiosError.request) {
          logData.errorMessage = 'Sem resposta do servidor (DNS/SSL/offline)';
        } else {
          logData.errorMessage = axiosError.message;
        }
      } else {
        logData.errorMessage = (error as Error).message || 'Erro desconhecido';
      }
    }

    const savedLog = await this.logRepository.upsert(logData); 
    return { log: savedLog, wasChecked: true };
  }

  private shouldRunCheck(monitorCheckedAt: Date | null, periodicityTime: string): boolean {
    if (!monitorCheckedAt) {
      return true; 
    }

    const intervalMs = this.parsePeriodicityToMs(periodicityTime);
    const now = new Date();
    const diffMs = now.getTime() - monitorCheckedAt.getTime();

    return diffMs >= intervalMs;
  }

  private parsePeriodicityToMs(time: string): number {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1), 10);
    switch (unit) {
      case 'M': return value * 60 * 1000;        
      case 'H': return value * 60 * 60 * 1000;    
      case 'D': return value * 24 * 60 * 60 * 1000; 
      default: return 0; 
    }
  }
}