/**
 * garmoth.js — BDO Boss Schedule (hardcoded weekly schedule)
 *
 * BDO world bosses follow a fixed weekly schedule.
 * Times are in UTC. MENA server = UTC+3.
 *
 * Schedule source: community-verified BDO boss timer
 */

// Boss metadata
const BOSS_META = {
  Kzarka:   { emoji: '🔴', color: 0xe74c3c },
  Karanda:  { emoji: '🟣', color: 0x9b59b6 },
  Nouver:   { emoji: '🔵', color: 0x3498db },
  Kutum:    { emoji: '🟠', color: 0xe67e22 },
  Offin:    { emoji: '🟡', color: 0xf1c40f },
  Quint:    { emoji: '⚪', color: 0xbdc3c7 },
  Muraka:   { emoji: '🟤', color: 0x8b6914 },
  Vell:     { emoji: '🌊', color: 0x1abc9c },
  Garmoth:  { emoji: '🐉', color: 0xc0392b },
  Bellocan: { emoji: '🌙', color: 0x6c3483 },
};

/**
 * MENA Boss Schedule — sourced from mmotimer.com/bdo/?server=mena
 *
 * MENA server runs on TRT (Turkey Time = UTC+3).
 * All times below are stored in UTC (TRT minus 3 hours).
 * day: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday,
 *      4=Thursday, 5=Friday, 6=Saturday  (UTC day)
 */
const BOSS_SCHEDULE = [
  // ── Sunday UTC (= Sunday TRT 03:00+ and Monday TRT 00:00-02:59) ──
  { day: 0, hour: 8,  minute: 0,  name: 'Kzarka'  },  // Sun 11:00 TRT
  { day: 0, hour: 8,  minute: 0,  name: 'Nouver'  },  // Sun 11:00 TRT
  { day: 0, hour: 13, minute: 0,  name: 'Karanda' },  // Sun 16:00 TRT
  { day: 0, hour: 13, minute: 0,  name: 'Kutum'   },  // Sun 16:00 TRT
  { day: 0, hour: 15, minute: 0,  name: 'Vell'    },  // Sun 18:00 TRT
  { day: 0, hour: 17, minute: 0,  name: 'Nouver'  },  // Sun 20:00 TRT
  { day: 0, hour: 17, minute: 0,  name: 'Kutum'   },  // Sun 20:00 TRT
  { day: 0, hour: 20, minute: 15, name: 'Garmoth' },  // Sun 23:15 TRT
  { day: 0, hour: 22, minute: 0,  name: 'Kzarka'  },  // Mon 01:00 TRT

  // ── Monday UTC ──
  { day: 1, hour: 8,  minute: 0,  name: 'Kzarka'  },  // Mon 11:00 TRT
  { day: 1, hour: 8,  minute: 0,  name: 'Nouver'  },  // Mon 11:00 TRT
  { day: 1, hour: 13, minute: 0,  name: 'Kzarka'  },  // Mon 16:00 TRT
  { day: 1, hour: 13, minute: 0,  name: 'Kutum'   },  // Mon 16:00 TRT
  { day: 1, hour: 17, minute: 0,  name: 'Karanda' },  // Mon 20:00 TRT
  { day: 1, hour: 17, minute: 0,  name: 'Nouver'  },  // Mon 20:00 TRT
  { day: 1, hour: 20, minute: 15, name: 'Offin'   },  // Mon 23:15 TRT
  { day: 1, hour: 22, minute: 0,  name: 'Kutum'   },  // Tue 01:00 TRT

  // ── Tuesday UTC ──
  { day: 2, hour: 8,  minute: 0,  name: 'Kzarka'  },  // Tue 11:00 TRT
  { day: 2, hour: 8,  minute: 0,  name: 'Kutum'   },  // Tue 11:00 TRT
  { day: 2, hour: 13, minute: 0,  name: 'Karanda' },  // Tue 16:00 TRT
  { day: 2, hour: 13, minute: 0,  name: 'Nouver'  },  // Tue 16:00 TRT
  { day: 2, hour: 17, minute: 0,  name: 'Quint'   },  // Tue 20:00 TRT
  { day: 2, hour: 17, minute: 0,  name: 'Muraka'  },  // Tue 20:00 TRT
  { day: 2, hour: 20, minute: 15, name: 'Garmoth' },  // Tue 23:15 TRT
  { day: 2, hour: 22, minute: 0,  name: 'Karanda' },  // Wed 01:00 TRT
  { day: 2, hour: 22, minute: 0,  name: 'Offin'   },  // Wed 01:00 TRT

  // ── Wednesday UTC ──
  { day: 3, hour: 8,  minute: 0,  name: 'Nouver'  },  // Wed 11:00 TRT
  { day: 3, hour: 8,  minute: 0,  name: 'Kutum'   },  // Wed 11:00 TRT
  { day: 3, hour: 13, minute: 0,  name: 'Kzarka'  },  // Wed 16:00 TRT
  { day: 3, hour: 13, minute: 0,  name: 'Nouver'  },  // Wed 16:00 TRT
  { day: 3, hour: 17, minute: 0,  name: 'Karanda' },  // Wed 20:00 TRT
  { day: 3, hour: 17, minute: 0,  name: 'Kzarka'  },  // Wed 20:00 TRT
  { day: 3, hour: 21, minute: 15, name: 'Vell'    },  // Thu 00:15 TRT
  { day: 3, hour: 22, minute: 0,  name: 'Kzarka'  },  // Thu 01:00 TRT

  // ── Thursday UTC ──
  { day: 4, hour: 8,  minute: 0,  name: 'Kzarka'  },  // Thu 11:00 TRT
  { day: 4, hour: 8,  minute: 0,  name: 'Nouver'  },  // Thu 11:00 TRT
  { day: 4, hour: 13, minute: 0,  name: 'Karanda' },  // Thu 16:00 TRT
  { day: 4, hour: 13, minute: 0,  name: 'Kutum'   },  // Thu 16:00 TRT
  { day: 4, hour: 17, minute: 0,  name: 'Nouver'  },  // Thu 20:00 TRT
  { day: 4, hour: 17, minute: 0,  name: 'Kutum'   },  // Thu 20:00 TRT
  { day: 4, hour: 20, minute: 15, name: 'Garmoth' },  // Thu 23:15 TRT
  { day: 4, hour: 22, minute: 0,  name: 'Nouver'  },  // Fri 01:00 TRT

  // ── Friday UTC ──
  { day: 5, hour: 8,  minute: 0,  name: 'Kzarka'  },  // Fri 11:00 TRT
  { day: 5, hour: 8,  minute: 0,  name: 'Kutum'   },  // Fri 11:00 TRT
  { day: 5, hour: 13, minute: 0,  name: 'Nouver'  },  // Fri 16:00 TRT
  { day: 5, hour: 17, minute: 0,  name: 'Kzarka'  },  // Fri 20:00 TRT
  { day: 5, hour: 17, minute: 0,  name: 'Kutum'   },  // Fri 20:00 TRT
  { day: 5, hour: 20, minute: 15, name: 'Offin'   },  // Fri 23:15 TRT
  { day: 5, hour: 22, minute: 0,  name: 'Karanda' },  // Sat 01:00 TRT

  // ── Saturday UTC ──
  { day: 6, hour: 8,  minute: 0,  name: 'Nouver'  },  // Sat 11:00 TRT
  { day: 6, hour: 8,  minute: 0,  name: 'Kutum'   },  // Sat 11:00 TRT
  { day: 6, hour: 13, minute: 0,  name: 'Karanda' },  // Sat 16:00 TRT
  { day: 6, hour: 13, minute: 0,  name: 'Kzarka'  },  // Sat 16:00 TRT
  { day: 6, hour: 16, minute: 0,  name: 'Quint'   },  // Sat 19:00 TRT
  { day: 6, hour: 16, minute: 0,  name: 'Muraka'  },  // Sat 19:00 TRT
  { day: 6, hour: 22, minute: 15, name: 'Karanda' },  // Sun 01:15 TRT
];

