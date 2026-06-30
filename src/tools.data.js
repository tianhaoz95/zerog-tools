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
  }
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
