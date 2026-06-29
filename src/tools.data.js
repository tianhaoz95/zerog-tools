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
  }
];