/**
 * Get the next spawn Date object for a schedule entry, from a given 'now'
 */
function nextSpawnDate(entry, now) {
  const d = new Date(now);
  d.setUTCHours(entry.hour, entry.minute, 0, 0);

  // Find how many days until the next occurrence of entry.day
  const todayDay = d.getUTCDay();
  let daysUntil = (entry.day - todayDay + 7) % 7;

  // If it's today but time has already passed, push to next week
  if (daysUntil === 0 && d.getTime() <= now) daysUntil = 7;

  d.setUTCDate(d.getUTCDate() + daysUntil);
  return d;
}

/**
 * Get the next N upcoming boss spawns
 * @param {string} region  (kept for API compatibility, schedule is global)
 * @param {number} limit
 * @returns {Array} sorted array of { name, spawnTime (Date) }
 */
function getUpcomingBosses(region = 'MENA', limit = 5) {
  const now = Date.now();

  const spawns = BOSS_SCHEDULE.map(entry => ({
    name: entry.name,
    spawnTime: nextSpawnDate(entry, now),
  }));

  spawns.sort((a, b) => a.spawnTime - b.spawnTime);

  return Promise.resolve(spawns.slice(0, limit));
}

/**
 * Get the single next boss spawning
 */
async function getNextBoss(region = 'MENA') {
  const upcoming = await getUpcomingBosses(region, 1);
  return upcoming[0] ?? null;
}

/**
 * Build a Discord embed line for a single boss spawn
 */
function formatBossLine(boss) {
  const name = boss.name ?? 'Unknown';
  const spawnMs = boss.spawnTime instanceof Date
    ? boss.spawnTime.getTime()
    : new Date(boss.spawnTime).getTime();

  const meta = BOSS_META[name] ?? { emoji: '⚔️' };
  const unixSec = Math.floor(spawnMs / 1000);

  return `${meta.emoji} **${name}** — <t:${unixSec}:t>  (<t:${unixSec}:R>)`;
}

/**
 * Format ms into "2h 14m"
 */
function formatCountdown(ms) {
  if (ms <= 0) return 'Spawning now!';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

module.exports = {
  getUpcomingBosses,
  getNextBoss,
  formatCountdown,
  formatBossLine,
  BOSS_META,
};
