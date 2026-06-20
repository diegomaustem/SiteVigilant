import knex from 'knex';
import type { Knex } from 'knex';
import dbConfig from '../database/dbConfig.js';
import { MonitorRepository } from '../modules/monitor/monitor.repository.js';
import { MonitorService } from '../modules/monitor/monitor.service.js';
import { MonitorController } from '../modules/monitor/monitor.controller.js';
import { PeriodicityRepository } from '../modules/periodicity/periodicity.repository.js';
import { PeriodicityService } from '../modules/periodicity/periodicity.service.js';
import { PeriodicityController } from '../modules/periodicity/periodicity.controller.js';
import { UrlConsultantService } from '../services/url-consultant.service.js';
import { LogRepository } from '../modules/logs/log.repository.js';
import { UserRepository } from '../modules/user/user.repository.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { AuthController } from '../modules/auth/auth.controller.js';

class DependencyContainer {
  private static dbCache: Knex | null = null;

  private static monitorServiceCache: MonitorService | null = null;
  private static monitorControllerCache: MonitorController | null = null;
  private static monitorRepositoryCache: MonitorRepository | null = null;

  private static periodicityServiceCache: PeriodicityService | null = null;
  private static periodicityControllerCache: PeriodicityController | null = null;
  private static periodicityRepositoryCache: PeriodicityRepository | null = null;

  private static urlConsultantServiceCache: UrlConsultantService | null = null;
  private static logRepositoryCache: LogRepository | null = null;

  private static userRepositoryCache: UserRepository | null = null;
  private static authServiceCache: AuthService | null = null;
  private static authControllerCache: AuthController | null = null;

  public static get db(): Knex {
    if (!this.dbCache) {
      const config = dbConfig;
      if(!config) {
        const currentEnv = process.env.NODE_ENV || 'não definido';
        throw new Error(`Configuração do banco não encontrada para o ambiente ${currentEnv}`);
      }
      this.dbCache = knex(config);
    }
    return this.dbCache;
  }

  public static get monitorRepository(): MonitorRepository {
    if (!this.monitorRepositoryCache) {
      this.monitorRepositoryCache = new MonitorRepository(this.db);
    }
    return this.monitorRepositoryCache;
  }

  public static get monitorService(): MonitorService {
    if (!this.monitorServiceCache) {
      this.monitorServiceCache = new MonitorService(this.monitorRepository);
    }
    return this.monitorServiceCache;
  }

  public static get monitorController(): MonitorController {
    if (!this.monitorControllerCache) {
      this.monitorControllerCache = new MonitorController(this.monitorService);
    }
    return this.monitorControllerCache;
  }

  public static get periodicityRepository(): PeriodicityRepository {
    if (!this.periodicityRepositoryCache) {
      this.periodicityRepositoryCache = new PeriodicityRepository(this.db);
    }
    return this.periodicityRepositoryCache;
  }

  public static get periodicityService(): PeriodicityService {
    if (!this.periodicityServiceCache) {
        this.periodicityServiceCache = new PeriodicityService(this.periodicityRepository);
    }
    return this.periodicityServiceCache;
  }

  public static get periodicityController(): PeriodicityController {
    if (!this.periodicityControllerCache) {
      this.periodicityControllerCache = new PeriodicityController(this.periodicityService);
    }
    return this.periodicityControllerCache;
  }

  public static get logRepository(): LogRepository {
    if (!this.logRepositoryCache) {
      this.logRepositoryCache = new LogRepository(this.db);
    }
    return this.logRepositoryCache;
  }

  public static get urlConsultantService(): UrlConsultantService {
    if (!this.urlConsultantServiceCache) {
      this.urlConsultantServiceCache = new UrlConsultantService(this.logRepository, this.periodicityRepository);
    }
    return this.urlConsultantServiceCache;
  }

  public static get userRepository(): UserRepository {
    if (!this.userRepositoryCache) {
      this.userRepositoryCache = new UserRepository(this.db);
    }
    return this.userRepositoryCache;
  }

  public static get authService(): AuthService {
    if (!this.authServiceCache) {
      this.authServiceCache = new AuthService(this.userRepository);
    }
    return this.authServiceCache;
  }

  public static get authController(): AuthController {
    if (!this.authControllerCache) {
      this.authControllerCache = new AuthController(this.authService);
    }
    return this.authControllerCache;
  }

  public static async destroyDb(): Promise<void> {
    if (this.dbCache) {
      await this.dbCache.destroy();
      this.dbCache = null;
    }
  }
}

export const db = DependencyContainer.db;
export const monitorController  = DependencyContainer.monitorController;
export const monitorService     = DependencyContainer.monitorService;
export const monitorRepository  = DependencyContainer.monitorRepository;

export const periodicityController = DependencyContainer.periodicityController;
export const periodicityService    = DependencyContainer.periodicityService;
export const periodicityRepository = DependencyContainer.periodicityRepository;

export const urlConsultantService = DependencyContainer.urlConsultantService;

export const authController = DependencyContainer.authController;
export const authService = DependencyContainer.authService;
export const userRepository = DependencyContainer.userRepository;

export default DependencyContainer;