# ZeroG Toolbox Rules

- **AI Powered Badging**: Any AI-powered tool must be labeled with the "AI Powered" badge (`.tool-badge.ai`) in the main tools grid view. This check should be implemented dynamically in `src/main.js` (e.g., checking if the tool title starts with `"AI"` or its ID starts with `"ai-"`) so that any new AI-powered tools added to the metadata registry automatically receive the badge.
