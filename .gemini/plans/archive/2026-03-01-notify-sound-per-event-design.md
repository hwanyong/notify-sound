# Design Document: Per-Event Custom Sound Selection

## 1. Problem Statement
The `notify-sound` extension currently supports a single, global audio file selection that applies to all hook events. The user requires the ability to select a specific, distinct audio file for each individual hook event via the TUI (`/notify-sound:config`). Furthermore, the extension must standardize its audio sources by completely dropping support for macOS native system sounds, relying exclusively on the `.wav` files bundled within the `assets/sounds/` directory to ensure perfect cross-platform consistency.

## 2. Requirements
### Functional
- **Asset-Only Audio:** The application must only list and play sounds found in `assets/sounds/` (`ping1`, `ping2`, `ping3`, `ping4`). macOS system sounds (`Ping.aiff`, `Pop.aiff`, etc.) must be removed from selection and playback logic.
- **Per-Event Audio Config:** The `~/.gemini/settings.json` must be updated to store both the enabled state and the selected sound name for each specific hook event.
- **TUI Updates:** 
  - The main menu (`config-audio.js`) must display the current sound assigned to each event.
  - Selecting an event from the main menu should enter a sub-menu context for that event, allowing the user to toggle its status or change its specific sound.
- **Playback Updates:** `play-audio.sh` must read the specific sound assigned to the triggered event. If none is assigned, it should fall back to the global sound.

### Constraints
- Retain the use of the built-in Node.js `readline` module for the TUI.
- Do not introduce new external dependencies.
- Ensure backwards compatibility with existing user configs where `events['HookName']` might currently just be a boolean instead of an object.

## 3. Approach
### Selected Approach: Nested Menu with Object-based State
1. **Data Structure Migration:** In `config-audio.js` and `play-audio.sh`, we will handle the migration of `ext.events[eventName]` from a `boolean` to an `object`: `{ enabled: boolean, sound: string | null }`.
2. **TUI Sub-menus:** We will refactor the `readline` loop in `config-audio.js` to track "current menu state" (e.g., `MAIN_MENU` vs `EVENT_MENU`). When an event is selected, the console clears and shows options specific to that event.
3. **Strict Pathing:** We remove OS checks (`isMac`) and simply scan/hardcode `['ping1', 'ping2', 'ping3', 'ping4']`. The bash script will unconditionally load from `$EXT_DIR/assets/sounds/${SOUND_NAME}.wav`.

## 4. Architecture
### Components
- **`scripts/config-audio.js`**: 
  - `SOUNDS` array becomes a static list of the bundled wav files.
  - `readSettings()` parses the config. A normalization pass converts any legacy boolean event states into object states.
  - The `readline` handler uses a state machine (`currentMenu`, `selectedEvent`) to route inputs to the correct handler function (`handleMainMenu`, `handleEventMenu`, `handleSoundSelection`).
- **`scripts/play-audio.sh`**:
  - The inline Node script will extract `eventEnabled` and `eventSound`.
  - Bash logic removes all `/System/Library/Sounds/` fallback paths and strictly uses `assets/sounds/`.

### Data Flow
1. User types `/notify-sound:config`.
2. `config-audio.js` normalizes `ext.events['SessionEnd']` from `true` to `{ enabled: true, sound: null }` if necessary.
3. User selects `[2]` (SessionEnd). Menu updates to show SessionEnd specific config.
4. User selects `[S]` to change sound, picks `ping2`.
5. State `ext.events['SessionEnd'].sound = 'ping2'` is saved.
6. When `SessionEnd` hook fires, `play-audio.sh` evaluates the inline script. `eventSound` returns `ping2`.
7. `play-audio.sh` plays `$EXT_DIR/assets/sounds/ping2.wav`.

## 5. Agent Team
- **Orchestrator (TechLead)**: Coordinates the generation and validation.
- **Coder**: Implements the TUI state machine, config normalizer, and simplified bash playback script.
- **Tester**: Manually tests the nested menu interaction and ensures the bash script plays the correct per-event file.

## 6. Risk Assessment & Mitigation
- **Risk**: Legacy configurations breaking the new TUI.
  - *Mitigation*: The `config-audio.js` and `play-audio.sh` inline scripts must explicitly check if the event value is a boolean (legacy) or object (new) and normalize it on the fly.
- **Risk**: User gets stuck in a nested menu.
  - *Mitigation*: Ensure every sub-menu has a clear `[B] Back to Main Menu` option.

## 7. Success Criteria
- The TUI displays `✅ On (ping2)` next to specific events.
- macOS system sounds are completely purged from the codebase.
- Changing a sound for `PreCompress` to `ping3` causes the `play-audio.sh PreCompress` command to physically play the `ping3.wav` file, without affecting the sound of `SessionStart`.