# Decorate Your Own 3D Portal

Turn any screen into a head-tracked window into a layered 3D world. Move your head and the scene shifts with a clean, convincing parallax "depth box" effect. Now with Gaussian splats dropped right into the portal.

Built for live visuals and creative tools like TouchDesigner and MadMapper using Syphon (macOS) or Spout (Windows) frame sharing.

## Highlights

- Real-time head tracking with MediaPipe Face Landmarker
- Off-axis projection for correct perspective at any viewing position
- Multi-layer video planes streamed over WebSocket as MJPEG
- Gaussian splat viewer with live position/rotation/scale controls
- Syphon/Spout capture for frictionless integration into existing pipelines
- Calibration, debug overlays, and quick controls baked into the UI

## Live Demo (GitHub Pages)

Once Pages is enabled, the live build is at:

`https://glaseagle.github.io/decorate_3D_portal_new/`

Notes:
- The demo runs the client only; Syphon/Spout streaming still requires the local Python server.
- Webcam access requires HTTPS (GitHub Pages is HTTPS).

## How It Works

1. **MediaPipe Face Landmarker** estimates head pose from the webcam.
2. An **asymmetric frustum** updates each frame based on your eye position.
3. A **Python server** captures Syphon/Spout frames and streams them over WebSocket.
4. The **Three.js client** maps streams onto depth layers and renders a Gaussian splat scene.

## Quick Start

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **macOS** with Syphon-compatible app, or **Windows** with Spout

### Client

```bash
cd client
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173). The Vite dev server proxies `/api` and `/ws` requests to the Python server on port 8765.

### Server (macOS)

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python syphon_server.py
```

### Server (Windows)

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements-windows.txt
python syphon_server.py
```

The server starts on port 8765 by default (configurable in `server/config.json`).

## Gaussian Splats

This project uses `@mkkellogg/gaussian-splats-3d` and loads a `.ply` from the client public path.

- Default load: `/rainbow_cars.ply`
- Change the URL in `client/src/App.tsx`
- Use the Splat panel (left side) to tweak position, rotation (degrees), and scale
- For Pages, you can set `VITE_SPLAT_URL` during build to load a hosted `.ply` file

If you do not want splats, remove the `loadSplat` call in `client/src/App.tsx` and the panel component.

## Server API

| Endpoint | Type | Description |
|----------|------|-------------|
| `GET /api/sources` | HTTP | List discovered Syphon/Spout video sources |
| `/ws/stream/{source_id}` | WebSocket | Binary MJPEG frame stream for a source |
| `/ws/control` | WebSocket | JSON control channel |

Binary frame protocol: `[type:1][timestamp:8][width:4][height:4][len:4][jpeg_data:N]`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `D` | Toggle debug overlay |
| `S` | Toggle settings panel |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D Rendering | Three.js r170 |
| Head Tracking | MediaPipe Face Landmarker (tasks-vision) |
| Gaussian Splats | @mkkellogg/gaussian-splats-3d |
| UI | React 18 + TypeScript + Tailwind CSS |
| Build | Vite 6 |
| Server | Python + FastAPI + uvicorn |
| Frame Capture | syphon-python (macOS) / SpoutGL (Windows) |
| Frame Encoding | OpenCV + NumPy |

## Project Structure

```
client/
  src/
    components/   ThreeView, FaceMeshView, DebugOverlay, SettingsPanel,
                  CalibrationWizard, CameraPermission, VideoSourceManager,
                  SplatPanel
    hooks/        useFaceLandmarker, useWebSocket, useVideoSources,
                  useMonitorDetection
    utils/        headPose, offAxisCamera, threeScene, calibration,
                  videoTextureManager
    types/        Shared TypeScript interfaces

server/
    syphon_server.py        Main FastAPI server
    source_manager.py       Syphon/Spout source discovery and capture
    spout_source_manager.py Windows Spout capture
    frame_encoder.py        JPEG encoding pipeline
    config.json             Server configuration
```

## Configuration

`server/config.json`:

```json
{
  "host": "0.0.0.0",
  "port": 8765,
  "mjpeg_quality": 80,
  "max_fps": 60,
  "discovery_interval_sec": 5
}
```

Client calibration (screen size, viewing distance, FOV) is stored in `localStorage` and adjustable from the settings panel.

## License

MIT
