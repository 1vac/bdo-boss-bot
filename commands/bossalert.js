/**
 * /bossalert — Set up automatic boss spawn alerts in a channel
 *
 * Usage:
 *   /bossalert start channel:#bdo-bosses           → alerts 15 min before each spawn
 *   /bossalert start channel:#bdo-bosses minutes:30
 *   /bossalert stop
 *
 * How it works:
 *   - Polls Garmoth every 5 minutes
 *   - When a boss is within `minutes` of spawning, posts an alert embed
 *   - Tracks which alerts were already sent to avoid duplicates
 */

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getUpcomingBosses, BOSS_META } = require('../garmoth');

// In-memory store: guildId → { channelId, region, minutesBefore, intervalId, sentAlerts: Set }
const alertSessions = new Map();

// How often to poll (ms)
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function startPolling(client, guildId, channelId, region, minutesBefore) {
  // Clear any existing session
  stopPolling(guildId);

  const sentAlerts = new Set();

  const intervalId = setInterval(async () => {
    try {
      const channel = await client.channels.fetch(channelId).catch(() => null);
      if (!channel) return stopPolling(guildId);

      const bosses = await getUpcomingBosses(region, 10);
      const now = Date.now();
      const windowMs = minutesBefore * 60 * 1000;

      for (const boss of bosses) {
        const name    = boss.name ?? boss.bossName ?? 'Unknown';
        const rawTime = boss.spawnTime ?? boss.nextSpawnTime ?? boss.time;
        const spawnMs = new Date(rawTime).getTime();
        const diffMs  = spawnMs - now;

        // Alert key: bossName + spawn unix second (unique per spawn)
        const alertKey = `${name}:${Math.floor(spawnMs / 1000)}`;

        if (diffMs > 0 && diffMs <= windowMs && !sentAlerts.has(alertKey)) {
          sentAlerts.add(alertKey);

          const meta     = BOSS_META[name] ?? { emoji: '⚔️', color: 0xff9900 };
          const unixSec  = Math.floor(spawnMs / 1000);
          const minsLeft = Math.ceil(diffMs / 60000);

          const embed = new EmbedBuilder()
            .setColor(meta.color ?? 0xff9900)
            .setTitle(`🔔  Boss Alert: ${meta.emoji} ${name} spawning in ${minsLeft} min!`)
            .setDescription(
              `**Region:** ${region}\n` +
              `**Spawn time:** <t:${unixSec}:F>\n` +
              `**Countdown:** <t:${unixSec}:R>`
            )
            .setFooter({ text: 'Data from Garmoth.com' })
            .setTimestamp();

          if (meta.image) embed.setThumbnail(meta.image);

          await channel.send({ content: '@here', embeds: [embed] });
        }
      }

      // Clean up old alert keys (older than 2 hours) to avoid memory bloat
      const cutoff = Math.floor((Date.now() - 2 * 3600 * 1000) / 1000);
      for (const key of sentAlerts) {
        const [, unixStr] = key.split(':');
        if (parseInt(unixStr) < cutoff) sentAlerts.delete(key);
      }

    } catch (err) {
      console.error(`[bossalert] Polling error for guild ${guildId}:`, err.message);
    }
  }, POLL_INTERVAL_MS);

  alertSessions.set(guildId, { channelId, region, minutesBefore, intervalId, sentAlerts });
}

function stopPolling(guildId) {
  const session = alertSessions.get(guildId);
  if (session) {
    clearInterval(session.intervalId);
    alertSessions.delete(guildId);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bossalert')
    .setDescription('Manage automatic boss spawn alerts in a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(sub =>
      sub.setName('start')
        .setDescription('Start sending boss alerts to a channel')
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('Channel to send alerts to')
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('region')
            .setDescription('Server region (default: MENA)')
            .setRequired(false)
            .addChoices(
              { name: 'MENA',       value: 'MENA'     },
              { name: 'EU',         value: 'EU'        },
              { name: 'NA',         value: 'NA'        },
              { name: 'SA',         value: 'SA'        },
              { name: 'SEA',        value: 'SEA'       },
              { name: 'Console NA', value: 'CONSOLENA' },
              { name: 'Console EU', value: 'CONSOLEEU' },
            )
        )
        .addIntegerOption(opt =>
          opt.setName('minutes')
            .setDescription('Alert how many minutes before spawn? (default: 15)')
            .setRequired(false)
            .setMinValue(5)
            .setMaxValue(60)
        )
    )
    .addSubcommand(sub =>
      sub.setName('stop')
        .setDescription('Stop boss alerts for this server')
    )
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('Check if boss alerts are active')
    ),

  // Expose for use in index.js (attaching the client)
  alertSessions,
  startPolling,
  stopPolling,

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'start') {
      const channel       = interaction.options.getChannel('channel');
      const region        = interaction.options.getString('region') ?? process.env.DEFAULT_REGION ?? 'MENA';
      const minutesBefore = interaction.options.getInteger('minutes') ?? 15;

      startPolling(interaction.client, interaction.guildId, channel.id, region, minutesBefore);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✅ Boss Alerts Enabled')
            .setDescription(
              `Alerts will be posted in <#${channel.id}> **${minutesBefore} minutes** before each boss spawn.\n` +
              `**Region:** ${region}\n\n` +
              `Use \`/bossalert stop\` to disable.`
            )
        ],
        ephemeral: true,
      });
    }

    else if (sub === 'stop') {
      const had = alertSessions.has(interaction.guildId);
      stopPolling(interaction.guildId);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(had ? 0xe74c3c : 0x95a5a6)
            .setTitle(had ? '🔕 Boss Alerts Stopped' : 'ℹ️ No Active Alerts')
            .setDescription(had ? 'Boss spawn alerts have been disabled for this server.' : 'There were no active alerts to stop.')
        ],
        ephemeral: true,
      });
    }

    else if (sub === 'status') {
      const session = alertSessions.get(interaction.guildId);

      if (!session) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x95a5a6)
              .setTitle('ℹ️ Boss Alerts: Inactive')
              .setDescription('Use `/bossalert start` to enable alerts.')
          ],
          ephemeral: true,
        });
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('✅ Boss Alerts: Active')
            .addFields(
              { name: 'Channel',        value: `<#${session.channelId}>`,        inline: true },
              { name: 'Region',         value: session.region,                    inline: true },
              { name: 'Alert window',   value: `${session.minutesBefore} min`,   inline: true },
            )
        ],
        ephemeral: true,
      });
    }
  },
};
