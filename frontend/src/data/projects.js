export const projects = [
  {
    id: 'finsight',
    number: '01',
    title: 'FinSight',
    year: '2026',
    tagline: 'ask earnings calls questions. get answers with sources.',
    description: 'temporal rag over earnings-call transcripts. filters by ticker and quarter, answers with citations, and sticks to the context it was given.',
    highlights: [
      '20 transcripts, 1,544 chunks, 384-dim embeddings (FAISS)',
      '100% recall@3, 0.90 MRR on a 5-query eval',
    ],
    tech: ['Python', 'Sentence Transformers', 'FAISS', 'Streamlit', 'Groq'],
    links: {
      github: 'https://github.com/dhruvlad1/FinSight',
      live: '',
    },
    media: [],
  },
  {
    id: 'voyexa',
    number: '02',
    title: 'Voyexa',
    year: '2026',
    tagline: 'an ai travel planner that checks its own work.',
    description: 'a two-stage gemini pipeline plans the trip and a validator reviews it. full-stack, with auth, saved itineraries and a drag-and-drop editor.',
    highlights: [
      'planner + validator prompts, retries with backoff and key rotation',
      'jwt auth, sse image streaming, postgres jsonb storage',
    ],
    tech: ['React', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL', 'Docker'],
    links: {
      github: 'https://github.com/dhruvlad1/Voyexa',
      live: '',
    },
    media: [],
  },
  {
    id: 'gestureflow',
    number: '03',
    title: 'GestureFlow',
    year: '2026',
    tagline: 'control your cursor with your hand. no extra hardware.',
    description: 'real-time hand tracking for windows. click, drag and scroll with gestures, smoothed so the cursor does not jitter.',
    highlights: [
      'mediapipe, 21 landmarks per hand, deterministic gesture rules',
      'threaded qt pipeline, hysteresis + click debouncing, 6 pytest modules',
    ],
    tech: ['Python', 'PySide6', 'OpenCV', 'MediaPipe', 'PyAutoGUI'],
    links: {
      github: 'https://github.com/dhruvlad1/GestureFlow',
      live: '',
    },
    media: [],
  },
  {
    id: 'visual-semantic-encoder',
    number: '04',
    title: 'Visual Semantic Encoder',
    year: '2026',
    tagline: 'teaching a network to describe what it sees.',
    description: 'image captioning built from scratch in pytorch: a cnn encoder, additive attention and an lstm decoder, with attention heatmaps to show where it looks.',
    highlights: [
      'custom 5-stage cnn encoder, trained 60 epochs on a 60k coco subset',
      'evaluated with bleu-1 / bleu-4',
    ],
    tech: ['Python', 'PyTorch', 'TorchVision', 'NLTK', 'CUDA'],
    links: {
      github: 'https://github.com/dhruvlad1/Visual-Semantic-Encoder',
      live: '',
    },
    media: [],
  },
]

export default projects
