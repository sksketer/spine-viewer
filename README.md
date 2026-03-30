# Spine Viewer

A web-based viewer for [Spine](http://esotericsoftware.com/) animations built with PixiJS v8 and TypeScript.

![Spine Viewer](https://img.shields.io/badge/Spine-4.2-blue) ![PixiJS](https://img.shields.io/badge/PixiJS-8.x-red) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Features

- 🎬 **Load & Preview** - Upload Spine skeleton files (.json/.skel), atlas, and textures
- 🎮 **Animation Controls** - Play, pause, loop animations with speed control
- 🔍 **Interactive Viewport** - Drag to reposition, Ctrl + Scroll to zoom
- 🎨 **Visual Settings** - Adjust alpha/opacity and canvas background color
- 📐 **Transform Controls** - Reset position and scale
- ⚙️ **Canvas Configuration** - Customize width, height, and background color
- 🔄 **Multi-Spine Support** - Load and manage multiple Spine instances

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/spine-viewer.git
cd spine-viewer

# Install dependencies
npm install
```

### Development

```bash
# Start development server with watch mode
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

### Build Output

The build outputs to the `docs/` folder, ready for deployment to GitHub Pages or any static hosting.

## Usage

1. **Upload Spine Files** - Click the upload area and select your Spine files:
   - Skeleton file (`.json` or `.skel`)
   - Atlas file (`.atlas`)
   - Texture files (`.png` or `.jpg`)

2. **Control Animation** - Use the controller panel to:
   - Select animations from the dropdown
   - Play/Pause the animation
   - Toggle looping
   - Adjust playback speed (0.1x - 5.0x)

3. **Adjust Visuals** - Modify the appearance:
   - Change alpha/opacity (0% - 100%)
   - Configure canvas dimensions and color

4. **Navigate** - Interact with the viewport:
   - **Drag** - Reposition the Spine
   - **Ctrl + Scroll** - Zoom in/out

## Project Structure

```
spine-viewer/
├── source/
│   ├── index.html          # Main HTML entry
│   ├── css/
│   │   ├── style.css       # Global styles
│   │   ├── controller.css  # Controller panel styles
│   │   └── tooltip.css     # Hint tooltip styles
│   ├── ts/
│   │   ├── index.ts        # Application entry point
│   │   ├── SpineViewer.ts  # Main viewer class
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── manager/        # UI & Asset managers
│   │   ├── model/          # Data models
│   │   └── spine-core/     # Spine wrapper & controller
│   └── assets/             # Static assets
├── docs/                   # Build output (GitHub Pages)
├── build.mjs              # esbuild configuration
├── package.json
└── tsconfig.json
```

## Tech Stack

- **[PixiJS v8](https://pixijs.com/)** - 2D WebGL/WebGPU renderer
- **[@esotericsoftware/spine-pixi-v8](https://esotericsoftware.com/spine-api-reference)** - Official Spine runtime for PixiJS
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[esbuild](https://esbuild.github.io/)** - Fast bundler

## Supported Spine Versions

Compatible with Spine 4.2.x exports. The viewer automatically detects the Spine version from the skeleton JSON file.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development with watch mode |
| `npm run build` | Production build |
| `npm run debug` | Debug build |
| `npm run type-check` | Run TypeScript type checking |

## License

ISC

## Acknowledgments

- [Esoteric Software](https://esotericsoftware.com/) for Spine
- [PixiJS](https://pixijs.com/) team for the amazing renderer
