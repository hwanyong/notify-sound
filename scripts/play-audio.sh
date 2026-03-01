#!/bin/bash

EVENT="$1"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
EXT_DIR="$(dirname "$DIR")"

# Read settings from ~/.gemini/settings.json
SETTINGS_FILE="$HOME/.gemini/settings.json"

# Default fallback values
GLOBAL_ENABLED="true"
SOUND_NAME="ping1"
EVENT_ENABLED="true"

if [ -f "$SETTINGS_FILE" ]; then
  # Use Node.js to quickly parse JSON and extract values
  CONFIG=$(node -e "
    try {
      const cfg = require('$SETTINGS_FILE');
      const ext = cfg.extensions?.['notify-sound'] || {};
      const global = ext.enabled !== false;
      const globalSound = ext.sound || 'ping1';
      const events = ext.events || {};
      
      let eventEnabled = true;
      let specificSoundToPlay = globalSound;
      
      const eventConf = events['$EVENT'];
      if (typeof eventConf === 'boolean') {
        eventEnabled = eventConf;
      } else if (typeof eventConf === 'object' && eventConf !== null) {
        if (eventConf.enabled !== undefined) {
            eventEnabled = eventConf.enabled;
        }
        if (eventConf.sound) {
            specificSoundToPlay = eventConf.sound;
        }
      }
      
      console.log(global + '|' + specificSoundToPlay + '|' + eventEnabled);
    } catch(e) {
      console.log('true|ping1|true');
    }
  ")
  GLOBAL_ENABLED=$(echo "$CONFIG" | cut -d'|' -f1)
  SOUND_NAME=$(echo "$CONFIG" | cut -d'|' -f2)
  EVENT_ENABLED=$(echo "$CONFIG" | cut -d'|' -f3)
fi

if [ "$GLOBAL_ENABLED" = "false" ] || [ "$EVENT_ENABLED" = "false" ]; then
  exit 0
fi

# Determine sound path
SOUND_PATH="$EXT_DIR/assets/sounds/${SOUND_NAME}.wav"

# Fallback if file doesn't exist
if [ ! -f "$SOUND_PATH" ]; then
  SOUND_PATH="$EXT_DIR/assets/sounds/ping1.wav"
fi

# Detect OS and play sound
if [[ "$OSTYPE" == "darwin"* ]]; then
  afplay "$SOUND_PATH" &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  if command -v paplay >/dev/null 2>&1; then
    paplay "$SOUND_PATH" &
  elif command -v aplay >/dev/null 2>&1; then
    aplay -q "$SOUND_PATH" &
  fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  # Convert path to Windows format if needed (Git Bash / MSYS)
  if command -v cygpath >/dev/null 2>&1; then
    WIN_PATH=$(cygpath -w "$SOUND_PATH")
    powershell.exe -c "(New-Object System.Media.SoundPlayer '${WIN_PATH}').PlaySync()" &
  else
    powershell.exe -c "(New-Object System.Media.SoundPlayer '${SOUND_PATH}').PlaySync()" &
  fi
fi