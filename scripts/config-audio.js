const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');

const settingsPath = path.join(os.homedir(), '.gemini', 'settings.json');

const isMac = os.platform() === 'darwin';

let SOUNDS = ['ping1', 'ping2', 'ping3', 'ping4'];
if (isMac) {
  SOUNDS = SOUNDS.concat([
    'Basso', 'Blow', 'Bottle', 'Frog', 'Funk', 'Glass', 'Hero',
    'Morse', 'Ping', 'Pop', 'Purr', 'Sosumi', 'Submarine', 'Tink'
  ]);
}

const EVENTS = [
  'SessionStart', 'SessionEnd', 'BeforeAgent', 'AfterAgent',
  'BeforeModel', 'AfterModel', 'BeforeToolSelection', 'BeforeTool',
  'AfterTool', 'Notification', 'PreCompress'
];

function readSettings() {
  if (!fs.existsSync(settingsPath)) return { extensions: {} };
  try { return JSON.parse(fs.readFileSync(settingsPath, 'utf8')); }
  catch (e) { return { extensions: {} }; }
}

function writeSettings(data) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving settings:', err.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let settings = readSettings();
if (!settings.extensions) settings.extensions = {};
if (!settings.extensions['notify-sound']) settings.extensions['notify-sound'] = {};
let ext = settings.extensions['notify-sound'];

// Initialize defaults
if (ext.enabled === undefined) ext.enabled = true;
if (!ext.sound) ext.sound = 'ping1';
if (!ext.events) ext.events = {};
EVENTS.forEach(ev => {
  if (ext.events[ev] === undefined) ext.events[ev] = true;
});

function showMenu() {
  console.clear();
  console.log('=== 🔔 Gemini CLI Notify Sound Configuration ===');
  console.log(`[0] Master Switch: ${ext.enabled ? '✅ On' : '🔇 Off'}`);
  console.log(`[S] Change Sound (Current: ${ext.sound})`);
  console.log('\n--- 🎯 Event-Specific Notifications ---');
  
  EVENTS.forEach((ev, i) => {
    const num = String(i + 1).padStart(2, ' ');
    console.log(`[${num}] ${ev.padEnd(20, ' ')}: ${ext.events[ev] ? '✅' : '🔇'}`);
  });
  
  console.log('\n[Q] Save and Quit');
  
  rl.question('\nEnter number/letter to change: ', (answer) => {
    const act = answer.trim().toUpperCase();
    
    if (act === 'Q') {
      writeSettings(settings);
      console.log('✅ Settings saved successfully.');
      rl.close();
      return;
    }
    
    if (act === '0') {
      ext.enabled = !ext.enabled;
    } else if (act === 'S') {
      console.log('\n🎵 Available Sounds:');
      SOUNDS.forEach((s, i) => {
        console.log(`${i + 1}. ${s}`);
      });
      rl.question('\nSelect sound number (Enter to cancel): ', (sIdx) => {
        const idx = parseInt(sIdx, 10) - 1;
        if (idx >= 0 && idx < SOUNDS.length) {
          ext.sound = SOUNDS[idx];
          console.log(`Sound changed to '${SOUNDS[idx]}'.`);
        }
        showMenu();
      });
      return; // Wait for inner question
    } else {
      const idx = parseInt(act, 10) - 1;
      if (idx >= 0 && idx < EVENTS.length) {
        const ev = EVENTS[idx];
        ext.events[ev] = !ext.events[ev];
      }
    }
    
    showMenu();
  });
}

showMenu();