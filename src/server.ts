import app from './app.js';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(chalk.blue(`Site Vigilant rodando na porta ${PORT}`));
});