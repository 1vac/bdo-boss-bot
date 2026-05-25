/**
 * garmoth.js — Garmoth.com API helper
 *
 * Base URL : https://api.garmoth.com
 * Key endpoint: GET /api/boss-timer?region=REGION_ID
 *
 * Region IDs (as used by Garmoth internally):
 *   NA         → 1
 *   EU         → 2
 *   SA         → 3   (South America)
 *   SEA        → 4   (South East Asia)
 *   MENA       → 5   (Middle East & North Africa)
 *   ConsoleNA  → 6
 *   ConsoleEU  → 7
 */

const fetch = require('node-fetch');

const BASE_URL = 'https://api.garmoth.com';

const REGION_IDS = {
  NA:        1,
  EU:        2,
  SA:        3,
  SEA:       4,
  MENA:      5,
  CONSOLENA: 6,
  CONSOLEEU: 7,
};

// Boss display names and their thumbnail images
const BOSS_META = {
  Kzarka:       { emoji: '🔴', color: 0xe74c3c, image: 'https://garmoth.com/images/bosses/kzarka.png' },
  Karanda:      { emoji: '🟣', color: 0x9b59b6, image: 'https://garmoth.com/images/bosses/karanda.png' },
  Nouver:       { emoji: '🔵', color: 0x3498db, image: 'https://garmoth.com/images/bosses/nouver.png' },
  Kutum:        { emoji: '🟠', color: 0xe67e22, image: 'https://garmoth.com/images/bosses/kutum.png' },
  Offin:        { emoji: '🟡', color: 0xf1c40f, image: 'https://garmoth.com/images/bosses/offin.png' },
  Quint:        { emoji: '⚪', color: 0xbdc3c7, image: 'https://garmoth.com/images/bosses/quint.png' },
  Muraka:       { emoji: '🟤', color: 0x8b6914, image: 'https://garmoth.com/images/bosses/muraka.png' },
  Vell:         { emoji: '🌊', color: 0x1abc9c, image: 'https://garmoth.com/images/bosses/vell.png' },
  Garmoth:      { emoji: '🐉', color: 0xc0392b, image: 'https://garmoth.com/images/bosses/garmoth.png' },
  Bellocan:     { emoji: '🌙', color: 0x6c3483, image: 'https://garmoth.com/images/bosses/bellocan.png' },
};

/**
 * Normalise a region string → Garmoth region ID number
 */
function getRegionId(region = 'MENA') {
  const key = region.toUpperCase().replace(/\s/g, '');
  return REGION_IDS[key] ?? REGION_IDS.MENA;
}

/**
 * Fetch boss timer data from Garmoth
 * @param {string} region  e.g. 'MENA', 'EU', 'NA'
 * @returns {Promise<Array>} Array of boss spawn objects
 */
async function fetchBossTimers(region = 'MENA') {
  const regionId = getRegionId(region);
  const url = `${BASE_URL}/api/boss-timer?region=${regionId}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Origin': 'https://garmoth.com',
      'Referer': 'https://garmoth.com/',
    },
  });

  if (!response.ok) {
    throw new Error(`Garmoth API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data; // array of boss spawn objects
}

/**
 * Get the next N upcoming boss spawns (sorted by time)
 * @param {string} region
 * @param {number} limit   how many bosses to return (default 5)
 */
async function getUpcomingBosses(region = 'MENA', limit = 5) {
  const bosses = await fetchBossTimers(region);
  const now = Date.now();

  // Filter to future spawns and sort ascending
  const upcoming = bosses
    .filter(b => {
      const spawnTime = new Date(b.spawnTime ?? b.nextSpawnTime ?? b.time).getTime();
      return spawnTime > now;
    })
    .sort((a, b) => {
      const tA = new Date(a.spawnTime ?? a.nextSpawnTime ?? a.time).getTime();
      const tB = new Date(b.spawnTime ?? b.nextSpawnTime ?? b.time).getTime();
      return tA - tB;
    })
    .slice(0, limit);

  return upcoming;
}

/**
 * Get the single next boss spawning
 * @param {string} region
 */
async function getNextBoss(region = 'MENA') {
  const upcoming = await getUpcomingBosses(region, 1);
  return upcoming[0] ?? null;
}

/**
 * Format milliseconds into a human-readable countdown  e.g.  "2h 14m"
 */
function formatCountdown(ms) {
  if (ms <= 0) return 'Spawning now!';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Build a Discord embed field value for a single boss spawn
 */
function formatBossLine(boss) {
  const name = boss.name ?? boss.bossName ?? 'Unknown';
  const rawTime = boss.spawnTime ?? boss.nextSpawnTime ?? boss.time;
  const spawnMs = new Date(rawTime).getTime();
  const diffMs = spawnMs - Date.now();
  const meta = BOSS_META[name] ?? { emoji: '⚔️' };

  // Discord timestamp  <t:UNIX:R>  shows live relative time in the client
  const unixSec = Math.floor(spawnMs / 1000);
  const discordTs = `<t:${unixSec}:t>  (<t:${unixSec}:R>)`;

  return `${meta.emoji} **${name}** — ${discordTs}`;
}

module.exports = {
  fetchBossTimers,
  getUpcomingBosses,
  getNextBoss,
  formatCountdown,
  formatBossLine,
  BOSS_META,
  REGION_IDS,
};
