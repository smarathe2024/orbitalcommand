# 🛰️ Orbital Command

Orbital Command is a high-fidelity, real-time satellite tracking and visualization platform. Built with React, Three.js, and Satellite.js, it provides a cinematic 3D environment to monitor global satellite networks, orbital paths, and mission-critical data.

![Orbital Command Dashboard](https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **Real-Time Tracking**: Live propagation of satellite orbits using SGP4 algorithms and TLE data.
- **Interactive 3D Globe**: A high-performance visualization of Earth with dynamic lighting and atmosphere.
- **Orbital Trails**: Visual representation of the last 60 seconds of flight history for every tracked asset.
- **Satellite Intelligence**: Detailed dossiers for each satellite, including frequency, mission description, and operational status.
- **Communication Simulation**: Interactive terminal interface to simulate data downlinks and telemetry requests.
- **Global Dashboard**: Real-time telemetry feed and network status overview.
- **Modern UI**: A "Brutalist-Tech" aesthetic powered by Tailwind CSS and Framer Motion.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **3D Engine**: [react-globe.gl](https://github.com/vasturiano/react-globe.gl), Three.js
- **Orbital Mechanics**: [satellite.js](https://github.com/shashwatak/satellite.js)
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/orbital-command.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🐳 Docker Deployment

You can also run Orbital Command using Docker for a production-ready environment.

### Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```

2. Access the application at `http://localhost:3000`.

### Using Dockerfile Directly

1. Build the image:
   ```bash
   docker build -t orbital-command .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:80 orbital-command
   ```

## 📖 Usage

### Navigation
- **Rotate**: Left-click and drag to rotate the globe.
- **Zoom**: Use the scroll wheel to zoom in/out.
- **Select**: Click on any satellite icon or label to open its detailed dossier.

### Dashboard
- **Telemetry Feed**: Monitor the live stream of orbital events in the bottom-left terminal.
- **Network Status**: View the total count of active vs. inactive assets in the top-right status bar.
- **Satellite Dossier**: Access technical specifications and available services (Telemetry, Downlink, Imaging) for selected satellites.

## 📸 Screenshots

| Global View | Satellite Dossier |
| :---: | :---: |
| ![Global View](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600) | ![Dossier](https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600) |

## 🧪 Data Sources

Satellite positions are calculated using Two-Line Element (TLE) sets. The simulation propagates these elements in real-time to provide accurate latitude, longitude, and altitude data.

---

Built with ❤️ for space enthusiasts and orbital engineers.
