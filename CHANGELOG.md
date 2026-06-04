# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-04

### Added
- **Core Kanban Functionality**: Fully interactive drag-and-drop board.
- **Card Features**: Descriptions, priorities (High, Medium, Low), checklists, and labels.
- **Label Management**: Global label store allowing users to create, rename, recolor, and delete labels.
- **Board & List Management**: Support for multiple boards, dynamic list creation, renaming, and deletion.
- **Local Persistence**: Offline-first design utilizing `@vueuse/core` to sync state with browser `localStorage`.
- **Premium UI/UX**: 
  - Complete Dark Mode and Light Mode support.
  - Interactive micro-animations and polished drop shadows.
  - Inline progress bars and percentage indicators for card checklists.
  - Tailwind CSS custom tokens mapped to an elegant "Inter" typeface.
- **Architecture**: Modular Vue 3 Composition API structure with Pinia state management.

### Fixed
- Stabilized drag-and-drop interactions across empty lists.
- Resolved Tailwind CSS utility class conflicts by refactoring static color mappings.
