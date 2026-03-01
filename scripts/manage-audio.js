const fs = require('fs');
const path = require('path');
const os = require('os');

const action = process.argv[2]; // 'enable', 'disable', 'status'
const settingsPath = path.join(os.homedir(), '.gemini', 'settings.json');

function readSettings() {
  if (!fs.existsSync(settingsPath)) {
    return { extensions: {} };
  }
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read settings file:', err.message);
    process.exit(1);
  }
}

function writeSettings(data) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save settings file:', err.message);
    process.exit(1);
  }
}

const settings = readSettings();
if (!settings.extensions) settings.extensions = {};
if (!settings.extensions['notify-sound']) settings.extensions['notify-sound'] = {};

if (action === 'enable') {
  settings.extensions['notify-sound'].enabled = true;
  writeSettings(settings);
  console.log('✅ Notification sound enabled.');
} else if (action === 'disable') {
  settings.extensions['notify-sound'].enabled = false;
  writeSettings(settings);
  console.log('🔇 Notification sound disabled.');
} else if (action === 'status') {
  const isEnabled = settings.extensions['notify-sound'].enabled !== false; // default true
  const sound = settings.extensions['notify-sound'].sound || 'ping1';
  console.log(`Notification Sound Status: ${isEnabled ? 'Enabled (✅)' : 'Disabled (🔇)'}`);
  console.log(`Current Sound: ${sound}`);
} else {
  console.log('Unknown command. Use enable, disable, or status.');
  process.exit(1);
}