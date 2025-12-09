const app = document.querySelector<HTMLDivElement>("#root");

if (app) {
  app.innerHTML = `
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#020617;color:white;font-family:system-ui, sans-serif;">
      <div style="text-align:center;max-width:480px;">
        <h1 style="font-size:2rem;margin-bottom:0.5rem;">Cosmic Lens</h1>
        <p style="opacity:0.8;margin-bottom:1.5rem;">
          Static demo is live. Interactive Gemini-powered features are disabled in this GitHub Pages build and use mock cosmic data only.
        </p>
      </div>
    </main>
  `;
}

