const readline = require('readline');
const fs = require('fs');
const path = require('path');

const home = process.env.HOME || process.env.USERPROFILE;
const settingsPath = path.join(home, '.gemini', 'settings.json');

const SOUNDS = ['ping1', 'ping2', 'ping3', 'ping4'];

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
  if (ext.events[ev] === undefined) {
    ext.events[ev] = { enabled: true, sound: null };
  } else if (typeof ext.events[ev] === 'boolean') {
    ext.events[ev] = { enabled: ext.events[ev], sound: null };
  } else if (typeof ext.events[ev] === 'object' && ext.events[ev] !== null) {
    if (ext.events[ev].enabled === undefined) ext.events[ev].enabled = true;
    if (ext.events[ev].sound === undefined) ext.events[ev].sound = null;
  }
});

let currentMenu = 'main';

function showMainMenu() {
  console.clear();
  console.log('=== 🔔 Gemini CLI Notify Sound Configuration ===');
  console.log(`[0] Master Switch: ${ext.enabled ? '✅ On ' : '🔇 Off'}`);
  console.log(`[S] Global Sound (Current: ${ext.sound})`);
  console.log('\n--- 🎯 Event-Specific Notifications ---');
  
  EVENTS.forEach((ev, i) => {
    const num = String(i + 1).padStart(2, ' ');
    const eventConfig = ext.events[ev];
    const status = eventConfig.enabled ? '✅ On ' : '🔇 Off';
    const soundStr = eventConfig.sound ? eventConfig.sound : 'Default';
    console.log(`[${num}] ${ev.padEnd(20, ' ')}: ${status} (${soundStr})`);
  });
  
  console.log('\n[Q] Quit');
}

function showEventMenu(ev) {
  console.clear();
  const eventConfig = ext.events[ev];
  console.log(`=== 🎯 Configure Event: ${ev} ===`);
  console.log(`[1] Toggle (Currently ${eventConfig.enabled ? 'On' : 'Off'})`);
  console.log(`[2] Change Sound (Currently ${eventConfig.sound ? eventConfig.sound : 'Default'})`);
  console.log('\n[B] Back to Main Menu');
}

function promptMain() {
  rl.question('\nEnter number/letter to select: ', (answer) => {
    const act = answer.trim().toUpperCase();
    
    if (act === 'Q') {
      console.log('✅ Exiting configuration.');
      rl.close();
      return;
    }
    
    if (act === '0') {
      ext.enabled = !ext.enabled;
      writeSettings(settings);
      showMainMenu();
      promptMain();
      return;
    } 
    
    if (act === 'S') {
      console.log('\n🎵 Available Global Sounds:');
      SOUNDS.forEach((s, i) => {
        console.log(`${i + 1}. ${s}`);
      });
      rl.question('\nSelect sound number (Enter to cancel): ', (sIdx) => {
        const trimmed = sIdx.trim();
        if (/^\d+$/.test(trimmed)) {
          const idx = parseInt(trimmed, 10) - 1;
          if (idx >= 0 && idx < SOUNDS.length) {
            ext.sound = SOUNDS[idx];
            console.log(`Global sound changed to '${SOUNDS[idx]}'.`);
            writeSettings(settings);
          }
        }
        showMainMenu();
        promptMain();
      });
      return;
    } 
    
    if (/^\d+$/.test(act)) {
      const idx = parseInt(act, 10) - 1;
      if (idx >= 0 && idx < EVENTS.length) {
        currentMenu = EVENTS[idx];
        showEventMenu(currentMenu);
        promptEvent();
        return;
      }
    }
    
    showMainMenu();
    promptMain();
  });
}

function promptEvent() {
  rl.question('\nEnter option: ', (answer) => {
    const act = answer.trim().toUpperCase();
    const ev = currentMenu;
    const eventConfig = ext.events[ev];

    if (act === 'B') {
      currentMenu = 'main';
      showMainMenu();
      promptMain();
      return;
    }
    
    if (act === '1') {
      eventConfig.enabled = !eventConfig.enabled;
      writeSettings(settings);
      showEventMenu(currentMenu);
      promptEvent();
      return;
    }
    
    if (act === '2') {
      console.log('\n🎵 Available Sounds:');
      console.log(`0. Default (Global Sound)`);
      SOUNDS.forEach((s, i) => {
        console.log(`${i + 1}. ${s}`);
      });
      rl.question('\nSelect sound number (Enter to cancel): ', (sIdx) => {
        const trimmed = sIdx.trim();
        if (/^\d+$/.test(trimmed)) {
          const idx = parseInt(trimmed, 10);
          if (idx === 0) {
            eventConfig.sound = null;
            writeSettings(settings);
          } else if (idx > 0 && idx <= SOUNDS.length) {
            eventConfig.sound = SOUNDS[idx - 1];
            writeSettings(settings);
          }
        }
        showEventMenu(currentMenu);
        promptEvent();
      });
      return;
    }
    
    showEventMenu(currentMenu);
    promptEvent();
  });
}

showMainMenu();
promptMain();