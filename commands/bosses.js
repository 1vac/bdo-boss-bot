/**
 * /bosses — Show the next upcoming BDO boss spawns
 *
 * Usage:
 *   /bosses               → next 5 bosses in MENA
 *   /bosses region:EU     → next 5 bosses in EU
 *   /bosses count:10      → next 10 bosses in MENA
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUpcomingBosses, formatBossLine, BOSS_META } = require('../garmoth');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bosses')
    .setDescription('Show upcoming BDO world boss spawns from Garmoth.com')
    .addStringOption(opt =>
      opt.setName('region')
        .setDescription('Server region (default: MENA)')
        .setRequired(false)
        .addChoices(
          { name: 'MENA',       value: 'MENA'      },
          { name: 'EU',         value: 'EU'         },
          { name: 'NA',         value: 'NA'         },
          { name: 'SA',         value: 'SA'         },
          { name: 'SEA',        value: 'SEA'        },
          { name: 'Console NA', value: 'CONSOLENA'  },
          { name: 'Console EU', value: 'CONSOLEEU'  },
        )
    )
    .addIntegerOption(opt =>
      opt.setName('count')
        .setDescription('Number of bosses to show (1–10, default: 5)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    const region = interaction.options.getString('region') ?? process.env.DEFAULT_REGION ?? 'MENA';
    const count  = interaction.options.getInteger('count') ?? 5;

    // Defer so we have time to fetch
    await interaction.deferReply();

    try {
      const bosses = await getUpcomingBosses(region, count);

      if (!bosses || bosses.length === 0) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle('No boss data found')
              .setDescription(`Could not retrieve boss timers for **${region}**. The Garmoth API may be temporarily unavailable.`)
          ]
        });
      }

      const lines = bosses.map(formatBossLine).join('\n');

      const embed = new EmbedBuilder()
        .setColor(0xc0392b)
        .setTitle(`⚔️  Upcoming BDO Bosses — ${region}`)
        .setDescription(lines)
        .setFooter({
          text: 'Data from Garmoth.com • Times shown in your local timezone',
          iconURL: 'https://garmoth.com/favicon.ico',
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('[/bosses] Error:', err);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Error fetching boss data')
            .setDescription(
              `Something went wrong when contacting the Garmoth API.\n\`\`\`${err.message}\`\`\``
            )
        ]
      });
    }
  },
};
