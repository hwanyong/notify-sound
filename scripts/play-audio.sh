#!/bin/bash

EVENT="$1"

# Read settings from ~/.gemini/settings.json
SETTINGS_FILE="$HOME/.gemini/settings.json"

# Default fallback values
GLOBAL_ENABLED="true"
SOUND_NAME="Ping"
EVENT_ENABLED="true"

if [ -f "$SETTINGS_FILE" ]; then
  # Use Node.js to quickly parse JSON and extract values
  CONFIG=$(node -e "
    try {
      const cfg = require('$SETTINGS_FILE');
      const ext = cfg.extensions?.['notify-sound'] || {};
      const global = ext.enabled !== false;
      const sound = ext.sound || 'Ping';
      const events = ext.events || {};
      const eventEnabled = events['$EVENT'] !== false;
      console.log(global + '|' + sound + '|' + eventEnabled);
    } catch(e) {
      console.log('true|Ping|true');
    }
  ")
  GLOBAL_ENABLED=$(echo "$CONFIG" | cut -d'|' -f1)
  SOUND_NAME=$(echo "$CONFIG" | cut -d'|' -f2)
  EVENT_ENABLED=$(echo "$CONFIG" | cut -d'|' -f3)
fi

if [ "$GLOBAL_ENABLED" = "false" ] || [ "$EVENT_ENABLED" = "false" ]; then
  exit 0
fi

SOUND_PATH="/System/Library/Sounds/${SOUND_NAME}.aiff"

if [ ! -f "$SOUND_PATH" ]; then
  SOUND_PATH="/System/Library/Sounds/Ping.aiff"
fi

# Run afplay in the background
afplay "$SOUND_PATH" &