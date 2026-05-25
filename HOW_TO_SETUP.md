# BDO Boss Bot — Setup Guide for Your Friend

## What you need before starting
- A computer with **Node.js** installed → download from https://nodejs.org (pick the LTS version)
- A Discord account
- The bot files from this GitHub repo

---

## STEP 1 — Download the bot files

```
git clone https://github.com/YOUR_FRIEND_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

Or just download the ZIP from GitHub and extract it.

---

## STEP 2 — Create the Discord Bot

1. Go to → https://discord.com/developers/applications
2. Click **"New Application"** (top right)
3. Give it a name like `BDO Boss Bot` → click **Create**
4. On the left sidebar click **"Bot"**
5. Click **"Reset Token"** → copy the token and save it somewhere safe
   ⚠️ This is your `DISCORD_TOKEN` — never share it publicly
6. Scroll down and make sure these are turned ON:
   - ✅ `Message Content Intent`
   - ✅ `Server Members Intent`

---

## STEP 3 — Invite the bot to your server

1. Still in the developer portal, click **"OAuth2"** on the left sidebar
2. Click **"URL Generator"**
3. Under **Scopes** check: ✅ `bot` and ✅ `applications.commands`
4. Under **Bot Permissions** check:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Mention Everyone
5. Scroll down and copy the generated URL
6. Open that URL in your browser → select your server → click **Authorize**

---

## STEP 4 — Get your IDs

You need two more IDs. First, enable Developer Mode in Discord:
> Discord → Settings (gear icon) → Advanced → turn on **Developer Mode**

Now:
- **CLIENT_ID** → Go back to https://discord.com/developers/applications → click your app → copy the **Application ID**
- **GUILD_ID** → In Discord, right-click your server name → **"Copy Server ID"**

---

## STEP 5 — Configure the bot

Inside the bot folder, find the file called `.env.example`.
- Rename it to `.env` (remove the `.example` part)
- Open `.env` with any text editor (Notepad is fine)
- Fill it in like this:

```
DISCORD_TOKEN=paste_your_bot_token_here
CLIENT_ID=paste_your_application_id_here
GUILD_ID=paste_your_server_id_here
DEFAULT_REGION=MENA
```

Save the file.

---

## STEP 6 — Install & run

Open a terminal / command prompt inside the bot folder and run these commands one by one:

```bash
# 1. Install the bot's dependencies
npm install

# 2. Register the slash commands with Discord (run this once)
node deploy-commands.js

# 3. Start the bot!
node index.js
```

If everything worked you'll see:
```
✅ Logged in as BDO Boss Bot#1234
🗡️  BDO Boss Bot is online!
```

---

## STEP 7 — Use the bot in Discord

Go to your Discord server and type `/` — you should see:

| Command | What it does |
|---|---|
| `/bosses` | Shows next 5 boss spawns for MENA |
| `/bosses region:EU` | Boss spawns for any other region |
| `/nextboss` | Shows only the very next boss |
| `/bossalert start channel:#your-channel` | Auto-alerts before each boss spawns |
| `/bossalert stop` | Stops the alerts |

---

## Keep the bot running 24/7 (optional)

Right now the bot only runs while your terminal is open.
To keep it running permanently, look into:
- **[PM2](https://pm2.keymetrics.io/)** — free process manager (recommended)
  ```bash
  npm install -g pm2
  pm2 start index.js --name bdo-bot
  pm2 save
  ```
- A cheap VPS (like DigitalOcean, Hetzner, or Oracle Free Tier)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `DISCORD_TOKEN is not set` | Make sure your `.env` file exists and is filled in correctly |
| Commands don't show up | Run `node deploy-commands.js` again |
| Bot is online but not responding | Check that you invited it with `applications.commands` scope |
| Boss data not loading | Garmoth API may be temporarily down — try again in a few minutes |
