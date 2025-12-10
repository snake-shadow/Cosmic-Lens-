# Cosmic Lens 🌌

An interactive, AI-powered celestial explorer. This application visualizes cosmic data using React, Recharts, and the Gemini API.

![Cosmic Lens](https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop)

## Features

- **Interactive Star Map:** A draggable, clickable scatter plot of celestial objects.
- **AI-Powered Analysis:** Ask about any object (real or theoretical) and get real-time data powered by Google Gemini.
- **Dynamic Visuals:** Beautiful animated backgrounds and neon UI aesthetics.
- **Safe Mode:** Gracefully falls back to mock data if no API key is present or quota is exceeded.

## Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/cosmic-lens.git
    cd cosmic-lens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```

## Deployment to Render

1.  Push this repository to GitHub.
2.  Log in to [Render](https://render.com) and create a new **Static Site**.
3.  Connect your repository.
4.  Use the following settings:
    - **Build Command:** `npm install && npm run build`
    - **Publish Directory:** `dist`
5.  **Environment Variables:**
    - Go to the "Environment" tab.
    - Add a variable named `API_KEY` and paste your Google Gemini API key.
    - *Note:* If you skip this, the app will run in "Safe Mode" (Mock Data).
