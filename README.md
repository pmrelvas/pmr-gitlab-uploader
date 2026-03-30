# GitLab Uploader — Chrome Extension

A browser extension that lets you commit files directly to a GitLab repository from any webpage. Drop files, write a commit message, pick a branch, and push — without leaving your browser.

## Features

- Drag-and-drop (or click-to-browse) file selection
- Commit message and branch inputs
- Overwrite toggle for updating existing files
- Persistent configuration stored in Chrome sync storage
- Works on any webpage via the toolbar icon

## Tools & stack

| Tool | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | UI framework (Composition API + `<script setup>`) |
| [Vite](https://vitejs.dev/) | Build tool and bundler |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Chrome Extensions MV3](https://developer.chrome.com/docs/extensions/mv3/) | Extension platform (Manifest V3) |
| [GitLab Commits API](https://docs.gitlab.com/ee/api/commits.html) | Multi-file commits via REST |
| `chrome.storage.sync` | Config persistence across devices |

## Project structure

```
src/popup/
  App.vue                     # Root component — nav + status banner
  components/
    NavBar.vue                # Upload / Settings tab toggle
    UploadView.vue            # Drag-drop, commit form, push button
    DropZone.vue              # File drop area
    FileList.vue              # Staged file list with remove buttons
    SettingsView.vue          # Configuration form
    StatusBanner.vue          # Auto-dismissing success/error feedback
  composables/
    useConfig.ts              # chrome.storage.sync read/write
    useFileReader.ts          # FileReader API → base64 encoding
    useGitLab.ts              # GitLab Commits API calls
  types/index.ts              # Shared TypeScript interfaces
public/
  manifest.json               # Chrome extension manifest (MV3)
  icons/                      # Extension icons
```

## Development

```bash
npm install
npm run dev       # watch mode — rebuilds on every save
npm run build     # production build → dist/
```

After each rebuild, click the reload icon on the extension card in `chrome://extensions` to pick up changes.

## Loading into Chrome

1. Run `npm run build` to generate the `dist/` folder.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `dist/` folder in this repository.
5. The GitLab Uploader icon will appear in your toolbar. Pin it for easy access.

To update after a rebuild, click the **reload** icon (↺) on the extension card.

## Configuration

Click the extension icon and go to the **Settings** tab:

| Field | Description |
|---|---|
| GitLab host URL | Your GitLab instance, e.g. `https://gitlab.com` |
| Repository owner / namespace | Group or username (leave empty for personal repos) |
| Repository name | The repo slug, e.g. `my-repo` |
| Target folder path | Folder inside the repo to upload into, e.g. `uploads/docs` |
| Default branch | Pre-fills the branch field on the Upload tab |
| Access token | A GitLab personal access token with `api` scope |

Settings are saved to `chrome.storage.sync` and synced across your signed-in Chrome profiles.

## Usage

1. Go to the **Upload** tab.
2. Drop files onto the drop zone or click it to browse.
3. Enter a commit message and confirm the branch.
4. Check **Overwrite existing files** if any of the files already exist in the repo.
5. Click **Push to GitLab**.
