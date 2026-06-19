import cron from 'node-cron';
import chalk from 'chalk';
import { monitorService } from '../config/container.js';
import { urlConsultantService } from '../config/container.js';

export function startMonitorJobs() {
  cron.schedule('*/10 * * * * *', async () => {
    console.log(chalk.green(`[${new Date().toISOString()}] Iniciando verificação de monitores. 🟢`));
    try {
      const monitors = await monitorService.getAll();

      for (const monitor of monitors) {
        await urlConsultantService.checkAddress(monitor);
      }

      console.log(chalk.green('Verificação concluída com sucesso. ✅'));
    } catch (error) {
      console.error(chalk.red.bold('Erro ao verificar monitores:', error));
    }
  });
}