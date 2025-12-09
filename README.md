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

3.  **Configure API Key**
    Create a `.env` file in the root directory:
    ```
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## deployment to GitHub Pages

1.  Build the project:
    ```bash
    npm run build
    ```
2.  Upload the contents of the `dist` folder to your web host, or configure GitHub Actions to deploy the build.

**Note:** For the AI features to work on a public URL, ensure your API Key in Google Cloud Console is restricted to your website's domain (HTTP Referrer restriction).
