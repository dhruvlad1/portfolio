export const projects = [
  {
    id: 'finsight',
    number: '01',
    title: 'FinSight',
    year: '2026',
    tagline: 'ask earnings calls questions. get [[answers with sources]].',
    description: 'temporal RAG over earnings-call transcripts. filters by ticker and quarter, answers with citations, and sticks to the context it was given.',
    highlights: [
      '20 transcripts, {{1,544 chunks}}, 384-dim embeddings (FAISS)',
      '{{100% recall@3}}, {{0.90 MRR}} on a 5-query eval',
    ],
    tech: ['Python', 'Sentence Transformers', 'FAISS', 'Streamlit', 'Groq'],
    links: {
      github: 'https://github.com/dhruvlad1/FinSight',
      live: '',
    },
    media: [{
      type: 'video',
      src: '/projects/finsight/demo.mp4',
      poster: '/projects/finsight/demo-poster.jpg',
      alt: 'FinSight answering a question about an earnings call, with cited sources',
    }],
  },
  {
    id: 'voyexa',
    number: '02',
    title: 'Voyexa',
    year: '2026',
    tagline: 'an [[AI travel planner]] that checks its own work.',
    description: 'a two-stage Gemini pipeline plans the trip and a validator reviews it. full-stack, with auth, saved itineraries and a drag-and-drop editor.',
    highlights: [
      'planner + validator prompts, retries with backoff and key rotation',
      'JWT auth, SSE image streaming, Postgres JSONB storage',
    ],
    tech: ['React', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/dhruvlad1/Voyexa',
      live: 'https://voyexa.vercel.app/',
    },
    media: [{
      type: 'video',
      src: '/projects/voyexa/demo.mp4',
      poster: '/projects/voyexa/demo-poster.jpg',
      alt: 'Voyexa generating and editing a travel itinerary',
    }],
  },
  {
    id: 'gestureflow',
    number: '03',
    title: 'GestureFlow',
    year: '2026',
    tagline: 'control your cursor with [[your hand]]. no extra hardware.',
    description: 'real-time hand tracking for Windows. click, drag and scroll with gestures, smoothed so the cursor does not jitter.',
    highlights: [
      'MediaPipe, {{21 landmarks}} per hand, deterministic gesture rules',
      'threaded Qt pipeline, hysteresis + click debouncing, {{6 pytest modules}}',
    ],
    tech: ['Python', 'PySide6', 'OpenCV', 'MediaPipe', 'PyAutoGUI'],
    links: {
      github: 'https://github.com/dhruvlad1/GestureFlow',
      live: '',
    },
    media: [{
      type: 'video',
      src: '/projects/gestureflow/demo.mp4',
      poster: '/projects/gestureflow/demo-poster.jpg',
      alt: 'GestureFlow controlling the Windows cursor with hand gestures',
    }],
  },
  {
    id: 'visual-semantic-encoder',
    number: '04',
    title: 'Visual Semantic Encoder',
    year: '2026',
    tagline: 'teaching a network to describe what it sees.',
    description: 'image captioning built from scratch in PyTorch: a CNN encoder, additive attention and an LSTM decoder, with attention heatmaps to show where it looks.',
    highlights: [
      'custom 5-stage CNN encoder, trained {{60 epochs}} on a {{60K COCO}} subset',
      'evaluated with {{BLEU-1 / BLEU-4}}',
    ],
    tech: ['Python', 'PyTorch', 'TorchVision', 'NLTK', 'CUDA'],
    links: {
      github: 'https://github.com/dhruvlad1/Visual-Semantic-Encoder',
      live: '',
    },
    media: [{
      type: 'image',
      src: '/projects/visual-semantic-encoder/screenshot-1.png',
      alt: 'Visual Semantic Encoder generating a caption with an attention heatmap',
    }],
  },
]

export default projects
