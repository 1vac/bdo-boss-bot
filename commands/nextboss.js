/**
 * /nextboss — Show only the very next boss spawning
 *
 * Usage:
 *   /nextboss              → next boss in MENA
 *   /nextboss region:NA    → next boss in NA
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getNextBoss, BOSS_META } = require('../garmoth');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nextboss')
    .setDescription('Show the very next BDO world boss that will spawn')
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
    ),

  async execute(interaction) {
    const region = interaction.options.getString('region') ?? process.env.DEFAULT_REGION ?? 'MENA';

    await interaction.deferReply();

    try {
      const boss = await getNextBoss(region);

      if (!boss) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff9900)
              .setTitle('No upcoming boss found')
              .setDescription(`No upcoming boss spawns found for **${region}**.`)
          ]
        });
      }

      const name     = boss.name ?? boss.bossName ?? 'Unknown Boss';
      const rawTime  = boss.spawnTime ?? boss.nextSpawnTime ?? boss.time;
      const spawnMs  = new Date(rawTime).getTime();
      const unixSec  = Math.floor(spawnMs / 1000);
      const meta     = BOSS_META[name] ?? { emoji: '⚔️', color: 0x2ecc71 };

      const embed = new EmbedBuilder()
        .setColor(meta.color ?? 0x2ecc71)
        .setTitle(`${meta.emoji}  Next Boss: ${name}  [${region}]`)
        .addFields(
          { name: '🕐 Spawn Time',  value: `<t:${unixSec}:F>`, inline: true },
          { name: '⏳ In',          value: `<t:${unixSec}:R>`,  inline: true },
        )
        .setFooter({
          text: 'Data from Garmoth.com • Times shown in your local timezone',
          iconURL: 'https://garmoth.com/favicon.ico',
        })
        .setTimestamp();

      // Add boss image if we have one
      if (meta.image) embed.setThumbnail(meta.image);

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('[/nextboss] Error:', err);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Error fetching boss data')
            .setDescription(`\`\`\`${err.message}\`\`\``)
        ]
      });
    }
  },
};
