import Database from './db';
import Discord from './src';

async function main() {
  const database = new Database();
  await database.connect();

  const discord = new Discord();
  await discord.login();
  await discord.buildSlashCommands();
  discord.setupHandlers();
}

main().catch(console.error);
