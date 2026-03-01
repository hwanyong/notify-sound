# Gemini CLI Extension Release Guide (notify-sound)

This guide provides instructions on how to release your `notify-sound` extension for the Gemini CLI, based on the official documentation.

## Prerequisites
1. **Public GitHub Repository:** Your repository must be public if you want it to be discoverable in the extension gallery.
2. **Manifest File:** Ensure that `gemini-extension.json` is located at the root of your repository or release archive.

## Step 1: Add the Gallery Topic
To make your extension discoverable by the Gemini CLI crawler:
- Go to your GitHub repository page.
- In the "About" section on the right sidebar, click the settings (gear) icon.
- Add the topic `gemini-cli-extension` to the "Topics" field.

## Step 2: Choose a Release Method

### Option A: Git Repository Release (Recommended for Flexibility)
This is the simplest method where users install directly from your repository.
- **Process:** Simply push your code to the `main` or `master` branch.
- **Installation Command:**
  ```bash
  gemini extensions install https://github.com/your-username/notify-sound
  ```
- Users can specify branches or tags using the `--ref` option (e.g., `--ref=v1.0.0`).

### Option B: GitHub Releases (Recommended for Efficiency)
If you want to package your extension into archives for faster installation:
- **Process:** Create a new Release on GitHub and attach the source code archive (zip/tar.gz) or let GitHub automatically generate it.
- **Installation:** The CLI will automatically fetch the 'Latest release' from GitHub when users run the install command.

## Step 3: Local Testing Before Release
Before releasing, you can test your extension locally without reinstalling:
```bash
# Link the current directory
gemini extensions link

# Verify installation
gemini extensions list
```

## Step 4: Final Directory Rename
Please ensure that your local repository directory is renamed from `alarm` to `notify-sound` to match the new extension name.
```bash
# Example command to rename the directory
mv ../alarm ../notify-sound
```