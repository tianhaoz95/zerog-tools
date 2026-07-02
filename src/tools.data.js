// --- TOOLS DATA DEFINITION ---
// Single source of truth for tool metadata. Imported by the runtime app
// (src/main.js) and by the build script (scripts/postbuild.js) to generate
// per-tool pre-rendered pages, Open Graph images, and the sitemap.
//
// `tags` is a curated, controlled vocabulary (see TAG_VOCABULARY below) used
// to render the chips on each tool card and to power the tag filter
// autocomplete on the home page. Keep tags drawn from TAG_VOCABULARY so the
// autocomplete list stays clean and predictable.
//
// Each tool object follows this metadata standard:
//   id          – unique slug, doubles as the URL path and view id stem
//   title       – display name (prefix "AI " for AI-powered tools → AI badge)
//   description – one-line summary (also used as the <meta description>)
//   keywords    – free-form search synonyms (powers home search)
//   tags        – chips drawn from TAG_VOCABULARY
//   category    – one of AD_TOPICS_BY_CATEGORY's keys; drives ad relevance
//   icon        – single emoji
//   uiClass     – 'ready' | 'beta' | 'experimental'
//   adTopics    – OPTIONAL string[] of buyer-intent ad topics for this tool;
//                 overrides the category default (see resolveAdContext below)
export const TAG_VOCABULARY = [
  'AI', 'Image', 'Audio', 'Video', 'Text', 'PDF', 'Color', 'Code', 'Data',
  'Network', 'Security', 'Crypto', 'Privacy', 'Converter', 'Generator',
  'Encoder', 'Formatter', 'Calculator', 'Finance', 'Health', 'Editor',
  'Analyzer', 'Validator', 'Visualizer', 'Design', 'Productivity', 'Time',
  'Hardware', 'Math'
];

