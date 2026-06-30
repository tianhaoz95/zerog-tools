// --- TOOLS DATA DEFINITION ---
// Single source of truth for tool metadata. Imported by the runtime app
// (src/main.js) and by the build script (scripts/postbuild.js) to generate
// per-tool pre-rendered pages, Open Graph images, and the sitemap.
export const TOOLS = [
  {
    id: 'passport-photo',
    title: 'AI Passport Photo Generator',
    description: 'Upload a portrait, remove the background with AI, align with official biometric guides, crop, and download single photos or a print-ready 4x6" sheet.',
    keywords: ['passport', 'photo', 'crop', 'background removal', 'face detection', 'resize', 'biometric', 'visa', 'id card', 'remove bg', 'portrait'],
    category: 'Graphics',
    icon: '👤',
    uiClass: 'ready'
  },
  {
    id: 'ai-face-swap',
    title: 'AI Deep Face Swap',
    description: 'Upload a source face and a target base scene, and swap the face client-side using AI landmark alignment and seamless color blending.',
    keywords: ['face swap', 'deepfake', 'face copy', 'face replace', 'ai face', 'portrait edit', 'morph face'],
    category: 'Graphics',
    icon: '🎭',
    uiClass: 'ready'
  },
  {
    id: 'image-vectorizer',
    title: 'PNG to SVG Vectorizer',
    description: 'Trace bitmap images (PNG, JPEG, WebP) into scalable vector graphics (SVG) using color edge contours, or rasterize SVGs back to PNG.',
    keywords: ['png to svg', 'svg to png', 'vectorize', 'trace image', 'raster', 'vector', 'convert image', 'svg converter'],
    category: 'Graphics',
    icon: '📐',
    uiClass: 'ready'
  },
  {
    id: 'audio-transcriber',
    title: 'AI Audio Transcriber',
    description: 'Record audio or upload voice files (.mp3, .wav, .m4a) and transcribe them locally using OpenAI\'s Whisper speech-to-text model.',
    keywords: ['transcribe', 'whisper', 'audio to text', 'speech to text', 'voice recorder', 'audio transcribe', 'speech transcriber'],
    category: 'Audio',
    icon: '🎙️',
    uiClass: 'ready'
  },
  {
    id: 'file-encrypter',
    title: 'File Encrypter & Decrypter',
    description: 'Encrypt any file locally using secure military-grade AES-256-GCM encryption with password-derived keys.',
    keywords: ['encrypt file', 'decrypt file', 'aes-256-gcm', 'security', 'crypto', 'password protect', 'private file', 'vault'],
    category: 'Security',
    icon: '🔐',
    uiClass: 'ready'
  },
  {
    id: 'ocr-scanner',
    title: 'AI Document OCR Scanner',
    description: 'Extract editable text from scanned documents, receipts, and images using in-browser optical character recognition.',
    keywords: ['ocr', 'text extract', 'read text', 'scan document', 'image to text', 'tesseract', 'extract text'],
    category: 'Text',
    icon: '📄',
    uiClass: 'ready'
  },
  {
    id: 'password-gen',
    title: 'Secure Password Generator',
    description: 'Generate strong, customizable passwords client-side with strength analysis and local safety verification.',
    keywords: ['password', 'generator', 'security', 'hash', 'passphrase', 'random string', 'credential'],
    category: 'Security',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Beautify, minify, validate, and compare JSON documents with syntax highlighting and tree view analysis.',
    keywords: ['json', 'format', 'minify', 'validate', 'beautify', 'syntax highlight', 'parse', 'prettify'],
    category: 'Developer',
    icon: '⚙️',
    uiClass: 'ready'
  },
  {
    id: 'qr-tool',
    title: 'QR Code Generator & Scanner',
    description: 'Generate QR codes from text inputs or scan QR codes from uploaded images locally in your browser.',
    keywords: ['qr code', 'barcode', 'scan qr', 'generate qr', 'reader', 'decoder', 'encoder'],
    category: 'Developer',
    icon: '📱',
    uiClass: 'ready'
  },
  {
    id: 'base64-tool',
    title: 'Base64 Encoder & Decoder',
    description: 'Encode plain text and files to Base64 format or decode Base64 data strings back to their original formats.',
    keywords: ['base64', 'encode text', 'decode base64', 'base64 file', 'btoa', 'atob', 'developer'],
    category: 'Developer',
    icon: '💾',
    uiClass: 'ready'
  },
  {
    id: 'markdown-tool',
    title: 'Markdown Live Previewer',
    description: 'Live-preview markdown formatting and convert markdown documents into HTML code structure instantly.',
    keywords: ['markdown', 'preview', 'html converter', 'md to html', 'markup', 'editor'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'url-tool',
    title: 'URL Encoder & Decoder',
    description: 'Encode URL payloads, decode query parameters, or parse query parameters into an editable grid table.',
    keywords: ['url encode', 'url decode', 'query parameter', 'uri component', 'parse url'],
    category: 'Developer',
    icon: '🔗',
    uiClass: 'ready'
  },
  {
    id: 'csv-json-tool',
    title: 'CSV <-> JSON Converter',
    description: 'Convert CSV table strings into structured JSON object arrays and compile JSON arrays back to CSV structures.',
    keywords: ['csv to json', 'json to csv', 'flat file', 'data table', 'converter', 'comma separated'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer & Format Converter',
    description: 'Resize image dimensions by pixels or aspect ratio and convert formats between PNG, JPEG, and WebP.',
    keywords: ['resize image', 'image converter', 'png to jpg', 'jpg to webp', 'dimensions', 'crop scale'],
    category: 'Graphics',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'pdf-tool',
    title: 'PDF Merger & Splitter',
    description: 'Merge multiple PDF documents together or extract specific page ranges from a PDF document.',
    keywords: ['merge pdf', 'split pdf', 'combine pdf', 'extract page', 'pdf tools', 'file editor'],
    category: 'Developer',
    icon: '📂',
    uiClass: 'ready'
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Explainer',
    description: 'Input patterns and text strings to test matches, highlights, and inspect capture group collections.',
    keywords: ['regex', 'regular expression', 'regex test', 'pattern match', 'explain regex', 'capture group'],
    category: 'Developer',
    icon: '🔬',
    uiClass: 'ready'
  },
  {
    id: 'diff-checker',
    title: 'Diff Checker & Text Comparator',
    description: 'Compare two text versions side-by-side or inline to highlight character-level additions and deletions.',
    keywords: ['diff', 'compare text', 'text diff', 'version compare', 'lcs algorithm', 'difference checker'],
    category: 'Text',
    icon: '⚖️',
    uiClass: 'ready'
  },
  {
    id: 'hash-generator',
    title: 'Hash & Checksum Generator',
    description: 'Generate cryptographic checksums (MD5, SHA-1, SHA-256, SHA-512) for text blocks or files locally.',
    keywords: ['hash', 'checksum', 'md5', 'sha-256', 'sha-512', 'sha-1', 'file integrity', 'digest'],
    category: 'Security',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'svg-editor',
    title: 'SVG Path Visualizer',
    description: 'Input raw SVG path d strings to visualize, resize, scale, or customize stroke and fill values.',
    keywords: ['svg path', 'svg visualizer', 'path d', 'vector canvas', 'vector draw'],
    category: 'Graphics',
    icon: '🖌️',
    uiClass: 'ready'
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert metrics across categories: Length, Weight, Temperature, and Digital Storage Byte sizes.',
    keywords: ['convert units', 'metric', 'imperial', 'celsius fahrenheit', 'bytes to gb', 'length weight'],
    category: 'Text',
    icon: '⚖️',
    uiClass: 'ready'
  },
  {
    id: 'color-picker',
    title: 'Color Palette & WCAG Checker',
    description: 'Pick colors, extract primary palette swatches from files, and check accessibility contrast ratios.',
    keywords: ['color picker', 'palette extract', 'wcag contrast', 'accessibility checker', 'contrast ratio', 'hex code'],
    category: 'Graphics',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'epoch-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix epochs (seconds/milliseconds) to human-readable datetime formats and vice-versa.',
    keywords: ['unix timestamp', 'epoch converter', 'unix time', 'date to timestamp', 'seconds since epoch'],
    category: 'Developer',
    icon: '⏱️',
    uiClass: 'ready'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Debugger & Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) headers and payloads locally with zero server calls.',
    keywords: ['jwt decode', 'json web token', 'jwt header', 'jwt payload', 'jwt signature', 'token decoder'],
    category: 'Security',
    icon: '🔑',
    uiClass: 'ready'
  },
  {
    id: 'uuid-generator',
    title: 'UUID & ULID Generator',
    description: 'Generate bulk random RFC 4122 UUID v4 or lexicographically sortable ULID strings client-side.',
    keywords: ['uuid generator', 'ulid generator', 'uuid v4', 'unique id', 'random strings', 'bulk generate'],
    category: 'Developer',
    icon: '🆔',
    uiClass: 'ready'
  },
  {
    id: 'lorem-generator',
    title: 'Lorem Ipsum & Mock Data Generator',
    description: 'Generate customizable mock paragraphs, sentences, or structured user profile JSON arrays.',
    keywords: ['lorem ipsum', 'placeholder text', 'mock user data', 'random profile', 'json dummy data'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'sql-formatter',
    title: 'SQL Formatter & Minifier',
    description: 'Prettify SQL queries with standard indentation or minify query statements client-side.',
    keywords: ['format sql', 'minify sql', 'sql beautify', 'database queries', 'sql formatter'],
    category: 'Developer',
    icon: '🗄️',
    uiClass: 'ready'
  },
  {
    id: 'cron-descriptor',
    title: 'Cron Expression Descriptor',
    description: 'Parse cron schedule strings into human explanations and view the next 5 execution times.',
    keywords: ['cron parser', 'cron expression', 'schedule timing', 'cron descriptor', 'next run times'],
    category: 'Developer',
    icon: '⏰',
    uiClass: 'ready'
  },
  {
    id: 'html-encoder',
    title: 'HTML Entity Encoder & Decoder',
    description: 'Encode characters into safe HTML entities or decode entities back to plain text strings.',
    keywords: ['html entities', 'entity encode', 'entity decode', 'escape html', 'unescape html'],
    category: 'Developer',
    icon: '🔣',
    uiClass: 'ready'
  },
  {
    id: 'ascii-generator',
    title: 'ASCII Art Generator',
    description: 'Generate clean text banners in stylized ASCII block characters locally.',
    keywords: ['ascii art', 'text banner', 'text to ascii', 'figlet', 'ascii block font'],
    category: 'Graphics',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'ua-parser',
    title: 'User Agent Parser & Client Info',
    description: 'Parse browser agent details, screen resolutions, hardware status, and permissions locally.',
    keywords: ['user agent', 'client details', 'screen size', 'viewport info', 'browser diagnostics'],
    category: 'Developer',
    icon: '💻',
    uiClass: 'ready'
  },
  {
    id: 'text-analyzer',
    title: 'Text Analyzer & Word Counter',
    description: 'Count words, characters, sentences, paragraphs, speaking speed, and analyze keyword densities.',
    keywords: ['word counter', 'character count', 'reading time', 'keyword density', 'text diagnostics'],
    category: 'Text',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'ai-sentiment',
    title: 'AI Sentiment & Emotion Analyzer',
    description: 'Analyze text emotional sentiments and tones entirely in your browser using local AI classification models.',
    keywords: ['sentiment analysis', 'emotion classifier', 'text tone', 'positive negative', 'mood analysis', 'ai tone'],
    category: 'Text',
    icon: '🎭',
    uiClass: 'ready'
  },
  {
    id: 'ai-translator',
    title: 'AI Language Translator',
    description: 'Translate paragraphs between English, French, and German 100% locally in your browser.',
    keywords: ['translate text', 'language translator', 'local translation', 'english french', 'english german', 't5 translator'],
    category: 'Text',
    icon: '🗣️',
    uiClass: 'ready'
  },
  {
    id: 'ai-detector',
    title: 'AI Object Detector & Image Classifier',
    description: 'Upload images to detect objects, draw bounding boxes, and label classifications 100% locally.',
    keywords: ['object detection', 'image classifier', 'draw bounding box', 'yolo object detector', 'image labeler', 'ai vision'],
    category: 'Graphics',
    icon: '👁️',
    uiClass: 'ready'
  },
  {
    id: 'bg-remover',
    title: 'AI Background Remover',
    description: 'Upload any image and erase its background instantly with the RMBG-1.4 AI model. Export a transparent PNG or recolor the backdrop, 100% locally.',
    keywords: ['remove background', 'background remover', 'rmbg', 'transparent png', 'cutout', 'remove bg', 'erase background', 'image matting', 'isnet'],
    category: 'Graphics',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'image-upscaler',
    title: 'AI Image Upscaler & Super-Resolution',
    description: 'Upscale and sharpen low-resolution images 2x or 4x with the Swin2SR super-resolution AI model. Recover detail from small photos, 100% locally in your browser.',
    keywords: ['upscale image', 'super resolution', 'super-resolution', 'enhance image', 'increase resolution', 'sharpen', 'swin2sr', 'image enlarger', 'ai upscaler', 'upscale photo', 'denoise', 'restore image'],
    category: 'Graphics',
    icon: '🔬',
    uiClass: 'ready'
  },
  {
    id: 'video-bg-swap',
    title: 'AI Video Background Swap',
    description: 'Upload a short clip and replace its background with a solid color or your own image using the MODNet matting AI, 100% locally. Exports a WebM video.',
    keywords: ['video background', 'green screen', 'chroma key', 'background swap', 'replace background', 'modnet', 'video matting', 'virtual background', 'remove video background'],
    category: 'Graphics',
    icon: '🎬',
    uiClass: 'ready'
  },
  {
    id: 'ev-gas-calculator',
    title: 'EV vs Gas Car Cost Calculator',
    description: 'Compare the total cost of owning an electric car versus a gas car. Models purchase price, fuel/electricity, maintenance, and shows lifetime savings plus a break-even point, 100% locally.',
    keywords: ['electric car', 'gas car', 'ev vs gas', 'total cost of ownership', 'tco', 'car cost', 'fuel savings', 'break even', 'mpg', 'kwh', 'ev calculator', 'gasoline', 'electricity cost'],
    category: 'Calculators',
    icon: '🔋',
    uiClass: 'ready'
  },
  {
    id: 'ai-summarizer',
    title: 'AI Text Summarizer',
    description: 'Summarize articles or transcripts, extract key bullet points, and adjust summary length locally in your browser using local AI models.',
    keywords: ['summarize', 'text summary', 'summarizer', 'extract points', 'local ai', 'article summary', 't5'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'ai-semantic-search',
    title: 'AI Semantic Search & Explorer',
    description: 'Paste text documents and search through them using natural language queries by semantic concept instead of raw keywords, 100% locally.',
    keywords: ['semantic search', 'embeddings', 'text match', 'similarity search', 'concept search', 'local ai', 'vector search'],
    category: 'Developer',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'audio-trimmer',
    title: 'Audio Waveform Editor & Trimmer',
    description: 'Upload audio files, visualize their waveforms in real-time, trim segments, apply volume fades, and export/download the audio locally.',
    keywords: ['trim audio', 'crop audio', 'audio editor', 'waveform', 'mp3 trimmer', 'wav cutter', 'fade audio'],
    category: 'Audio',
    icon: '✂️',
    uiClass: 'ready'
  },
  {
    id: 'pdf-signer',
    title: 'PDF Signer & Form Annotator',
    description: 'Upload any PDF document, draw or type your signature, annotate fields, position them dynamically on pages, and save the signed PDF.',
    keywords: ['sign pdf', 'signature', 'annotate pdf', 'fill form', 'pdf-lib', 'write on pdf', 'pdf editor'],
    category: 'Developer',
    icon: '✍️',
    uiClass: 'ready'
  },
  {
    id: 'exif-stripper',
    title: 'EXIF Metadata Inspector & Stripper',
    description: 'Inspect hidden metadata (camera settings, capture timestamps, GPS coordinates) in your photos and strip them for complete privacy.',
    keywords: ['exif metadata', 'strip exif', 'remove metadata', 'gps metadata', 'photo location', 'image details', 'privacy photo'],
    category: 'Security',
    icon: '📷',
    uiClass: 'ready'
  },
  {
    id: 'css-layout-builder',
    title: 'Interactive Flexbox & CSS Grid Builder',
    description: 'Visually construct flexbox or grid layouts. Add grid items, set padding, gaps, alignments, and output ready-to-use HTML/CSS code.',
    keywords: ['flexbox', 'css grid', 'layout generator', 'visual designer', 'css builder', 'frontend tool', 'responsive'],
    category: 'Developer',
    icon: '📐',
    uiClass: 'ready'
  },
  {
    id: 'api-client',
    title: 'REST API Client & Request Tester',
    description: 'Test HTTP requests (GET, POST, etc.) with custom headers and body payloads, view formatted responses, and generate code snippets client-side.',
    keywords: ['api tester', 'rest client', 'postman', 'fetch request', 'http request', 'api debugger', 'cors test'],
    category: 'Developer',
    icon: '⚡',
    uiClass: 'ready'
  },
  {
    id: 'pdf-image-converter',
    title: 'Image-to-PDF & PDF-to-Image Converter',
    description: 'Combine multiple images with drag-and-drop ordering into a single PDF, or render and extract PDF pages as high-resolution PNG images.',
    keywords: ['image to pdf', 'pdf to image', 'convert images', 'extract pdf pages', 'png to pdf', 'pdf to png', 'pdf converter'],
    category: 'Graphics',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'mortgage-calculator',
    title: 'Home Mortgage & Amortization Dashboard',
    description: 'Calculate monthly home loan payments, simulate extra repayment impacts, and view interactive amortization charts and schedule tables.',
    keywords: ['mortgage calculator', 'amortization schedule', 'home loan', 'interest principal', 'financial chart', 'loan calculator'],
    category: 'Calculators',
    icon: '🏠',
    uiClass: 'ready'
  },
  {
    id: 'pomodoro-space',
    title: 'Pomodoro Space & Ambient Soundscape',
    description: 'A study/work productivity station combining Pomodoro time blocks with customizable ambient background audio mixing.',
    keywords: ['pomodoro timer', 'ambient sound', 'lofi focus', 'productivity timer', 'study space', 'audio mixer', 'white noise'],
    category: 'Calculators',
    icon: '🍅',
    uiClass: 'ready'
  },
  {
    id: 'morse-code',
    title: 'Morse Code Translator & Player',
    description: 'Translate text to Morse code, play it as audio using Web Audio, or flash the screen, and decode Morse code back to text.',
    keywords: ['morse code', 'translator', 'audio player', 'cw', 'telegraph', 'morse decoder', 'sound generator'],
    category: 'Developer',
    icon: '📻',
    uiClass: 'ready'
  },
  {
    id: 'text-to-speech',
    title: 'AI Text-to-Speech (TTS) Reader',
    description: 'Convert text to speech locally using browser Synthesis voices, with speed, pitch controls and text word highlighting.',
    keywords: ['text to speech', 'tts', 'speech reader', 'speak text', 'read aloud', 'voice synthesizer'],
    category: 'Audio',
    icon: '🗣️',
    uiClass: 'ready'
  },
  {
    id: 'media-recorder',
    title: 'Screen & Camera Recorder',
    description: 'Record your screen, webcam, or a browser tab with audio locally using the MediaRecorder API, with local preview and WebM download.',
    keywords: ['screen recorder', 'webcam recorder', 'record video', 'video recorder', 'capture screen', 'media recorder'],
    category: 'Graphics',
    icon: '📹',
    uiClass: 'ready'
  },
  {
    id: 'keyboard-tester',
    title: 'Key Event & Keyboard Tester',
    description: 'Interactive keyboard interface to test keystrokes and inspect detailed JavaScript keyboard event properties in real-time.',
    keywords: ['keyboard test', 'key events', 'keycode', 'key checker', 'keyboard diagnostic', 'event listener'],
    category: 'Developer',
    icon: '⌨️',
    uiClass: 'ready'
  },
  {
    id: 'svg-converter',
    title: 'SVG to CSS & DataURI Converter',
    description: 'Convert raw SVG code into inline CSS backgrounds, raw HTML DataURIs, JSX components, and copy them instantly.',
    keywords: ['svg to css', 'datauri', 'svg converter', 'base64 svg', 'urlencode svg', 'inline svg', 'jsx svg'],
    category: 'Developer',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter & Validator',
    description: 'Validate, prettify, format, or minify XML documents with syntax highlighting, indentation adjustment, and tree view.',
    keywords: ['xml format', 'xml validator', 'prettify xml', 'xml tree', 'xml beautifier', 'format xml', 'minify xml'],
    category: 'Developer',
    icon: '📑',
    uiClass: 'ready'
  },
  {
    id: 'base-converter',
    title: 'Number Base Converter',
    description: 'Convert numbers between Binary, Octal, Decimal, Hexadecimal, and any custom base (2-36) with step-by-step math.',
    keywords: ['base converter', 'binary to hex', 'dec to bin', 'number base', 'radix', 'hex converter'],
    category: 'Developer',
    icon: '🔢',
    uiClass: 'ready'
  },
  {
    id: 'css-glassmorphism',
    title: 'CSS Glassmorphism & Shadow Builder',
    description: 'Visually design glassmorphic components and layered shadows, customize blur, opacity, borders, and copy CSS snippets.',
    keywords: ['glassmorphism', 'css shadow', 'box shadow generator', 'glassmorphic CSS', 'visual designer', 'neon shadow'],
    category: 'Developer',
    icon: '💎',
    uiClass: 'ready'
  },
  {
    id: 'case-converter',
    title: 'Text Case & List Converter',
    description: 'Convert text casing (camelCase, snake_case, PascalCase, kebab-case, title case) or format lists into JSON arrays, CSV, or bullet points.',
    keywords: ['case converter', 'text case', 'camelcase', 'snake_case', 'list formatter', 'list converter', 'title case'],
    category: 'Text',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'aspect-ratio-calc',
    title: 'Aspect Ratio & PPI Calculator',
    description: 'Calculate aspect ratio scaling, downscaling/upscaling dimensions, and find screen Pixels Per Inch (PPI) density.',
    keywords: ['aspect ratio', 'ppi calculator', 'dpi calculator', 'screen density', 'image scaling', 'resolution calculator'],
    category: 'Calculators',
    icon: '📏',
    uiClass: 'ready'
  },
  {
    id: 'color-blindness',
    title: 'Color Blindness Simulator',
    description: 'Upload images and simulate various color vision deficiencies like Deuteranopia, Protanopia, and Tritanopia locally on a canvas.',
    keywords: ['color blindness', 'color blind simulation', 'daltonism', 'deuteranopia', 'protanopia', 'tritanopia', 'accessibility'],
    category: 'Graphics',
    icon: '👁️‍🗨️',
    uiClass: 'ready'
  },
  {
    id: 'tone-generator',
    title: 'Audio Tone & Noise Generator',
    description: 'Generate pure audio tones (sine, square, sawtooth, triangle waves) or focus noise colors (white, pink, brownian) locally using Web Audio.',
    keywords: ['tone generator', 'noise generator', 'white noise', 'frequency generator', 'audio test', 'sine wave'],
    category: 'Audio',
    icon: '🔊',
    uiClass: 'ready'
  },
  {
    id: 'subnet-calculator',
    title: 'IP Subnet & CIDR Calculator',
    description: 'Parse IP addresses and CIDR notations to calculate subnets, network ranges, broadcast addresses, and usable host counts.',
    keywords: ['subnet calculator', 'cidr calculator', 'ip range', 'netmask', 'network range', 'ip address'],
    category: 'Developer',
    icon: '🌐',
    uiClass: 'ready'
  },
  {
    id: 'pixel-tester',
    title: 'Dead Pixel Tester & Fixer',
    description: 'Diagnose dead screen pixels using high-contrast fullscreen colors, and run a fast-flashing repair cycle to unstick stuck pixels.',
    keywords: ['dead pixel', 'pixel fixer', 'stuck pixel', 'screen test', 'monitor test', 'color flash'],
    category: 'Graphics',
    icon: '📺',
    uiClass: 'ready'
  },
  {
    id: 'sketchpad',
    title: 'Paint Canvas & Sketchpad',
    description: 'A canvas sketchpad to draw with brushes, colors, opacity, shapes, undo/redo logs, and export high-quality transparent PNGs.',
    keywords: ['sketchpad', 'paint canvas', 'drawing tool', 'draw online', 'doodle', 'vector sketch'],
    category: 'Graphics',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'hex-viewer',
    title: 'Binary File Hex Dump Viewer',
    description: 'Upload files of any size to inspect their byte-by-byte hexadecimal contents and ASCII character representation locally.',
    keywords: ['hex dump', 'hex viewer', 'binary viewer', 'file bytes', 'hex inspector', 'file reader'],
    category: 'Developer',
    icon: '💾',
    uiClass: 'ready'
  },
  {
    id: 'tip-calculator',
    title: 'Tip & Bill Split Calculator',
    description: 'Calculate tip percentages, split bills among multiple people with custom tax rates, rounding options, and unequal individual split shares.',
    keywords: ['tip calculator', 'split bill', 'bill splitter', 'restaurant tip', 'dinner split', 'finance utility'],
    category: 'Calculators',
    icon: '💵',
    uiClass: 'ready'
  },
  {
    id: 'life-progress',
    title: 'Life Progress & Biorhythm Chart',
    description: 'Visualize your age in detail, track life progress metrics (day, month, year, lifetime), and chart physical, emotional, and intellectual biorhythms.',
    keywords: ['life progress', 'biorhythm', 'age calculator', 'life timer', 'biorhythm chart', 'productivity tracking'],
    category: 'Calculators',
    icon: '⏳',
    uiClass: 'ready'
  },
  {
    id: 'graphing-calc',
    title: 'Scientific & Graphing Calculator',
    description: 'Solve scientific math operations and plot 2D mathematical functions dynamically on a canvas coordinate system.',
    keywords: ['scientific calculator', 'graphing calculator', 'plot math', 'math solver', 'function plotter', 'calculator'],
    category: 'Calculators',
    icon: '🧮',
    uiClass: 'ready'
  },
  {
    id: 'password-analyzer',
    title: 'Password Strength & Entropy Analyzer',
    description: 'Analyze passwords for character sets, length, dictionary entropy bits, and estimate cracking time under different computing speeds.',
    keywords: ['password strength', 'entropy analyzer', 'password security', 'crack time', 'password safety', 'brute force estimate'],
    category: 'Security',
    icon: '🛡️',
    uiClass: 'ready'
  },
  {
    id: 'luhn-validator',
    title: 'Credit Card Luhn Validator',
    description: 'Validate credit card numbers locally, detect card network issuers, and verify Luhn algorithm checksums.',
    keywords: ['luhn algorithm', 'credit card validator', 'card check', 'validate card', 'card issuer'],
    category: 'Security',
    icon: '💳',
    uiClass: 'ready'
  },
  {
    id: 'binary-translator',
    title: 'Binary to Text Translator',
    description: 'Convert plain text into binary code (0s and 1s) and decode binary back to legible text characters.',
    keywords: ['binary translator', 'text to binary', 'binary to text', 'ascii binary', 'decode binary'],
    category: 'Developer',
    icon: '🔢',
    uiClass: 'ready'
  },
  {
    id: 'color-palette-gen',
    title: 'Color Palette & Contrast Evaluator',
    description: 'Generate analogous, complementary, or triadic color schemes from a seed, and evaluate WCAG contrast ratios.',
    keywords: ['color palette', 'palette generator', 'contrast checker', 'wcag contrast', 'color schemes', 'color wheel'],
    category: 'Graphics',
    icon: '🎨',
    uiClass: 'ready'
  },
  {
    id: 'lorem-markdown',
    title: 'Lorem Ipsum Markdown Generator',
    description: 'Generate structured dummy paragraphs, lists, headers, code blocks, blockquotes, and tables in Markdown format.',
    keywords: ['lorem markdown', 'markdown generator', 'dummy text', 'placeholder markdown', 'md generator'],
    category: 'Text',
    icon: '📝',
    uiClass: 'ready'
  },
  {
    id: 'user-flowchart',
    title: 'Visual Flowchart & Diagram Maker',
    description: 'Design interactive node charts and logic diagrams from simple text rules (e.g. A -> B) rendered to SVG diagrams.',
    keywords: ['flowchart maker', 'diagram generator', 'text to diagram', 'graph visualizer', 'mermaid lite', 'svg flowchart'],
    category: 'Developer',
    icon: '📊',
    uiClass: 'ready'
  },
  {
    id: 'metronome-tapper',
    title: 'BPM Tapper & Audio Metronome',
    description: 'Tap along to measure tempo in beats per minute, or play customizable metronome click rates using Web Audio.',
    keywords: ['bpm tapper', 'metronome', 'bpm counter', 'audio click', 'tempo tap', 'music tuner'],
    category: 'Audio',
    icon: '🥁',
    uiClass: 'ready'
  },
  {
    id: 'caesar-cipher',
    title: 'Caesar & ROT13 Cipher Encoder',
    description: 'Encrypt or decrypt messages using Caesar shifts and ROT13 ciphers, with live key adjustment sliders.',
    keywords: ['caesar cipher', 'rot13', 'cipher encode', 'text encrypt', 'rot13 cipher', 'substitution cipher'],
    category: 'Security',
    icon: '🕵️',
    uiClass: 'ready'
  },
  {
    id: 'timezone-converter',
    title: 'Global Time Zone Converter',
    description: 'Compare hours across multiple global time zones visually using interactive 24-hour slider sliders.',
    keywords: ['timezone converter', 'world clock', 'time zones', 'timezone slider', 'time comparison'],
    category: 'Calculators',
    icon: '🗺️',
    uiClass: 'ready'
  },
  {
    id: 'date-calculator',
    title: 'Date Difference & Addition Calculator',
    description: 'Calculate the exact intervals in days/weeks/months/years between two dates, or add/subtract days from a calendar day.',
    keywords: ['date calculator', 'date difference', 'add days', 'days between dates', 'time calculator'],
    category: 'Calculators',
    icon: '📅',
    uiClass: 'ready'
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate savings growth over time with monthly additions and compound frequencies, plotted on a canvas bar chart.',
    keywords: ['compound interest', 'investment calculator', 'savings calculator', 'finance growth', 'growth chart'],
    category: 'Calculators',
    icon: '📈',
    uiClass: 'ready'
  },
  {
    id: 'tdee-calculator',
    title: 'BMI & TDEE Health Calculator',
    description: 'Calculate your BMI, BMR, and TDEE calorie requirements, with protein/carb/fat macro split recommendations.',
    keywords: ['tdee calculator', 'bmr calculator', 'bmi calculator', 'calorie needs', 'macros calculator'],
    category: 'Calculators',
    icon: '🥗',
    uiClass: 'ready'
  },
  {
    id: 'sort-list',
    title: 'List Sorter & Deduplicator',
    description: 'Clean up text lists by sorting alphabetically/numerically, shuffling, removing duplicate lines, or removing empty gaps.',
    keywords: ['list sorter', 'deduplicate list', 'shuffle lines', 'sort text', 'clean list'],
    category: 'Text',
    icon: '🔤',
    uiClass: 'ready'
  },
  {
    id: 'json-yaml-converter',
    title: 'JSON, YAML & CSV Converter',
    description: 'Convert structured config files between JSON, YAML, and CSV tables, client-side, in real-time.',
    keywords: ['json to yaml', 'yaml to json', 'json to csv', 'csv to json', 'format converter'],
    category: 'Developer',
    icon: '🔄',
    uiClass: 'ready'
  },
  {
    id: 'device-info',
    title: 'WebAPI & Device Tester',
    description: 'Run compatibility checks for modern WebAPIs (Bluetooth, USB, Gamepad, Battery) and view detailed system characteristics.',
    keywords: ['device info', 'webapi support', 'battery level', 'hardware tests', 'browser capabilities'],
    category: 'Developer',
    icon: '🖥️',
    uiClass: 'ready'
  },
  {
    id: 'stopwatch-lap',
    title: 'Precision Stopwatch & Lap Log',
    description: 'Track elapsed time with millisecond precision, log laps in a grid table, and download results as a CSV spreadsheet.',
    keywords: ['stopwatch', 'lap timer', 'split timer', 'chronometer', 'timer csv'],
    category: 'Calculators',
    icon: '⏱️',
    uiClass: 'ready'
  },
  {
    id: 'html-wysiwyg',
    title: 'Visual HTML WYSIWYG Editor',
    description: 'Edit formatted text in a rich text visual editor and extract clean, responsive HTML markup instantly.',
    keywords: ['wysiwyg editor', 'rich text', 'html editor', 'visual editor', 'generate html'],
    category: 'Text',
    icon: '🌐',
    uiClass: 'ready'
  },
  {
    id: 'css-gradient-mesh',
    title: 'CSS Gradient Builder',
    description: 'Design linear or radial CSS gradients, add custom color stops on a visual slider, and copy CSS rules.',
    keywords: ['css gradient', 'gradient maker', 'color stops', 'linear-gradient', 'radial-gradient'],
    category: 'Developer',
    icon: '🌈',
    uiClass: 'ready'
  },
  {
    id: 'svg-path-viewer',
    title: 'SVG Path Visualizer & Grid Editor',
    description: 'Paste SVG path d="..." attributes to draw them on an interactive grid, scale dimensions, and export clean SVGs.',
    keywords: ['svg path', 'path visualizer', 'svg editor', 'path d', 'vector paths'],
    category: 'Graphics',
    icon: '🗺️',
    uiClass: 'ready'
  },
  {
    id: 'guitar-tuner',
    title: 'Microphone Instrument & Guitar Tuner',
    description: 'Tune your musical instruments via microphone inputs using real-time pitch detection and a visual needle scale.',
    keywords: ['guitar tuner', 'pitch detector', 'instrument tuner', 'frequency counter', 'chromatic tuner'],
    category: 'Audio',
    icon: '🎸',
    uiClass: 'ready'
  },
  {
    id: 'speed-reader',
    title: 'Focus Speed Reader',
    description: 'Read text using Rapid Serial Visual Presentation (RSVP), flashing words at customizable speeds (WPM) to increase focus.',
    keywords: ['speed reader', 'rsvp reading', 'wpm speed', 'focus reading', 'spritz reader'],
    category: 'Text',
    icon: '⚡',
    uiClass: 'ready'
  },
  {
    id: 'mime-inspector',
    title: 'File MIME Magic Byte Inspector',
    description: 'Inspect uploaded files using hex magic byte signatures to identify their true extension and MIME-type classification.',
    keywords: ['mime inspector', 'magic bytes', 'file signature', 'identify file', 'file type hex'],
    category: 'Security',
    icon: '🔍',
    uiClass: 'ready'
  },
  {
    id: 'sql-playground',
    title: 'SQL Query Playground & Sandbox',
    description: 'Execute basic SQL commands (CREATE, INSERT, SELECT) on mock, in-memory table structures to test queries.',
    keywords: ['sql playground', 'sql database', 'sandbox sql', 'learn sql', 'mock database'],
    category: 'Developer',
    icon: '💾',
    uiClass: 'ready'
  },
  {
    id: 'hash-verifier',
    title: 'File Checksum & Hash Verifier',
    description: 'Generate cryptographic hashes (MD5, SHA-256) of uploaded files locally and compare them to verify file integrity.',
    keywords: ['checksum', 'file hash', 'sha256 file', 'md5 file', 'file verification'],
    category: 'Security',
    icon: '🛡️',
    uiClass: 'ready'
  },
  {
    id: 'lorem-pixel',
    title: 'SVG Placeholder Image Generator',
    description: 'Generate customizable placeholder images with custom dimensions, labels, and colors, and copy the inline SVG.',
    keywords: ['placeholder image', 'lorem pixel', 'svg placeholder', 'image generator', 'design placeholder'],
    category: 'Graphics',
    icon: '🖼️',
    uiClass: 'ready'
  },
  {
    id: 'ratio-solver',
    title: 'Ratio & Proportion Solver',
    description: 'Solve proportions (A:B = C:D) for missing variables, scale dimensions, and simplify ratio proportions.',
    keywords: ['ratio solver', 'proportion', 'solve ratio', 'math ratio', 'scale dimensions'],
    category: 'Calculators',
    icon: '⚖️',
    uiClass: 'ready'
  }
];
