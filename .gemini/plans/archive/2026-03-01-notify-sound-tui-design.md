# Design Document: Notify Sound TUI Enhancement

## 1. Problem Statement
The `notify-sound` extension for Gemini CLI currently supports playing audio on various hook events. The user has requested a TUI (Text-based User Interface) configuration menu accessible via `/notify-sound:config` that allows enabling or disabling sound notifications for each hook event individually. While a basic `readline` implementation exists, it needs to be verified, refined, and ensured it integrates perfectly with the playback script.

## 2. Requirements
### Functional
- User must be able to invoke `/notify-sound:config` to launch an interactive menu.
- The menu must display the global master switch, current sound selection, and a list of all supported Gemini CLI hook events.
- User must be able to toggle the enabled/disabled state of each hook event individually.
- Settings must be persistently saved to the Gemini CLI settings file (`~/.gemini/settings.json`).
- The audio playback script (`play-audio.sh`) must respect the individual event configurations before playing a sound.

### Non-Functional
- Must be lightweight and not require heavy external dependencies (e.g., sticking to built-in Node.js `readline`).
- The interface should be clear, responsive, and easy to navigate using standard keyboard input.

### Constraints
- Must remain compatible with the existing `settings.json` structure (`extensions['notify-sound']`).
- Must work cross-platform (macOS, Linux, Windows).

## 3. Approach
### Selected Approach: Refined `readline` Implementation
We will enhance the existing `scripts/config-audio.js` which uses the native Node.js `readline` module. 

**Modifications:**
1. Verify the menu rendering and input handling logic.
2. Ensure the `play-audio.sh` script correctly extracts the specific event state from `settings.json` and short-circuits if the event is disabled. (This is mostly implemented but needs verification).

### Alternatives Considered
- **Inquirer.js / Enquirer**: While providing a richer UI (arrow key navigation), it introduces an external dependency to a very lightweight extension. The existing `readline` approach is sufficient and dependency-free.

## 4. Architecture
### Components
- **`commands/notify-sound/config.toml`**: The entry point. Executes `node scripts/config-audio.js`.
- **`scripts/config-audio.js`**: The interactive TUI. Reads `~/.gemini/settings.json`, renders the menu, handles user input to toggle states, and writes back to `settings.json`.
- **`scripts/play-audio.sh`**: The execution hook. Receives the event name as `$1`, parses `settings.json` using a quick inline Node script, and exits if the global or specific event setting is false.

### Data Flow
1. User runs `/notify-sound:config`.
2. CLI executes `config-audio.js`.
3. Script reads `settings.json`. User toggles `SessionEnd` to `false`. Script writes to `settings.json`.
4. Gemini CLI triggers `SessionEnd` hook.
5. CLI executes `play-audio.sh SessionEnd`.
6. Script reads `settings.json`, sees `events['SessionEnd'] === false`, and exits cleanly without playing sound.

## 5. Agent Team
- **Orchestrator (TechLead)**: Manages the workflow and validates the final implementation.
- **Coder**: Implements any necessary refinements to `config-audio.js` and `play-audio.sh`.
- **Tester**: Validates the end-to-end flow.

## 6. Risk Assessment & Mitigation
- **Risk**: Concurrent file writes to `~/.gemini/settings.json` causing corruption.
  - *Mitigation*: The config script is run interactively by the user, so concurrent writes are unlikely during configuration. The read in `play-audio.sh` is read-only.
- **Risk**: Missing event names.
  - *Mitigation*: Hardcode the complete list of supported Gemini CLI events in the config script to ensure consistency.

## 7. Success Criteria
- Running `/notify-sound:config` presents a clear, interactive menu.
- Disabling a specific event (e.g., `PreCompress`) stops the sound from playing when that event occurs, while other events still play sounds.
- The global master switch correctly overrides individual event settings.