/**
 * deploy-commands.js
 *
 * Run this ONCE (or whenever you add/change slash commands) to register them
 * with Discord:
 *
 *   node deploy-commands.js
 *
 * Commands are registered to the specific guild in GUILD_ID for instant
 * availability. To register globally (takes up to 1 hour to propagate),
 * remove the guildId line below.
 */

require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('❌  Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in .env');
  process.exit(1);
}

// Collect all command data
const commands = [];
const commandsPath = path.join(__dirname, 'commands');

for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command) {
    commands.push(command.data.toJSON());
    console.log(`  + ${command.data.name}`);
  }
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`\n🔄  Registering ${commands.length} slash command(s)...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log(`✅  Successfully registered ${data.length} command(s) to guild ${GUILD_ID}.\n`);
    console.log('You can now run:  node index.js\n');

  } catch (err) {
    console.error('❌  Failed to register commands:', err);
  }
})();