export const TOOLS = [
  {
    id: 'passport-photo',
    title: 'AI Passport Photo Generator',
    description: 'Upload a portrait, remove the background with AI, align with official biometric guides, crop, and download single photos or a print-ready 4x6" sheet.',
    keywords: ['passport', 'photo', 'crop', 'background removal', 'face detection', 'resize', 'biometric', 'visa', 'id card', 'remove bg', 'portrait'],
    tags: ['AI', 'Image', 'Privacy', 'Generator'],
    category: 'Graphics',
    icon: '👤',
    uiClass: 'ready'
  },
  {
    id: 'ai-face-swap',
    title: 'AI Deep Face Swap',
    description: 'Upload a source face and a target base scene, and swap the face client-side using AI landmark alignment and seamless color blending.',
    keywords: ['face swap', 'deepfake', 'face copy', 'face replace', 'ai face', 'portrait edit', 'morph face'],
    tags: ['AI', 'Image', 'Editor'],
    category: 'Graphics',
    icon: '🎭',
    uiClass: 'ready'
  },
  {
    id: 'ai-baby-predictor',
    title: 'AI Baby Appearance Predictor',
    description: 'Upload a photo of each parent, pick a gender, and generate a playful AI face-blend preview of your future baby at ages 2, 6, 12, and 18.',
    keywords: ['baby predictor', 'future baby', 'baby generator', 'face blend', 'baby face', 'what will my baby look like', 'baby maker', 'parents face merge', 'baby age progression'],
    tags: ['AI', 'Image', 'Generator'],
    category: 'Graphics',
    icon: '👶',
    uiClass: 'ready'
  },
  {
    id: 'image-vectorizer',
    title: 'PNG to SVG Vectorizer',
    description: 'Trace bitmap images (PNG, JPEG, WebP) into scalable vector graphics (SVG) using color edge contours, or rasterize SVGs back to PNG.',
    keywords: ['png to svg', 'svg to png', 'vectorize', 'trace image', 'raster', 'vector', 'convert image', 'svg converter'],
    tags: ['Image', 'Converter', 'Design'],
    category: 'Graphics',
    icon: '📐',
    uiClass: 'ready'
  },
  {
    id: 'audio-transcriber',
    title: 'AI Audio Transcriber',
    description: 'Record audio or upload voice files (.mp3, .wav, .m4a) and transcribe them locally using OpenAI\'s Whisper speech-to-text model.',
    keywords: ['transcribe', 'whisper', 'audio to text', 'speech to text', 'voice recorder', 'audio transcribe', 'speech transcriber'],
    tags: ['AI', 'Audio', 'Text'],
    category: 'Audio',
    icon: '🎙️',
    uiClass: 'ready'
  },
  {
    id: 'file-encrypter',
    title: 'File Encrypter & Decrypter',
    description: 'Encrypt any file locally using secure military-grade AES-256-GCM encryption with password-derived keys.',
    keywords: ['encrypt file', 'decrypt file', 'aes-256-gcm', 'security', 'crypto', 'password protect', 'private file', 'vault'],
    tags: ['Security', 'Crypto', 'Privacy'],
    category: 'Security',
    icon: '🔐',
    uiClass: 'ready'
  },
  {
    id: 'ocr-scanner',
    title: 'AI Document OCR Scanner',
    description: 'Extract editable text from scanned documents, receipts, and images using in-browser optical character recognition.',
    keywords: ['ocr', 'text extract', 'read text', 'scan document', 'image to text', 'tesseract', 'extract text'],
    tags: ['AI', 'Image', 'Text'],
    category: 'Text',
    icon: '📄',
    uiClass: 'ready'
  },
  {
    id: 'password-gen',
    title: 'Secure Password Generator',
    description: 'Generate strong, customizable passwords client-side with strength analysis and local safety verification.',
    keywords: ['password', 'generator', 'security', 'hash', 'passphrase', 'random string', 'credential'],
    tags: ['Security', 'Generator', 'Crypto'],
    category: 'Security',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Beautify, minify, validate, and compare JSON documents with syntax highlighting and tree view analysis.',
    keywords: ['json', 'format', 'minify', 'validate', 'beautify', 'syntax highlight', 'parse', 'prettify'],
    tags: ['Code', 'Data', 'Formatter', 'Validator'],
    category: 'Developer',
    icon: '⚙️',
    uiClass: 'ready'
  },
  {
    id: 'qr-tool',
    title: 'QR Code Generator & Scanner',
    description: 'Generate QR codes from text inputs or scan QR codes from uploaded images locally in your browser.',
    keywords: ['qr code', 'barcode', 'scan qr', 'generate qr', 'reader', 'decoder', 'encoder'],
    tags: ['Generator', 'Image', 'Encoder'],
    category: 'Developer',
    icon: '📱',
    uiClass: 'ready'
  },
  {
    id: 'base64-tool',
    title: 'Base64 Encoder & Decoder',
    description: 'Encode plain text and files to Base64 format or decode Base64 data strings back to their original formats.',
    keywords: ['base64', 'encode text', 'decode base64', 'base64 file', 'btoa', 'atob', 'developer'],
    tags: ['Code', 'Encoder', 'Converter'],
    category: 'Developer',
    icon: '💾',
    uiClass: 'ready'
  },
  {
    id: 'markdown-tool',
    title: 'Markdown Live Previewer',
    description: 'Live-preview markdown formatting and convert markdown documents into HTML code structure instantly.',
    keywords: ['markdown', 'preview', 'html converter', 'md to html', 'markup', 'editor'],
    tags: ['Text', 'Editor', 'Converter'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'url-tool',
    title: 'URL Encoder & Decoder',
    description: 'Encode URL payloads, decode query parameters, or parse query parameters into an editable grid table.',
    keywords: ['url encode', 'url decode', 'query parameter', 'uri component', 'parse url'],
    tags: ['Code', 'Encoder', 'Converter'],
    category: 'Developer',
    icon: '🔗',
    uiClass: 'ready'
  },
  {
    id: 'csv-json-tool',
    title: 'CSV <-> JSON Converter',
    description: 'Convert CSV table strings into structured JSON object arrays and compile JSON arrays back to CSV structures.',
    keywords: ['csv to json', 'json to csv', 'flat file', 'data table', 'converter', 'comma separated'],
    tags: ['Data', 'Converter', 'Code'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer & Format Converter',
    description: 'Resize image dimensions by pixels or aspect ratio and convert formats between PNG, JPEG, and WebP.',
    keywords: ['resize image', 'image converter', 'png to jpg', 'jpg to webp', 'dimensions', 'crop scale'],
    tags: ['Image', 'Converter', 'Editor'],
    category: 'Graphics',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'pdf-tool',
    title: 'PDF Merger & Splitter',
    description: 'Merge multiple PDF documents together or extract specific page ranges from a PDF document.',
    keywords: ['merge pdf', 'split pdf', 'combine pdf', 'extract page', 'pdf tools', 'file editor'],
    tags: ['PDF', 'Editor'],
    category: 'Developer',
    icon: '📂',
    uiClass: 'ready'
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Explainer',
    description: 'Input patterns and text strings to test matches, highlights, and inspect capture group collections.',
    keywords: ['regex', 'regular expression', 'regex test', 'pattern match', 'explain regex', 'capture group'],
    tags: ['Code', 'Text', 'Validator'],
    category: 'Developer',
    icon: '🔬',
    uiClass: 'ready'
  },
  {
    id: 'diff-checker',
    title: 'Diff Checker & Text Comparator',
    description: 'Compare two text versions side-by-side or inline to highlight character-level additions and deletions.',
    keywords: ['diff', 'compare text', 'text diff', 'version compare', 'lcs algorithm', 'difference checker'],
    tags: ['Text', 'Analyzer', 'Code'],
    category: 'Text',
    icon: '⚖️',
    uiClass: 'ready'
  },
  {
    id: 'hash-generator',
    title: 'Hash & Checksum Generator',
    description: 'Generate cryptographic checksums (MD5, SHA-1, SHA-256, SHA-512) for text blocks or files locally.',
    keywords: ['hash', 'checksum', 'md5', 'sha-256', 'sha-512', 'sha-1', 'file integrity', 'digest'],
    tags: ['Security', 'Crypto', 'Generator'],
    category: 'Security',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'svg-editor',
    title: 'SVG Path Visualizer',
    description: 'Input raw SVG path d strings to visualize, resize, scale, or customize stroke and fill values.',
    keywords: ['svg path', 'svg visualizer', 'path d', 'vector canvas', 'vector draw'],
    tags: ['Image', 'Design', 'Visualizer'],
    category: 'Graphics',
    icon: '🖌️',
    uiClass: 'ready'
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert metrics across categories: Length, Weight, Temperature, and Digital Storage Byte sizes.',
    keywords: ['convert units', 'metric', 'imperial', 'celsius fahrenheit', 'bytes to gb', 'length weight'],
    tags: ['Converter', 'Math'],
    category: 'Text',
    icon: '⚖️',
    uiClass: 'ready'
  },
  {
    id: 'color-picker',
    title: 'Color Palette & WCAG Checker',
    description: 'Pick colors, extract primary palette swatches from files, and check accessibility contrast ratios.',
    keywords: ['color picker', 'palette extract', 'wcag contrast', 'accessibility checker', 'contrast ratio', 'hex code'],
    tags: ['Color', 'Design', 'Analyzer'],
    category: 'Graphics',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'epoch-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix epochs (seconds/milliseconds) to human-readable datetime formats and vice-versa.',
    keywords: ['unix timestamp', 'epoch converter', 'unix time', 'date to timestamp', 'seconds since epoch'],
    tags: ['Time', 'Converter', 'Code'],
    category: 'Developer',
    icon: '⏱️',
    uiClass: 'ready'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Debugger & Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) headers and payloads locally with zero server calls.',
    keywords: ['jwt decode', 'json web token', 'jwt header', 'jwt payload', 'jwt signature', 'token decoder'],
    tags: ['Security', 'Code', 'Encoder'],
    category: 'Security',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'uuid-generator',
    title: 'UUID & ULID Generator',
    description: 'Generate bulk random RFC 4122 UUID v4 or lexicographically sortable ULID strings client-side.',
    keywords: ['uuid generator', 'ulid generator', 'uuid v4', 'unique id', 'random strings', 'bulk generate'],
    tags: ['Code', 'Generator'],
    category: 'Developer',
    icon: '🆔',
    uiClass: 'ready'
  },
  {
    id: 'lorem-generator',
    title: 'Lorem Ipsum & Mock Data Generator',
    description: 'Generate customizable mock paragraphs, sentences, or structured user profile JSON arrays.',
    keywords: ['lorem ipsum', 'placeholder text', 'mock user data', 'random profile', 'json dummy data'],
    tags: ['Text', 'Generator', 'Data'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'sql-formatter',
    title: 'SQL Formatter & Minifier',
    description: 'Prettify SQL queries with standard indentation or minify query statements client-side.',
    keywords: ['format sql', 'minify sql', 'sql beautify', 'database queries', 'sql formatter'],
    tags: ['Code', 'Formatter', 'Data'],
    category: 'Developer',
    icon: '🗄️',
    uiClass: 'ready'
  },
  {
    id: 'cron-descriptor',
    title: 'Cron Expression Descriptor',
    description: 'Parse cron schedule strings into human explanations and view the next 5 execution times.',
    keywords: ['cron parser', 'cron expression', 'schedule timing', 'cron descriptor', 'next run times'],
    tags: ['Code', 'Time', 'Analyzer'],
    category: 'Developer',
    icon: '⏰',
    uiClass: 'ready'
  },
  {
    id: 'html-encoder',
    title: 'HTML Entity Encoder & Decoder',
    description: 'Encode characters into safe HTML entities or decode entities back to plain text strings.',
    keywords: ['html entities', 'entity encode', 'entity decode', 'escape html', 'unescape html'],
    tags: ['Code', 'Encoder', 'Converter'],
    category: 'Developer',
    icon: '🔣',
    uiClass: 'ready'
  },
  {
    id: 'ascii-generator',
    title: 'ASCII Art Generator',
    description: 'Generate clean text banners in stylized ASCII block characters locally.',
    keywords: ['ascii art', 'text banner', 'text to ascii', 'figlet', 'ascii block font'],
    tags: ['Text', 'Generator', 'Design'],
    category: 'Graphics',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'ua-parser',
    title: 'User Agent Parser & Client Info',
    description: 'Parse browser agent details, screen resolutions, hardware status, and permissions locally.',
    keywords: ['user agent', 'client details', 'screen size', 'viewport info', 'browser diagnostics'],
    tags: ['Code', 'Hardware', 'Analyzer'],
    category: 'Developer',
    icon: '💻',
    uiClass: 'ready'
  },
  {
    id: 'text-analyzer',
    title: 'Text Analyzer & Word Counter',
    description: 'Count words, characters, sentences, paragraphs, speaking speed, and analyze keyword densities.',
    keywords: ['word counter', 'character count', 'reading time', 'keyword density', 'text diagnostics'],
    tags: ['Text', 'Analyzer'],
    category: 'Text',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'ai-sentiment',
    title: 'AI Sentiment & Emotion Analyzer',
    description: 'Analyze text emotional sentiments and tones entirely in your browser using local AI classification models.',
    keywords: ['sentiment analysis', 'emotion classifier', 'text tone', 'positive negative', 'mood analysis', 'ai tone'],
    tags: ['AI', 'Text', 'Analyzer'],
    category: 'Text',
    icon: '🎭',
    uiClass: 'ready'
  },
  {
    id: 'ai-translator',
    title: 'AI Language Translator',
    description: 'Translate paragraphs between English, French, and German 100% locally in your browser.',
    keywords: ['translate text', 'language translator', 'local translation', 'english french', 'english german', 't5 translator'],
    tags: ['AI', 'Text', 'Converter'],
    category: 'Text',
    icon: '🗣️',
    uiClass: 'ready'
  },
  {
    id: 'ai-detector',
    title: 'AI Object Detector & Image Classifier',
    description: 'Upload images to detect objects, draw bounding boxes, and label classifications 100% locally.',
    keywords: ['object detection', 'image classifier', 'draw bounding box', 'yolo object detector', 'image labeler', 'ai vision'],
    tags: ['AI', 'Image', 'Analyzer'],
    category: 'Graphics',
    icon: '👁️',
    uiClass: 'ready'
  },
  {
    id: 'bg-remover',
    title: 'AI Background Remover',
    description: 'Upload any image and erase its background instantly with the RMBG-1.4 AI model. Export a transparent PNG or recolor the backdrop, 100% locally.',
    keywords: ['remove background', 'background remover', 'rmbg', 'transparent png', 'cutout', 'remove bg', 'erase background', 'image matting', 'isnet'],
    tags: ['AI', 'Image', 'Editor'],
    category: 'Graphics',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'image-upscaler',
    title: 'AI Image Upscaler & Super-Resolution',
    description: 'Upscale and sharpen low-resolution images 2x or 4x with the Swin2SR super-resolution AI model. Recover detail from small photos, 100% locally in your browser.',
    keywords: ['upscale image', 'super resolution', 'super-resolution', 'enhance image', 'increase resolution', 'sharpen', 'swin2sr', 'image enlarger', 'ai upscaler', 'upscale photo', 'denoise', 'restore image'],
    tags: ['AI', 'Image', 'Editor'],
    category: 'Graphics',
    icon: '🔬',
    uiClass: 'ready'
  },
  {
    id: 'video-bg-swap',
    title: 'AI Video Background Swap',
    description: 'Upload a short clip and replace its background with a solid color or your own image using the MODNet matting AI, 100% locally. Exports a WebM video.',
    keywords: ['video background', 'green screen', 'chroma key', 'background swap', 'replace background', 'modnet', 'video matting', 'virtual background', 'remove video background'],
    tags: ['AI', 'Video', 'Editor'],
    category: 'Graphics',
    icon: '🎬',
    uiClass: 'ready'
  },
  {
    id: 'ev-gas-calculator',
    title: 'EV vs Gas Car Cost Calculator',
    description: 'Compare the total cost of owning an electric car versus a gas car. Models purchase price, fuel/electricity, maintenance, and shows lifetime savings plus a break-even point, 100% locally.',
    keywords: ['electric car', 'gas car', 'ev vs gas', 'total cost of ownership', 'tco', 'car cost', 'fuel savings', 'break even', 'mpg', 'kwh', 'ev calculator', 'gasoline', 'electricity cost'],
    tags: ['Calculator', 'Finance', 'Visualizer'],
    category: 'Calculators',
    icon: '🔋',
    uiClass: 'ready'
  },
  {
    id: 'ai-summarizer',
    title: 'AI Text Summarizer',
    description: 'Summarize articles or transcripts, extract key bullet points, and adjust summary length locally in your browser using local AI models.',
    keywords: ['summarize', 'text summary', 'summarizer', 'extract points', 'local ai', 'article summary', 't5'],
    tags: ['AI', 'Text', 'Analyzer'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'ai-semantic-search',
    title: 'AI Semantic Search & Explorer',
    description: 'Paste text documents and search through them using natural language queries by semantic concept instead of raw keywords, 100% locally.',
    keywords: ['semantic search', 'embeddings', 'text match', 'similarity search', 'concept search', 'local ai', 'vector search'],
    tags: ['AI', 'Text', 'Analyzer'],
    category: 'Developer',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'audio-trimmer',
    title: 'Audio Waveform Editor & Trimmer',
    description: 'Upload audio files, visualize their waveforms in real-time, trim segments, apply volume fades, and export/download the audio locally.',
    keywords: ['trim audio', 'crop audio', 'audio editor', 'waveform', 'mp3 trimmer', 'wav cutter', 'fade audio'],
    tags: ['Audio', 'Editor', 'Visualizer'],
    category: 'Audio',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'pdf-signer',
    title: 'PDF Signer & Form Annotator',
    description: 'Upload any PDF document, draw or type your signature, annotate fields, position them dynamically on pages, and save the signed PDF.',
    keywords: ['sign pdf', 'signature', 'annotate pdf', 'fill form', 'pdf-lib', 'write on pdf', 'pdf editor'],
    tags: ['PDF', 'Editor'],
    category: 'Developer',
    icon: '✍️',
    uiClass: 'ready'
  },
  {
    id: 'exif-stripper',
    title: 'EXIF Metadata Inspector & Stripper',
    description: 'Inspect hidden metadata (camera settings, capture timestamps, GPS coordinates) in your photos and strip them for complete privacy.',
    keywords: ['exif metadata', 'strip exif', 'remove metadata', 'gps metadata', 'photo location', 'image details', 'privacy photo'],
    tags: ['Image', 'Privacy', 'Security'],
    category: 'Security',
    icon: '📷',
    uiClass: 'ready'
  },
  {
    id: 'css-layout-builder',
    title: 'Interactive Flexbox & CSS Grid Builder',
    description: 'Visually construct flexbox or grid layouts. Add grid items, set padding, gaps, alignments, and output ready-to-use HTML/CSS code.',
    keywords: ['flexbox', 'css grid', 'layout generator', 'visual designer', 'css builder', 'frontend tool', 'responsive'],
    tags: ['Code', 'Design', 'Generator'],
    category: 'Developer',
    icon: '📐',
    uiClass: 'ready'
  },
  {
    id: 'api-client',
    title: 'REST API Client & Request Tester',
    description: 'Test HTTP requests (GET, POST, etc.) with custom headers and body payloads, view formatted responses, and generate code snippets client-side.',
    keywords: ['api tester', 'rest client', 'postman', 'fetch request', 'http request', 'api debugger', 'cors test'],
    tags: ['Code', 'Network', 'Analyzer'],
    category: 'Developer',
    icon: '⚡',
    uiClass: 'ready'
  },
  {
    id: 'pdf-image-converter',
    title: 'Image-to-PDF & PDF-to-Image Converter',
    description: 'Combine multiple images with drag-and-drop ordering into a single PDF, or render and extract PDF pages as high-resolution PNG images.',
    keywords: ['image to pdf', 'pdf to image', 'convert images', 'extract pdf pages', 'png to pdf', 'pdf to png', 'pdf converter'],
    tags: ['PDF', 'Image', 'Converter'],
    category: 'Graphics',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'mortgage-calculator',
    title: 'Home Mortgage & Amortization Dashboard',
    description: 'Calculate monthly home loan payments, simulate extra repayment impacts, and view interactive amortization charts and schedule tables.',
    keywords: ['mortgage calculator', 'amortization schedule', 'home loan', 'interest principal', 'financial chart', 'loan calculator'],
    tags: ['Calculator', 'Finance', 'Visualizer'],
    category: 'Calculators',
    icon: '🏠',
    uiClass: 'ready'
  },
  {
    id: 'pomodoro-space',
    title: 'Pomodoro Space & Ambient Soundscape',
    description: 'A study/work productivity station combining Pomodoro time blocks with customizable ambient background audio mixing.',
    keywords: ['pomodoro timer', 'ambient sound', 'lofi focus', 'productivity timer', 'study space', 'audio mixer', 'white noise'],
    tags: ['Productivity', 'Audio', 'Time'],
    category: 'Calculators',
    icon: '🍅',
    uiClass: 'ready'
  },
  {
    id: 'morse-code',
    title: 'Morse Code Translator & Player',
    description: 'Translate text to Morse code, play it as audio using Web Audio, or flash the screen, and decode Morse code back to text.',
    keywords: ['morse code', 'translator', 'audio player', 'cw', 'telegraph', 'morse decoder', 'sound generator'],
    tags: ['Converter', 'Audio', 'Encoder'],
    category: 'Developer',
    icon: '📻',
    uiClass: 'ready'
  },
  {
    id: 'text-to-speech',
    title: 'AI Text-to-Speech (TTS) Reader',
    description: 'Convert text to speech locally using browser Synthesis voices, with speed, pitch controls and text word highlighting.',
    keywords: ['text to speech', 'tts', 'speech reader', 'speak text', 'read aloud', 'voice synthesizer'],
    tags: ['AI', 'Audio', 'Text'],
    category: 'Audio',
    icon: '🗣️',
    uiClass: 'ready'
  },
  {
    id: 'media-recorder',
    title: 'Screen & Camera Recorder',
    description: 'Record your screen, webcam, or a browser tab with audio locally using the MediaRecorder API, with local preview and WebM download.',
    keywords: ['screen recorder', 'webcam recorder', 'record video', 'video recorder', 'capture screen', 'media recorder'],
    tags: ['Video', 'Editor', 'Hardware'],
    category: 'Graphics',
    icon: '📹',
    uiClass: 'ready'
  },
  {
    id: 'keyboard-tester',
    title: 'Key Event & Keyboard Tester',
    description: 'Interactive keyboard interface to test keystrokes and inspect detailed JavaScript keyboard event properties in real-time.',
    keywords: ['keyboard test', 'key events', 'keycode', 'key checker', 'keyboard diagnostic', 'event listener'],
    tags: ['Hardware', 'Code', 'Analyzer'],
    category: 'Developer',
    icon: '⌨️',
    uiClass: 'ready'
  },
  {
    id: 'svg-converter',
    title: 'SVG to CSS & DataURI Converter',
    description: 'Convert raw SVG code into inline CSS backgrounds, raw HTML DataURIs, JSX components, and copy them instantly.',
    keywords: ['svg to css', 'datauri', 'svg converter', 'base64 svg', 'urlencode svg', 'inline svg', 'jsx svg'],
    tags: ['Code', 'Converter', 'Design'],
    category: 'Developer',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter & Validator',
    description: 'Validate, prettify, format, or minify XML documents with syntax highlighting, indentation adjustment, and tree view.',
    keywords: ['xml format', 'xml validator', 'prettify xml', 'xml tree', 'xml beautifier', 'format xml', 'minify xml'],
    tags: ['Code', 'Data', 'Formatter', 'Validator'],
    category: 'Developer',
    icon: '📑',
    uiClass: 'ready'
  },
  {
    id: 'base-converter',
    title: 'Number Base Converter',
    description: 'Convert numbers between Binary, Octal, Decimal, Hexadecimal, and any custom base (2-36) with step-by-step math.',
    keywords: ['base converter', 'binary to hex', 'dec to bin', 'number base', 'radix', 'hex converter'],
    tags: ['Math', 'Converter', 'Code'],
    category: 'Developer',
    icon: '🔢',
    uiClass: 'ready'
  },
  {
    id: 'css-glassmorphism',
    title: 'CSS Glassmorphism & Shadow Builder',
    description: 'Visually design glassmorphic components and layered shadows, customize blur, opacity, borders, and copy CSS snippets.',
    keywords: ['glassmorphism', 'css shadow', 'box shadow generator', 'glassmorphic CSS', 'visual designer', 'neon shadow'],
    tags: ['Code', 'Design', 'Generator'],
    category: 'Developer',
    icon: '💎',
    uiClass: 'ready'
  },
  {
    id: 'css-box-shadow',
    title: 'CSS Box Shadow Generator',
    description: 'Design multi-layer box shadows with live preview. Add layers, adjust blur/spread/offset/color/inset, apply presets, and copy the complete CSS output.',
    keywords: ['box shadow', 'shadow generator', 'css shadow', 'multi layer shadow', 'drop shadow', 'neumorphism', 'shadow preset'],
    tags: ['Code', 'Design', 'Generator'],
    category: 'Developer',
    icon: '🌑',
    uiClass: 'ready'
  },
  {
    id: 'case-converter',
    title: 'Text Case & List Converter',
    description: 'Convert text casing (camelCase, snake_case, PascalCase, kebab-case, title case) or format lists into JSON arrays, CSV, or bullet points.',
    keywords: ['case converter', 'text case', 'camelcase', 'snake_case', 'list formatter', 'list converter', 'title case'],
    tags: ['Text', 'Converter', 'Code'],
    category: 'Text',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'aspect-ratio-calc',
    title: 'Aspect Ratio & PPI Calculator',
    description: 'Calculate aspect ratio scaling, downscaling/upscaling dimensions, and find screen Pixels Per Inch (PPI) density.',
    keywords: ['aspect ratio', 'ppi calculator', 'dpi calculator', 'screen density', 'image scaling', 'resolution calculator'],
    tags: ['Calculator', 'Image', 'Math'],
    category: 'Calculators',
    icon: '📏',
    uiClass: 'ready'
  },
  {
    id: 'color-blindness',
    title: 'Color Blindness Simulator',
    description: 'Upload images and simulate various color vision deficiencies like Deuteranopia, Protanopia, and Tritanopia locally on a canvas.',
    keywords: ['color blindness', 'color blind simulation', 'daltonism', 'deuteranopia', 'protanopia', 'tritanopia', 'accessibility'],
    tags: ['Color', 'Image', 'Design'],
    category: 'Graphics',
    icon: '👁️‍🗨️',
    uiClass: 'ready'
  },
  {
    id: 'tone-generator',
    title: 'Audio Tone & Noise Generator',
    description: 'Generate pure audio tones (sine, square, sawtooth, triangle waves) or focus noise colors (white, pink, brownian) locally using Web Audio.',
    keywords: ['tone generator', 'noise generator', 'white noise', 'frequency generator', 'audio test', 'sine wave'],
    tags: ['Audio', 'Generator'],
    category: 'Audio',
    icon: '🔊',
    uiClass: 'ready'
  },
  {
    id: 'subnet-calculator',
    title: 'IP Subnet & CIDR Calculator',
    description: 'Parse IP addresses and CIDR notations to calculate subnets, network ranges, broadcast addresses, and usable host counts.',
    keywords: ['subnet calculator', 'cidr calculator', 'ip range', 'netmask', 'network range', 'ip address'],
    tags: ['Network', 'Calculator', 'Code'],
    category: 'Developer',
    icon: '🌐',
    uiClass: 'ready'
  },
  {
    id: 'pixel-tester',
    title: 'Dead Pixel Tester & Fixer',
    description: 'Diagnose dead screen pixels using high-contrast fullscreen colors, and run a fast-flashing repair cycle to unstick stuck pixels.',
    keywords: ['dead pixel', 'pixel fixer', 'stuck pixel', 'screen test', 'monitor test', 'color flash'],
    tags: ['Hardware', 'Image'],
    category: 'Graphics',
    icon: '📺',
    uiClass: 'ready'
  },
  {
    id: 'sketchpad',
    title: 'Paint Canvas & Sketchpad',
    description: 'A canvas sketchpad to draw with brushes, colors, opacity, shapes, undo/redo logs, and export high-quality transparent PNGs.',
    keywords: ['sketchpad', 'paint canvas', 'drawing tool', 'draw online', 'doodle', 'vector sketch'],
    tags: ['Image', 'Editor', 'Design'],
    category: 'Graphics',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'hex-viewer',
    title: 'Binary File Hex Dump Viewer',
    description: 'Upload files of any size to inspect their byte-by-byte hexadecimal contents and ASCII character representation locally.',
    keywords: ['hex dump', 'hex viewer', 'binary viewer', 'file bytes', 'hex inspector', 'file reader'],
    tags: ['Code', 'Analyzer'],
    category: 'Developer',
    icon: '💾',
    uiClass: 'ready'
  },
  {
    id: 'tip-calculator',
    title: 'Tip & Bill Split Calculator',
    description: 'Calculate tip percentages, split bills among multiple people with custom tax rates, rounding options, and unequal individual split shares.',
    keywords: ['tip calculator', 'split bill', 'bill splitter', 'restaurant tip', 'dinner split', 'finance utility'],
    tags: ['Calculator', 'Finance'],
    category: 'Calculators',
    icon: '💵',
    uiClass: 'ready'
  },
  {
    id: 'life-progress',
    title: 'Life Progress & Biorhythm Chart',
    description: 'Visualize your age in detail, track life progress metrics (day, month, year, lifetime), and chart physical, emotional, and intellectual biorhythms.',
    keywords: ['life progress', 'biorhythm', 'age calculator', 'life timer', 'biorhythm chart', 'productivity tracking'],
    tags: ['Calculator', 'Visualizer', 'Time'],
    category: 'Calculators',
    icon: '⏳',
    uiClass: 'ready'
  },
  {
    id: 'graphing-calc',
    title: 'Scientific & Graphing Calculator',
    description: 'Solve scientific math operations and plot 2D mathematical functions dynamically on a canvas coordinate system.',
    keywords: ['scientific calculator', 'graphing calculator', 'plot math', 'math solver', 'function plotter', 'calculator'],
    tags: ['Calculator', 'Math', 'Visualizer'],
    category: 'Calculators',
    icon: '🧮',
    uiClass: 'ready'
  },
  {
    id: 'password-analyzer',
    title: 'Password Strength & Entropy Analyzer',
    description: 'Analyze passwords for character sets, length, dictionary entropy bits, and estimate cracking time under different computing speeds.',
    keywords: ['password strength', 'entropy analyzer', 'password security', 'crack time', 'password safety', 'brute force estimate'],
    tags: ['Security', 'Analyzer'],
    category: 'Security',
    icon: '🛡️',
    uiClass: 'ready'
  },
  {
    id: 'luhn-validator',
    title: 'Credit Card Luhn Validator',
    description: 'Validate credit card numbers locally, detect card network issuers, and verify Luhn algorithm checksums.',
    keywords: ['luhn algorithm', 'credit card validator', 'card check', 'validate card', 'card issuer'],
    tags: ['Security', 'Validator', 'Finance'],
    category: 'Security',
    icon: '💳',
    uiClass: 'ready'
  },
  {
    id: 'binary-translator',
    title: 'Binary to Text Translator',
    description: 'Convert plain text into binary code (0s and 1s) and decode binary back to legible text characters.',
    keywords: ['binary translator', 'text to binary', 'binary to text', 'ascii binary', 'decode binary'],
    tags: ['Converter', 'Encoder', 'Code'],
    category: 'Developer',
    icon: '🔢',
    uiClass: 'ready'
  },
  {
    id: 'color-palette-gen',
    title: 'Color Palette & Contrast Evaluator',
    description: 'Generate analogous, complementary, or triadic color schemes from a seed, and evaluate WCAG contrast ratios.',
    keywords: ['color palette', 'palette generator', 'contrast checker', 'wcag contrast', 'color schemes', 'color wheel'],
    tags: ['Color', 'Generator', 'Design'],
    category: 'Graphics',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'lorem-markdown',
    title: 'Lorem Ipsum Markdown Generator',
    description: 'Generate structured dummy paragraphs, lists, headers, code blocks, blockquotes, and tables in Markdown format.',
    keywords: ['lorem markdown', 'markdown generator', 'dummy text', 'placeholder markdown', 'md generator'],
    tags: ['Text', 'Generator'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'user-flowchart',
    title: 'Visual Flowchart & Diagram Maker',
    description: 'Design interactive node charts and logic diagrams from simple text rules (e.g. A -> B) rendered to SVG diagrams.',
    keywords: ['flowchart maker', 'diagram generator', 'text to diagram', 'graph visualizer', 'mermaid lite', 'svg flowchart'],
    tags: ['Visualizer', 'Design', 'Code'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'metronome-tapper',
    title: 'BPM Tapper & Audio Metronome',
    description: 'Tap along to measure tempo in beats per minute, or play customizable metronome click rates using Web Audio.',
    keywords: ['bpm tapper', 'metronome', 'bpm counter', 'audio click', 'tempo tap', 'music tuner'],
    tags: ['Audio', 'Productivity'],
    category: 'Audio',
    icon: '🥁',
    uiClass: 'ready'
  },
  {
    id: 'caesar-cipher',
    title: 'Caesar & ROT13 Cipher Encoder',
    description: 'Encrypt or decrypt messages using Caesar shifts and ROT13 ciphers, with live key adjustment sliders.',
    keywords: ['caesar cipher', 'rot13', 'cipher encode', 'text encrypt', 'rot13 cipher', 'substitution cipher'],
    tags: ['Security', 'Crypto', 'Encoder'],
    category: 'Security',
    icon: '🕵️',
    uiClass: 'ready'
  },
  {
    id: 'timezone-converter',
    title: 'Global Time Zone Converter',
    description: 'Compare hours across multiple global time zones visually using interactive 24-hour slider sliders.',
    keywords: ['timezone converter', 'world clock', 'time zones', 'timezone slider', 'time comparison'],
    tags: ['Time', 'Converter'],
    category: 'Calculators',
    icon: '🗺️',
    uiClass: 'ready'
  },
  {
    id: 'date-calculator',
    title: 'Date Difference & Addition Calculator',
    description: 'Calculate the exact intervals in days/weeks/months/years between two dates, or add/subtract days from a calendar day.',
    keywords: ['date calculator', 'date difference', 'add days', 'days between dates', 'time calculator'],
    tags: ['Time', 'Calculator'],
    category: 'Calculators',
    icon: '📅',
    uiClass: 'ready'
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate savings growth over time with monthly additions and compound frequencies, plotted on a canvas bar chart.',
    keywords: ['compound interest', 'investment calculator', 'savings calculator', 'finance growth', 'growth chart'],
    tags: ['Calculator', 'Finance', 'Visualizer'],
    category: 'Calculators',
    icon: '📈',
    uiClass: 'ready'
  },
  {
    id: 'tdee-calculator',
    title: 'BMI & TDEE Health Calculator',
    description: 'Calculate your BMI, BMR, and TDEE calorie requirements, with protein/carb/fat macro split recommendations.',
    keywords: ['tdee calculator', 'bmr calculator', 'bmi calculator', 'calorie needs', 'macros calculator'],
    tags: ['Calculator', 'Health'],
    category: 'Calculators',
    icon: '🥗',
    uiClass: 'ready'
  },
  {
    id: 'sort-list',
    title: 'List Sorter & Deduplicator',
    description: 'Clean up text lists by sorting alphabetically/numerically, shuffling, removing duplicate lines, or removing empty gaps.',
    keywords: ['list sorter', 'deduplicate list', 'shuffle lines', 'sort text', 'clean list'],
    tags: ['Text', 'Editor'],
    category: 'Text',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'json-yaml-converter',
    title: 'JSON, YAML & CSV Converter',
    description: 'Convert structured config files between JSON, YAML, and CSV tables, client-side, in real-time.',
    keywords: ['json to yaml', 'yaml to json', 'json to csv', 'csv to json', 'format converter'],
    tags: ['Data', 'Converter', 'Code'],
    category: 'Developer',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'device-info',
    title: 'WebAPI & Device Tester',
    description: 'Run compatibility checks for modern WebAPIs (Bluetooth, USB, Gamepad, Battery) and view detailed system characteristics.',
    keywords: ['device info', 'webapi support', 'battery level', 'hardware tests', 'browser capabilities'],
    tags: ['Hardware', 'Code', 'Analyzer'],
    category: 'Developer',
    icon: '🖥️',
    uiClass: 'ready'
  },
  {
    id: 'stopwatch-lap',
    title: 'Precision Stopwatch & Lap Log',
    description: 'Track elapsed time with millisecond precision, log laps in a grid table, and download results as a CSV spreadsheet.',
    keywords: ['stopwatch', 'lap timer', 'split timer', 'chronometer', 'timer csv'],
    tags: ['Time', 'Productivity'],
    category: 'Calculators',
    icon: '⏱️',
    uiClass: 'ready'
  },
  {
    id: 'html-wysiwyg',
    title: 'Visual HTML WYSIWYG Editor',
    description: 'Edit formatted text in a rich text visual editor and extract clean, responsive HTML markup instantly.',
    keywords: ['wysiwyg editor', 'rich text', 'html editor', 'visual editor', 'generate html'],
    tags: ['Code', 'Text', 'Editor'],
    category: 'Text',
    icon: '🌐',
    uiClass: 'ready'
  },
  {
    id: 'css-gradient-mesh',
    title: 'CSS Gradient Builder',
    description: 'Design linear or radial CSS gradients, add custom color stops on a visual slider, and copy CSS rules.',
    keywords: ['css gradient', 'gradient maker', 'color stops', 'linear-gradient', 'radial-gradient'],
    tags: ['Code', 'Design', 'Color'],
    category: 'Developer',
    icon: '🌈',
    uiClass: 'ready'
  },
  {
    id: 'svg-path-viewer',
    title: 'SVG Path Visualizer & Grid Editor',
    description: 'Paste SVG path d="..." attributes to draw them on an interactive grid, scale dimensions, and export clean SVGs.',
    keywords: ['svg path', 'path visualizer', 'svg editor', 'path d', 'vector paths'],
    tags: ['Image', 'Design', 'Visualizer'],
    category: 'Graphics',
    icon: '🗺️',
    uiClass: 'ready'
  },
  {
    id: 'guitar-tuner',
    title: 'Microphone Instrument & Guitar Tuner',
    description: 'Tune your musical instruments via microphone inputs using real-time pitch detection and a visual needle scale.',
    keywords: ['guitar tuner', 'pitch detector', 'instrument tuner', 'frequency counter', 'chromatic tuner'],
    tags: ['Audio', 'Hardware'],
    category: 'Audio',
    icon: '🎸',
    uiClass: 'ready'
  },
  {
    id: 'speed-reader',
    title: 'Focus Speed Reader',
    description: 'Read text using Rapid Serial Visual Presentation (RSVP), flashing words at customizable speeds (WPM) to increase focus.',
    keywords: ['speed reader', 'rsvp reading', 'wpm speed', 'focus reading', 'spritz reader'],
    tags: ['Text', 'Productivity'],
    category: 'Text',
    icon: '⚡',
    uiClass: 'ready'
  },
  {
    id: 'mime-inspector',
    title: 'File MIME Magic Byte Inspector',
    description: 'Inspect uploaded files using hex magic byte signatures to identify their true extension and MIME-type classification.',
    keywords: ['mime inspector', 'magic bytes', 'file signature', 'identify file', 'file type hex'],
    tags: ['Security', 'Analyzer', 'Code'],
    category: 'Security',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'sql-playground',
    title: 'SQL Query Playground & Sandbox',
    description: 'Execute basic SQL commands (CREATE, INSERT, SELECT) on mock, in-memory table structures to test queries.',
    keywords: ['sql playground', 'sql database', 'sandbox sql', 'learn sql', 'mock database'],
    tags: ['Code', 'Data'],
    category: 'Developer',
    icon: '💾',
    uiClass: 'ready'
  },
  {
    id: 'hash-verifier',
    title: 'File Checksum & Hash Verifier',
    description: 'Generate cryptographic hashes (MD5, SHA-256) of uploaded files locally and compare them to verify file integrity.',
    keywords: ['checksum', 'file hash', 'sha256 file', 'md5 file', 'file verification'],
    tags: ['Security', 'Crypto', 'Validator'],
    category: 'Security',
    icon: '🛡️',
    uiClass: 'ready'
  },
  {
    id: 'lorem-pixel',
    title: 'SVG Placeholder Image Generator',
    description: 'Generate customizable placeholder images with custom dimensions, labels, and colors, and copy the inline SVG.',
    keywords: ['placeholder image', 'lorem pixel', 'svg placeholder', 'image generator', 'design placeholder'],
    tags: ['Image', 'Generator', 'Design'],
    category: 'Graphics',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'ratio-solver',
    title: 'Ratio & Proportion Solver',
    description: 'Solve proportions (A:B = C:D) for missing variables, scale dimensions, and simplify ratio proportions.',
    keywords: ['ratio solver', 'proportion', 'solve ratio', 'math ratio', 'scale dimensions'],
    tags: ['Calculator', 'Math'],
    category: 'Calculators',
    icon: '⚖️',
    uiClass: 'ready'
  },
  {
    id: 'json-diff',
    title: 'JSON Diff & Patch Generator',
    description: 'Compare two JSON documents side-by-side, visualize structural differences with unified or inline views, and export a JSON Patch (RFC 6902) diff.',
    keywords: ['json diff', 'json compare', 'json patch', 'rfc 6902', 'json difference', 'compare json', 'json merge', 'structure compare'],
    tags: ['Code', 'Data', 'Analyzer', 'Validator'],
    category: 'Developer',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'json-schema-gen',
    title: 'JSON to Schema Generator',
    description: 'Paste any JSON data and instantly generate a valid JSON Schema (Draft-07) with inferred types, array item schemas, and nested object definitions.',
    keywords: ['json schema', 'schema generator', 'draft 07', 'json schema draft', 'api schema', 'data contract', 'schema from json', 'validate schema'],
    tags: ['Code', 'Data', 'Generator', 'Validator'],
    category: 'Developer',
    icon: '📋',
    uiClass: 'ready'
  },
  {
    id: 'json-to-ts',
    title: 'JSON to TypeScript Interface Generator',
    description: 'Paste JSON data and instantly generate TypeScript interfaces, types, and union types with proper type inference for objects, arrays, and primitives.',
    keywords: ['json to typescript', 'typescript generator', 'ts interface', 'type inference', 'api types', 'json to ts', 'interface generator'],
    tags: ['Code', 'Data', 'Generator'],
    category: 'Developer',
    icon: '🔷',
    uiClass: 'ready'
  },
  {
    id: 'multi-hash-calculator',
    title: 'Multi-Hash Calculator (All Algorithms)',
    description: 'Calculate all cryptographic hashes simultaneously — MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3-224/256/384/512, RipeMD-160, CRC32, and Adler32 — for text or files.',
    keywords: ['hash calculator', 'multi hash', 'md5 sha256', 'all hashes', 'checksum all', 'file integrity', 'digest generator', 'calculate all hashes'],
    tags: ['Security', 'Crypto', 'Generator'],
    category: 'Security',
    icon: '🔐',
    uiClass: 'ready'
  },
  {
    id: 'ai-pose-estimator',
    title: 'AI Live Pose Estimator',
    description: 'Stream your webcam and see real-time human pose keypoints extracted by the VitPose-Base AI model side-by-side with the original feed, 100% locally in your browser.',
    keywords: ['pose estimation', 'body keypoints', 'webcam pose', 'vitpose', 'skeleton detection', 'human body tracking', 'live ai', 'real-time pose'],
    tags: ['AI', 'Video', 'Analyzer'],
    category: 'Graphics',
    icon: '🏃',
    uiClass: 'ready',
    adTopics: ['fitness tracking apps', 'sports analytics software', 'motion capture tools', 'physical therapy apps'],
  },
  {
    id: 'fire-retirement-calc',
    title: 'FIRE Early Retirement Calculator',
    description: 'Calculate your Financial Independence, Retire Early (FIRE) target number, determine your timeline, and simulate dynamic investment growth scenarios 100% locally.',
    keywords: ['fire calculator', 'early retirement', 'financial independence', 'retire early', '4 percent rule', 'net worth projection', 'savings rate', 'financial freedom'],
    tags: ['Calculator', 'Finance', 'Math'],
    category: 'Calculators',
    icon: '🔥',
    uiClass: 'ready',
    adTopics: ['retirement planning', 'investment portfolio', 'savings calculator', 'personal finance tools']
  },
  {
    id: 'str-cost-segregation',
    title: 'STR Cost Segregation Tax Saver',
    description: 'Estimate tax savings from Short-Term Rental (STR) Cost Segregation and the STR tax loophole 100% locally.',
    keywords: ['str cost segregation', 'cost segregation', 'tax savings', 'short term rental loophole', 'depreciation', 'bonus depreciation', 'real estate tax', 'str loophole', 'passive activity loss', 'tax write off'],
    tags: ['Calculator', 'Finance', 'Math'],
    category: 'Calculators',
    icon: '🏨',
    uiClass: 'ready',
    adTopics: ['real estate investment', 'tax preparation services', 'cost segregation study', 'rental property tax']
  },
  {
    id: 'code-to-image',
    title: 'Code Snippet to Image Generator',
    description: 'Convert code snippets into syntax-highlighted, beautifully framed images with customizable gradients, shadows, and themes.',
    keywords: ['code snippet', 'code to image', 'syntax highlight', 'carbon copy', 'code print', 'snippet preview', 'export code', 'beautiful code', 'developer graphic', 'screenshot code'],
    tags: ['Code', 'Image', 'Generator', 'Design'],
    category: 'Graphics',
    icon: '💻',
    uiClass: 'ready',
    adTopics: ['developer tools', 'graphic design software', 'code formatting', 'social media graphics']
  },
  {
    id: 'ai-resume-injector',
    title: 'AI Resume Prompt Injector',
    description: 'Inject invisible, AI-targeted instructions into your PDF resume to bypass automated screening filters and boost matching scores.',
    keywords: ['resume bypass', 'ats bypass', 'prompt injection', 'invisible text', 'pdf resume', 'ats screening', 'resume optimizer', 'resume checker'],
    tags: ['AI', 'PDF', 'Editor', 'Privacy'],
    category: 'Security',
    icon: '📄',
    uiClass: 'ready',
    adTopics: ['resume writing services', 'job search platforms', 'interview preparation', 'career counseling']
  },
  {
    id: 'code-beautifier',
    title: 'Code Beautifier & Minifier',
    description: 'Format or minify JavaScript, CSS, and HTML instantly in your browser with the full Prettier engine — no server needed.',
    keywords: ['format code', 'beautify', 'minify', 'prettify', 'code formatter', 'JS format', 'CSS format', 'HTML format', 'code beautifier', 'prettier'],
    tags: ['Code', 'Developer', 'Formatter'],
    category: 'Developer',
    icon: '✨',
    uiClass: 'ready'
  },
  {
    id: 'graphql-formatter',
    title: 'GraphQL Query Formatter & Validator',
    description: 'Pretty-print, validate, and format GraphQL queries and schemas entirely in your browser with the official GraphQL.js engine.',
    keywords: ['graphql', 'query formatter', 'graphql validator', 'graphql pretty print', 'graphql lint', 'graphql schema', 'gql', 'apollo'],
    tags: ['Code', 'Developer', 'Formatter'],
    category: 'Developer',
    icon: '🔷',
    uiClass: 'ready'
  },
  {
    id: 'config-converter',
    title: 'TOML ↔ JSON ↔ YAML Converter',
    description: 'Convert between TOML, JSON, and YAML config formats with validation — all in your browser. Paste any format and get the others instantly.',
    keywords: ['toml converter', 'yaml converter', 'json converter', 'config format', 'toml to json', 'yaml to toml', 'format converter', 'dotenv'],
    tags: ['Code', 'Developer', 'Converter'],
    category: 'Developer',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'env-validator',
    title: '.env File Validator & Formatter',
    description: 'Validate, sort, and clean .env files. Detect syntax errors, sort keys alphabetically, mask sensitive values, and export formatted output.',
    keywords: ['dotenv', 'env file', 'environment variables', 'env validator', 'env formatter', 'sort env', 'mask secrets', 'lint dotenv'],
    tags: ['Code', 'Developer', 'Validator'],
    category: 'Developer',
    icon: '📋',
    uiClass: 'ready'
  },
  {
    id: 'git-diff-viewer',
    title: 'Git Diff Viewer (Patch/Unified)',
    description: 'Paste a git diff or patch file and view it in unified or side-by-side format with syntax highlighting. Supports standard unified diff format.',
    keywords: ['git diff', 'patch viewer', 'unified diff', 'side by side diff', 'code review', 'git patch', 'diff viewer'],
    tags: ['Code', 'Developer', 'Viewer'],
    category: 'Developer',
    icon: '📄',
    uiClass: 'ready'
  },
  {
    id: 'gitignore-generator',
    title: '.gitignore Generator',
    description: 'Generate a .gitignore file by selecting languages, frameworks, and editors. Combines templates and lets you customize before downloading.',
    keywords: ['gitignore', 'git ignore', 'generator', 'templates', 'node', 'python', 'java', 'editor', 'ide'],
    tags: ['Code', 'Developer', 'Generator'],
    category: 'Developer',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'curl-converter',
    title: 'cURL ↔ Fetch/Axios Converter',
    description: 'Instantly convert cURL commands to JavaScript fetch() or axios code, and vice versa. Paste a curl command or JS snippet and get clean, ready-to-use output — no server calls.',
    keywords: ['curl converter', 'fetch converter', 'axios converter', 'curl to js', 'js to curl', 'http request converter', 'api code generator', 'request builder'],
    tags: ['Code', 'Developer', 'Converter'],
    category: 'Developer',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'dockerfile-linter',
    title: 'Dockerfile Linter & Best-Practice Checker',
    description: 'Paste a Dockerfile and get instant feedback on anti-patterns, security issues, optimization opportunities, and layer-ordering best practices — all running client-side.',
    keywords: ['dockerfile linter', 'docker lint', 'docker best practices', 'container optimization', 'layer ordering', 'security audit', 'docker check', 'dockerfile analyzer'],
    tags: ['Code', 'Security'],
    category: 'Developer',
    icon: '🐳',
    uiClass: 'ready'
  },
  {
    id: 'crontab-builder',
    title: 'Crontab Builder (Visual)',
    description: 'Build cron expressions with a visual scheduler UI — select minutes, hours, days, months and weekdays, then preview the next run times. No server calls.',
    keywords: ['cron builder', 'cron expression', 'schedule generator', 'crontab', 'task scheduler', 'cron tester', 'next run time'],
    tags: ['Code', 'Productivity'],
    category: 'Developer',
    icon: '⏰',
    uiClass: 'ready'
  },
  {
    id: 'http-status-codes',
    title: 'HTTP Status Code Reference & Tester',
    description: 'Searchable reference of all HTTP status codes (1xx–5xx) with descriptions, use cases, and example scenarios. Filter by category or search by code.',
    keywords: ['http status codes', 'status code reference', '200 404 500', 'http response codes', 'web development reference', 'api status codes'],
    tags: ['Code', 'Network'],
    category: 'Developer',
    icon: '📋',
    uiClass: 'ready'
  },
  {
    id: 'json-path-query',
    title: 'JSON Path / JMESPath Query Tester',
    description: 'Live query JSON data with JSONPath or JMESPath expressions. Paste your JSON, enter a query, and see results highlighted in the original structure — all running client-side.',
    keywords: ['jsonpath', 'jmespath', 'json query', 'json explorer', 'api response tester', 'aws jmespath', 'jsonpath expression'],
    tags: ['Code', 'Data', 'Developer'],
    category: 'Developer',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'code-snippet-screenshot',
    title: 'Code Snippet Screenshot Generator',
    description: 'Turn any code snippet into a beautiful, shareable image with syntax highlighting, themes, line numbers, and more — all rendered client-side in your browser.',
    keywords: ['carbon', 'code screenshot', 'code image', 'syntax highlighter', 'share code', 'beautiful code', 'code export', 'png generator'],
    tags: ['Code', 'Design', 'Developer'],
    category: 'Graphics',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'regex-cheatsheet',
    title: 'Regex Cheatsheet & Library',
    description: 'Searchable collection of common regular expressions with a live tester, syntax helper, and one-click copy — all running client-side in your browser.',
    keywords: ['regex', 'regular expression', 'pattern matcher', 'regex tester', 'regex library', 'email validator', 'url regex', 'phone number regex'],
    tags: ['Code', 'Developer', 'Reference'],
    category: 'Developer',
    icon: '🔣',
    uiClass: 'ready'
  },
  {
    id: 'semver-calculator',
    title: 'Semantic Version (SemVer) Calculator',
    description: 'Parse, compare, bump and validate semantic versions. Check version ranges, extract parts, and compute differences between releases — all running client-side.',
    keywords: ['semver', 'version calculator', 'version comparison', 'npm version', 'package.json', 'major minor patch', 'version range'],
    tags: ['Code', 'Developer', 'Calculator'],
    category: 'Developer',
    icon: '🔢',
    uiClass: 'ready'
  },
  {
    id: 'htaccess-nginx-generator',
    title: 'HTAccess / Nginx Redirect Generator',
    description: 'Build redirect rules visually and generate .htaccess or Nginx configuration code. Supports 301/302 redirects, regex patterns, query strings, and more — all generated client-side.',
    keywords: ['htaccess', 'nginx redirect', '301 redirect', 'url rewrite', 'apache config', 'web server config', 'redirect generator'],
    tags: ['Code', 'Developer', 'Network'],
    category: 'Developer',
    icon: '🔀',
    uiClass: 'ready'
  },
  {
    id: 'api-mock-response',
    title: 'API Mock Response Generator',
    description: 'Define a JSON schema and generate realistic mock API responses. Supports string, integer, array, object types with format hints — all generated client-side.',
    keywords: ['mock api', 'fake json', 'api mock', 'json generator', 'schema to data', 'api testing', 'stub response'],
    tags: ['Code', 'Developer', 'Generator'],
    category: 'Developer',
    icon: '🔀',
    uiClass: 'ready'
  },
  {
    id: 'ws-tester',
    title: 'WebSocket Tester / Echo Client',
    description: 'Connect to any WebSocket server and inspect messages in real-time. Debug protocols, test APIs, or experiment with WS-based services — all from your browser.',
    keywords: ['websocket', 'wss', 'echo client', 'ws tester', 'socket debug', 'real-time messaging', 'protocol testing'],
    tags: ['Developer', 'Network', 'Tester'],
    category: 'Developer',
    icon: '🔌',
    uiClass: 'ready'
  },
  {
    id: 'html-to-jsx',
    title: 'HTML to JSX Converter',
    description: 'Convert raw HTML markup to React-compatible JSX syntax. Handles className, htmlFor, inline styles, self-closing tags, boolean attributes, and event handlers — all in your browser.',
    keywords: ['html to jsx', 'react converter', 'jsx generator', 'html react', 'markup converter', 'component code gen'],
    tags: ['Code', 'Developer', 'Converter'],
    category: 'Developer',
    icon: '⚛️',
    uiClass: 'ready'
  },
  {
    id: 'css-to-tailwind',
    title: 'CSS to Tailwind Converter',
    description: 'Map raw CSS declarations to equivalent Tailwind utility classes. Handles colors, spacing, sizing, typography, flexbox, grid, borders, shadows, and more — all in your browser.',
    keywords: ['css to tailwind', 'tailwind converter', 'utility classes', 'css convert', 'tailwind gen', 'style to class'],
    tags: ['Code', 'Developer', 'Converter'],
    category: 'Developer',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'code-complexity',
    title: 'Code Complexity / LOC Analyzer',
    description: 'Paste source code and get detailed metrics: total lines, blank lines, comment lines, function count, cyclomatic complexity estimate, and more. Supports JavaScript, CSS, HTML, Python, and more.',
    keywords: ['loc counter', 'code analyzer', 'complexity metric', 'lines of code', 'cyclomatic complexity', 'code metrics'],
    tags: ['Code', 'Developer', 'Analyzer'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'find-replace',
    title: 'Find & Replace (Regex Bulk Editor)',
    description: 'Paste text and apply multiple find/replace patterns at once. Toggle regex mode and case sensitivity per pattern, preview changes before applying — all in your browser.',
    keywords: ['find replace', 'bulk editor', 'regex replace', 'multi replace', 'text editor', 'search replace'],
    tags: ['Text', 'Developer', 'Editor'],
    category: 'Text & Writing',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'text-sorter',
    title: 'Text Sorter & Column Splitter',
    description: 'Sort lines alphabetically, reverse order, shuffle, split text by delimiter into columns or lines, and join them back. All operations run in your browser.',
    keywords: ['sort text', 'column splitter', 'split lines', 'text sorter', 'shuffle lines', 'deduplicate'],
    tags: ['Text', 'Developer', 'Utility'],
    category: 'Text & Writing',
    icon: '🔀',
    uiClass: 'ready'
  },
  {
    id: 'whitespace-cleaner',
    title: 'Whitespace & Line Break Cleaner',
    description: 'Clean up messy text: trim whitespace, remove blank lines, replace tabs with spaces, normalize line endings (CRLF→LF), and collapse consecutive newlines. All operations run client-side.',
    keywords: ['whitespace cleaner', 'trim text', 'remove blank lines', 'normalize line endings', 'collapse newlines', 'tabs to spaces'],
    tags: ['Text', 'Developer', 'Utility'],
    category: 'Text & Writing',
    icon: '✨',
    uiClass: 'ready'
  },
  {
    id: 'slug-generator',
    title: 'Slug / Permalink Generator',
    description: 'Convert titles, headings, or sentences into URL-safe slugs. Customize separators (dash, underscore, dot), case conversion, and special character handling. Preview full URLs with your domain.',
    keywords: ['slug generator', 'permalink generator', 'url slug converter', 'seo friendly url', 'title to slug', 'url safe string'],
    tags: ['Text', 'Developer', 'SEO', 'Utility'],
    category: 'Text & Writing',
    icon: '🔗',
    uiClass: 'ready'
  },
  {
    id: 'markdown-html',
    title: 'Markdown ↔ HTML Converter',
    description: 'Convert between Markdown and HTML with live preview. Supports headers, bold, italic, links, images, code blocks, lists, blockquotes, and more. All conversion happens in your browser.',
    keywords: ['markdown converter', 'html converter', 'md to html', 'html to markdown', 'markdown editor', 'rich text converter'],
    tags: ['Text', 'Developer', 'Converter', 'Utility'],
    category: 'Text & Writing',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'md-table-generator',
    title: 'Markdown Table Generator',
    description: 'Create markdown tables with a visual grid editor. Add rows and columns, edit cells directly, preview the rendered HTML table live, and copy the markdown source code.',
    keywords: ['markdown table generator', 'table creator', 'grid editor', 'md table builder', 'html table preview'],
    tags: ['Text', 'Developer', 'Table', 'Utility'],
    category: 'Text & Writing',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'text-handwriting',
    title: 'Text to Handwriting Generator',
    description: 'Render your text as realistic handwriting on virtual paper. Choose from different styles (cursive, print, neat), customize pen color and size, adjust line spacing, and export as PNG.',
    keywords: ['handwriting generator', 'text to handwriting', 'virtual pen', 'handwritten text', 'canvas drawing text'],
    tags: ['Text', 'Design', 'Generator', 'Utility'],
    category: 'Text & Writing',
    icon: '✍️',
    uiClass: 'ready'
  },
  {
    id: 'fancy-unicode',
    title: 'Fancy Unicode Text Generator',
    description: 'Convert your text into fancy styles for social media: bold, italic, script, circled, squared, and more. Copy any style directly to clipboard.',
    keywords: ['fancy text generator', 'unicode text converter', 'social media text', 'bold italic text', 'decorative text'],
    tags: ['Text', 'Social Media', 'Generator', 'Utility'],
    category: 'Text & Writing',
    icon: '✨',
    uiClass: 'ready'
  },
  {
    id: 'emoji-picker',
    title: 'Emoji Picker & Searcher',
    description: 'Browse and search a directory of emojis. Click any emoji to copy it directly to your clipboard, along with its shortcode.',
    keywords: ['emoji picker', 'emoji searcher', 'emoji directory', 'copy emoji', 'emoji shortcodes'],
    tags: ['Text', 'Social Media', 'Utility', 'Emoji'],
    category: 'Text & Writing',
    icon: '😀',
    uiClass: 'ready'
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum (Themed) Generator',
    description: 'Generate placeholder text in multiple themes: classic Lorem Ipsum, hipster, corporate, and pirate. Perfect for design mockups and prototypes.',
    keywords: ['lorem ipsum generator', 'placeholder text', 'hipster text generator', 'corporate speak generator', 'pirate text generator'],
    tags: ['Text', 'Writing', 'Generator', 'Utility'],
    category: 'Text & Writing',
    icon: '📄',
    uiClass: 'ready'
  },
  {
    id: 'text-reverser',
    title: 'Text Reverser & Mirror Tool',
    description: 'Reverse strings, words, flip text into mirror characters (Unicode bidirectional), and transform case — all in your browser.',
    keywords: ['text reverser', 'reverse string', 'mirror text', 'flip text', 'swap case', 'camelCase converter', 'snake_case converter'],
    tags: ['Text', 'Writing', 'Utility', 'Formatter'],
    category: 'Text & Writing',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'duplicate-line',
    title: 'Duplicate Line Finder & Remover',
    description: 'Paste text and find duplicate lines. Highlight them or remove them entirely — all in your browser.',
    keywords: ['duplicate line finder', 'remove duplicates', 'deduplicate', 'find repeated lines', 'highlight duplicates'],
    tags: ['Text', 'Writing', 'Utility', 'Formatter'],
    category: 'Text & Writing',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'word-frequency',
    title: 'Word Frequency & Keyword Density',
    description: 'Analyze text for word frequency, keyword density, and SEO metrics — all in your browser.',
    keywords: ['word frequency analyzer', 'keyword density checker', 'SEO word counter', 'text analysis', 'top words'],
    tags: ['Text', 'Writing', 'Utility', 'SEO'],
    category: 'Text & Writing',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'cipher-suite',
    title: 'Classic Cipher Suite (ROT / Vigenère / Atbash)',
    description: 'Encode and decode text using classic ciphers: ROT13, ROT-N, Vigenère, and Atbash — all in your browser.',
    keywords: ['ROT13 encoder', 'Vigenere cipher', 'Atbash cipher', 'text encryption', 'classic ciphers', 'crypto tool'],
    tags: ['Text', 'Writing', 'Utility', 'Security'],
    category: 'Text & Writing',
    icon: '🔐',
    uiClass: 'ready'
  },
  {
    id: 'citation-bibtex',
    title: 'Citation / BibTeX Formatter',
    description: 'Format references into APA, MLA, or BibTeX citation styles — all in your browser.',
    keywords: ['citation formatter', 'BibTeX generator', 'APA format', 'MLA format', 'reference formatter'],
    tags: ['Text', 'Writing', 'Utility', 'Academic'],
    category: 'Text & Writing',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper & Rotator',
    description: 'Crop, rotate, and flip images with aspect ratio presets — all in your browser.',
    keywords: ['image cropper', 'rotate image', 'flip image', 'aspect ratio', 'crop tool'],
    tags: ['Image', 'Media', 'Utility', 'Editor'],
    category: 'Image & Media',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor (Lossy/Lossless)',
    description: 'Compress images client-side with quality controls — supports JPEG, PNG, and WebP output formats.',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'jpeg compression', 'webp converter', 'png optimizer', 'lossy compression', 'lossless compression'],
    tags: ['Image', 'Media', 'Optimizer', 'Converter'],
    category: 'Image & Media',
    icon: '🗜️',
    uiClass: 'ready'
  },
  {
    id: 'webp-avif-converter',
    title: 'WebP / AVIF Converter',
    description: 'Convert images to modern WebP or AVIF formats with smaller file sizes and better compression.',
    keywords: ['webp converter', 'avif converter', 'image format converter', 'convert webp', 'convert avif', 'modern image format'],
    tags: ['Image', 'Media', 'Converter', 'Optimizer'],
    category: 'Image & Media',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'favicon-generator',
    title: 'Favicon & App Icon Generator',
    description: 'Generate favicon, PWA icons (16x16 to 512x512), and manifest.json from a single source image.',
    keywords: ['favicon generator', 'app icon generator', 'pwa icons', 'manifest.json', 'icon generator', 'website icon'],
    tags: ['Image', 'Media', 'Generator', 'PWA'],
    category: 'Image & Media',
    icon: '🌐',
    uiClass: 'ready'
  },
  {
    id: 'image-color-picker',
    title: 'Image Color Picker / Eyedropper',
    description: 'Upload an image and click anywhere to pick its color. Get hex, RGB, HSL values instantly with a zoom view.',
    keywords: ['color picker', 'eyedropper tool', 'hex color', 'rgb color', 'image color', 'color selector'],
    tags: ['Image', 'Media', 'Tool', 'Utility'],
    category: 'Image & Media',
    icon: '💧',
    uiClass: 'ready'
  },
  {
    id: 'image-ascii-art',
    title: 'Image to ASCII Art Converter',
    description: 'Convert any image into ASCII or ANSI art. Upload a photo, adjust density and character set, and get back text-based pixel art — all client-side.',
    keywords: ['ascii art', 'image to ascii', 'ansi art', 'pixel art text', 'ascii converter', 'text art generator', 'character art'],
    tags: ['Image', 'Media', 'Converter', 'Art'],
    category: 'Image & Media',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'image-meme-generator',
    title: 'Meme Generator',
    description: 'Upload an image and add top/bottom captions with customizable font, size, color, stroke, and position. Create classic meme-style images entirely in your browser.',
    keywords: ['meme generator', 'top text bottom text', 'image caption tool', 'meme maker', 'caption overlay', 'funny text on image', 'meme creator'],
    tags: ['Image', 'Media', 'Generator', 'Fun'],
    category: 'Image & Media',
    icon: '😂',
    uiClass: 'ready'
  },
  {
    id: 'image-watermark-adder',
    title: 'Watermark Adder',
    description: 'Add text or logo watermarks to images with tiling, rotation, opacity control, and positioning. Protect your photos with professional-looking watermarks — all processed in your browser.',
    keywords: ['watermark tool', 'image watermark', 'logo overlay', 'tile watermark', 'protect photos', 'copyright image', 'brand protection'],
    tags: ['Image', 'Media', 'Tool', 'Security'],
    category: 'Image & Media',
    icon: '💧',
    uiClass: 'ready'
  },
  {
    id: 'image-gif-maker',
    title: 'GIF Maker (Images → GIF)',
    description: 'Upload multiple images as frames and create an animated GIF with customizable frame duration, loop count, and quality. Perfect for simple animations and meme sequences — all generated in your browser.',
    keywords: ['gif maker', 'animated gif', 'image to gif', 'frame animation', 'meme sequence', 'photo slideshow gif', 'gif creator'],
    tags: ['Image', 'Media', 'Generator', 'Animation'],
    category: 'Image & Media',
    icon: '🎞️',
    uiClass: 'ready'
  },
  {
    id: 'video-to-gif-converter',
    title: 'Video to GIF Converter',
    description: 'Upload a video clip, trim it with start/end time controls, extract frames at configurable intervals, and generate an animated GIF. Perfect for creating short looping animations from videos — all processed in your browser.',
    keywords: ['video to gif', 'video clip to gif', 'trim video gif', 'extract gif from video', 'video animation converter', 'clip to gif', 'video screenshot gif'],
    tags: ['Video', 'Image', 'Converter', 'Animation'],
    category: 'Media',
    icon: '🎬',
    uiClass: 'ready'
  },
  {
    id: 'spritesheet-generator',
    title: 'Spritesheet Generator & Slicer',
    description: 'Pack multiple images into a single spritesheet with configurable grid size and spacing. Also slice existing spritesheets back into individual frames. Perfect for game developers — all processed in your browser.',
    keywords: ['spritesheet generator', 'sprite packer', 'image grid maker', 'game asset tool', 'frame manager', 'spritesheet slicer', 'animation frames'],
    tags: ['Image', 'Media', 'Tool', 'Game Dev'],
    category: 'Image & Media',
    icon: '🎮',
    uiClass: 'ready'
  },
  {
    id: 'image-collage-grid-maker',
    title: 'Image Collage / Grid Maker',
    description: 'Combine multiple images into grids and collages with configurable layout, spacing, padding, and background color. Create beautiful photo mosaics and grid layouts — all processed in your browser.',
    keywords: ['collage maker', 'image grid', 'photo mosaic', 'grid layout', 'photo grid maker', 'image collage', 'photo organizer'],
    tags: ['Image', 'Media', 'Generator', 'Design'],
    category: 'Image & Media',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'image-photo-filters',
    title: 'Photo Filters & Adjustments',
    description: 'Apply brightness, contrast, saturation, blur, grayscale, sepia, and other filters to uploaded images with live preview sliders. Professional photo editing in your browser — all processed client-side.',
    keywords: ['photo filter', 'image adjustment', 'brightness slider', 'contrast tool', 'saturation editor', 'blur effect', 'grayscale converter', 'sepia filter'],
    tags: ['Image', 'Media', 'Tool', 'Editor'],
    category: 'Image & Media',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'image-pixel-art-editor',
    title: 'Pixel Art Editor',
    description: 'Draw pixel art on a configurable grid with mouse/touch drawing, color palette selection, undo/redo, and export as PNG/SVG. Create retro-style pixel art directly in your browser.',
    keywords: ['pixel art editor', 'pixel drawing', 'retro art creator', 'grid drawing tool', 'pixel canvas', '8-bit art', 'sprite creator'],
    tags: ['Image', 'Media', 'Tool', 'Art'],
    category: 'Image & Media',
    icon: '🎮',
    uiClass: 'ready'
  },
  {
    id: 'image-blurhash-generator',
    title: 'Blurhash / ThumbHash Generator',
    description: 'Generate compact Blurhash and ThumbHash placeholders for images. Create lightweight, short placeholder strings that fade in as images load — perfect for progressive image loading UX.',
    keywords: ['blurhash generator', 'thumbhash generator', 'placeholder hash', 'image placeholder', 'progressive loading', 'lazy load effect', 'compact image hash', 'blurhash online'],
    tags: ['Image', 'Media', 'Tool', 'Generator'],
    category: 'Image & Media',
    icon: '🌫️',
    uiClass: 'ready'
  },
  {
    id: 'image-exif-viewer',
    title: 'Image Metadata (EXIF/GPS) Viewer Map',
    description: 'Extract and display EXIF metadata from photos including GPS coordinates, camera settings, date/time taken. Plot photo locations on an interactive map with detailed image information.',
    keywords: ['exif viewer', 'image metadata', 'gps location', 'photo gps', 'camera info', 'image inspector', 'photo data', 'location tracker'],
    tags: ['Image', 'Media', 'Tool', 'Viewer'],
    category: 'Image & Media',
    icon: '📍',
    uiClass: 'ready'
  },
  {
    id: 'favicon-spinner-maker',
    title: 'Animated Favicon / Loading Spinner Maker',
    description: 'Generate animated CSS/SVG loading spinners and custom animated favicons. Choose from multiple animation styles (spin, pulse, bounce) with color customization and instant preview.',
    keywords: ['spinner maker', 'loading spinner', 'favicon generator', 'animated favicon', 'css spinner', 'svg spinner', 'loading animation', 'icon creator'],
    tags: ['Design', 'CSS', 'SVG', 'Generator'],
    category: 'Design & CSS',
    icon: '⏳',
    uiClass: 'ready'
  },
  {
    id: 'css-animation-builder',
    title: 'CSS Animation / Keyframe Builder',
    description: 'Create professional CSS keyframe animations with a visual builder. Choose from preset Animista-style effects, customize timing and easing, preview in real-time, and export production-ready CSS code.',
    keywords: ['css animation', 'keyframe builder', 'animista', 'css transitions', 'animation generator', 'hover effects', 'loading animation', 'motion design'],
    tags: ['Design', 'CSS', 'Generator', 'Animation'],
    category: 'Design & CSS',
    icon: '✨',
    uiClass: 'ready'
  },
  {
    id: 'css-cubic-bezier-editor',
    title: 'CSS Cubic-Bezier Easing Editor',
    description: 'Visually design and preview cubic-bezier easing curves for CSS animations. Choose from presets or drag control points to create custom ease-in-out effects with live curve visualization.',
    keywords: ['cubic bezier editor', 'easing curve', 'css easing', 'animation easing', 'ease in out', 'bezier curve', 'motion design', 'visual easing'],
    tags: ['Design', 'CSS', 'Generator', 'Animation'],
    category: 'Design & CSS',
    icon: '📈',
    uiClass: 'ready'
  },
  {
    id: 'css-clip-path-generator',
    title: 'CSS Clip-Path / Shape Generator',
    description: 'Visually create and preview CSS clip-path shapes using polygon points. Choose from preset shapes or drag control points to design custom polygons, with live preview and instant code export.',
    keywords: ['clip path generator', 'css shape maker', 'polygon editor', 'css clip-path', 'shape designer', 'visual polygon', 'css mask generator'],
    tags: ['Design', 'CSS', 'Generator', 'Shape'],
    category: 'Design & CSS',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'css-neumorphism-generator',
    title: 'CSS Neumorphism Generator',
    description: 'Visually create neumorphic (soft UI) shadow effects with live preview. Adjust light/dark shadow positions, blur radius, and colors to generate production-ready CSS code.',
    keywords: ['neumorphism generator', 'soft ui', 'neu design', 'css shadows', 'extruded shape', 'plastic effect', 'shadow maker', 'ui design'],
    tags: ['Design', 'CSS', 'Generator', 'UI'],
    category: 'Design & CSS',
    icon: '🔮',
    uiClass: 'ready'
  },
  {
    id: 'code-typing-video',
    title: 'Code Typing Animation Video Renderer',
    description: 'Turn a code snippet into a typewriter-style typing animation and export it as an MP4 or WebM video — rendered and encoded 100% locally with WebAssembly FFmpeg.',
    keywords: ['code typing animation', 'code video', 'typing effect video', 'coding tutorial video', 'code screen recording', 'programming animation', 'ffmpeg wasm', 'code to video', 'developer video export'],
    tags: ['Code', 'Video', 'Generator', 'Design'],
    category: 'Graphics',
    icon: '🎞️',
    uiClass: 'ready',
    adTopics: ['screen recording software', 'video editing tools', 'coding tutorial platforms', 'youtube channel growth']
  },
  {
    id: 'ai-photo-booth',
    title: 'AI Photo Booth with Pose Decorations',
    description: 'Turn your webcam into a fun photo booth! Detects body pose in real-time and lets you place emoji decorations at joint positions, or position them freely. Capture and download as PNG.',
    keywords: ['photo booth', 'webcam', 'emoji overlay', 'pose detection', 'body keypoints', 'selfie editor', 'fun camera', 'decoration', 'sticker'],
    tags: ['AI', 'Image', 'Video', 'Editor'],
    category: 'Graphics',
    icon: '📸',
    uiClass: 'ready',
    adTopics: ['emoji maker', 'sticker design tools', 'photo editing apps', 'image generation']
  },
  {
    id: 'css-border-radius-blob-generator',
    title: 'CSS Border-Radius / Blob Generator',
    description: 'Visually create organic blob shapes by adjusting border-radius percentages on each corner. Preview in real-time with live canvas rendering and export production-ready CSS code.',
    keywords: ['blob generator', 'border radius editor', 'organic shape maker', 'css blob', 'rounded corners', 'morphology', 'shape designer', 'visual css'],
    tags: ['Design', 'CSS', 'Generator', 'Shape'],
    category: 'Design & CSS',
    icon: '🫧',
    uiClass: 'ready'
  },
  {
    id: 'css-filter-playground',
    title: 'CSS Filter Playground',
    description: 'Visually apply and preview all CSS filter functions (blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia) with live canvas rendering. Adjust each filter independently and export production-ready CSS code.',
    keywords: ['css filters', 'filter playground', 'image filters', 'brightness slider', 'contrast adjuster', 'grayscale effect', 'sepia filter', 'hue rotation', 'blur effect'],
    tags: ['Design', 'CSS', 'Generator', 'Image'],
    category: 'Design & CSS',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'mesh-gradient-generator',
    title: 'Mesh Gradient Generator',
    description: 'Create liquid-glass mesh gradient backgrounds with live preview. Position color blobs, adjust blur and opacity to generate production-ready CSS code for modern UI designs.',
    keywords: ['mesh gradient', 'liquid glass', 'gradient background', 'blob gradient', 'glassmorphism', 'modern ui design', 'color blend', 'animated gradient'],
    tags: ['Design', 'CSS', 'Generator', 'Background'],
    category: 'Design & CSS',
    icon: '🌈',
    uiClass: 'ready'
  },
  {
    id: 'tailwind-config-builder',
    title: 'Tailwind Config / Theme Builder',
    description: 'Visually build a tailwind.config.js theme with color scales, spacing, and typography settings. Preview colors in real-time and export production-ready Tailwind configuration code.',
    keywords: ['tailwind config', 'tailwind theme', 'color scale generator', 'design system builder', 'tailwind setup', 'ui framework', 'css customization'],
    tags: ['Design', 'CSS', 'Generator', 'Tailwind'],
    category: 'Design & CSS',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'color-format-converter',
    title: 'Color Format Converter',
    description: 'Convert colors between HEX, RGB, HSL, OKLCH, and CMYK formats with live preview. Paste a color in any format and instantly see all representations.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'hsl to hex', 'oklch converter', 'cmyk converter', 'color picker', 'color space'],
    tags: ['Design', 'CSS', 'Converter', 'Color'],
    category: 'Design & CSS',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'color-shade-tint-scale',
    title: 'Color Shade / Tint Scale Generator',
    description: 'Generate a complete 50–900 color scale (11 steps) from any base color. Perfect for design systems, Tailwind themes, and CSS custom properties.',
    keywords: ['color scale', 'color palette generator', 'design system colors', 'tailwind colors', 'css variables', 'color shades'],
    tags: ['Design', 'CSS', 'Generator', 'Color Palette'],
    category: 'Design & CSS',
    icon: '🌈',
    uiClass: 'ready'
  },
  {
    id: 'font-pairing-previewer',
    title: 'Font Pairing Previewer',
    description: 'Preview Google Font combinations live. Choose heading and body fonts, adjust sizes and weights, and export CSS with one click.',
    keywords: ['font pairing', 'google fonts', 'typography preview', 'font combination', 'css font generator'],
    tags: ['Design', 'CSS', 'Generator', 'Typography'],
    category: 'Design & CSS',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'type-scale-generator',
    title: 'Type Scale / Modular Scale Generator',
    description: 'Build a responsive typographic scale with modular ratios. Choose your base size, ratio, and generate a complete type scale for headings, body text, and everything in between.',
    keywords: ['typography scale', 'modular scale', 'type scale generator', 'CSS typography', 'responsive fonts'],
    tags: ['Design', 'CSS', 'Generator', 'Typography'],
    category: 'Design & CSS',
    icon: '📐',
    uiClass: 'ready'
  },
  {
    id: 'favicon-safe-color-contrast-grid',
    title: 'Favicon-Safe Color Contrast Grid',
    description: 'Generate a full WCAG contrast matrix for any palette. Test text/background combinations at favicon sizes to ensure readability and accessibility compliance.',
    keywords: ['wcag contrast', 'color contrast checker', 'favicon size', 'accessibility grid', 'contrast ratio'],
    tags: ['Design', 'Color', 'Accessibility', 'Visualizer'],
    category: 'Design & CSS',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'ai-commit-message-gen',
    title: 'AI Commit Message Generator',
    description: 'Paste a git diff and let the local Qwen2.5 AI model draft a clean, Conventional Commits-style commit message, 100% locally in your browser.',
    keywords: ['commit message', 'git commit', 'conventional commits', 'ai commit generator', 'git diff', 'commit generator', 'qwen', 'commit log'],
    tags: ['AI', 'Code', 'Generator'],
    category: 'Developer',
    icon: '📜',
    uiClass: 'ready',
    adTopics: ['developer tools', 'git hosting platforms', 'code review software', 'devops productivity']
  },
  {
    id: 'ai-image-captioner',
    title: 'AI Image Captioning',
    description: 'Upload an image and generate descriptive captions using a local BLIP/ViT vision-language model — runs 100% in your browser with WebGPU or WASM acceleration.',
    keywords: ['image caption', 'vision language model', 'BLIP', 'ViT', 'AI image description', 'alt text generator', 'accessibility'],
    tags: ['AI', 'Image', 'Accessibility', 'Visualizer'],
    category: 'Graphics',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'ai-depth-map-estimator',
    title: 'AI Depth Map Estimator',
    description: 'Generate a depth map from a single photo using a local MiDaS/DPT vision model — creates realistic parallax effects and 3D-like imagery entirely in your browser.',
    keywords: ['depth map', 'depth estimation', 'parallax effect', 'MiDaS', 'DPT', 'AI depth', '3D photo'],
    tags: ['AI', 'Image', 'Visualizer'],
    category: 'Graphics',
    icon: '🔮',
    uiClass: 'ready'
  },
  {
    id: 'ai-zero-shot-image-classifier',
    title: 'AI Zero-Shot Image Classifier',
    description: 'Classify uploaded images against any custom labels using a local CLIP vision model — no API keys, runs entirely in your browser.',
    keywords: ['zero shot classification', 'CLIP', 'image labeling', 'custom labels', 'AI classifier', 'vision model'],
    tags: ['AI', 'Image', 'Classifier'],
    category: 'Graphics',
    icon: '🏷️',
    uiClass: 'ready'
  },
  {
    id: 'ai-grammar-spell-checker',
    title: 'AI Grammar & Spell Checker',
    description: 'Check grammar and spelling in your text using a local NLP model — no API keys, runs entirely in your browser.',
    keywords: ['grammar checker', 'spell check', 'NLP', 'text correction', 'writing assistant', 'proofreading'],
    tags: ['AI', 'Text', 'Checker'],
    category: 'Grammar',
    icon: '✏️',
    uiClass: 'ready'
  },
  {
    id: 'ai-text-paraphraser',
    title: 'AI Text Paraphraser / Rewriter',
    description: 'Reword and rephrase your text in different tones (formal, casual, creative) using a local seq2seq model — runs 100% client-side with WebGPU or WASM.',
    keywords: ['paraphraser', 'text rewriter', 'rephrase', 'tone changer', 'Pegasus', 'T5', 'AI writing assistant', 'formal casual'],
    tags: ['AI', 'Text', 'Rewriter', 'Writing Assistant'],
    category: 'Grammar',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'ai-named-entity-recognizer',
    title: 'AI Named Entity Recognizer',
    description: 'Extract people, places, organizations, and other entities from text using a local NER model — runs 100% client-side with WebGPU or WASM.',
    keywords: ['NER', 'named entity recognition', 'entity extraction', 'people places organizations', 'NLP', 'text annotation', 'BERT'],
    tags: ['AI', 'Text', 'Extractor', 'NLP'],
    category: 'Grammar',
    icon: '🏷️',
    uiClass: 'ready'
  },
  {
    id: 'ai-question-answering',
    title: 'AI Question Answering (Context)',
    description: 'Ask questions about pasted documents and get extractive answers using a local QA model — runs 100% client-side with WebGPU or WASM.',
    keywords: ['question answering', 'QA', 'extractive QA', 'context comprehension', 'SQuAD', 'BERT', 'document Q&A'],
    tags: ['AI', 'Text', 'QA', 'NLP'],
    category: 'Grammar',
    icon: '❓',
    uiClass: 'ready'
  },
  {
    id: 'ai-zero-shot-text-classifier',
    title: 'AI Zero-Shot Text Classifier',
    description: 'Tag text against any custom categories without prior training — uses a local CLIP-based model to classify into arbitrary labels, runs 100% client-side.',
    keywords: ['zero shot classification', 'text labeling', 'custom categories', 'CLIP', 'AI classifier', 'text categorization'],
    tags: ['AI', 'Text', 'Classifier'],
    category: 'Grammar',
    icon: '🏷️',
    uiClass: 'ready'
  },
  {
    id: 'ai-code-comment-gen',
    title: 'AI Code Comment / Docstring Generator',
    description: 'Generate comments and docstrings for your code using a local code model — supports Python, JavaScript, Java, and more. Runs 100% client-side.',
    keywords: ['code comments', 'docstring generator', 'code documentation', 'AI coding assistant', 'function docs', 'inline comments'],
    tags: ['AI', 'Developer', 'Code Helper'],
    category: 'Developer',
    icon: '💬',
    uiClass: 'ready'
  },
  {
    id: 'ai-speaker-diarization',
    title: 'AI Speaker Diarization / Voice Activity',
    description: 'Detect speech segments and identify different speakers in audio files using a local AI model — runs 100% client-side with WebGPU or WASM.',
    keywords: ['speaker diarization', 'voice activity detection', 'audio segmentation', 'speech detection', 'who spoke when', 'audio analysis'],
    tags: ['AI', 'Audio', 'Speech'],
    category: 'Audio',
    icon: '🎤',
    uiClass: 'ready'
  },
  {
    id: 'ai-image-segmentation',
    title: 'AI Image Segmentation (Click to Mask)',
    description: 'Segment images by clicking on objects — uses a local segmentation model (SAM-style) to create masks around clicked areas. Runs 100% client-side.',
    keywords: ['image segmentation', 'click to mask', 'object detection', 'mask generation', 'SAM', 'segment anything', 'image editing'],
    tags: ['AI', 'Image', 'Segmentation'],
    category: 'Image & Media',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'ai-handwriting-recognition',
    title: 'AI Handwriting / Sketch Recognition',
    description: 'Draw digits or shapes on a canvas and let an in-browser model recognize what you wrote. Uses transformers.js for fully client-side handwriting recognition.',
    keywords: ['handwriting recognition', 'sketch recognition', 'digit recognition', 'drawing to text', 'canvas drawing', 'AI recognition'],
    tags: ['AI', 'Text', 'Recognition'],
    category: 'Developer',
    icon: '✏️',
    uiClass: 'ready'
  },
  {
    id: 'ai-smart-image-cropper',
    title: 'AI Smart Image Cropper (Saliency-Based)',
    description: 'Upload an image and let AI detect the most important focal point, then auto-crop to highlight it. Uses a saliency detection model running 100% client-side.',
    keywords: ['smart crop', 'saliency detection', 'AI cropper', 'auto crop', 'focal point', 'image cropping'],
    tags: ['AI', 'Image', 'Editor'],
    category: 'Image & Media',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'ai-text-embeddings-viz',
    title: 'AI Text Embeddings Visualizer (2D Plot)',
    description: 'Input multiple text samples and visualize their semantic similarity in 2D space using text embeddings. Uses transformers.js with PCA/t-SNE projection, runs 100% client-side.',
    keywords: ['text embeddings', 'embedding visualization', 'semantic similarity', 'PCA plot', 'text clustering', 'NLP embedding'],
    tags: ['AI', 'Text', 'Visualization'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'csv-viewer-editor',
    title: 'CSV Viewer / Editor & Cleaner',
    description: 'Spreadsheet-like CSV editing in the browser — upload, view, edit cells inline, sort columns, filter rows, and export cleaned data. Runs 100% client-side.',
    keywords: ['csv editor', 'spreadsheet viewer', 'csv cleaner', 'data table editor', 'csv sort', 'csv filter', 'csv converter'],
    tags: ['Data', 'Editor', 'Converter'],
    category: 'Developer',
    icon: '📄',
    uiClass: 'ready'
  },
  {
    id: 'excel-converter',
    title: 'Excel (XLSX) ↔ CSV/JSON Converter',
    description: 'Parse Excel spreadsheets and convert between XLSX, CSV, and JSON formats entirely in the browser using SheetJS. Upload XLSX to preview and export as CSV or JSON.',
    keywords: ['xlsx converter', 'excel to csv', 'json converter', 'spreadsheet parser', 'csv converter', 'data format converter'],
    tags: ['Data', 'Converter', 'Developer'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'json-flattener',
    title: 'JSON to CSV / Excel Flattener',
    description: 'Flatten nested JSON objects into a tabular format suitable for CSV/Excel export. Supports dot-notation keys, array expansion, and configurable separators.',
    keywords: ['json flattener', 'nested json to csv', 'json table converter', 'flatten json', 'json to excel', 'json transformer'],
    tags: ['Data', 'Converter', 'Developer'],
    category: 'Developer',
    icon: '🔧',
    uiClass: 'ready'
  },
  {
    id: 'sql-json-generator',
    title: 'SQL ↔ JSON / INSERT Generator',
    description: 'Generate SQL INSERT statements from JSON data, or convert SQL queries to JSON format. Supports MySQL/PostgreSQL syntax with configurable table names and column selection.',
    keywords: ['sql generator', 'json to sql', 'insert statement generator', 'sql converter', 'database query builder', 'json database export'],
    tags: ['Data', 'Converter', 'Developer'],
    category: 'Developer',
    icon: '🗃️',
    uiClass: 'ready'
  },
  {
    id: 'chart-graph-maker',
    title: 'Chart / Graph Maker (Bar/Line/Pie)',
    description: 'Build bar, line, and pie charts from pasted data with live preview. Customize colors, sizes, and export as PNG/SVG. Renders with Canvas API — no external libraries needed.',
    keywords: ['chart maker', 'graph generator', 'bar chart', 'line chart', 'pie chart', 'data visualization', 'canvas chart'],
    tags: ['Data', 'Visualizer', 'Developer'],
    category: 'Developer',
    icon: '📈',
    uiClass: 'ready'
  },
  {
    id: 'geojson-viewer',
    title: 'GeoJSON Viewer & Editor',
    description: 'View and edit GeoJSON data on an interactive Leaflet map. Add, modify, delete points, lines, and polygons with live preview. Export modified GeoJSON.',
    keywords: ['geojson viewer', 'map editor', 'geospatial', 'leaflet', 'polygon editor', 'point editor', 'line editor'],
    tags: ['Data', 'Map', 'Developer'],
    category: 'Developer',
    icon: '🗺️',
    uiClass: 'ready'
  },
  {
    id: 'protobuf-decoder',
    title: 'Protobuf / MessagePack Decoder',
    description: 'Decode Protocol Buffers and MessagePack binary data into readable JSON. Paste hex or base64 encoded protobuf/MessagePack bytes to inspect the structure.',
    keywords: ['protobuf decoder', 'messagepack decoder', 'binary parser', 'protocol buffers', 'binary serialization'],
    tags: ['Data', 'Decoder', 'Developer'],
    category: 'Developer',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'data-uri-inspector',
    title: 'Data URI / Blob Inspector',
    description: 'Decode and preview data URIs (data:image/png;base64,...) or blob URLs. Inspect metadata, view images, download files — all in your browser.',
    keywords: ['data uri inspector', 'blob inspector', 'decode data uri', 'preview base64 image', 'data url decoder'],
    tags: ['Data', 'Decoder', 'Developer'],
    category: 'Developer',
    icon: '🔎',
    uiClass: 'ready'
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter (Offline Rates)',
    description: 'Convert between 30+ world currencies with built-in exchange rates. Works fully offline — no API needed. Override rates manually for custom conversions.',
    keywords: ['currency converter', 'exchange rate calculator', 'money converter', 'offline currency', 'forex calculator'],
    tags: ['Finance', 'Converter', 'Calculator'],
    category: 'Finance & Calculators',
    icon: '💱',
    uiClass: 'ready'
  },
  {
    id: 'loan-calculator',
    title: 'Loan / Auto Payment Calculator',
    description: 'Calculate monthly payments, total interest, and amortization schedule for car loans and personal loans. Visualize your payoff timeline.',
    keywords: ['loan calculator', 'auto payment calculator', 'amortization schedule', 'car loan calculator', 'mortgage calculator'],
    tags: ['Finance', 'Calculator'],
    category: 'Finance & Calculators',
    icon: '🏦',
    uiClass: 'ready'
  },
  {
    id: 'salary-calculator',
    title: 'Salary / Hourly / Take-Home Calculator',
    description: 'Convert between hourly, monthly, and annual salaries. Calculate take-home pay after federal taxes and FICA deductions.',
    keywords: ['salary calculator', 'hourly to salary converter', 'take home pay calculator', 'net income calculator', 'tax calculator'],
    tags: ['Finance', 'Calculator'],
    category: 'Finance & Calculators',
    icon: '💰',
    uiClass: 'ready'
  },
  {
    id: 'crypto-profit-dca',
    title: 'Crypto Profit / DCA Calculator',
    description: 'Track dollar-cost-averaged crypto purchases and calculate total profit, ROI, and cost basis.',
    keywords: ['crypto calculator', 'dca calculator', 'cost basis calculator', 'bitcoin profit calculator', 'portfolio return'],
    tags: ['Finance', 'Calculator'],
    category: 'Finance & Calculators',
    icon: '📈',
    uiClass: 'ready'
  },
  {
    id: 'invoice-generator',
    title: 'Invoice / Quote Generator (PDF)',
    description: 'Create professional invoices and quotes with your branding, then export as PDF.',
    keywords: ['invoice generator', 'quote creator', 'PDF invoice', 'business document', 'billing'],
    tags: ['Finance', 'Generator'],
    category: 'Finance & Calculators',
    icon: '📄',
    uiClass: 'ready'
  },
  {
    id: 'percentage-discount-calc',
    title: 'Percentage & Discount Calculator',
    description: 'All-in-one percentage math toolkit — calculate percentages, discounts, increases, and comparisons.',
    keywords: ['percentage calculator', 'discount calculator', 'percent off', 'percentage increase', 'percentage of'],
    tags: ['Finance', 'Calculator'],
    category: 'Finance & Calculators',
    icon: '🔢',
    uiClass: 'ready'
  },
  {
    id: 'calorie-macro-calc',
    title: 'Calorie / Macro & Recipe Calculator',
    description: 'Calculate daily calorie and macro targets, or compute nutrition per serving for recipes.',
    keywords: ['calorie calculator', 'macro calculator', 'nutrition calculator', 'recipe nutrition', 'protein carbs fat'],
    tags: ['Health', 'Calculator'],
    category: 'Health & Lifestyle',
    icon: '🥗',
    uiClass: 'ready'
  },
  {
    id: 'sleep-cycle-calc',
    title: 'Sleep Cycle / Bedtime Calculator',
    description: 'Calculate optimal bedtimes based on your wake-up time and sleep cycle science (90-min cycles).',
    keywords: ['sleep calculator', 'bedtime calculator', 'wake up time', 'sleep cycles', 'when to go to bed'],
    tags: ['Health', 'Calculator'],
    category: 'Health & Lifestyle',
    icon: '🌙',
    uiClass: 'ready'
  },
  {
    id: 'diceware-passphrase',
    title: 'Diceware Passphrase Generator',
    description: 'Generate strong, memorable passphrases using the Diceware method with a curated wordlist.',
    keywords: ['passphrase generator', 'diceware', 'password generator', 'strong password', 'mnemonic phrase'],
    tags: ['Security', 'Generator'],
    category: 'Security, Network & Productivity',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'totp-2fa-generator',
    title: 'TOTP / 2FA Code Generator',
    description: 'Generate time-based one-time passwords (TOTP) from a secret key for offline two-factor authentication.',
    keywords: ['2FA generator', 'authenticator code', 'TOTP', 'two factor auth', 'offline authenticator'],
    tags: ['Security', 'Generator'],
    category: 'Security, Network & Productivity',
    icon: '🔐',
    uiClass: 'ready'
  },
  {
    id: 'dns-whois-header',
    title: 'DNS / Whois / Header Lookup',
    description: 'Inspect DNS records, HTTP response headers, and domain information using public APIs.',
    keywords: ['dns lookup', 'whois lookup', 'header inspector', 'domain lookup', 'network tools'],
    tags: ['Network', 'Inspector'],
    category: 'Security, Network & Productivity',
    icon: '🌐',
    uiClass: 'ready'
  },
  {
    id: 'kanban-markdown-board',
    title: 'Kanban / Markdown Note Board (LocalStorage)',
    description: 'Offline task board with markdown notes, drag-and-drop columns, and LocalStorage persistence.',
    keywords: ['kanban board', 'task manager', 'markdown notes', 'offline board', 'todo list'],
    tags: ['Productivity', 'Board'],
    category: 'Security, Network & Productivity',
    icon: '📋',
    uiClass: 'ready'
  },
];

// --- IN-TOOL AD RELEVANCE STANDARD ---
// Every tool view renders one contextual ad (see mountToolAd in main.js). To
// keep ads relevant to the tool the user opened, we resolve a set of
// buyer-intent "topics" per tool. Relevance is resolved as:
//     tool.adTopics  (optional per-tool override)
//   || AD_TOPICS_BY_CATEGORY[tool.category]
// The topic strings are surfaced as on-page caption text next to the ad unit,
// which (a) gives the AdSense contextual engine tool-specific signals to match
// inventory against and (b) doubles as the visible "Ads related to …" label.
// Keep one entry here for every category used in TOOLS above.
export const AD_TOPICS_BY_CATEGORY = {
  Graphics:    { label: 'design & photo',          topics: ['photo editing software', 'graphic design tools', 'stock photo subscriptions', 'online print services'] },
  Audio:       { label: 'audio & media',           topics: ['audio editing software', 'transcription services', 'podcast hosting', 'studio headphones'] },
  Text:        { label: 'writing & documents',      topics: ['document scanning apps', 'grammar checkers', 'note-taking apps', 'translation services'] },
  Developer:   { label: 'developer tools',          topics: ['cloud hosting', 'API platforms', 'developer laptops', 'online coding courses'] },
  Security:    { label: 'privacy & security',       topics: ['password managers', 'VPN services', 'encrypted cloud storage', 'antivirus software'] },
  Calculators: { label: 'finance & productivity',   topics: ['budgeting apps', 'online banking', 'productivity software', 'financial planning'] },
};

// Fallback used when a tool's category has no registry entry.
const AD_TOPICS_FALLBACK = { label: 'apps & software', topics: ['online tools', 'web apps', 'productivity software'] };

// Resolve the ad context (visible label + contextual topics) for a tool.
export function resolveAdContext(tool) {
  const base = (tool && AD_TOPICS_BY_CATEGORY[tool.category]) || AD_TOPICS_FALLBACK;
  const topics = (tool && Array.isArray(tool.adTopics) && tool.adTopics.length)
    ? tool.adTopics
    : base.topics;
  return { label: base.label, topics };
}
