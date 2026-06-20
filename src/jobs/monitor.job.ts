import cron from 'node-cron';
import chalk from 'chalk';
import { monitorService } from '../config/container.js';
import { urlConsultantService } from '../config/container.js';

export function startMonitorJobs() {
  cron.schedule('*/10 * * * * *', async () => {
    const startTime = Date.now();
    console.log(chalk.green(`[${new Date().toISOString()}] Iniciando verificação de monitores. 🟢`));
    try {
      const monitors = await monitorService.getAll();

      let checkedCount = 0;
      let errorCount = 0;

      for (const monitor of monitors) {
        try {
          const result = await urlConsultantService.checkAddress(monitor);
          const { log, wasChecked } = result;
          if (wasChecked) checkedCount++;
        } catch (error: any) {
          errorCount++;
          console.error(chalk.red(`[Monitor ${monitor.id}] Erro: ${error.message}`));
        }
      }

      const elapsed = (Date.now() - startTime) / 1000;

      console.log(chalk.green(`Verificação concluída. ${checkedCount} monitores verificados, ${errorCount} erros. (${elapsed}s) ✅`));
    } catch (error) {
      console.error(chalk.red.bold('Erro ao verificar monitores:', error));
    }
  });
}