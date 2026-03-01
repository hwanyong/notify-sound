# Gemini CLI Notify Sound Extension

A notification sound extension for the [Gemini CLI](https://geminicli.com) that plays an audio cue when various hook events occur. 

Never miss the completion of a long-running task, agent action, or prompt generation again. This extension works cross-platform (macOS, Linux, Windows) using built-in terminal audio players.

## Features
- **Cross-Platform Support:** Plays sounds using built-in tools (`afplay` on macOS, `aplay`/`paplay` on Linux, `PowerShell` on Windows).
- **Default Sounds Included:** Comes with 4 crisp `ping` sounds (`.wav` format) out of the box to avoid licensing issues.
- **macOS System Sounds:** On macOS, automatically supports playing native system sounds (like Ping, Pop, Basso, etc.).
- **Event Specific:** Granular control over which Gemini CLI events trigger a sound.
- **Interactive Configuration:** Easy-to-use interactive menu to set up sounds and event triggers.

## Installation

Install the extension directly via the Gemini CLI using the public GitHub repository:

```bash
gemini extensions install https://github.com/hwanyong/notify-sound
```

## Configuration

You can easily configure the extension using the interactive command provided:

```bash
gemini notify-sound config
```

### Configuration Options

When you run the config command, you will see an interactive menu:

1. **Master Switch:** Quickly enable or disable the entire extension.
2. **Change Sound:** 
   - Choose between the built-in sounds (`ping1`, `ping2`, `ping3`, `ping4`).
   - If you are on a Mac, you will also see the native macOS system sounds.
3. **Event Toggles:** You can toggle sounds on/off for specific Gemini CLI lifecycle hooks:
   - `SessionStart` / `SessionEnd`
   - `BeforeAgent` / `AfterAgent`
   - `BeforeModel` / `AfterModel`
   - `BeforeToolSelection` 
   - `BeforeTool` / `AfterTool`
   - `Notification`
   - `PreCompress`

## CLI Commands

In addition to the interactive config, you can quickly toggle the master state:

- **Enable all sounds:**
  ```bash
  gemini notify-sound enable
  ```
- **Disable all sounds (Silence):**
  ```bash
  gemini notify-sound disable
  ```
- **Check current status:**
  ```bash
  gemini notify-sound status
  ```

## License

This project is licensed under the [MIT License](LICENSE). 
The included `ping1` ~ `ping4` sounds are assumed to be royalty-free/public domain (CC0) or appropriately licensed for distribution.
