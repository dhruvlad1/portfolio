# Dhruv's Portfolio

A React + Vite portfolio foundation for Dhruv, built with plain CSS and modular React components.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Adding project media

Add project media under `frontend/public/projects/<id>/`, then reference it in
the project data with a public path such as `/projects/<id>/file.mp4`.

Recommended video format: MP4 H.264, maximum 1280px wide, no audio, and under
approximately 6 MB. Add a `.jpg` or `.webp` poster alongside each video.

## Deploying

Deploy with Vercel:

1. Import the repository.
2. Set **Root Directory** to `frontend`.
3. Select **Vite** as the framework.
4. Use `npm run build` as the build command.
5. Use `dist` as the output directory.

Before deploying, replace `REPLACE-ME` in `frontend/index.html`,
`frontend/src/data/profile.js`, `frontend/public/robots.txt`, and
`frontend/public/sitemap.xml`. Add `frontend/public/og-image.png` at 1200x630,
and replace `frontend/public/resume.pdf` with a final version that contains no
phone number.
