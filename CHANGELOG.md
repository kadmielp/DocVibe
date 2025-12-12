# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2025-12-11

### Security
- **Prompt Injection Protection**: Implemented XML tagging for user inputs in Gemini prompts to prevent prompt injection attacks.
- **Input Sanitization**: Added strict JSON cleaning logic to handle potential Markdown leakage in API responses.
- **Secure File Uploads**: Implemented strict schema validation and file size limits (5MB) for project imports to prevent DoS and corrupted state.
- **Markdown Security**: Configured `ReactMarkdown` to disable script execution and enforce `noopener noreferrer` on external links to prevent reverse tabnabbing.

### Design ("Midnight Aesthetic")
- **Visual Overhaul**: Complete redesign inspired by modern tools like Linear/Vercel.
  - New Color System: Deep black backgrounds, subtle gradients, and glassmorphism effects.
  - Typography: Switched to Inter with tighter tracking for headings and JetBrains Mono for code.
  - Bento Grid Dashboard: Replaced generic cards with a high-density, modular grid layout.
- **Component Updates**:
  - **Buttons**: Shiny, gradient-based primary buttons with hover glow effects.
  - **Inputs**: Minimalist, focused input states in the Wizard.
  - **Header**: Glass-effect sticky header with crisp branding.

### Features
- **Auto-Save**: The Wizard now automatically saves progress to `localStorage`, allowing users to refresh or leave without losing their draft.
- **Copy to Clipboard**: Added a one-click copy button for generated Markdown documentation in the Project View.
- **Detailed Project View**: Enhanced sidebar navigation and sticky headers for better readability of long documentation.

## [1.2.0] - 2025-12-11

### Changed
- **UI**: Updated header branding and window title.
- **Mobile Optimization**: Complete overhaul of responsive layouts for mobile devices.
  - **Project View**: Navigation tabs now scroll horizontally on top for mobile screens.
  - **Settings**: Modal layout adapts to smaller screens with scrollable navigation.
  - **Wizard**: Simplified step indicators and improved padding for touch interfaces.
  - **App Header**: refined padding and button visibility on mobile.
- **Dashboard UI**: 
  - Moved project status metrics (Ready/Drafts) to the top row for better visibility.
  - Expanded the project list view to utilize the full width of the container.

### Added
- **Settings**: Added a dedicated settings modal accessible via the gear icon in the header.
- **AI Model Selection**: Users can now choose between Gemini 3.0 Pro (default) and Gemini 2.5 Flash via Settings.
- **Data Management**: Added ability to Import and Export project data via JSON files.
- **AI Assistance**: Added "Answer with AI" button to the questionnaire wizard to help users formulate technical answers.

### Fixed
- Improved dark mode consistency in modal components.