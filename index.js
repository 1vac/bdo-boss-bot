/**
 * BDO Boss Bot — Main Entry Point
 * Built with discord.js v14
 *
 * Commands:
 *   /bosses     — List next N upcoming boss spawns
 *   /nextboss   — Show the very next boss only
 *   /bossalert  — Auto-alert in a channel before each spawn
 */

require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs   = require('fs');
const path = require('path');

// ── Bot client ──────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// ── Load slash commands ──────────────────────────────────────────────────────
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`[commands] Loaded: /${command.data.name}`);
  } else {
    console.warn(`[commands] Skipped ${file} — missing "data" or "execute"`);
  }
}

// ── Ready ────────────────────────────────────────────────────────────────────
client.once(Events.ClientReady, readyClient => {
  console.log(`\n✅  Logged in as ${readyClient.user.tag}`);
  console.log(`📡  Serving ${readyClient.guilds.cache.size} server(s)`);
  console.log(`🗡️   BDO Boss Bot is online!\n`);

  readyClient.user.setPresence({
    activities: [{ name: 'BDO Boss Spawns 🐉', type: 3 }], // type 3 = Watching
    status: 'online',
  });
});

// ── Interaction handler ───────────────────────────────────────────────────────
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`[interactions] Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`[interactions] Error in /${interaction.commandName}:`, err);

    const errMsg = {
      content: '❌ An error occurred while running this command.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errMsg);
    } else {
      await interaction.reply(errMsg);
    }
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌  DISCORD_TOKEN is not set in your .env file!');
  process.exit(1);
}

client.login(token);
