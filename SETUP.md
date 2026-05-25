# BDO Boss Bot — Setup Guide

## Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer
- A Discord account with a server you manage

---

## Step 1 — Create your Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name (e.g. `BDO Boss Bot`)
3. Go to **Bot** tab → click **Add Bot**
4. Under **Token**, click **Reset Token** and copy it → this is your `DISCORD_TOKEN`
5. Scroll down and enable **`applications.commands`** scope
6. Go to **OAuth2 → URL Generator**:
   - Scopes: ✅ `bot`, ✅ `applications.commands`
   - Bot Permissions: ✅ `Send Messages`, ✅ `Embed Links`, ✅ `Mention Everyone`
7. Copy the generated URL, open it in your browser, and invite the bot to your server

---

## Step 2 — Get your IDs

| Variable    | Where to find it                                             |
|-------------|--------------------------------------------------------------|
| `CLIENT_ID` | Applications page → Your app → **Application ID**           |
| `GUILD_ID`  | Right-click your Discord server icon → **Copy Server ID**   |

> **Tip:** Enable Developer Mode in Discord: Settings → Advanced → Developer Mode

---

## Step 3 — Configure the bot

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` and fill in:
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here
DEFAULT_REGION=MENA
```

---

## Step 4 — Install & run

```bash
# Install dependencies
npm install

# Register slash commands with Discord (run once)
npm run deploy

# Start the bot
npm start
```

---

## Commands

| Command | Description |
|---|---|
| `/bosses` | Next 5 upcoming boss spawns (default: MENA) |
| `/bosses region:EU count:10` | Next 10 spawns in EU |
| `/nextboss` | The single next boss spawning |
| `/nextboss region:NA` | Next boss in NA |
| `/bossalert start channel:#bdo channel:15` | Auto-alert 15 min before each spawn |
| `/bossalert stop` | Stop alerts |
| `/bossalert status` | Check if alerts are active |

---

## API Source

All boss data comes from **[Garmoth.com](https://garmoth.com)** — the most up-to-date BDO boss tracker.

API endpoint: `https://api.garmoth.com/api/boss-timer?region=REGION_ID`

Region IDs:  NA=1, EU=2, SA=3, SEA=4, **MENA=5**, ConsoleNA=6, ConsoleEU=7
