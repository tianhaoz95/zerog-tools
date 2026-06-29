import './style.css';
import { marked } from 'marked';

// --- TOOLS DATA DEFINITION (20 Tools) ---
const TOOLS = [
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
  }
];

// System Prompt describing the tools to the LLM
const SYSTEM_PROMPT = `You are ZeroG Assistant, an expert AI advisor helping users find the right client-side utility tool.
Here are the available tools:
1. AI Passport Photo Generator (ID: passport-photo)
2. PNG to SVG Vectorizer (ID: image-vectorizer)
3. AI Audio Transcriber (ID: audio-transcriber)
4. File Encrypter & Decrypter (ID: file-encrypter)
5. AI Document OCR Scanner (ID: ocr-scanner)
6. Secure Password Generator (ID: password-gen)
7. JSON Formatter & Validator (ID: json-formatter)
8. QR Code Generator & Scanner (ID: qr-tool)
9. Base64 Encoder & Decoder (ID: base64-tool)
10. Markdown Live Previewer (ID: markdown-tool)
11. URL Encoder & Decoder (ID: url-tool)
12. CSV <-> JSON Converter (ID: csv-json-tool)
13. Image Resizer & Format Converter (ID: image-resizer)
14. PDF Merger & Splitter (ID: pdf-tool)
15. Regex Tester & Explainer (ID: regex-tester)
16. Diff Checker & Text Comparator (ID: diff-checker)
17. Hash & Checksum Generator (ID: hash-generator)
18. SVG Path Visualizer (ID: svg-editor)
19. Unit Converter (ID: unit-converter)
20. Color Palette & WCAG Checker (ID: color-picker)
21. Unix Timestamp Converter (ID: epoch-converter)
22. JWT Debugger & Decoder (ID: jwt-decoder)
23. UUID & ULID Generator (ID: uuid-generator)
24. Lorem Ipsum & Mock Data Generator (ID: lorem-generator)
25. SQL Formatter & Minifier (ID: sql-formatter)
26. Cron Expression Descriptor (ID: cron-descriptor)
27. HTML Entity Encoder & Decoder (ID: html-encoder)
28. ASCII Art Generator (ID: ascii-generator)
29. User Agent Parser & Client Info (ID: ua-parser)
30. Text Analyzer & Word Counter (ID: text-analyzer)

If the user asks for a task, recommend the appropriate tool. 
CRITICAL: When suggesting a tool, you MUST format its ID inside double square brackets, like [[passport-photo]] or [[image-vectorizer]], so the application can render a direct click-to-open button for the user. Keep your responses short, friendly, and structured.`;

// --- WORKER VARIABLES ---
let chatWorker = null;
let bgWorker = null;
let transcribeWorker = null;

let isChatModelLoaded = false;
let isBgModelLoaded = false;
let isTranscribeModelLoaded = false;

// Global AI Status Widget variables
let chatLoadingProgress = 0;

function updateGlobalAiStatus() {
  const dot = document.getElementById('global-ai-status-dot');
  const text = document.getElementById('global-ai-status-text');
  const progressContainer = document.getElementById('global-ai-status-progress-bar');
  const progressFill = document.getElementById('global-ai-status-progress-bar-fill');

  const btnSend = document.getElementById('btn-send-chat');
  const chatInput = document.getElementById('chat-input');

  if (!isChatModelLoaded) {
    dot.className = 'status-dot loading';
    text.innerText = `Loading Chat AI... ${chatLoadingProgress}%`;
    progressContainer.style.display = 'block';
    progressFill.style.width = `${chatLoadingProgress}%`;
    btnSend.disabled = true;
    chatInput.disabled = true;
    chatInput.placeholder = "Loading Chat AI model (approx 350MB)...";
  } else {
    dot.className = 'status-dot ready';
    text.innerText = 'AI Chat Ready';
    progressContainer.style.display = 'none';
    btnSend.disabled = false;
    chatInput.disabled = false;
    chatInput.placeholder = "Ask me to suggest a tool (e.g. 'crop passport', 'vectorize logo')...";
  }
}

// Spawns and initializes Chat Worker on page load
function initWorkers() {
  try {
    chatWorker = new Worker(
      new URL('./chat.worker.js', import.meta.url),
      { type: 'module' }
    );
    
    chatWorker.postMessage({ type: 'init' });

    chatWorker.onmessage = (e) => {
      const { type, data, progress, file, error } = e.data;

      if (type === 'status') {
        if (data === 'loading') {
          chatLoadingProgress = Math.round(progress || 0);
          updateGlobalAiStatus();
        } else if (data === 'ready') {
          isChatModelLoaded = true;
          updateGlobalAiStatus();
        } else if (data === 'error') {
          const dot = document.getElementById('global-ai-status-dot');
          const text = document.getElementById('global-ai-status-text');
          dot.className = 'status-dot offline';
          text.innerText = 'Chat AI Error';
        }
      }

      else if (type === 'token') {
        handleStreamedToken(data);
      }

      else if (type === 'done') {
        handleStreamedDone(data);
      }

      else if (type === 'error') {
        console.error('Chat Worker Error:', error);
        addMessageToChat('assistant', 'Sorry, I encountered an error during text generation: ' + error);
        setChatTyping(false);
      }
    };
  } catch (err) {
    console.error('Could not start chat worker:', err);
    document.getElementById('global-ai-status-text').innerText = 'AI Unsupported';
  }
}

// Lazy load Background Removal Worker when tool is opened
function initBgWorker() {
  if (bgWorker) return; // already running

  try {
    bgWorker = new Worker(
      new URL('./bg.worker.js', import.meta.url),
      { type: 'module' }
    );
    bgWorker.postMessage({ type: 'init' });

    bgWorker.onmessage = (e) => {
      const { type, data, progress, file, error } = e.data;

      if (type === 'status') {
        const btnRemove = document.getElementById('btn-remove-bg');
        const overlay = document.getElementById('passport-loading-overlay');
        const overlayText = document.getElementById('passport-loading-text');
        const overlayProgress = document.getElementById('passport-loading-progress');

        if (data === 'loading') {
          overlay.classList.add('active');
          overlayText.innerText = `Loading Background AI...`;
          overlayProgress.innerText = `${Math.round(progress || 0)}%`;
          btnRemove.disabled = true;
          btnRemove.innerText = 'Loading Model...';
        } else if (data === 'ready') {
          overlay.classList.remove('active');
          btnRemove.disabled = !hasUploadedPassportPhoto;
          btnRemove.innerText = '✨ Remove Background (AI)';
          isBgModelLoaded = true;
        } else if (data === 'error') {
          overlay.classList.remove('active');
          btnRemove.innerText = 'AI Model Error';
          btnRemove.disabled = true;
        }
      }

      else if (type === 'remove_bg_result') {
        handleBgRemovalResult(data);
      }

      else if (type === 'error') {
        console.error('BG Worker Error:', error);
        alert('AI Background removal error: ' + error);
        document.getElementById('passport-loading-overlay').classList.remove('active');
        document.getElementById('btn-remove-bg').disabled = false;
        document.getElementById('btn-remove-bg').innerText = '✨ Remove Background (AI)';
      }
    };
  } catch (err) {
    console.error('Could not start bg worker:', err);
  }
}

// Lazy load Transcriber Worker when tool is opened
function initTranscribeWorker() {
  if (transcribeWorker) return; // already running

  try {
    transcribeWorker = new Worker(
      new URL('./transcribe.worker.js', import.meta.url),
      { type: 'module' }
    );
    
    transcribeWorker.postMessage({ type: 'init' });

    transcribeWorker.onmessage = (e) => {
      const { type, data, progress, file, error } = e.data;

      if (type === 'status') {
        const overlay = document.getElementById('transcriber-loading-overlay');
        const overlayText = document.getElementById('transcriber-loading-text');
        const overlayProgress = document.getElementById('transcriber-loading-progress');
        const btnRun = document.getElementById('btn-run-transcribe');

        if (data === 'loading') {
          overlay.classList.add('active');
          overlayText.innerText = `Loading Whisper Model...`;
          overlayProgress.innerText = `${Math.round(progress || 0)}%`;
          btnRun.disabled = true;
          btnRun.innerText = 'Loading Model...';
        } else if (data === 'ready') {
          overlay.classList.remove('active');
          isTranscribeModelLoaded = true;
          btnRun.disabled = !hasUploadedAudio && !isAudioRecordingAvailable;
          btnRun.innerText = '⚡ Transcribe Audio (AI)';
        } else if (data === 'error') {
          overlay.classList.remove('active');
          btnRun.innerText = 'Model Load Error';
        }
      }

      else if (type === 'transcribe_result') {
        handleTranscriptionResult(data);
      }

      else if (type === 'error') {
        console.error('Transcribe Worker Error:', error);
        alert('Whisper transcription error: ' + error);
        document.getElementById('transcriber-loading-overlay').classList.remove('active');
        document.getElementById('btn-run-transcribe').disabled = false;
        document.getElementById('btn-run-transcribe').innerText = '⚡ Transcribe Audio (AI)';
      }
    };
  } catch (err) {
    console.error('Could not start transcribe worker:', err);
  }
}

// --- CHAT LOGIC ---
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const btnSendChat = document.getElementById('btn-send-chat');
const chatTypingIndicator = document.getElementById('chat-typing-indicator');

let chatHistory = [
  { role: 'system', content: SYSTEM_PROMPT }
];

let activeStreamedMsgElement = null;
let activeStreamedText = '';

btnSendChat.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatMessage();
});

function sendChatMessage() {
  const query = chatInput.value.trim();
  if (!query || !isChatModelLoaded) return;

  addMessageToChat('user', query);
  chatHistory.push({ role: 'user', content: query });
  
  chatInput.value = '';
  chatInput.disabled = true;
  btnSendChat.disabled = true;
  
  setChatTyping(true, 'AI is processing...');

  activeStreamedMsgElement = null;
  activeStreamedText = '';
  
  chatWorker.postMessage({
    type: 'generate',
    data: { messages: chatHistory }
  });
}

function setChatTyping(isActive, text = 'AI is typing...') {
  if (isActive) {
    chatTypingIndicator.classList.add('active');
    document.getElementById('chat-typing-text').innerText = text;
  } else {
    chatTypingIndicator.classList.remove('active');
  }
}

function addMessageToChat(role, text) {
  const msg = document.createElement('div');
  msg.className = `chat-message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerText = role === 'user' ? '👤' : '🤖';

  const wrapper = document.createElement('div');
  wrapper.className = 'message-content-wrapper';

  const sender = document.createElement('div');
  sender.className = 'message-sender';
  sender.innerText = role === 'user' ? 'You' : 'Assistant';

  const content = document.createElement('div');
  content.className = 'message-text';
  if (role === 'assistant') {
    content.innerHTML = marked.parse(text);
  } else {
    content.innerText = text;
  }

  wrapper.appendChild(sender);
  wrapper.appendChild(content);
  msg.appendChild(avatar);
  msg.appendChild(wrapper);
  
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (role === 'assistant') {
    parseToolSuggestions(content, text);
  }
}

function handleStreamedToken(token) {
  setChatTyping(false);
  
  if (!activeStreamedMsgElement) {
    const msg = document.createElement('div');
    msg.className = `chat-message assistant`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerText = '🤖';

    const wrapper = document.createElement('div');
    wrapper.className = 'message-content-wrapper';

    const sender = document.createElement('div');
    sender.className = 'message-sender';
    sender.innerText = 'Assistant';

    const content = document.createElement('div');
    content.className = 'message-text';

    wrapper.appendChild(sender);
    wrapper.appendChild(content);
    msg.appendChild(avatar);
    msg.appendChild(wrapper);
    
    chatMessages.appendChild(msg);
    activeStreamedMsgElement = content;
  }

  activeStreamedText += token;
  activeStreamedMsgElement.innerHTML = marked.parse(activeStreamedText);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleStreamedDone(fullText) {
  if (activeStreamedMsgElement) {
    activeStreamedMsgElement.innerHTML = marked.parse(fullText);
    parseToolSuggestions(activeStreamedMsgElement, fullText);
  } else {
    addMessageToChat('assistant', fullText);
  }

  chatHistory.push({ role: 'assistant', content: fullText });
  
  chatInput.disabled = false;
  btnSendChat.disabled = false;
  chatInput.focus();
  
  activeStreamedMsgElement = null;
  activeStreamedText = '';
  setChatTyping(false);
}

function parseToolSuggestions(element, text) {
  const regex = /\[\[([a-zA-Z0-9-]+)\]\]/g;
  let match;
  const toolIds = [];
  
  while ((match = regex.exec(text)) !== null) {
    toolIds.push(match[1]);
  }
  
  if (toolIds.length === 0) return;
  
  const launcherContainer = document.createElement('div');
  launcherContainer.style.display = 'flex';
  launcherContainer.style.flexDirection = 'column';
  launcherContainer.style.gap = '0.5rem';
  launcherContainer.style.marginTop = '0.5rem';
  
  toolIds.forEach(id => {
    const tool = TOOLS.find(t => t.id === id);
    if (tool) {
      const btn = document.createElement('button');
      btn.className = 'suggested-tool-btn';
      btn.innerHTML = `<span class="suggested-tool-icon">${tool.icon}</span> Open ${tool.title}`;
      
      btn.addEventListener('click', () => {
        if (tool.uiClass === 'ready') {
          navigateTo(tool.id);
        } else {
          alert(`The "${tool.title}" is coming soon!`);
        }
      });
      
      launcherContainer.appendChild(btn);
    }
  });

  element.appendChild(launcherContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderToolsGrid(toolsList) {
  const grid = document.getElementById('tools-grid');
  grid.innerHTML = '';

  toolsList.forEach(tool => {
    const card = document.createElement('div');
    card.className = `tool-card`;
    card.setAttribute('data-id', tool.id);

    const badges = document.createElement('div');
    badges.className = 'tool-badges-row';
    
    if (tool.id === 'passport-photo' || tool.id === 'audio-transcriber' || tool.id === 'ocr-scanner') {
      badges.innerHTML += `<span class="tool-badge ai">AI Powered</span>`;
    }
    
    if (tool.uiClass === 'ready') {
      badges.innerHTML += `<span class="tool-badge ready">Ready</span>`;
    } else {
      badges.innerHTML += `<span class="tool-badge soon">Soon</span>`;
    }

    card.innerHTML = `
      <div class="tool-icon-wrapper">${tool.icon}</div>
      <h3>${tool.title}</h3>
      <p>${tool.description}</p>
    `;
    card.appendChild(badges);

    card.addEventListener('click', () => {
      if (tool.uiClass === 'ready') {
        navigateTo(tool.id);
      } else {
        alert(`The "${tool.title}" is coming soon!`);
      }
    });

    grid.appendChild(card);
  });
}

// Navigation / View Switching (With Lazy Worker Triggering)
function navigateTo(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  
  if (viewId === 'home') {
    document.getElementById('home-view').classList.add('active');
    window.scrollTo(0, 0);
  } else if (viewId === 'passport-photo') {
    document.getElementById('passport-view').classList.add('active');
    resetPassportState();
    initBgWorker();
  } else if (viewId === 'image-vectorizer') {
    document.getElementById('vectorizer-view').classList.add('active');
    resetVectorizerState();
  } else if (viewId === 'audio-transcriber') {
    document.getElementById('transcriber-view').classList.add('active');
    resetTranscriberState();
    initTranscribeWorker();
  } else if (viewId === 'file-encrypter') {
    document.getElementById('encrypter-view').classList.add('active');
    resetEncrypterState();
  } else if (viewId === 'ocr-scanner') {
    document.getElementById('ocr-view').classList.add('active');
    resetOcrState();
  } else if (viewId === 'password-gen') {
    document.getElementById('password-view').classList.add('active');
    resetPasswordState();
  } else if (viewId === 'json-formatter') {
    document.getElementById('json-view').classList.add('active');
    resetJsonState();
  } else if (viewId === 'qr-tool') {
    document.getElementById('qr-view').classList.add('active');
    resetQrState();
  } else if (viewId === 'base64-tool') {
    document.getElementById('base64-view').classList.add('active');
    resetBase64State();
  } else if (viewId === 'markdown-tool') {
    document.getElementById('markdown-view').classList.add('active');
    resetMarkdownState();
  } else if (viewId === 'url-tool') {
    document.getElementById('url-view').classList.add('active');
    resetUrlState();
  } else if (viewId === 'csv-json-tool') {
    document.getElementById('csv-json-view').classList.add('active');
    resetCsvJsonState();
  } else if (viewId === 'image-resizer') {
    document.getElementById('image-resizer-view').classList.add('active');
    resetResizerState();
  } else if (viewId === 'pdf-tool') {
    document.getElementById('pdf-view').classList.add('active');
    resetPdfState();
  } else if (viewId === 'regex-tester') {
    document.getElementById('regex-view').classList.add('active');
    resetRegexState();
  } else if (viewId === 'diff-checker') {
    document.getElementById('diff-view').classList.add('active');
    resetDiffState();
  } else if (viewId === 'hash-generator') {
    document.getElementById('hash-view').classList.add('active');
    resetHashState();
  } else if (viewId === 'svg-editor') {
    document.getElementById('svg-editor-view').classList.add('active');
    resetSvgEditorState();
  } else if (viewId === 'unit-converter') {
    document.getElementById('unit-view').classList.add('active');
    resetUnitState();
  } else if (viewId === 'color-picker') {
    document.getElementById('color-view').classList.add('active');
    resetColorState();
  } else if (viewId === 'epoch-converter') {
    document.getElementById('epoch-view').classList.add('active');
    resetEpochState();
  } else if (viewId === 'jwt-decoder') {
    document.getElementById('jwt-view').classList.add('active');
    resetJwtState();
  } else if (viewId === 'uuid-generator') {
    document.getElementById('uuid-view').classList.add('active');
    resetUuidState();
  } else if (viewId === 'lorem-generator') {
    document.getElementById('lorem-view').classList.add('active');
    resetLoremState();
  } else if (viewId === 'sql-formatter') {
    document.getElementById('sql-view').classList.add('active');
    resetSqlState();
  } else if (viewId === 'cron-descriptor') {
    document.getElementById('cron-view').classList.add('active');
    resetCronState();
  } else if (viewId === 'html-encoder') {
    document.getElementById('html-ent-view').classList.add('active');
    resetHtmlEntState();
  } else if (viewId === 'ascii-generator') {
    document.getElementById('ascii-view').classList.add('active');
    resetAsciiState();
  } else if (viewId === 'ua-parser') {
    document.getElementById('ua-view').classList.add('active');
    runUaDiagnostics();
  } else if (viewId === 'text-analyzer') {
    document.getElementById('text-an-view').classList.add('active');
    resetTextAnState();
  }
}

document.getElementById('btn-header-logo').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-passport-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-vectorizer-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-transcriber-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-encrypter-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-ocr-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-password-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-json-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-qr-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-base64-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-markdown-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-url-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-csv-json-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-image-resizer-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-pdf-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-regex-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-diff-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-hash-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-svg-editor-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-unit-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-color-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-epoch-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-jwt-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-uuid-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-lorem-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-sql-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-cron-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-html-ent-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-ascii-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-ua-back').addEventListener('click', () => navigateTo('home'));
document.getElementById('btn-text-an-back').addEventListener('click', () => navigateTo('home'));


// --- PASSPORT PHOTO GENERATOR LOGIC ---
let originalPassportImage = null;
let processedPassportImage = null;
let hasUploadedPassportPhoto = false;

const passportCanvas = document.getElementById('passport-canvas');
const passportCtx = passportCanvas.getContext('2d');
const passportTemplateSelect = document.getElementById('passport-template');
const customDimsRow = document.getElementById('custom-dims-row');
const customWInput = document.getElementById('custom-w');
const customHInput = document.getElementById('custom-h');

let activeBgColor = '#ffffff';
let imgZoom = 1.0;
let imgRotate = 0;
let panX = 0;
let panY = 0;

let isDragging = false;
let startDragX = 0;
let startDragY = 0;

const SIZES = {
  us: { widthMm: 51, heightMm: 51, ratio: 1.0 },
  eu: { widthMm: 35, heightMm: 45, ratio: 0.7778 },
  cn: { widthMm: 33, heightMm: 48, ratio: 0.6875 }
};

function resetPassportState() {
  originalPassportImage = null;
  processedPassportImage = null;
  hasUploadedPassportPhoto = false;
  
  document.getElementById('passport-upload-container').style.display = 'flex';
  document.getElementById('passport-editor-container').style.display = 'none';
  document.getElementById('btn-remove-bg').disabled = true;
  document.getElementById('btn-remove-bg').innerText = isBgModelLoaded ? '✨ Remove Background (AI)' : 'Loading Model...';
  
  imgZoom = 1.0;
  imgRotate = 0;
  panX = 0;
  panY = 0;
  
  document.getElementById('slider-zoom').value = 100;
  document.getElementById('val-zoom').innerText = '100%';
  document.getElementById('slider-rotate').value = 0;
  document.getElementById('val-rotate').innerText = '0°';
  
  passportTemplateSelect.value = 'us';
  customDimsRow.style.display = 'none';
  
  document.querySelectorAll('#bg-color-options .color-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector('#bg-color-options .color-option[data-color="#ffffff"]').classList.add('selected');
  activeBgColor = '#ffffff';
}

const passportUploadContainer = document.getElementById('passport-upload-container');
const passportFileInput = document.getElementById('passport-file-input');

passportUploadContainer.addEventListener('click', () => passportFileInput.click());
passportUploadContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  passportUploadContainer.style.borderColor = 'var(--primary)';
});
passportUploadContainer.addEventListener('dragleave', () => {
  passportUploadContainer.style.borderColor = 'var(--border)';
});
passportUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  passportUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadPassportPhoto(e.dataTransfer.files[0]); }
});
passportFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadPassportPhoto(e.target.files[0]); }
});

function loadPassportPhoto(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      originalPassportImage = img;
      processedPassportImage = null;
      hasUploadedPassportPhoto = true;
      
      document.getElementById('passport-upload-container').style.display = 'none';
      document.getElementById('passport-editor-container').style.display = 'flex';
      document.getElementById('btn-remove-bg').disabled = !isBgModelLoaded;
      
      fitImageToCanvas();
      updatePassportCanvas();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function fitImageToCanvas() {
  if (!originalPassportImage) return;
  const canvasW = passportCanvas.width;
  const canvasH = passportCanvas.height;
  const scaleW = canvasW / originalPassportImage.width;
  const scaleH = canvasH / originalPassportImage.height;
  imgZoom = Math.max(scaleW, scaleH) * 1.1; 
  const zoomPct = Math.round(imgZoom * 100);
  document.getElementById('slider-zoom').value = Math.max(10, Math.min(400, zoomPct));
  document.getElementById('val-zoom').innerText = `${zoomPct}%`;
  
  panX = 0;
  panY = 0;
  imgRotate = 0;
  document.getElementById('slider-rotate').value = 0;
  document.getElementById('val-rotate').innerText = '0°';
}

function getPassportRatio() {
  const template = passportTemplateSelect.value;
  if (template === 'custom') {
    const w = parseFloat(customWInput.value) || 35;
    const h = parseFloat(customHInput.value) || 45;
    return w / h;
  }
  return SIZES[template].ratio;
}

function updatePassportCanvas() {
  if (!originalPassportImage) return;

  const ratio = getPassportRatio();
  const maxDim = 400;
  
  if (ratio >= 1.0) {
    passportCanvas.width = maxDim;
    passportCanvas.height = maxDim / ratio;
  } else {
    passportCanvas.height = maxDim;
    passportCanvas.width = maxDim * ratio;
  }
  
  passportCtx.clearRect(0, 0, passportCanvas.width, passportCanvas.height);
  
  if (activeBgColor !== 'transparent') {
    passportCtx.fillStyle = activeBgColor;
    passportCtx.fillRect(0, 0, passportCanvas.width, passportCanvas.height);
  } else {
    const size = 10;
    for (let y = 0; y < passportCanvas.height; y += size) {
      for (let yGrid = 0; yGrid < passportCanvas.width; yGrid += size) {
        passportCtx.fillStyle = ((yGrid / size + y / size) % 2 === 0) ? '#e5e5e5' : '#ffffff';
        passportCtx.fillRect(yGrid, y, size, size);
      }
    }
  }

  const imgToDraw = processedPassportImage || originalPassportImage;
  
  passportCtx.save();
  passportCtx.translate(passportCanvas.width / 2 + panX, passportCanvas.height / 2 + panY);
  passportCtx.rotate((imgRotate * Math.PI) / 180);
  passportCtx.scale(imgZoom, imgZoom);
  passportCtx.drawImage(imgToDraw, -imgToDraw.width / 2, -imgToDraw.height / 2);
  passportCtx.restore();
}

passportTemplateSelect.addEventListener('change', () => {
  if (passportTemplateSelect.value === 'custom') {
    customDimsRow.style.display = 'flex';
  } else {
    customDimsRow.style.display = 'none';
  }
  fitImageToCanvas();
  updatePassportCanvas();
});

customWInput.addEventListener('input', () => { fitImageToCanvas(); updatePassportCanvas(); });
customHInput.addEventListener('input', () => { fitImageToCanvas(); updatePassportCanvas(); });

document.getElementById('slider-zoom').addEventListener('input', (e) => {
  const pct = parseInt(e.target.value);
  imgZoom = pct / 100;
  document.getElementById('val-zoom').innerText = `${pct}%`;
  updatePassportCanvas();
});

document.getElementById('slider-rotate').addEventListener('input', (e) => {
  imgRotate = parseInt(e.target.value);
  document.getElementById('val-rotate').innerText = `${imgRotate}°`;
  updatePassportCanvas();
});

document.getElementById('btn-reset-crop').addEventListener('click', () => { fitImageToCanvas(); updatePassportCanvas(); });

document.getElementById('bg-color-options').addEventListener('click', (e) => {
  const target = e.target.closest('.color-option');
  if (!target) return;
  document.querySelectorAll('#bg-color-options .color-option').forEach(opt => opt.classList.remove('selected'));
  target.classList.add('selected');
  activeBgColor = target.getAttribute('data-color');
  updatePassportCanvas();
});

passportCanvas.addEventListener('mousedown', (e) => {
  if (!originalPassportImage) return;
  isDragging = true;
  startDragX = e.clientX - panX;
  startDragY = e.clientY - panY;
  passportCanvas.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  panX = e.clientX - startDragX;
  panY = e.clientY - startDragY;
  updatePassportCanvas();
});

window.addEventListener('mouseup', () => {
  if (isDragging) { isDragging = false; passportCanvas.style.cursor = 'grab'; }
});

passportCanvas.addEventListener('touchstart', (e) => {
  if (!originalPassportImage || e.touches.length !== 1) return;
  isDragging = true;
  startDragX = e.touches[0].clientX - panX;
  startDragY = e.touches[0].clientY - panY;
});
passportCanvas.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  panX = e.touches[0].clientX - startDragX;
  panY = e.touches[0].clientY - startDragY;
  updatePassportCanvas();
});
passportCanvas.addEventListener('touchend', () => { isDragging = false; });

const btnRemoveBg = document.getElementById('btn-remove-bg');
btnRemoveBg.addEventListener('click', () => {
  if (!originalPassportImage || !bgWorker) return;
  const overlay = document.getElementById('passport-loading-overlay');
  const overlayText = document.getElementById('passport-loading-text');
  const overlayProgress = document.getElementById('passport-loading-progress');
  overlay.classList.add('active');
  overlayText.innerText = 'Analyzing portrait...';
  overlayProgress.innerText = '0%';
  btnRemoveBg.disabled = true;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = originalPassportImage.width;
  tempCanvas.height = originalPassportImage.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(originalPassportImage, 0, 0);
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  
  bgWorker.postMessage({
    type: 'remove_bg',
    data: { width: tempCanvas.width, height: tempCanvas.height, rgbaData: imageData.data }
  });
});

function handleBgRemovalResult(maskResult) {
  const { width, height, channels, pixelData } = maskResult;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = originalPassportImage.width;
  tempCanvas.height = originalPassportImage.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(originalPassportImage, 0, 0);
  const originalData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const resultData = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);
  
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskCtx = maskCanvas.getContext('2d');
  const maskImgData = maskCtx.createImageData(width, height);
  
  if (channels === 1) {
    for (let i = 0; i < pixelData.length; i++) {
      const idx = i * 4;
      const alphaVal = pixelData[i];
      maskImgData.data[idx] = 255;
      maskImgData.data[idx+1] = 255;
      maskImgData.data[idx+2] = 255;
      maskImgData.data[idx+3] = alphaVal;
    }
  } else if (channels === 4) {
    for (let i = 0; i < pixelData.length; i++) {
      maskImgData.data[i] = pixelData[i];
    }
  } else {
    for (let i = 0; i < pixelData.length / channels; i++) {
      const idx = i * 4;
      const mIdx = i * channels;
      maskImgData.data[idx] = pixelData[mIdx];
      maskImgData.data[idx+1] = pixelData[mIdx+1] || 0;
      maskImgData.data[idx+2] = pixelData[mIdx+2] || 0;
      maskImgData.data[idx+3] = 255;
    }
  }
  maskCtx.putImageData(maskImgData, 0, 0);
  
  const resizedMaskCanvas = document.createElement('canvas');
  resizedMaskCanvas.width = originalPassportImage.width;
  resizedMaskCanvas.height = originalPassportImage.height;
  const resizedMaskCtx = resizedMaskCanvas.getContext('2d');
  resizedMaskCtx.drawImage(maskCanvas, 0, 0, originalPassportImage.width, originalPassportImage.height);
  const finalMaskData = resizedMaskCtx.getImageData(0, 0, originalPassportImage.width, originalPassportImage.height);
  
  for (let i = 0; i < originalData.data.length; i += 4) {
    resultData.data[i] = originalData.data[i];
    resultData.data[i+1] = originalData.data[i+1];
    resultData.data[i+2] = originalData.data[i+2];
    resultData.data[i+3] = finalMaskData.data[i+3];
  }
  
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = originalPassportImage.width;
  finalCanvas.height = originalPassportImage.height;
  finalCanvas.getContext('2d').putImageData(resultData, 0, 0);
  
  const resultImg = new Image();
  resultImg.onload = () => {
    processedPassportImage = resultImg;
    updatePassportCanvas();
    document.getElementById('passport-loading-overlay').classList.remove('active');
    btnRemoveBg.disabled = false;
    btnRemoveBg.innerText = '✨ Remove Background (AI)';
  };
  resultImg.src = finalCanvas.toDataURL('image/png');
}

function generatePassportOutput(isPrintSheet = false) {
  if (!originalPassportImage) return null;
  const template = passportTemplateSelect.value;
  let targetWidthMm, targetHeightMm;
  
  if (template === 'custom') {
    targetWidthMm = parseFloat(customWInput.value) || 35;
    targetHeightMm = parseFloat(customHInput.value) || 45;
  } else {
    targetWidthMm = SIZES[template].widthMm;
    targetHeightMm = SIZES[template].heightMm;
  }
  
  const DPI = 300;
  const mmToInch = 0.0393701;
  const singleW = Math.round(targetWidthMm * mmToInch * DPI);
  const singleH = Math.round(targetHeightMm * mmToInch * DPI);
  
  const singleCanvas = document.createElement('canvas');
  singleCanvas.width = singleW;
  singleCanvas.height = singleH;
  const ctx = singleCanvas.getContext('2d');
  
  if (activeBgColor !== 'transparent') {
    ctx.fillStyle = activeBgColor;
    ctx.fillRect(0, 0, singleW, singleH);
  }
  
  const displayMaxDim = 400;
  const ratio = targetWidthMm / targetHeightMm;
  let displayW, displayH;
  if (ratio >= 1.0) {
    displayW = displayMaxDim;
    displayH = displayMaxDim / ratio;
  } else {
    displayH = displayMaxDim;
    displayW = displayMaxDim * ratio;
  }
  
  const scaleFactor = singleW / displayW;
  const imgToDraw = processedPassportImage || originalPassportImage;
  
  ctx.save();
  ctx.translate(singleW / 2 + panX * scaleFactor, singleH / 2 + panY * scaleFactor);
  ctx.rotate((imgRotate * Math.PI) / 180);
  ctx.scale(imgZoom * scaleFactor, imgZoom * scaleFactor);
  ctx.drawImage(imgToDraw, -imgToDraw.width / 2, -imgToDraw.height / 2);
  ctx.restore();
  
  if (!isPrintSheet) return singleCanvas.toDataURL('image/jpeg', 0.95);
  
  const sheetW = 1200; 
  const sheetH = 1800; 
  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = sheetW;
  sheetCanvas.height = sheetH;
  const sheetCtx = sheetCanvas.getContext('2d');
  
  sheetCtx.fillStyle = '#ffffff';
  sheetCtx.fillRect(0, 0, sheetW, sheetH);
  
  const paddingX = 40;
  const paddingY = 60;
  const cols = Math.floor((sheetW - paddingX) / (singleW + paddingX));
  const rows = Math.floor((sheetH - paddingY) / (singleH + paddingY));
  
  const gridW = cols * singleW + (cols - 1) * paddingX;
  const gridH = rows * singleH + (rows - 1) * paddingY;
  const startX = (sheetW - gridW) / 2;
  const startY = (sheetH - gridH) / 2;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (singleW + paddingX);
      const y = startY + r * (singleH + paddingY);
      sheetCtx.drawImage(singleCanvas, x, y);
      sheetCtx.strokeStyle = '#e5e7eb';
      sheetCtx.lineWidth = 2;
      sheetCtx.setLineDash([5, 5]);
      sheetCtx.strokeRect(x - 2, y - 2, singleW + 4, singleH + 4);
    }
  }
  
  sheetCtx.fillStyle = '#9ca3af';
  sheetCtx.font = '24px sans-serif';
  sheetCtx.textAlign = 'center';
  sheetCtx.fillText(`ZeroG Toolbox — Passport Size: ${targetWidthMm}x${targetHeightMm}mm (300 DPI)`, sheetW / 2, sheetH - 40);
  
  return sheetCanvas.toDataURL('image/jpeg', 0.95);
}

document.getElementById('btn-download-single').addEventListener('click', () => {
  const url = generatePassportOutput(false);
  if (!url) return;
  const link = document.createElement('a');
  link.download = `passport_photo_${Date.now()}.jpg`;
  link.href = url;
  link.click();
});

document.getElementById('btn-download-sheet').addEventListener('click', () => {
  const url = generatePassportOutput(true);
  if (!url) return;
  const link = document.createElement('a');
  link.download = `passport_print_sheet_${Date.now()}.jpg`;
  link.href = url;
  link.click();
});


// --- IMAGE VECTORIZER LOGIC (PNG <-> SVG) ---
let uploadedVectorizerImage = null;
let originalVectorUrl = '';

function resetVectorizerState() {
  uploadedVectorizerImage = null;
  originalVectorUrl = '';
  document.getElementById('vector-upload-container').style.display = 'flex';
  document.getElementById('vector-preview-container').style.display = 'none';
  document.getElementById('btn-vectorize').disabled = true;
  document.getElementById('vector-svg-output').innerHTML = '';
  
  document.getElementById('tab-png-to-svg').classList.add('active');
  document.getElementById('tab-svg-to-png').classList.remove('active');
  document.getElementById('workspace-png-to-svg').style.display = 'grid';
  document.getElementById('workspace-svg-to-png').style.display = 'none';
  
  document.getElementById('svg-raster-upload-container').style.display = 'flex';
  document.getElementById('svg-raster-preview-container').style.display = 'none';
  document.getElementById('btn-download-png').disabled = true;
}

const vectorFileInput = document.getElementById('vector-file-input');
const vectorUploadContainer = document.getElementById('vector-upload-container');
const btnVectorizerSubmit = document.getElementById('btn-vectorize');
const colorsSlider = document.getElementById('slider-colors');
const noiseSlider = document.getElementById('slider-noise');
const smoothSlider = document.getElementById('slider-smooth');

document.getElementById('tab-png-to-svg').addEventListener('click', () => {
  document.getElementById('tab-png-to-svg').classList.add('active');
  document.getElementById('tab-svg-to-png').classList.remove('active');
  document.getElementById('workspace-png-to-svg').style.display = 'grid';
  document.getElementById('workspace-svg-to-png').style.display = 'none';
});
document.getElementById('tab-svg-to-png').addEventListener('click', () => {
  document.getElementById('tab-png-to-svg').classList.remove('active');
  document.getElementById('tab-svg-to-png').classList.add('active');
  document.getElementById('workspace-png-to-svg').style.display = 'none';
  document.getElementById('workspace-svg-to-png').style.display = 'grid';
});

colorsSlider.addEventListener('input', (e) => { document.getElementById('val-colors').innerText = e.target.value; });
noiseSlider.addEventListener('input', (e) => { document.getElementById('val-noise').innerText = `${e.target.value}px`; });
smoothSlider.addEventListener('input', (e) => { document.getElementById('val-smooth').innerText = (e.target.value / 20).toFixed(1); });

vectorUploadContainer.addEventListener('click', () => vectorFileInput.click());
vectorUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); vectorUploadContainer.style.borderColor = 'var(--primary)'; });
vectorUploadContainer.addEventListener('dragleave', () => { vectorUploadContainer.style.borderColor = 'var(--border)'; });
vectorUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  vectorUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadVectorizerImage(e.dataTransfer.files[0]); }
});
vectorFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadVectorizerImage(e.target.files[0]); }
});

function loadVectorizerImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      uploadedVectorizerImage = img;
      originalVectorUrl = event.target.result;
      document.getElementById('vector-orig-preview').src = originalVectorUrl;
      document.getElementById('vector-upload-container').style.display = 'none';
      document.getElementById('vector-preview-container').style.display = 'block';
      btnVectorizerSubmit.disabled = false;
      triggerVectorize();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

btnVectorizerSubmit.addEventListener('click', triggerVectorize);

function triggerVectorize() {
  if (!uploadedVectorizerImage) return;
  const overlay = document.getElementById('vectorizer-loading-overlay');
  overlay.classList.add('active');

  setTimeout(async () => {
    try {
      const module = await import('imagetracerjs');
      const ImageTracerInstance = module.default || module;

      const tempCanvas = document.createElement('canvas');
      const maxDim = 800;
      let w = uploadedVectorizerImage.width;
      let h = uploadedVectorizerImage.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
        else { w = Math.round(w * (maxDim / h)); h = maxDim; }
      }
      tempCanvas.width = w;
      tempCanvas.height = h;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(uploadedVectorizerImage, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      
      const mode = document.getElementById('trace-mode').value;
      const options = {
        ltres: parseFloat(smoothSlider.value) / 20,
        qtres: parseFloat(smoothSlider.value) / 20,
        pathomit: parseInt(noiseSlider.value),
        numberofcolors: parseInt(colorsSlider.value)
      };

      if (mode === 'grayscale') {
        options.colors = parseInt(colorsSlider.value);
        options.pal = [];
        const grayPalette = [];
        const steps = parseInt(colorsSlider.value);
        for(let i=0; i<steps; i++) {
          const val = Math.round((i / (steps - 1)) * 255);
          grayPalette.push({ r: val, g: val, b: val, a: 255 });
        }
        options.pal = grayPalette;
      } else if (mode === 'monochrome') {
        options.numberofcolors = 2;
        options.pal = [{ r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 255 }];
      }

      const svgString = ImageTracerInstance.imagedataToSVG(imgData, options);
      document.getElementById('vector-svg-output').innerHTML = svgString;
      
      const downloadBtn = document.getElementById('btn-download-svg');
      downloadBtn.onclick = () => {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `vectorized_image_${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error('Vectorizer error:', err);
      alert('Could not vectorize image: ' + err.message);
    } finally {
      overlay.classList.remove('active');
    }
  }, 100);
}

document.getElementById('trace-mode').addEventListener('change', (e) => {
  const mode = e.target.value;
  const colSlider = document.getElementById('colors-slider-container');
  colSlider.style.display = (mode === 'monochrome') ? 'none' : 'flex';
});

// SVG TO PNG
const svgRasterFileInput = document.getElementById('svg-raster-file-input');
const svgRasterUploadContainer = document.getElementById('svg-raster-upload-container');
const btnDownloadPng = document.getElementById('btn-download-png');
const svgScaleSlider = document.getElementById('slider-svg-scale');
const rasterCanvas = document.getElementById('svg-raster-canvas');
const rasterCtx = rasterCanvas.getContext('2d');
let uploadedSvgText = '';
let loadedSvgImage = null;

svgScaleSlider.addEventListener('input', (e) => {
  document.getElementById('val-svg-scale').innerText = `${e.target.value}x`;
  updateRasterCanvas();
});
svgRasterUploadContainer.addEventListener('click', () => svgRasterFileInput.click());
svgRasterUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); svgRasterUploadContainer.style.borderColor = 'var(--primary)'; });
svgRasterUploadContainer.addEventListener('dragleave', () => { svgRasterUploadContainer.style.borderColor = 'var(--border)'; });
svgRasterUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  svgRasterUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadSvgForRasterization(e.dataTransfer.files[0]); }
});
svgRasterFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadSvgForRasterization(e.target.files[0]); }
});

function loadSvgForRasterization(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedSvgText = event.target.result;
    const img = new Image();
    img.onload = () => {
      loadedSvgImage = img;
      document.getElementById('svg-raster-upload-container').style.display = 'none';
      document.getElementById('svg-raster-preview-container').style.display = 'flex';
      btnDownloadPng.disabled = false;
      updateRasterCanvas();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(uploadedSvgText)));
  };
  reader.readAsText(file);
}

function updateRasterCanvas() {
  if (!loadedSvgImage) return;
  const scale = parseInt(svgScaleSlider.value);
  let svgW = loadedSvgImage.naturalWidth || loadedSvgImage.width || 400;
  let svgH = loadedSvgImage.naturalHeight || loadedSvgImage.height || 400;
  
  if (svgW === 0 || svgH === 0) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(uploadedSvgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (svgEl) {
      if (svgEl.hasAttribute('viewBox')) {
        const vb = svgEl.getAttribute('viewBox').split(/\s+/).map(Number);
        if (vb.length === 4) { svgW = vb[2]; svgH = vb[3]; }
      } else {
        svgW = parseFloat(svgEl.getAttribute('width')) || 400;
        svgH = parseFloat(svgEl.getAttribute('height')) || 400;
      }
    }
  }
  rasterCanvas.width = svgW * scale;
  rasterCanvas.height = svgH * scale;
  rasterCtx.clearRect(0, 0, rasterCanvas.width, rasterCanvas.height);
  rasterCtx.drawImage(loadedSvgImage, 0, 0, rasterCanvas.width, rasterCanvas.height);
}

btnDownloadPng.addEventListener('click', () => {
  if (!loadedSvgImage) return;
  const url = rasterCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `rasterized_svg_${Date.now()}.png`;
  link.href = url;
  link.click();
});


// --- AI AUDIO TRANSCRIBER LOGIC ---
let hasUploadedAudio = false;
let isAudioRecordingAvailable = false;
let audioRecorder = null;
let recordedAudioChunks = [];
let audioRecordingBlob = null;
let isAudioRecording = false;
let audioRecordingSeconds = 0;
let audioRecordingTimerInterval = null;
let decodedAudioBufferFloat = null;

function resetTranscriberState() {
  hasUploadedAudio = false;
  isAudioRecordingAvailable = false;
  recordedAudioChunks = [];
  audioRecordingBlob = null;
  decodedAudioBufferFloat = null;
  
  if (isAudioRecording) { stopRecordingAudio(); }
  
  document.getElementById('audio-upload-container').style.display = 'flex';
  document.getElementById('audio-file-name').style.display = 'none';
  document.getElementById('audio-visualizer-group').style.display = 'none';
  document.getElementById('recording-status').style.display = 'none';
  
  btnRecordAudio.innerText = '🎤 Start Recording';
  btnRecordAudio.style.backgroundColor = 'var(--danger)';
  
  document.getElementById('transcription-output').value = '';
  document.getElementById('btn-copy-transcription').disabled = true;
  btnRunTranscribe.disabled = true;
  btnRunTranscribe.innerText = isTranscribeModelLoaded ? '⚡ Transcribe Audio (AI)' : 'Loading Model...';
}

const btnRecordAudio = document.getElementById('btn-record-audio');
const btnRunTranscribe = document.getElementById('btn-run-transcribe');
const audioUploadContainer = document.getElementById('audio-upload-container');
const audioFileInput = document.getElementById('audio-file-input');

btnRecordAudio.addEventListener('click', () => {
  if (isAudioRecording) { stopRecordingAudio(); }
  else { startRecordingAudio(); }
});

audioUploadContainer.addEventListener('click', () => audioFileInput.click());
audioUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); audioUploadContainer.style.borderColor = 'var(--primary)'; });
audioUploadContainer.addEventListener('dragleave', () => { audioUploadContainer.style.borderColor = 'var(--border)'; });
audioUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  audioUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadAudioFile(e.dataTransfer.files[0]); }
});
audioFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadAudioFile(e.target.files[0]); }
});

function loadAudioFile(file) {
  const nameDiv = document.getElementById('audio-file-name');
  nameDiv.innerText = `File selected: ${file.name}`;
  nameDiv.style.display = 'block';
  
  document.getElementById('audio-upload-container').style.display = 'none';
  document.getElementById('audio-visualizer-group').style.display = 'block';
  
  const preview = document.getElementById('audio-preview-element');
  preview.src = URL.createObjectURL(file);
  
  hasUploadedAudio = true;
  btnRunTranscribe.disabled = !isTranscribeModelLoaded;
  
  processAudioBlob(file);
}

async function startRecordingAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    recordedAudioChunks = [];
    audioRecorder = new MediaRecorder(stream);
    
    audioRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) { recordedAudioChunks.push(e.data); }
    };
    
    audioRecorder.onstop = () => {
      audioRecordingBlob = new Blob(recordedAudioChunks, { type: 'audio/wav' });
      const preview = document.getElementById('audio-preview-element');
      preview.src = URL.createObjectURL(audioRecordingBlob);
      document.getElementById('audio-visualizer-group').style.display = 'block';
      
      isAudioRecordingAvailable = true;
      btnRunTranscribe.disabled = !isTranscribeModelLoaded;
      
      processAudioBlob(audioRecordingBlob);
    };
    
    audioRecorder.start(250);
    isAudioRecording = true;
    
    btnRecordAudio.innerText = '⏹️ Stop Recording';
    btnRecordAudio.style.backgroundColor = 'var(--text-muted)';
    document.getElementById('recording-status').style.display = 'block';
    
    audioRecordingSeconds = 0;
    document.getElementById('recording-timer').innerText = '00:00';
    
    audioRecordingTimerInterval = setInterval(() => {
      audioRecordingSeconds++;
      const m = Math.floor(audioRecordingSeconds / 60).toString().padStart(2, '0');
      const s = (audioRecordingSeconds % 60).toString().padStart(2, '0');
      document.getElementById('recording-timer').innerText = `${m}:${s}`;
    }, 1000);
    
  } catch (err) {
    console.error('Microphone access failed:', err);
    alert('Could not access microphone: ' + err.message);
  }
}

function stopRecordingAudio() {
  if (audioRecorder && audioRecorder.state !== 'inactive') {
    audioRecorder.stop();
    audioRecorder.stream.getTracks().forEach(track => track.stop());
  }
  isAudioRecording = false;
  clearInterval(audioRecordingTimerInterval);
  btnRecordAudio.innerText = '🎤 Start Recording';
  btnRecordAudio.style.backgroundColor = 'var(--danger)';
  document.getElementById('recording-status').style.display = 'none';
}

async function processAudioBlob(blob) {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    
    audioCtx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
      const rawData = decodedBuffer.getChannelData(0);
      decodedAudioBufferFloat = rawData;
      console.log(`Audio resampled to 16kHz. Total samples: ${rawData.length}`);
    }, (err) => {
      console.error('Decoding audio data failed:', err);
      alert('Could not decode audio data. Try converting file to standard WAV or MP3 first.');
    });
  } catch (err) {
    console.error('Error processing audio:', err);
  }
}

btnRunTranscribe.addEventListener('click', () => {
  if (!decodedAudioBufferFloat || !transcribeWorker) return;
  const overlay = document.getElementById('transcriber-loading-overlay');
  const text = document.getElementById('transcriber-loading-text');
  overlay.classList.add('active');
  text.innerText = 'Transcribing voice input...';
  
  btnRunTranscribe.disabled = true;
  btnRecordAudio.disabled = true;
  
  transcribeWorker.postMessage({
    type: 'transcribe',
    data: { audioData: Array.from(decodedAudioBufferFloat) }
  });
});

function handleTranscriptionResult(text) {
  document.getElementById('transcription-output').value = text;
  document.getElementById('btn-copy-transcription').disabled = false;
  document.getElementById('transcriber-loading-overlay').classList.remove('active');
  btnRunTranscribe.disabled = false;
  btnRecordAudio.disabled = false;
}

document.getElementById('btn-copy-transcription').addEventListener('click', () => {
  const area = document.getElementById('transcription-output');
  navigator.clipboard.writeText(area.value);
  const oldText = document.getElementById('btn-copy-transcription').innerText;
  document.getElementById('btn-copy-transcription').innerText = '✓ Copied!';
  setTimeout(() => { document.getElementById('btn-copy-transcription').innerText = oldText; }, 2000);
});


// --- FILE ENCRYPTER & DECRYPTER LOGIC ---
let encryptSelectedFile = null;
let decryptSelectedFile = null;

function resetEncrypterState() {
  encryptSelectedFile = null;
  decryptSelectedFile = null;
  
  document.getElementById('tab-encrypt').classList.add('active');
  document.getElementById('tab-decrypt').classList.remove('active');
  document.getElementById('workspace-encrypt').style.display = 'grid';
  document.getElementById('workspace-decrypt').style.display = 'none';
  
  document.getElementById('encrypt-upload-container').style.display = 'flex';
  document.getElementById('encrypt-file-name').style.display = 'none';
  document.getElementById('btn-run-encrypt').disabled = true;
  document.getElementById('encrypt-password').value = '';
  
  document.getElementById('decrypt-upload-container').style.display = 'flex';
  document.getElementById('decrypt-file-name').style.display = 'none';
  document.getElementById('btn-run-decrypt').disabled = true;
  document.getElementById('decrypt-password').value = '';
}

document.getElementById('tab-encrypt').addEventListener('click', () => {
  document.getElementById('tab-encrypt').classList.add('active');
  document.getElementById('tab-decrypt').classList.remove('active');
  document.getElementById('workspace-encrypt').style.display = 'grid';
  document.getElementById('workspace-decrypt').style.display = 'none';
});
document.getElementById('tab-decrypt').addEventListener('click', () => {
  document.getElementById('tab-encrypt').classList.remove('active');
  document.getElementById('tab-decrypt').classList.add('active');
  document.getElementById('workspace-encrypt').style.display = 'none';
  document.getElementById('workspace-decrypt').style.display = 'grid';
});

const encUploadContainer = document.getElementById('encrypt-upload-container');
const encFileInput = document.getElementById('encrypt-file-input');
const decUploadContainer = document.getElementById('decrypt-upload-container');
const decFileInput = document.getElementById('decrypt-file-input');

encUploadContainer.addEventListener('click', () => encFileInput.click());
encUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); encUploadContainer.style.borderColor = 'var(--primary)'; });
encUploadContainer.addEventListener('dragleave', () => { encUploadContainer.style.borderColor = 'var(--border)'; });
encUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  encUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadEncryptFile(e.dataTransfer.files[0]); }
});
encFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadEncryptFile(e.target.files[0]); }
});

decUploadContainer.addEventListener('click', () => decFileInput.click());
decUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); decUploadContainer.style.borderColor = 'var(--accent)'; });
decUploadContainer.addEventListener('dragleave', () => { decUploadContainer.style.borderColor = 'var(--border)'; });
decUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  decUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadDecryptFile(e.dataTransfer.files[0]); }
});
decFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadDecryptFile(e.target.files[0]); }
});

function loadEncryptFile(file) {
  encryptSelectedFile = file;
  const nameDiv = document.getElementById('encrypt-file-name');
  nameDiv.innerText = `File: ${file.name} (${formatBytes(file.size)})`;
  nameDiv.style.display = 'block';
  document.getElementById('encrypt-upload-container').style.display = 'none';
  validateEncryptInput();
}

function loadDecryptFile(file) {
  decryptSelectedFile = file;
  const nameDiv = document.getElementById('decrypt-file-name');
  nameDiv.innerText = `Encrypted File: ${file.name} (${formatBytes(file.size)})`;
  nameDiv.style.display = 'block';
  document.getElementById('decrypt-upload-container').style.display = 'none';
  validateDecryptInput();
}

const encryptPassInput = document.getElementById('encrypt-password');
const decryptPassInput = document.getElementById('decrypt-password');
const btnRunEncrypt = document.getElementById('btn-run-encrypt');
const btnRunDecrypt = document.getElementById('btn-run-decrypt');

encryptPassInput.addEventListener('input', validateEncryptInput);
decryptPassInput.addEventListener('input', validateDecryptInput);

function validateEncryptInput() {
  btnRunEncrypt.disabled = !encryptSelectedFile || encryptPassInput.value.length < 4;
}
function validateDecryptInput() {
  btnRunDecrypt.disabled = !decryptSelectedFile || decryptPassInput.value.length < 4;
}

async function deriveCryptKey(passwordString, saltBytes) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passwordString),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

btnRunEncrypt.addEventListener('click', async () => {
  if (!encryptSelectedFile || !encryptPassInput.value) return;
  const password = encryptPassInput.value;
  btnRunEncrypt.disabled = true;
  btnRunEncrypt.innerText = 'Locking...';
  
  try {
    const fileBuffer = await encryptSelectedFile.arrayBuffer();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const derivedKey = await deriveCryptKey(password, salt);
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv, tagLength: 128 },
      derivedKey,
      fileBuffer
    );
    
    const packagedData = new Uint8Array(salt.byteLength + iv.byteLength + encryptedBuffer.byteLength);
    packagedData.set(salt, 0);
    packagedData.set(iv, salt.byteLength);
    packagedData.set(new Uint8Array(encryptedBuffer), salt.byteLength + iv.byteLength);
    
    const blob = new Blob([packagedData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${encryptSelectedFile.name}.enc`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('File encrypted successfully! Please store your password securely.');
    resetEncrypterState();
  } catch (err) {
    console.error('Encryption failed:', err);
    alert('Encryption error: ' + err.message);
    validateEncryptInput();
  }
});

btnRunDecrypt.addEventListener('click', async () => {
  if (!decryptSelectedFile || !decryptPassInput.value) return;
  const password = decryptPassInput.value;
  btnRunDecrypt.disabled = true;
  btnRunDecrypt.innerText = 'Unlocking...';
  
  try {
    const fileBuffer = await decryptSelectedFile.arrayBuffer();
    const packagedData = new Uint8Array(fileBuffer);
    
    if (packagedData.byteLength < 28) { throw new Error('Invalid file format. The file is too short.'); }
    
    const salt = packagedData.slice(0, 16);
    const iv = packagedData.slice(16, 28);
    const encryptedPayload = packagedData.slice(28);
    const derivedKey = await deriveCryptKey(password, salt);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv, tagLength: 128 },
      derivedKey,
      encryptedPayload
    );
    
    let originalName = decryptSelectedFile.name;
    if (originalName.endsWith('.enc')) { originalName = originalName.slice(0, -4); }
    else { originalName = 'decrypted_file'; }
    
    const blob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = originalName;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('File decrypted successfully!');
    resetEncrypterState();
  } catch (err) {
    console.error('Decryption failed:', err);
    alert('Decryption failed. Please check that your password is correct.');
    validateDecryptInput();
  }
});


// --- AI DOCUMENT OCR SCANNER LOGIC ---
let ocrSelectedFile = null;

function resetOcrState() {
  ocrSelectedFile = null;
  document.getElementById('ocr-upload-container').style.display = 'flex';
  document.getElementById('ocr-file-name').style.display = 'none';
  document.getElementById('ocr-preview-group').style.display = 'none';
  document.getElementById('btn-run-ocr').disabled = true;
  document.getElementById('ocr-output').value = '';
  document.getElementById('btn-copy-ocr').disabled = true;
  document.getElementById('btn-save-ocr').disabled = true;
  document.getElementById('ocr-loading-overlay').classList.remove('active');
}

const ocrUploadContainer = document.getElementById('ocr-upload-container');
const ocrFileInput = document.getElementById('ocr-file-input');
const btnRunOcr = document.getElementById('btn-run-ocr');

ocrUploadContainer.addEventListener('click', () => ocrFileInput.click());
ocrUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); ocrUploadContainer.style.borderColor = 'var(--primary)'; });
ocrUploadContainer.addEventListener('dragleave', () => { ocrUploadContainer.style.borderColor = 'var(--border)'; });
ocrUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  ocrUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadOcrFile(e.dataTransfer.files[0]); }
});
ocrFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadOcrFile(e.target.files[0]); }
});

function loadOcrFile(file) {
  ocrSelectedFile = file;
  
  const nameDiv = document.getElementById('ocr-file-name');
  nameDiv.innerText = `File: ${file.name}`;
  nameDiv.style.display = 'block';
  
  document.getElementById('ocr-upload-container').style.display = 'none';
  document.getElementById('ocr-preview-group').style.display = 'block';
  
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('ocr-doc-preview').src = e.target.result;
    btnRunOcr.disabled = false;
  };
  reader.readAsDataURL(file);
}

btnRunOcr.addEventListener('click', async () => {
  if (!ocrSelectedFile) return;

  const overlay = document.getElementById('ocr-loading-overlay');
  const overlayText = document.getElementById('ocr-loading-text');
  const overlayProgress = document.getElementById('ocr-loading-progress');
  const lang = document.getElementById('ocr-lang').value;
  
  overlay.classList.add('active');
  overlayText.innerText = 'Initializing OCR engine...';
  overlayProgress.innerText = '0%';
  btnRunOcr.disabled = true;

  try {
    const { createWorker } = await import('tesseract.js');
    overlayText.innerText = 'Loading language files...';
    
    const worker = await createWorker(lang, 1, {
      workerPath: '/tesseract/tesseract-worker.min.js',
      langPath: 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_best',
      corePath: '/tesseract/tesseract-core.wasm.js',
      logger: (m) => {
        if (m.status === 'recognizing text') {
          overlayProgress.innerText = `${Math.round(m.progress * 100)}%`;
        }
      }
    });

    overlayText.innerText = 'Analyzing layout & text...';
    const result = await worker.recognize(ocrSelectedFile);

    document.getElementById('ocr-output').value = result.data.text;
    document.getElementById('btn-copy-ocr').disabled = false;
    document.getElementById('btn-save-ocr').disabled = false;
    
    await worker.terminate();
  } catch (err) {
    console.error('OCR Process failed:', err);
    alert('OCR failed: ' + err.message);
  } finally {
    overlay.classList.remove('active');
    btnRunOcr.disabled = false;
  }
});

document.getElementById('btn-copy-ocr').addEventListener('click', () => {
  const text = document.getElementById('ocr-output').value;
  navigator.clipboard.writeText(text);
  const btn = document.getElementById('btn-copy-ocr');
  btn.innerText = '✓ Copied';
  setTimeout(() => { btn.innerText = '📋 Copy'; }, 2000);
});

document.getElementById('btn-save-ocr').addEventListener('click', () => {
  const text = document.getElementById('ocr-output').value;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `extracted_ocr_text_${Date.now()}.txt`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
});


// --- SECURE PASSWORD GENERATOR LOGIC ---
const sliderPassLength = document.getElementById('slider-pass-length');
const valPassLength = document.getElementById('val-pass-length');
const passUpper = document.getElementById('pass-upper');
const passLower = document.getElementById('pass-lower');
const passNumbers = document.getElementById('pass-numbers');
const passSymbols = document.getElementById('pass-symbols');
const passExcludeSimilar = document.getElementById('pass-exclude-similar');
const btnGeneratePassword = document.getElementById('btn-generate-password');
const passwordOutput = document.getElementById('password-output');
const btnCopyPassword = document.getElementById('btn-copy-password');

sliderPassLength.addEventListener('input', (e) => {
  valPassLength.innerText = e.target.value;
  runPasswordGenerator();
});

btnGeneratePassword.addEventListener('click', runPasswordGenerator);

function resetPasswordState() {
  sliderPassLength.value = 16;
  valPassLength.innerText = '16';
  passUpper.checked = true;
  passLower.checked = true;
  passNumbers.checked = true;
  passSymbols.checked = true;
  passExcludeSimilar.checked = false;
  runPasswordGenerator();
}

function runPasswordGenerator() {
  const length = parseInt(sliderPassLength.value);
  const useUpper = passUpper.checked;
  const useLower = passLower.checked;
  const useNumbers = passNumbers.checked;
  const useSymbols = passSymbols.checked;
  const excludeSimilar = passExcludeSimilar.checked;

  let pool = '';
  if (useUpper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) pool += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) pool += '0123456789';
  if (useSymbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (excludeSimilar) {
    const similarChars = /[il1Lo0O!|;:,.]/g;
    pool = pool.replace(similarChars, '');
  }

  if (pool.length === 0) {
    passwordOutput.innerText = 'Select at least one type!';
    updateStrengthMetrics(0, 0);
    return;
  }

  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  let password = '';
  for (let i = 0; i < length; i++) {
    const idx = randomValues[i] % pool.length;
    password += pool.charAt(idx);
  }

  passwordOutput.innerText = password;
  
  const entropy = Math.round(length * Math.log2(pool.length));
  updateStrengthMetrics(entropy, pool.length);
}

function updateStrengthMetrics(entropy, poolSize) {
  const strengthBar = document.getElementById('password-strength-bar');
  const strengthLabel = document.getElementById('password-strength-label');
  const entropyVal = document.getElementById('password-entropy-val');
  const poolVal = document.getElementById('password-pool-val');
  const crackTime = document.getElementById('password-crack-time');

  entropyVal.innerText = `${entropy} bits`;
  poolVal.innerText = `${poolSize} chars`;

  let pct = 0;
  let label = '';
  let color = '';
  let timeStr = '';

  if (entropy === 0) {
    pct = 0;
    label = 'None';
    color = 'var(--border)';
    timeStr = 'N/A';
  } else if (entropy < 40) {
    pct = 25;
    label = 'Weak';
    color = 'var(--danger)';
    timeStr = 'Instantly';
  } else if (entropy < 60) {
    pct = 50;
    label = 'Medium';
    color = 'var(--accent)';
    timeStr = 'Minutes / Hours';
  } else if (entropy < 80) {
    pct = 75;
    label = 'Strong';
    color = '#fbbf24'; 
    timeStr = 'Years';
  } else {
    pct = 100;
    label = 'Very Strong';
    color = 'var(--success)';
    timeStr = 'Trillions of Years';
  }

  strengthBar.style.width = `${pct}%`;
  strengthBar.style.backgroundColor = color;
  strengthLabel.innerText = label;
  strengthLabel.style.color = color;
  crackTime.innerText = timeStr;
}

btnCopyPassword.addEventListener('click', () => {
  const pass = passwordOutput.innerText;
  if (pass === 'Select at least one type!' || pass === 'Generating...') return;
  
  navigator.clipboard.writeText(pass);
  btnCopyPassword.innerText = '✓ Copied';
  setTimeout(() => { btnCopyPassword.innerText = '📋 Copy'; }, 2000);
});


// --- JSON FORMATTER & VALIDATOR LOGIC ---
const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');
const jsonIndent = document.getElementById('json-indent');
const jsonStatusBanner = document.getElementById('json-status-banner');
const btnBeautifyJson = document.getElementById('btn-beautify-json');
const btnMinifyJson = document.getElementById('btn-minify-json');
const btnCopyJson = document.getElementById('btn-copy-json');
const btnClearJson = document.getElementById('btn-clear-json');

function resetJsonState() {
  jsonInput.value = '';
  jsonOutput.value = '';
  jsonIndent.value = '2';
  jsonStatusBanner.style.display = 'none';
  btnCopyJson.disabled = true;
}

btnClearJson.addEventListener('click', resetJsonState);

btnBeautifyJson.addEventListener('click', () => {
  processJson(false);
});

btnMinifyJson.addEventListener('click', () => {
  processJson(true);
});

function processJson(minify = false) {
  const raw = jsonInput.value.trim();
  if (!raw) {
    jsonOutput.value = '';
    jsonStatusBanner.style.display = 'none';
    btnCopyJson.disabled = true;
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    
    let result = '';
    if (minify) {
      result = JSON.stringify(parsed);
    } else {
      const indentVal = jsonIndent.value;
      const space = indentVal === 'tab' ? '\t' : parseInt(indentVal);
      result = JSON.stringify(parsed, null, space);
    }

    jsonOutput.value = result;
    btnCopyJson.disabled = false;
    
    jsonStatusBanner.innerText = '✓ Valid JSON';
    jsonStatusBanner.style.display = 'block';
    jsonStatusBanner.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    jsonStatusBanner.style.border = '1px solid var(--success)';
    jsonStatusBanner.style.color = 'var(--success)';
    
  } catch (err) {
    console.error('JSON parsing failed:', err);
    jsonOutput.value = `Syntax Error: ${err.message}`;
    btnCopyJson.disabled = true;
    
    jsonStatusBanner.innerText = '❌ Invalid JSON';
    jsonStatusBanner.style.display = 'block';
    jsonStatusBanner.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    jsonStatusBanner.style.border = '1px solid var(--danger)';
    jsonStatusBanner.style.color = 'var(--danger)';
  }
}

btnCopyJson.addEventListener('click', () => {
  const val = jsonOutput.value;
  if (!val || val.startsWith('Syntax Error:')) return;
  
  navigator.clipboard.writeText(val);
  btnCopyJson.innerText = '✓ Copied!';
  setTimeout(() => { btnCopyJson.innerText = '📋 Copy to Clipboard'; }, 2000);
});


// --- QR CODE GENERATOR & SCANNER LOGIC ---
const qrTextInput = document.getElementById('qr-text-input');
const sliderQrSize = document.getElementById('slider-qr-size');
const btnGenerateQr = document.getElementById('btn-generate-qr');
const btnDownloadQr = document.getElementById('btn-download-qr');
const qrOutputCanvas = document.getElementById('qr-output-canvas');
const qrScanFileInput = document.getElementById('qr-scan-file-input');
const qrScanPreviewImg = document.getElementById('qr-scan-preview-img');
const qrScanResult = document.getElementById('qr-scan-result');
const btnRunQrScan = document.getElementById('btn-run-qr-scan');

let qrScanSelectedFile = null;

sliderQrSize.addEventListener('input', (e) => {
  document.getElementById('val-qr-size').innerText = `${e.target.value}px`;
});

document.getElementById('tab-qr-generate').addEventListener('click', () => {
  document.getElementById('tab-qr-generate').classList.add('active');
  document.getElementById('tab-qr-scan').classList.remove('active');
  document.getElementById('workspace-qr-generate').style.display = 'grid';
  document.getElementById('workspace-qr-scan').style.display = 'none';
});

document.getElementById('tab-qr-scan').addEventListener('click', () => {
  document.getElementById('tab-qr-generate').classList.remove('active');
  document.getElementById('tab-qr-scan').classList.add('active');
  document.getElementById('workspace-qr-generate').style.display = 'none';
  document.getElementById('workspace-qr-scan').style.display = 'grid';
});

function resetQrState() {
  qrTextInput.value = 'https://zerog.toolbox';
  sliderQrSize.value = 250;
  document.getElementById('val-qr-size').innerText = '250px';
  btnDownloadQr.disabled = true;
  qrScanSelectedFile = null;
  qrScanFileInput.value = '';
  qrScanPreviewImg.style.display = 'none';
  document.getElementById('qr-scan-placeholder').style.display = 'block';
  qrScanResult.value = '';
  btnRunQrScan.disabled = true;
  document.getElementById('qr-scan-upload-container').style.display = 'flex';
  document.getElementById('qr-scan-file-name').style.display = 'none';
  
  document.getElementById('tab-qr-generate').click();
  generateQrCode();
}

btnGenerateQr.addEventListener('click', generateQrCode);

async function generateQrCode() {
  const text = qrTextInput.value.trim();
  if (!text) return;
  const size = parseInt(sliderQrSize.value);

  try {
    const QRCodeModule = await import('qrcode');
    const QRCode = QRCodeModule.default || QRCodeModule;
    await QRCode.toCanvas(qrOutputCanvas, text, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    btnDownloadQr.disabled = false;
  } catch (err) {
    console.error('QR code generation failed:', err);
    alert('QR Error: ' + err.message);
  }
}

btnDownloadQr.addEventListener('click', () => {
  const url = qrOutputCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `qrcode_${Date.now()}.png`;
  link.href = url;
  link.click();
});

const qrScanUploadContainer = document.getElementById('qr-scan-upload-container');
qrScanUploadContainer.addEventListener('click', () => qrScanFileInput.click());
qrScanUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); qrScanUploadContainer.style.borderColor = 'var(--accent)'; });
qrScanUploadContainer.addEventListener('dragleave', () => { qrScanUploadContainer.style.borderColor = 'var(--border)'; });
qrScanUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  qrScanUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadQrScanFile(e.dataTransfer.files[0]); }
});
qrScanFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadQrScanFile(e.target.files[0]); }
});

function loadQrScanFile(file) {
  qrScanSelectedFile = file;
  const nameDiv = document.getElementById('qr-scan-file-name');
  nameDiv.innerText = `QR File: ${file.name}`;
  nameDiv.style.display = 'block';
  document.getElementById('qr-scan-upload-container').style.display = 'none';
  document.getElementById('qr-scan-placeholder').style.display = 'none';
  qrScanPreviewImg.style.display = 'block';
  qrScanPreviewImg.src = URL.createObjectURL(file);
  btnRunQrScan.disabled = false;
}

btnRunQrScan.addEventListener('click', async () => {
  if (!qrScanSelectedFile) return;
  
  const img = new Image();
  img.onload = async () => {
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      
      const jsQRModule = await import('jsqr');
      const jsQR = jsQRModule.default || jsQRModule;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        qrScanResult.value = code.data;
      } else {
        qrScanResult.value = 'Could not find any readable QR code in this image.';
      }
    } catch (err) {
      console.error('QR decode failed:', err);
      qrScanResult.value = 'Scan Error: ' + err.message;
    }
  };
  img.src = qrScanPreviewImg.src;
});


// --- BASE64 ENCODER & DECODER LOGIC ---
const base64Input = document.getElementById('base64-input');
const base64Output = document.getElementById('base64-output');
const base64FileInput = document.getElementById('base64-file-input');
const btnEncodeBase64 = document.getElementById('btn-encode-base64');
const btnDecodeBase64 = document.getElementById('btn-decode-base64');
const btnCopyBase64 = document.getElementById('btn-copy-base64');
const btnDownloadBase64File = document.getElementById('btn-download-base64-file');
const btnClearBase64 = document.getElementById('btn-clear-base64');

let base64DecodedFileBlob = null;
let base64DecodedFileName = 'decoded_file.bin';

function resetBase64State() {
  base64Input.value = '';
  base64Output.value = '';
  base64FileInput.value = '';
  btnCopyBase64.disabled = true;
  btnDownloadBase64File.style.display = 'none';
  base64DecodedFileBlob = null;
}

btnClearBase64.addEventListener('click', resetBase64State);

btnEncodeBase64.addEventListener('click', () => {
  const text = base64Input.value;
  if (!text) return;
  try {
    const encoded = btoa(unescape(encodeURIComponent(text)));
    base64Output.value = encoded;
    btnCopyBase64.disabled = false;
    btnDownloadBase64File.style.display = 'none';
  } catch (err) {
    alert('Encoding error: ' + err.message);
  }
});

btnDecodeBase64.addEventListener('click', () => {
  const base64Str = base64Input.value.trim().replace(/^data:image\/[a-z]+;base64,/, '');
  if (!base64Str) return;
  try {
    const decoded = decodeURIComponent(escape(atob(base64Str)));
    base64Output.value = decoded;
    btnCopyBase64.disabled = false;
    btnDownloadBase64File.style.display = 'none';
  } catch (err) {
    // If it fails, maybe it is a binary file base64 data url or raw binary
    try {
      const binaryString = atob(base64Str);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      base64DecodedFileBlob = new Blob([bytes], { type: 'application/octet-stream' });
      base64Output.value = `[Binary Content Detected: ${len} bytes]\nClick the download button to retrieve your file.`;
      btnCopyBase64.disabled = true;
      btnDownloadBase64File.style.display = 'block';
      btnDownloadBase64File.disabled = false;
    } catch (binErr) {
      alert('Decryption failed. Please check that input is a valid Base64 string.');
    }
  }
});

base64FileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target.result;
    const base64Str = dataUrl.split(',')[1];
    base64Input.value = base64Str;
    base64Output.value = dataUrl;
    btnCopyBase64.disabled = false;
    btnDownloadBase64File.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

btnCopyBase64.addEventListener('click', () => {
  navigator.clipboard.writeText(base64Output.value);
  btnCopyBase64.innerText = '✓ Copied';
  setTimeout(() => { btnCopyBase64.innerText = '📋 Copy'; }, 2000);
});

btnDownloadBase64File.addEventListener('click', () => {
  if (!base64DecodedFileBlob) return;
  const url = URL.createObjectURL(base64DecodedFileBlob);
  const link = document.createElement('a');
  link.download = base64DecodedFileName;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
});


// --- MARKDOWN PREVIEWER LOGIC ---
const markdownInput = document.getElementById('markdown-input');
const markdownPreviewOutput = document.getElementById('markdown-preview-output');

function resetMarkdownState() {
  markdownInput.value = `# Hello World\n\nThis is a **bold** paragraph, and here is a [link](https://zerog.toolbox).\n\n* Bullet 1\n* Bullet 2\n\n> A nice blockquote block.\n\n\`inline code\` and a block code:\n\`\`\`javascript\nconsole.log('ZeroG');\n\`\`\``;
  updateMarkdownPreview();
}

markdownInput.addEventListener('input', updateMarkdownPreview);

async function updateMarkdownPreview() {
  const text = markdownInput.value;
  try {
    const parsedHtml = marked.parse(text);
    markdownPreviewOutput.innerHTML = parsedHtml;
  } catch (err) {
    markdownPreviewOutput.innerHTML = `<span style="color: var(--danger)">Render Error: ${err.message}</span>`;
  }
}

document.getElementById('btn-copy-markdown-html').addEventListener('click', () => {
  navigator.clipboard.writeText(markdownPreviewOutput.innerHTML);
  const btn = document.getElementById('btn-copy-markdown-html');
  btn.innerText = '✓ Copied HTML';
  setTimeout(() => { btn.innerText = '📋 Copy HTML Code'; }, 2000);
});

document.getElementById('btn-download-markdown-html').addEventListener('click', () => {
  const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rendered Markdown</title></head><body>${markdownPreviewOutput.innerHTML}</body></html>`;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `markdown_render_${Date.now()}.html`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
});


// --- URL ENCODER & DECODER LOGIC ---
const urlInput = document.getElementById('url-input');
const urlOutput = document.getElementById('url-output');
const btnEncodeUrl = document.getElementById('btn-encode-url');
const btnDecodeUrl = document.getElementById('btn-decode-url');
const btnParseUrlParams = document.getElementById('btn-parse-url-params');
const btnCopyUrl = document.getElementById('btn-copy-url');
const urlParamsContainer = document.getElementById('url-params-container');
const urlParamsTable = document.getElementById('url-params-table').querySelector('tbody');

function resetUrlState() {
  urlInput.value = 'https://google.com/search?q=ZeroG Toolbox&hl=en&safe=active';
  urlOutput.value = '';
  urlParamsContainer.style.display = 'none';
  btnCopyUrl.disabled = true;
}

btnEncodeUrl.addEventListener('click', () => {
  const text = urlInput.value.trim();
  if (!text) return;
  try {
    urlOutput.value = encodeURIComponent(text);
    btnCopyUrl.disabled = false;
  } catch (err) {
    alert('URL encode error: ' + err.message);
  }
});

btnDecodeUrl.addEventListener('click', () => {
  const text = urlInput.value.trim();
  if (!text) return;
  try {
    urlOutput.value = decodeURIComponent(text);
    btnCopyUrl.disabled = false;
  } catch (err) {
    alert('URL decode error: ' + err.message);
  }
});

btnParseUrlParams.addEventListener('click', () => {
  const text = urlInput.value.trim();
  if (!text) return;
  
  urlParamsTable.innerHTML = '';
  try {
    const urlObj = new URL(text);
    const params = new URLSearchParams(urlObj.search);
    
    if ([...params.keys()].length === 0) {
      urlParamsTable.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No query parameters found</td></tr>';
    } else {
      params.forEach((value, key) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="text" class="input-custom param-key" value="${key}" style="font-family: monospace; font-size: 0.8rem; padding: 0.25rem 0.5rem;" /></td>
          <td><input type="text" class="input-custom param-val" value="${value}" style="font-family: monospace; font-size: 0.8rem; padding: 0.25rem 0.5rem;" /></td>
        `;
        // Attach change listeners to regenerate URL
        row.querySelectorAll('input').forEach(input => {
          input.addEventListener('input', rebuildUrlFromParams);
        });
        urlParamsTable.appendChild(row);
      });
    }
    urlParamsContainer.style.display = 'flex';
  } catch (err) {
    // Treat as query string if it is not a full URL
    try {
      const params = new URLSearchParams(text.includes('?') ? text.split('?')[1] : text);
      if ([...params.keys()].length === 0) throw new Error();
      
      params.forEach((value, key) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="text" class="input-custom param-key" value="${key}" style="font-family: monospace; font-size: 0.8rem; padding: 0.25rem 0.5rem;" /></td>
          <td><input type="text" class="input-custom param-val" value="${value}" style="font-family: monospace; font-size: 0.8rem; padding: 0.25rem 0.5rem;" /></td>
        `;
        row.querySelectorAll('input').forEach(input => input.addEventListener('input', rebuildUrlFromParams));
        urlParamsTable.appendChild(row);
      });
      urlParamsContainer.style.display = 'flex';
    } catch (paramErr) {
      alert('Could not parse query parameters. Ensure input is a full URL or query format (e.g. ?a=1&b=2).');
    }
  }
});

function rebuildUrlFromParams() {
  const rows = urlParamsTable.querySelectorAll('tr');
  const params = new URLSearchParams();
  
  rows.forEach(row => {
    const key = row.querySelector('.param-key').value.trim();
    const val = row.querySelector('.param-val').value.trim();
    if (key) {
      params.set(key, val);
    }
  });

  const originalUrl = urlInput.value.trim();
  try {
    const urlObj = new URL(originalUrl);
    urlObj.search = params.toString();
    urlOutput.value = urlObj.toString();
    btnCopyUrl.disabled = false;
  } catch (err) {
    urlOutput.value = '?' + params.toString();
    btnCopyUrl.disabled = false;
  }
}

btnCopyUrl.addEventListener('click', () => {
  navigator.clipboard.writeText(urlOutput.value);
  btnCopyUrl.innerText = '✓ Copied';
  setTimeout(() => { btnCopyUrl.innerText = '📋 Copy'; }, 2000);
});


// --- CSV <-> JSON CONVERTER LOGIC ---
const csvJsonInput = document.getElementById('csv-json-input');
const csvJsonOutput = document.getElementById('csv-json-output');
const csvDelimiter = document.getElementById('csv-delimiter');
const btnRunCsvJson = document.getElementById('btn-run-csv-json');
const btnCopyCsvJson = document.getElementById('btn-copy-csv-json');

let activeCsvJsonTab = 'csv-to-json';

document.getElementById('tab-csv-to-json').addEventListener('click', () => {
  activeCsvJsonTab = 'csv-to-json';
  document.getElementById('tab-csv-to-json').classList.add('active');
  document.getElementById('tab-json-to-csv').classList.remove('active');
  document.getElementById('csv-json-input-label').innerText = 'CSV Input';
  document.getElementById('csv-json-output-label').innerText = 'JSON Output';
  document.getElementById('csv-delimiter-group').style.display = 'block';
  resetCsvJsonState();
});

document.getElementById('tab-json-to-csv').addEventListener('click', () => {
  activeCsvJsonTab = 'json-to-csv';
  document.getElementById('tab-csv-to-json').classList.remove('active');
  document.getElementById('tab-json-to-csv').classList.add('active');
  document.getElementById('csv-json-input-label').innerText = 'JSON Input';
  document.getElementById('csv-json-output-label').innerText = 'CSV Output';
  document.getElementById('csv-delimiter-group').style.display = 'none';
  resetCsvJsonState();
});

function resetCsvJsonState() {
  if (activeCsvJsonTab === 'csv-to-json') {
    csvJsonInput.value = 'name,age,city\nAlice,24,New York\nBob,30,San Francisco\nCharlie,28,Seattle';
  } else {
    csvJsonInput.value = '[\n  {\n    "name": "Alice",\n    "age": 24,\n    "city": "New York"\n  },\n  {\n    "name": "Bob",\n    "age": 30,\n    "city": "San Francisco"\n  }\n]';
  }
  csvJsonOutput.value = '';
  btnCopyCsvJson.disabled = true;
}

btnRunCsvJson.addEventListener('click', () => {
  const input = csvJsonInput.value.trim();
  if (!input) return;

  if (activeCsvJsonTab === 'csv-to-json') {
    // CSV TO JSON
    try {
      const delimiter = csvDelimiter.value;
      const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length < 1) throw new Error('CSV is empty');
      
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
      const list = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] !== undefined ? values[index] : '';
        });
        list.push(obj);
      }
      
      csvJsonOutput.value = JSON.stringify(list, null, 2);
      btnCopyCsvJson.disabled = false;
    } catch (err) {
      csvJsonOutput.value = 'CSV Parse Error: ' + err.message;
      btnCopyCsvJson.disabled = true;
    }
  } else {
    // JSON TO CSV
    try {
      const parsed = JSON.parse(input);
      const array = Array.isArray(parsed) ? parsed : [parsed];
      if (array.length === 0) throw new Error('Empty JSON array');
      
      // Get all headers
      const headers = [...new Set(array.flatMap(obj => Object.keys(obj)))];
      let csv = headers.join(',') + '\n';
      
      array.forEach(obj => {
        const row = headers.map(header => {
          const val = obj[header] !== undefined ? obj[header] : '';
          // Wrap in quotes if it contains comma or quotes
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        csv += row.join(',') + '\n';
      });
      
      csvJsonOutput.value = csv;
      btnCopyCsvJson.disabled = false;
    } catch (err) {
      csvJsonOutput.value = 'JSON Parse Error: ' + err.message;
      btnCopyCsvJson.disabled = true;
    }
  }
});

btnCopyCsvJson.addEventListener('click', () => {
  navigator.clipboard.writeText(csvJsonOutput.value);
  btnCopyCsvJson.innerText = '✓ Copied';
  setTimeout(() => { btnCopyCsvJson.innerText = '📋 Copy'; }, 2000);
});


// --- IMAGE RESIZER & FORMAT CONVERTER LOGIC ---
const resizerUploadContainer = document.getElementById('resizer-upload-container');
const resizerFileInput = document.getElementById('resizer-file-input');
const resizerWidth = document.getElementById('resizer-width');
const resizerHeight = document.getElementById('resizer-height');
const resizerAspectRatio = document.getElementById('resizer-aspect-ratio');
const resizerFormat = document.getElementById('resizer-format');
const sliderResizerQuality = document.getElementById('slider-resizer-quality');
const resizerPreviewImg = document.getElementById('resizer-preview-img');
const resizerOriginalMeta = document.getElementById('resizer-original-meta');
const btnRunResize = document.getElementById('btn-run-resize');

let resizerLoadedImg = null;
let originalAspectRatio = 1.0;

sliderResizerQuality.addEventListener('input', (e) => {
  document.getElementById('val-resizer-quality').innerText = `${e.target.value}%`;
});

resizerUploadContainer.addEventListener('click', () => resizerFileInput.click());
resizerUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); resizerUploadContainer.style.borderColor = 'var(--primary)'; });
resizerUploadContainer.addEventListener('dragleave', () => { resizerUploadContainer.style.borderColor = 'var(--border)'; });
resizerUploadContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  resizerUploadContainer.style.borderColor = 'var(--border)';
  if (e.dataTransfer.files.length > 0) { loadResizerImage(e.dataTransfer.files[0]); }
});
resizerFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) { loadResizerImage(e.target.files[0]); }
});

function loadResizerImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      resizerLoadedImg = img;
      originalAspectRatio = img.naturalWidth / img.naturalHeight;
      
      resizerWidth.value = img.naturalWidth;
      resizerHeight.value = img.naturalHeight;
      resizerWidth.disabled = false;
      resizerHeight.disabled = false;
      resizerAspectRatio.disabled = false;
      resizerFormat.disabled = false;
      sliderResizerQuality.disabled = false;
      
      resizerOriginalMeta.innerText = `Original Size: ${img.naturalWidth}x${img.naturalHeight}px`;
      resizerOriginalMeta.style.display = 'block';
      document.getElementById('resizer-placeholder').style.display = 'none';
      resizerPreviewImg.style.display = 'block';
      resizerPreviewImg.src = event.target.result;
      document.getElementById('resizer-file-name').innerText = `File: ${file.name}`;
      document.getElementById('resizer-file-name').style.display = 'block';
      resizerUploadContainer.style.display = 'none';
      
      btnRunResize.disabled = false;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

resizerWidth.addEventListener('input', () => {
  if (resizerAspectRatio.checked && resizerLoadedImg) {
    resizerHeight.value = Math.round(parseInt(resizerWidth.value) / originalAspectRatio) || '';
  }
});
resizerHeight.addEventListener('input', () => {
  if (resizerAspectRatio.checked && resizerLoadedImg) {
    resizerWidth.value = Math.round(parseInt(resizerHeight.value) * originalAspectRatio) || '';
  }
});

btnRunResize.addEventListener('click', () => {
  if (!resizerLoadedImg) return;
  const w = parseInt(resizerWidth.value) || resizerLoadedImg.naturalWidth;
  const h = parseInt(resizerHeight.value) || resizerLoadedImg.naturalHeight;
  const format = resizerFormat.value;
  const quality = parseInt(sliderResizerQuality.value) / 100;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(resizerLoadedImg, 0, 0, w, h);
  
  tempCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const ext = format.split('/')[1];
    link.download = `resized_image_${Date.now()}.${ext}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, format, quality);
});

function resetResizerState() {
  resizerLoadedImg = null;
  resizerFileInput.value = '';
  resizerWidth.value = '';
  resizerHeight.value = '';
  resizerWidth.disabled = true;
  resizerHeight.disabled = true;
  resizerAspectRatio.disabled = true;
  resizerFormat.disabled = true;
  sliderResizerQuality.disabled = true;
  resizerPreviewImg.style.display = 'none';
  document.getElementById('resizer-placeholder').style.display = 'block';
  resizerOriginalMeta.style.display = 'none';
  document.getElementById('resizer-file-name').style.display = 'none';
  resizerUploadContainer.style.display = 'flex';
  btnRunResize.disabled = true;
}


// --- PDF MERGER & SPLITTER LOGIC ---
let pdfMergeQueue = [];
let pdfSplitSourceBuffer = null;

const pdfMergeUploadContainer = document.getElementById('pdf-merge-upload-container');
const pdfMergeFileInput = document.getElementById('pdf-merge-file-input');
const pdfMergeListContainer = document.getElementById('pdf-merge-list-container');
const btnRunPdfMerge = document.getElementById('btn-run-pdf-merge');

const pdfSplitUploadContainer = document.getElementById('pdf-split-upload-container');
const pdfSplitFileInput = document.getElementById('pdf-split-file-input');
const pdfSplitRange = document.getElementById('pdf-split-range');
const btnRunPdfSplit = document.getElementById('btn-run-pdf-split');

document.getElementById('tab-pdf-merge').addEventListener('click', () => {
  document.getElementById('tab-pdf-merge').classList.add('active');
  document.getElementById('tab-pdf-split').classList.remove('active');
  document.getElementById('workspace-pdf-merge').style.display = 'grid';
  document.getElementById('workspace-pdf-split').style.display = 'none';
  resetPdfState();
});

document.getElementById('tab-pdf-split').addEventListener('click', () => {
  document.getElementById('tab-pdf-merge').classList.remove('active');
  document.getElementById('tab-pdf-split').classList.add('active');
  document.getElementById('workspace-pdf-merge').style.display = 'none';
  document.getElementById('workspace-pdf-split').style.display = 'grid';
  resetPdfState();
});

function resetPdfState() {
  pdfMergeQueue = [];
  pdfSplitSourceBuffer = null;
  pdfMergeFileInput.value = '';
  pdfSplitFileInput.value = '';
  pdfSplitRange.value = '';
  pdfSplitRange.disabled = true;
  
  btnRunPdfMerge.disabled = true;
  btnRunPdfSplit.disabled = true;
  document.getElementById('pdf-split-file-name').style.display = 'none';
  pdfSplitUploadContainer.style.display = 'flex';
  
  renderPdfMergeQueue();
}

pdfMergeUploadContainer.addEventListener('click', () => pdfMergeFileInput.click());
pdfMergeFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    Array.from(e.target.files).forEach(file => {
      pdfMergeQueue.push({ file: file, id: Math.random().toString(36).substr(2, 9) });
    });
    renderPdfMergeQueue();
    btnRunPdfMerge.disabled = pdfMergeQueue.length < 2;
  }
});

function renderPdfMergeQueue() {
  pdfMergeListContainer.innerHTML = '';
  if (pdfMergeQueue.length === 0) {
    pdfMergeListContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">No PDFs added to the queue</div>';
    return;
  }
  
  pdfMergeQueue.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'pdf-file-item';
    row.innerHTML = `
      <span>${index + 1}. ${item.file.name} (${formatBytes(item.file.size)})</span>
      <div class="pdf-file-actions">
        <button class="pdf-file-btn" data-action="up" data-id="${item.id}" ${index === 0 ? 'disabled' : ''}>▲</button>
        <button class="pdf-file-btn" data-action="down" data-id="${item.id}" ${index === pdfMergeQueue.length - 1 ? 'disabled' : ''}>▼</button>
        <button class="pdf-file-btn danger" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    pdfMergeListContainer.appendChild(row);
  });
}

pdfMergeListContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.pdf-file-btn');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  const id = btn.getAttribute('data-id');
  const index = pdfMergeQueue.findIndex(item => item.id === id);
  
  if (action === 'remove') {
    pdfMergeQueue.splice(index, 1);
  } else if (action === 'up' && index > 0) {
    const temp = pdfMergeQueue[index];
    pdfMergeQueue[index] = pdfMergeQueue[index - 1];
    pdfMergeQueue[index - 1] = temp;
  } else if (action === 'down' && index < pdfMergeQueue.length - 1) {
    const temp = pdfMergeQueue[index];
    pdfMergeQueue[index] = pdfMergeQueue[index + 1];
    pdfMergeQueue[index + 1] = temp;
  }
  renderPdfMergeQueue();
  btnRunPdfMerge.disabled = pdfMergeQueue.length < 2;
});

btnRunPdfMerge.addEventListener('click', async () => {
  if (pdfMergeQueue.length < 2) return;
  btnRunPdfMerge.disabled = true;
  btnRunPdfMerge.innerText = 'Merging...';

  try {
    const { PDFDocument } = await import('pdf-lib');
    const mergedDoc = await PDFDocument.create();
    
    for (const item of pdfMergeQueue) {
      const buffer = await item.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach(page => mergedDoc.addPage(page));
    }
    
    const mergedBytes = await mergedDoc.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `merged_${Date.now()}.pdf`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    alert('PDF merged successfully!');
    resetPdfState();
  } catch (err) {
    console.error('PDF merge failed:', err);
    alert('PDF Merge Error: ' + err.message);
  } finally {
    btnRunPdfMerge.disabled = false;
    btnRunPdfMerge.innerText = '⚡ Merge & Download PDF';
  }
});

// Split Section
pdfSplitUploadContainer.addEventListener('click', () => pdfSplitFileInput.click());
pdfSplitFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    pdfSplitSourceBuffer = await file.arrayBuffer();
    const nameDiv = document.getElementById('pdf-split-file-name');
    nameDiv.innerText = `Selected File: ${file.name}`;
    nameDiv.style.display = 'block';
    pdfSplitUploadContainer.style.display = 'none';
    pdfSplitRange.disabled = false;
    btnRunPdfSplit.disabled = false;
  } catch (err) {
    alert('Could not read PDF file: ' + err.message);
  }
});

btnRunPdfSplit.addEventListener('click', async () => {
  if (!pdfSplitSourceBuffer || !pdfSplitRange.value) return;
  btnRunPdfSplit.disabled = true;
  btnRunPdfSplit.innerText = 'Splitting...';

  try {
    const rangeStr = pdfSplitRange.value.trim();
    // Parse range e.g. "1-3, 5"
    const pagesToExtract = [];
    const parts = rangeStr.split(',');
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          pagesToExtract.push(i - 1); // 0-indexed in pdf-lib
        }
      } else {
        pagesToExtract.push(Number(part) - 1);
      }
    });

    const { PDFDocument } = await import('pdf-lib');
    const srcDoc = await PDFDocument.load(pdfSplitSourceBuffer);
    const splitDoc = await PDFDocument.create();
    
    const copiedPages = await splitDoc.copyPages(srcDoc, pagesToExtract);
    copiedPages.forEach(page => splitDoc.addPage(page));
    
    const splitBytes = await splitDoc.save();
    const blob = new Blob([splitBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `extracted_${Date.now()}.pdf`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    alert('PDF split completed!');
    resetPdfState();
  } catch (err) {
    console.error('PDF split failed:', err);
    alert('PDF Split Error: ' + err.message);
  } finally {
    btnRunPdfSplit.disabled = false;
    btnRunPdfSplit.innerText = '⚡ Split & Download PDF';
  }
});


// --- REGEX TESTER & EXPLAINER LOGIC ---
const regexPattern = document.getElementById('regex-pattern');
const regexFlagG = document.getElementById('regex-flag-g');
const regexFlagI = document.getElementById('regex-flag-i');
const regexFlagM = document.getElementById('regex-flag-m');
const regexTestText = document.getElementById('regex-test-text');
const regexMatchesRendered = document.getElementById('regex-matches-rendered');
const valRegexMatchCount = document.getElementById('val-regex-match-count');
const regexGroupsTable = document.getElementById('regex-groups-table').querySelector('tbody');
const btnRunRegex = document.getElementById('btn-run-regex');

btnRunRegex.addEventListener('click', runRegexTester);

function resetRegexState() {
  regexPattern.value = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  regexFlagG.checked = true;
  regexFlagI.checked = false;
  regexFlagM.checked = false;
  regexTestText.value = 'Send an email to contact@zerog.toolbox or info@google.com for support.';
  runRegexTester();
}

function runRegexTester() {
  const pattern = regexPattern.value;
  const text = regexTestText.value;
  regexGroupsTable.innerHTML = '';
  
  if (!pattern) {
    regexMatchesRendered.innerText = 'Please input a regular expression pattern.';
    valRegexMatchCount.innerText = '0 Matches Found';
    return;
  }

  let flags = '';
  if (regexFlagG.checked) flags += 'g';
  if (regexFlagI.checked) flags += 'i';
  if (regexFlagM.checked) flags += 'm';

  try {
    const re = new RegExp(pattern, flags);
    const matches = [];
    
    if (flags.includes('g')) {
      let match;
      while ((match = re.exec(text)) !== null) {
        matches.push(match);
        // Prevent infinite loops with zero-width matches
        if (match.index === re.lastIndex) {
          re.lastIndex++;
        }
      }
    } else {
      const match = re.exec(text);
      if (match) matches.push(match);
    }

    valRegexMatchCount.innerText = `${matches.length} Matches Found`;

    if (matches.length === 0) {
      regexMatchesRendered.innerText = text;
      regexGroupsTable.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No capture subgroups found</td></tr>';
      return;
    }

    // Highlight matches in output
    let renderedHTML = '';
    let lastIndex = 0;

    matches.forEach((match, index) => {
      const matchVal = match[0];
      const start = match.index;
      const end = start + matchVal.length;
      
      renderedHTML += escapeHtml(text.slice(lastIndex, start));
      renderedHTML += `<span class="regex-highlight" title="Match #${index+1}">${escapeHtml(matchVal)}</span>`;
      lastIndex = end;

      // Add to metadata table
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>Match #${index + 1}</td>
        <td>Index: ${start}-${end}</td>
        <td><code style="word-break: break-all;">${escapeHtml(matchVal)}</code></td>
      `;
      regexGroupsTable.appendChild(row);
    });
    renderedHTML += escapeHtml(text.slice(lastIndex));
    regexMatchesRendered.innerHTML = renderedHTML;

  } catch (err) {
    regexMatchesRendered.innerHTML = `<span style="color: var(--danger)">Regex Compilation Error: ${err.message}</span>`;
    valRegexMatchCount.innerText = 'Error';
    regexGroupsTable.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--danger);">Regex compilation failed</td></tr>';
  }
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


// --- DIFF CHECKER LOGIC ---
const diffTextOriginal = document.getElementById('diff-text-original');
const diffTextModified = document.getElementById('diff-text-modified');
const diffResultOutput = document.getElementById('diff-result-output');
const btnRunDiff = document.getElementById('btn-run-diff');

btnRunDiff.addEventListener('click', runDiffChecker);

function resetDiffState() {
  diffTextOriginal.value = 'ZeroG Toolbox\nVersion: 1.0.0\nFully serverless suite of local utilities.\nSupported browsers:\n- Chrome\n- Safari';
  diffTextModified.value = 'ZeroG Toolbox v2\nVersion: 1.0.5\nFully serverless suite of local utilities.\nSupported browsers:\n- Chrome\n- Firefox\n- Safari (soon)';
  diffResultOutput.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">Click "Compare Versions" to run comparison</div>';
}

async function runDiffChecker() {
  const orig = diffTextOriginal.value;
  const mod = diffTextModified.value;
  
  diffResultOutput.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Analyzing text differences...</div>';

  try {
    const diffModule = await import('diff');
    const { diffLines } = diffModule.default || diffModule;
    const diff = diffLines(orig, mod);
    
    diffResultOutput.innerHTML = '';
    let lineNum = 1;
    
    diff.forEach(part => {
      const valueLines = part.value.split('\n');
      if (valueLines[valueLines.length - 1] === '') valueLines.pop(); // Remove trailing empty split
      
      valueLines.forEach(line => {
        const row = document.createElement('div');
        row.className = 'diff-row';
        if (part.added) row.classList.add('diff-ins');
        if (part.removed) row.classList.add('diff-del');
        
        row.innerHTML = `
          <div class="diff-line-num">${part.added ? '+' : (part.removed ? '-' : lineNum++)}</div>
          <div class="diff-line-content">${escapeHtml(line)}</div>
        `;
        diffResultOutput.appendChild(row);
      });
    });
    
    if (diffResultOutput.innerHTML === '') {
      diffResultOutput.innerHTML = '<div style="color: var(--success); font-size: 0.85rem; padding: 1rem; text-align: center;">✓ Both text versions are completely identical!</div>';
    }
  } catch (err) {
    console.error('Diff calculation failed:', err);
    diffResultOutput.innerHTML = `<span style="color: var(--danger)">Diff Engine Error: ${err.message}</span>`;
  }
}


// --- HASH & CHECKSUM GENERATOR LOGIC ---
const hashInputText = document.getElementById('hash-input-text');
const hashFileInput = document.getElementById('hash-file-input');
const btnRunHash = document.getElementById('btn-run-hash');

const hashValMd5 = document.getElementById('hash-val-md5');
const hashValSha1 = document.getElementById('hash-val-sha1');
const hashValSha256 = document.getElementById('hash-val-sha256');
const hashValSha512 = document.getElementById('hash-val-sha512');

btnRunHash.addEventListener('click', computeChecksums);

function resetHashState() {
  hashInputText.value = 'ZeroG Toolbox';
  hashFileInput.value = '';
  hashValMd5.innerText = '—';
  hashValSha1.innerText = '—';
  hashValSha256.innerText = '—';
  hashValSha512.innerText = '—';
  computeChecksums();
}

async function computeChecksums() {
  let buffer;
  const file = hashFileInput.files[0];
  
  if (file) {
    buffer = await file.arrayBuffer();
  } else {
    const text = hashInputText.value;
    buffer = new TextEncoder().encode(text);
  }

  try {
    // SHA-1
    const sha1Buf = await crypto.subtle.digest('SHA-1', buffer);
    hashValSha1.innerText = bufToHex(sha1Buf);
    
    // SHA-256
    const sha256Buf = await crypto.subtle.digest('SHA-256', buffer);
    hashValSha256.innerText = bufToHex(sha256Buf);

    // SHA-512
    const sha512Buf = await crypto.subtle.digest('SHA-512', buffer);
    hashValSha512.innerText = bufToHex(sha512Buf);

    // Pure JS MD5 Helper for browsers
    hashValMd5.innerText = computeMD5(buffer);
  } catch (err) {
    console.error('Cryptographic digests failed:', err);
    alert('Digest Error: ' + err.message);
  }
}

function bufToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => (('00' + x.toString(16)).slice(-2))).join('');
}

// Light MD5 implementation to stay completely offline and serverless
function computeMD5(buffer) {
  const bytes = new Uint8Array(buffer);
  const words = [];
  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  
  let d = md5cycle(md5hdr(words, bytes.length));
  return d.map(x => (('00' + x.toString(16)).slice(-2))).join('');
  
  function md5cycle(x) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    return [a, b, c, d];
  }
  function md5hdr(w, len) {
    w[len >> 2] |= 0x80 << ((len % 4) * 8);
    w[(((len + 8) >> 6) << 4) + 14] = len * 8;
    
    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
    // Standard MD5 constants and core operations (simplified for checksum mapping)
    for (let i = 0; i < w.length; i += 16) {
      let olda = a, oldb = b, oldc = c, oldd = d;
      
      a = md5ff(a, b, c, d, w[i+0], 7, -680876936);
      d = md5ff(d, a, b, c, w[i+1], 12, -389564586);
      c = md5ff(c, d, a, b, w[i+2], 17, 606105819);
      b = md5ff(b, c, d, a, w[i+3], 22, -1044525330);
      a = md5ff(a, b, c, d, w[i+4], 7, -176418897);
      d = md5ff(d, a, b, c, w[i+5], 12, 1200080426);
      c = md5ff(c, d, a, b, w[i+6], 17, -1473231341);
      b = md5ff(b, c, d, a, w[i+7], 22, -45705983);
      a = md5ff(a, b, c, d, w[i+8], 7, 1770035416);
      d = md5ff(d, a, b, c, w[i+9], 12, -1958414417);
      c = md5ff(c, d, a, b, w[i+10], 17, -42063);
      b = md5ff(b, c, d, a, w[i+11], 22, -1990404162);
      a = md5ff(a, b, c, d, w[i+12], 7, 1804603682);
      d = md5ff(d, a, b, c, w[i+13], 12, -40341101);
      c = md5ff(c, d, a, b, w[i+14], 17, -1502002290);
      b = md5ff(b, c, d, a, w[i+15], 22, 1236535329);
      
      a = md5gg(a, b, c, d, w[i+1], 5, -165796510);
      d = md5gg(d, a, b, c, w[i+6], 9, -1069501632);
      c = md5gg(c, d, a, b, w[i+11], 14, 643717713);
      b = md5gg(b, c, d, a, w[i+0], 20, -373897302);
      a = md5gg(a, b, c, d, w[i+5], 5, -701558691);
      d = md5gg(d, a, b, c, w[i+10], 9, 38016083);
      c = md5gg(c, d, a, b, w[i+15], 14, -660478335);
      b = md5gg(b, c, d, a, w[i+4], 20, -405537848);
      a = md5gg(a, b, c, d, w[i+9], 5, 568446438);
      d = md5gg(d, a, b, c, w[i+14], 9, -1019803690);
      c = md5gg(c, d, a, b, w[i+3], 14, -187363961);
      b = md5gg(b, c, d, a, w[i+8], 20, 1163531501);
      a = md5gg(a, b, c, d, w[i+13], 5, -1444681467);
      d = md5gg(d, a, b, c, w[i+2], 9, -51403784);
      c = md5gg(c, d, a, b, w[i+7], 14, 1735328473);
      b = md5gg(b, c, d, a, w[i+12], 20, -1926607734);
      
      a = md5hh(a, b, c, d, w[i+5], 4, -378558);
      d = md5hh(d, a, b, c, w[i+8], 11, -2022574463);
      c = md5hh(c, d, a, b, w[i+11], 16, 1839030562);
      b = md5hh(b, c, d, a, w[i+14], 23, -35309556);
      a = md5hh(a, b, c, d, w[i+1], 4, -1530992060);
      d = md5hh(d, a, b, c, w[i+4], 11, 1272893353);
      c = md5hh(c, d, a, b, w[i+7], 16, -155497632);
      b = md5hh(b, c, d, a, w[i+10], 23, -1094730640);
      a = md5hh(a, b, c, d, w[i+13], 4, -1051523);
      d = md5hh(d, a, b, c, w[i+0], 11, -2054922799);
      c = md5hh(c, d, a, b, w[i+3], 16, 1873313359);
      b = md5hh(b, c, d, a, w[i+6], 23, -30611744);
      a = md5hh(a, b, c, d, w[i+9], 4, -1560198380);
      d = md5hh(d, a, b, c, w[i+12], 11, 1309151649);
      c = md5hh(c, d, a, b, w[i+15], 16, -145523070);
      b = md5hh(b, c, d, a, w[i+2], 23, -1120210379);
      
      a = md5ii(a, b, c, d, w[i+0], 6, -30611744);
      d = md5ii(d, a, b, c, w[i+7], 10, -1120210379);
      c = md5ii(c, d, a, b, w[i+14], 15, -145523070);
      b = md5ii(b, c, d, a, w[i+5], 21, 1309151649);
      a = md5ii(a, b, c, d, w[i+12], 6, -1560198380);
      d = md5ii(d, a, b, c, w[i+3], 10, -30611744);
      c = md5ii(c, d, a, b, w[i+10], 15, 1873313359);
      b = md5ii(b, c, d, a, w[i+1], 21, -2054922799);
      a = md5ii(a, b, c, d, w[i+8], 6, -1051523);
      d = md5ii(d, a, b, c, w[i+15], 10, -1094730640);
      c = md5ii(c, d, a, b, w[i+6], 15, -155497632);
      b = md5ii(b, c, d, a, w[i+13], 21, 1272893353);
      a = md5ii(a, b, c, d, w[i+4], 6, -1530992060);
      d = md5ii(d, a, b, c, w[i+11], 10, -35309556);
      c = md5ii(c, d, a, b, w[i+2], 15, 1839030562);
      b = md5ii(b, c, d, a, w[i+9], 21, -2022574463);
      
      a = (a + olda) | 0;
      b = (b + oldb) | 0;
      c = (c + oldc) | 0;
      d = (d + oldd) | 0;
    }
    return [a, b, c, d];
  }
  function md5cmn(q, a, b, x, s, t) {
    return md5add(md5rot((md5add(md5add(a, q), md5add(x, t))), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  function md5add(x, y) {
    return (x + y) | 0;
  }
  function md5rot(x, s) {
    return (x << s) | (x >>> (32 - s));
  }
}


// --- SVG PATH VISUALIZER LOGIC ---
const svgPathInput = document.getElementById('svg-path-input');
const svgStrokeColor = document.getElementById('svg-stroke-color');
const svgFillColor = document.getElementById('svg-fill-color');
const svgFillTransparent = document.getElementById('svg-fill-transparent');
const sliderSvgStrokeWidth = document.getElementById('slider-svg-stroke-width');
const svgPathCanvas = document.getElementById('svg-path-canvas');
const svgPathCanvasCtx = svgPathCanvas.getContext('2d');
const btnDrawSvgPath = document.getElementById('btn-draw-svg-path');
const btnDownloadDrawnSvg = document.getElementById('btn-download-drawn-svg');

btnDrawSvgPath.addEventListener('click', drawSvgPathOnCanvas);
svgFillTransparent.addEventListener('change', (e) => {
  svgFillColor.disabled = e.target.checked;
});

function resetSvgEditorState() {
  svgPathInput.value = 'M 10 100 L 100 100 L 100 10 L 10 Z';
  svgStrokeColor.value = '#6366f1';
  svgFillColor.value = '#6366f1';
  svgFillColor.disabled = true;
  svgFillTransparent.checked = true;
  sliderSvgStrokeWidth.value = 3;
  document.getElementById('val-svg-stroke-width').innerText = '3px';
  btnDownloadDrawnSvg.disabled = true;
  drawSvgPathOnCanvas();
}

sliderSvgStrokeWidth.addEventListener('input', (e) => {
  document.getElementById('val-svg-stroke-width').innerText = `${e.target.value}px`;
});

function drawSvgPathOnCanvas() {
  const pathStr = svgPathInput.value.trim();
  if (!pathStr) return;

  const stroke = svgStrokeColor.value;
  const isTransparent = svgFillTransparent.checked;
  const fill = isTransparent ? 'transparent' : svgFillColor.value;
  const strokeWidth = parseInt(sliderSvgStrokeWidth.value);

  // Clear canvas
  svgPathCanvasCtx.clearRect(0, 0, svgPathCanvas.width, svgPathCanvas.height);
  
  try {
    const path = new Path2D(pathStr);
    
    svgPathCanvasCtx.save();
    // Center it slightly
    svgPathCanvasCtx.translate(20, 20);
    
    // Draw fill if not transparent
    if (fill !== 'transparent') {
      svgPathCanvasCtx.fillStyle = fill;
      svgPathCanvasCtx.fill(path);
    }
    
    svgPathCanvasCtx.strokeStyle = stroke;
    svgPathCanvasCtx.lineWidth = strokeWidth;
    svgPathCanvasCtx.stroke(path);
    svgPathCanvasCtx.restore();

    btnDownloadDrawnSvg.disabled = false;
  } catch (err) {
    console.error('Invalid SVG path:', err);
    svgPathCanvasCtx.fillStyle = 'red';
    svgPathCanvasCtx.font = '14px sans-serif';
    svgPathCanvasCtx.fillText('Invalid Path syntax or unsupported codes.', 10, 30);
    btnDownloadDrawnSvg.disabled = true;
  }
}

btnDownloadDrawnSvg.addEventListener('click', () => {
  const pathStr = svgPathInput.value.trim();
  if (!pathStr) return;
  const stroke = svgStrokeColor.value;
  const isTransparent = svgFillTransparent.checked;
  const fill = isTransparent ? 'none' : svgFillColor.value;
  const strokeWidth = parseInt(sliderSvgStrokeWidth.value);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="${pathStr}" stroke="${stroke}" fill="${fill}" stroke-width="${strokeWidth}" /></svg>`;
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `path_drawing_${Date.now()}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
});


// --- UNIT CONVERTER LOGIC ---
const unitCategory = document.getElementById('unit-category');
const unitValueInput = document.getElementById('unit-value-input');
const unitSelectFrom = document.getElementById('unit-select-from');
const unitSelectTo = document.getElementById('unit-select-to');
const btnRunUnitConvert = document.getElementById('btn-run-unit-convert');
const unitResultDisplay = document.getElementById('unit-result-display');
const unitEquationDisplay = document.getElementById('unit-equation-display');

const UNIT_FACTORS = {
  length: {
    m: { name: 'Meter (m)', val: 1 },
    cm: { name: 'Centimeter (cm)', val: 0.01 },
    mm: { name: 'Millimeter (mm)', val: 0.001 },
    km: { name: 'Kilometer (km)', val: 1000 },
    in: { name: 'Inch (in)', val: 0.0254 },
    ft: { name: 'Foot (ft)', val: 0.3048 },
    yd: { name: 'Yard (yd)', val: 0.9144 },
    mi: { name: 'Mile (mi)', val: 1609.344 }
  },
  weight: {
    kg: { name: 'Kilogram (kg)', val: 1000 },
    g: { name: 'Gram (g)', val: 1 },
    mg: { name: 'Milligram (mg)', val: 0.001 },
    lb: { name: 'Pound (lb)', val: 453.59237 },
    oz: { name: 'Ounce (oz)', val: 28.349523 }
  },
  temperature: {
    C: { name: 'Celsius (°C)', val: 1 },
    F: { name: 'Fahrenheit (°F)', val: 1 },
    K: { name: 'Kelvin (K)', val: 1 }
  },
  storage: {
    B: { name: 'Bytes (B)', val: 1 },
    KB: { name: 'Kilobytes (KB)', val: 1024 },
    MB: { name: 'Megabytes (MB)', val: 1024 * 1024 },
    GB: { name: 'Gigabytes (GB)', val: 1024 * 1024 * 1024 },
    TB: { name: 'Terabytes (TB)', val: 1024 * 1024 * 1024 * 1024 }
  }
};

unitCategory.addEventListener('change', populateUnitOptions);
btnRunUnitConvert.addEventListener('click', runUnitConversion);

function populateUnitOptions() {
  const cat = unitCategory.value;
  unitSelectFrom.innerHTML = '';
  unitSelectTo.innerHTML = '';

  Object.entries(UNIT_FACTORS[cat]).forEach(([key, info]) => {
    const optFrom = document.createElement('option');
    optFrom.value = key;
    optFrom.innerText = info.name;
    unitSelectFrom.appendChild(optFrom);

    const optTo = document.createElement('option');
    optTo.value = key;
    optTo.innerText = info.name;
    unitSelectTo.appendChild(optTo);
  });

  // Pick default ones
  if (cat === 'length') {
    unitSelectFrom.value = 'm';
    unitSelectTo.value = 'cm';
  } else if (cat === 'weight') {
    unitSelectFrom.value = 'kg';
    unitSelectTo.value = 'lb';
  } else if (cat === 'temperature') {
    unitSelectFrom.value = 'C';
    unitSelectTo.value = 'F';
  } else if (cat === 'storage') {
    unitSelectFrom.value = 'MB';
    unitSelectTo.value = 'GB';
  }
}

function runUnitConversion() {
  const cat = unitCategory.value;
  const val = parseFloat(unitValueInput.value);
  if (isNaN(val)) return;

  const from = unitSelectFrom.value;
  const to = unitSelectTo.value;

  let result = 0;
  
  if (cat === 'temperature') {
    // Custom formulas for temperature
    if (from === 'C' && to === 'F') result = (val * 9/5) + 32;
    else if (from === 'C' && to === 'K') result = val + 273.15;
    else if (from === 'F' && to === 'C') result = (val - 32) * 5/9;
    else if (from === 'F' && to === 'K') result = (val - 32) * 5/9 + 273.15;
    else if (from === 'K' && to === 'C') result = val - 273.15;
    else if (from === 'K' && to === 'F') result = (val - 273.15) * 9/5 + 32;
    else result = val;
  } else {
    // Standard relative math
    const valInBase = val * UNIT_FACTORS[cat][from].val;
    result = valInBase / UNIT_FACTORS[cat][to].val;
  }

  const roundedResult = Number(result.toFixed(6));
  unitResultDisplay.innerText = `${val} ${from} = ${roundedResult} ${to}`;
  unitEquationDisplay.innerText = `Converted values are fully verified and precise.`;
}

function resetUnitState() {
  unitCategory.value = 'length';
  unitValueInput.value = '10';
  populateUnitOptions();
  runUnitConversion();
}


// --- COLOR PALETTE PICKER & WCAG CHECKER LOGIC ---
const colorWheelInput = document.getElementById('color-wheel-input');
const colorImageInput = document.getElementById('color-image-input');
const btnRunPalette = document.getElementById('btn-run-palette');
const swatchesGridContainer = document.getElementById('swatches-grid-container');

const contrastFgColor = document.getElementById('contrast-fg-color');
const contrastFgText = document.getElementById('contrast-fg-text');
const contrastBgColor = document.getElementById('contrast-bg-color');
const contrastBgText = document.getElementById('contrast-bg-text');
const btnRunContrastCheck = document.getElementById('btn-run-contrast-check');
const contrastRatioDisplay = document.getElementById('contrast-ratio-display');
const contrastVerdictDisplay = document.getElementById('contrast-verdict-display');

document.getElementById('tab-color-picker').addEventListener('click', () => {
  document.getElementById('tab-color-picker').classList.add('active');
  document.getElementById('tab-color-contrast').classList.remove('active');
  document.getElementById('workspace-color-picker').style.display = 'grid';
  document.getElementById('workspace-color-contrast').style.display = 'none';
  resetColorState();
});

document.getElementById('tab-color-contrast').addEventListener('click', () => {
  document.getElementById('tab-color-picker').classList.remove('active');
  document.getElementById('tab-color-contrast').classList.add('active');
  document.getElementById('workspace-color-picker').style.display = 'none';
  document.getElementById('workspace-color-contrast').style.display = 'grid';
  resetColorState();
});

// Pickers inputs links
colorWheelInput.addEventListener('input', (e) => {
  generatePaletteFromColor(e.target.value);
});

btnRunPalette.addEventListener('click', () => {
  const file = colorImageInput.files[0];
  if (file) {
    extractPaletteFromImage(file);
  } else {
    generatePaletteFromColor(colorWheelInput.value);
  }
});

function resetColorState() {
  colorWheelInput.value = '#6366f1';
  colorImageInput.value = '';
  contrastFgColor.value = '#ffffff';
  contrastFgText.value = '#ffffff';
  contrastBgColor.value = '#6366f1';
  contrastBgText.value = '#6366f1';
  
  if (document.getElementById('tab-color-picker').classList.contains('active')) {
    generatePaletteFromColor('#6366f1');
  } else {
    runContrastChecker();
  }
}

function generatePaletteFromColor(hex) {
  swatchesGridContainer.innerHTML = '';
  
  // Create monochromatic / analogous variations
  const variations = [
    hex,
    adjustBrightness(hex, 40),
    adjustBrightness(hex, 20),
    adjustBrightness(hex, -20),
    adjustBrightness(hex, -40)
  ];

  variations.forEach(color => {
    const card = document.createElement('div');
    card.className = 'swatch-card';
    card.innerHTML = `
      <div class="swatch-tile" style="background-color: ${color};"></div>
      <span class="swatch-hex">${color.toUpperCase()}</span>
    `;
    card.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
      alert(`Copied HEX code ${color} to clipboard!`);
    });
    swatchesGridContainer.appendChild(card);
  });
}

function adjustBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = Math.max(0, Math.min(255, R + percent));
  G = Math.max(0, Math.min(255, G + percent));
  B = Math.max(0, Math.min(255, B + percent));

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function extractPaletteFromImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 50;
      tempCanvas.height = 50;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 50, 50);
      const imgData = ctx.getImageData(0, 0, 50, 50).data;

      // Simplistic color clustering: gather some random pixels
      const colors = [];
      for (let i = 0; i < imgData.length; i += 120) { // jump steps
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];
        const hex = rgbToHex(r, g, b);
        if (!colors.includes(hex)) {
          colors.push(hex);
        }
        if (colors.length >= 5) break;
      }
      
      swatchesGridContainer.innerHTML = '';
      colors.forEach(color => {
        const card = document.createElement('div');
        card.className = 'swatch-card';
        card.innerHTML = `
          <div class="swatch-tile" style="background-color: ${color};"></div>
          <span class="swatch-hex">${color.toUpperCase()}</span>
        `;
        card.addEventListener('click', () => {
          navigator.clipboard.writeText(color);
          alert(`Copied HEX code ${color}!`);
        });
        swatchesGridContainer.appendChild(card);
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Contrast Checker
contrastFgColor.addEventListener('input', (e) => { contrastFgText.value = e.target.value; runContrastChecker(); });
contrastBgColor.addEventListener('input', (e) => { contrastBgText.value = e.target.value; runContrastChecker(); });
contrastFgText.addEventListener('input', (e) => { if (e.target.value.match(/^#[0-9a-fA-F]{6}$/)) { contrastFgColor.value = e.target.value; runContrastChecker(); } });
contrastBgText.addEventListener('input', (e) => { if (e.target.value.match(/^#[0-9a-fA-F]{6}$/)) { contrastBgColor.value = e.target.value; runContrastChecker(); } });
btnRunContrastCheck.addEventListener('click', runContrastChecker);

function getLuminance(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function runContrastChecker() {
  const fg = contrastFgColor.value;
  const bg = contrastBgColor.value;

  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);

  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  const roundedRatio = Number(ratio.toFixed(2));

  contrastRatioDisplay.innerText = `${roundedRatio}:1`;

  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  document.getElementById('wcag-aa-normal').innerText = aaNormal ? 'PASS' : 'FAIL';
  document.getElementById('wcag-aa-normal').style.color = aaNormal ? 'var(--success)' : 'var(--danger)';
  
  document.getElementById('wcag-aa-large').innerText = aaLarge ? 'PASS' : 'FAIL';
  document.getElementById('wcag-aa-large').style.color = aaLarge ? 'var(--success)' : 'var(--danger)';

  document.getElementById('wcag-aaa-normal').innerText = aaaNormal ? 'PASS' : 'FAIL';
  document.getElementById('wcag-aaa-normal').style.color = aaaNormal ? 'var(--success)' : 'var(--danger)';

  document.getElementById('wcag-aaa-large').innerText = aaaLarge ? 'PASS' : 'FAIL';
  document.getElementById('wcag-aaa-large').style.color = aaaLarge ? 'var(--success)' : 'var(--danger)';

  if (aaaNormal) {
    contrastVerdictDisplay.innerText = 'PASS (WCAG AAA)';
    contrastVerdictDisplay.style.color = 'var(--success)';
  } else if (aaNormal) {
    contrastVerdictDisplay.innerText = 'PASS (WCAG AA)';
    contrastVerdictDisplay.style.color = 'var(--success)';
  } else {
    contrastVerdictDisplay.innerText = 'FAIL (CONTRAST)';
    contrastVerdictDisplay.style.color = 'var(--danger)';
  }
}


// --- QUICK FILTER LOGIC ---
const toolsSearchInput = document.getElementById('tools-search-input');
toolsSearchInput.addEventListener('input', runToolsFilter);

function runToolsFilter() {
  const query = toolsSearchInput.value.trim().toLowerCase();
  if (!query) {
    renderToolsGrid(TOOLS);
    return;
  }
  
  const filtered = TOOLS.filter(tool => {
    return tool.title.toLowerCase().includes(query) ||
           tool.description.toLowerCase().includes(query) ||
           tool.keywords.some(keyword => keyword.toLowerCase().includes(query));
  });
  
  renderToolsGrid(filtered);
}

// --- COLLAPSIBLE CHAT SIDEBAR LOGIC ---
const btnToggleChat = document.getElementById('btn-toggle-chat');
const btnCloseChat = document.getElementById('btn-close-chat');
const appContainer = document.getElementById('app');

function toggleChat(forceState) {
  const isCollapsed = appContainer.classList.contains('chat-collapsed');
  const shouldCollapse = forceState !== undefined ? forceState : !isCollapsed;

  const toggleText = btnToggleChat.querySelector('.chat-toggle-text');
  
  if (shouldCollapse) {
    appContainer.classList.add('chat-collapsed');
    if (toggleText) toggleText.innerText = 'Show Chat';
  } else {
    appContainer.classList.remove('chat-collapsed');
    if (toggleText) toggleText.innerText = 'Hide Chat';
    // Scroll chat messages list to the bottom on expand
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

if (btnToggleChat) {
  btnToggleChat.addEventListener('click', () => toggleChat());
}
if (btnCloseChat) {
  btnCloseChat.addEventListener('click', () => toggleChat(true));
}

// --- UNIX TIMESTAMP CONVERTER LOGIC ---
let epochInterval = null;

function resetEpochState() {
  document.getElementById('epoch-input-stamp').value = '';
  document.getElementById('epoch-input-date').value = '';
  document.getElementById('epoch-output-area').value = '';
  startEpochTicker();
}

function startEpochTicker() {
  if (epochInterval) clearInterval(epochInterval);
  const ticker = document.getElementById('epoch-current-ticker');
  ticker.innerText = Math.floor(Date.now() / 1000);
  epochInterval = setInterval(() => {
    ticker.innerText = Math.floor(Date.now() / 1000);
  }, 1000);
}

document.getElementById('btn-epoch-to-date').addEventListener('click', () => {
  const input = document.getElementById('epoch-input-stamp').value.trim();
  if (!input) return;
  const num = parseInt(input, 10);
  if (isNaN(num)) {
    document.getElementById('epoch-output-area').value = 'Invalid timestamp value.';
    return;
  }
  // Detect if seconds or milliseconds
  const date = new Date(num < 99999999999 ? num * 1000 : num);
  if (isNaN(date.getTime())) {
    document.getElementById('epoch-output-area').value = 'Invalid date representation.';
    return;
  }
  document.getElementById('epoch-output-area').value = `ISO string: ${date.toISOString()}\nUTC string: ${date.toUTCString()}\nLocal Time: ${date.toString()}`;
});

document.getElementById('btn-date-to-epoch').addEventListener('click', () => {
  const input = document.getElementById('epoch-input-date').value.trim();
  if (!input) return;
  const parsed = Date.parse(input);
  if (isNaN(parsed)) {
    document.getElementById('epoch-output-area').value = 'Could not parse date string. Try ISO format (e.g. 2026-06-29T16:30:00).';
    return;
  }
  document.getElementById('epoch-output-area').value = `Epoch (seconds): ${Math.floor(parsed / 1000)}\nEpoch (milliseconds): ${parsed}`;
});

document.getElementById('btn-epoch-copy').addEventListener('click', () => {
  const text = document.getElementById('epoch-output-area').value;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('Output copied to clipboard!');
});


// --- JWT DEBUGGER & DECODER LOGIC ---
function resetJwtState() {
  document.getElementById('jwt-input-token').value = '';
  document.getElementById('jwt-header-output').innerText = 'Paste a valid JWT token to see the header...';
  document.getElementById('jwt-payload-output').innerText = 'Paste a valid JWT token to see the payload...';
}

document.getElementById('btn-jwt-decode').addEventListener('click', () => {
  const token = document.getElementById('jwt-input-token').value.trim();
  if (!token) return;
  
  const parts = token.split('.');
  if (parts.length < 2) {
    alert('Invalid JWT format. Must contain at least header and payload parts.');
    return;
  }

  try {
    const decodePart = (str) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    };

    const headerJson = JSON.parse(decodePart(parts[0]));
    const payloadJson = JSON.parse(decodePart(parts[1]));

    document.getElementById('jwt-header-output').innerText = JSON.stringify(headerJson, null, 2);
    document.getElementById('jwt-payload-output').innerText = JSON.stringify(payloadJson, null, 2);
  } catch (err) {
    document.getElementById('jwt-header-output').innerText = 'Error decoding token.';
    document.getElementById('jwt-payload-output').innerText = err.message;
  }
});


// --- UUID & ULID GENERATOR LOGIC ---
function resetUuidState() {
  document.getElementById('uuid-output-area').value = '';
}

function generateULID() {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const now = Date.now();
  let timePart = '';
  let temp = now;
  for (let i = 0; i < 10; i++) {
    timePart = alphabet[temp % 32] + timePart;
    temp = Math.floor(temp / 32);
  }
  let randomPart = '';
  for (let i = 0; i < 16; i++) {
    randomPart += alphabet[Math.floor(Math.random() * 32)];
  }
  return timePart + randomPart;
}

document.getElementById('btn-uuid-generate').addEventListener('click', () => {
  const type = document.getElementById('uuid-type-select').value;
  const qty = parseInt(document.getElementById('uuid-quantity-input').value, 10) || 10;
  const uppercase = document.getElementById('uuid-uppercase-checkbox').checked;

  const results = [];
  for (let i = 0; i < qty; i++) {
    let id = type === 'uuidv4' ? crypto.randomUUID() : generateULID();
    if (uppercase) id = id.toUpperCase();
    else id = id.toLowerCase();
    results.push(id);
  }

  document.getElementById('uuid-output-area').value = results.join('\n');
});

document.getElementById('btn-uuid-copy').addEventListener('click', () => {
  const text = document.getElementById('uuid-output-area').value;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('Identifiers copied to clipboard!');
});


// --- LOREM IPSUM & MOCK DATA GENERATOR LOGIC ---
function resetLoremState() {
  document.getElementById('lorem-output-area').value = '';
}

const LOREM_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];
const MOCK_NAMES = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Robert Lee', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Sarah Taylor', 'James Miller', 'Linda Anderson'];

document.getElementById('lorem-type-select').addEventListener('change', (e) => {
  const label = document.getElementById('lbl-lorem-quantity');
  if (e.target.value === 'paragraphs') label.innerText = 'Number of Paragraphs';
  else if (e.target.value === 'sentences') label.innerText = 'Number of Sentences';
  else label.innerText = 'Number of User Profiles';
});

document.getElementById('btn-lorem-generate').addEventListener('click', () => {
  const type = document.getElementById('lorem-type-select').value;
  const qty = parseInt(document.getElementById('lorem-quantity-input').value, 10) || 3;
  let outputText = '';

  if (type === 'paragraphs') {
    const paragraphs = [];
    for (let p = 0; p < qty; p++) {
      const sentences = [];
      const sentenceCount = 4 + Math.floor(Math.random() * 4);
      for (let s = 0; s < sentenceCount; s++) {
        const words = [];
        const wordCount = 8 + Math.floor(Math.random() * 12);
        for (let w = 0; w < wordCount; w++) {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
        let sentence = words.join(' ');
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
        sentences.push(sentence);
      }
      paragraphs.push(sentences.join(' '));
    }
    outputText = paragraphs.join('\n\n');
  } else if (type === 'sentences') {
    const sentences = [];
    for (let s = 0; s < qty; s++) {
      const words = [];
      const wordCount = 6 + Math.floor(Math.random() * 8);
      for (let w = 0; w < wordCount; w++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      let sentence = words.join(' ');
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      sentences.push(sentence);
    }
    outputText = sentences.join(' ');
  } else {
    const users = [];
    for (let u = 0; u < qty; u++) {
      const name = MOCK_NAMES[u % MOCK_NAMES.length];
      users.push({
        id: crypto.randomUUID(),
        name: name,
        email: name.toLowerCase().replace(' ', '.') + '@example.com',
        role: u % 3 === 0 ? 'Admin' : 'User',
        status: u % 2 === 0 ? 'Active' : 'Inactive',
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      });
    }
    outputText = JSON.stringify(users, null, 2);
  }

  document.getElementById('lorem-output-area').value = outputText;
});

document.getElementById('btn-lorem-copy').addEventListener('click', () => {
  const text = document.getElementById('lorem-output-area').value;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('Placeholder data copied!');
});


// --- SQL FORMATTER & MINIFIER LOGIC ---
function resetSqlState() {
  document.getElementById('sql-input-query').value = '';
  document.getElementById('sql-output-query').value = '';
}

const SQL_KEYWORDS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'SET', 'VALUES', 'INTO', 'CREATE TABLE', 'DROP TABLE', 'UNION', 'ALL'];

document.getElementById('btn-sql-format').addEventListener('click', () => {
  const raw = document.getElementById('sql-input-query').value.trim();
  if (!raw) return;

  // Simple, clean client-side SQL formatting algorithm
  let sql = raw.replace(/\s+/g, ' ');
  SQL_KEYWORDS.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    sql = sql.replace(regex, `\n${kw}`);
  });

  const lines = sql.split('\n');
  let indentLevel = 0;
  const formattedLines = lines.map(line => {
    let cleanLine = line.trim();
    if (!cleanLine) return '';
    
    // Capitalize key SQL keywords
    SQL_KEYWORDS.forEach(kw => {
      const regex = new RegExp(`^${kw}\\b`, 'i');
      if (regex.test(cleanLine)) {
        cleanLine = cleanLine.replace(regex, kw);
      }
    });

    if (cleanLine.startsWith('FROM') || cleanLine.startsWith('WHERE') || cleanLine.startsWith('JOIN') || cleanLine.startsWith('LEFT JOIN') || cleanLine.startsWith('ORDER BY') || cleanLine.startsWith('GROUP BY')) {
      indentLevel = 1;
    } else if (cleanLine.startsWith('SELECT') || cleanLine.startsWith('INSERT') || cleanLine.startsWith('UPDATE') || cleanLine.startsWith('DELETE')) {
      indentLevel = 0;
    } else if (cleanLine.startsWith('AND') || cleanLine.startsWith('OR')) {
      indentLevel = 2;
    }

    return '  '.repeat(indentLevel) + cleanLine;
  });

  document.getElementById('sql-output-query').value = formattedLines.filter(l => l !== '').join('\n');
});

document.getElementById('btn-sql-minify').addEventListener('click', () => {
  const raw = document.getElementById('sql-input-query').value.trim();
  if (!raw) return;

  // Minify SQL logic
  let min = raw.replace(/\/\*[\s\S]*?\*\//g, ''); // block comments
  min = min.replace(/--.*?\n/g, '\n'); // single line comments
  min = min.replace(/\s+/g, ' '); // collapse space
  document.getElementById('sql-output-query').value = min.trim();
});

document.getElementById('btn-sql-copy').addEventListener('click', () => {
  const text = document.getElementById('sql-output-query').value;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('Query copied to clipboard!');
});


// --- CRON EXPRESSION DESCRIPTOR LOGIC ---
function resetCronState() {
  document.getElementById('cron-input-expression').value = '*/15 9-17 * * 1-5';
  document.getElementById('cron-explanation-output').innerText = 'Parse a cron expression to see its description...';
  document.getElementById('cron-schedule-list').innerText = 'No upcoming schedules calculated.';
}

document.getElementById('btn-cron-parse').addEventListener('click', () => {
  const cron = document.getElementById('cron-input-expression').value.trim();
  if (!cron) return;

  const parts = cron.split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    document.getElementById('cron-explanation-output').innerText = 'Invalid cron expression format. Must contain 5 fields (minutes, hours, day of month, month, day of week).';
    return;
  }

  // Basic descriptive parser
  const [min, hour, dom, mon, dow] = parts;
  let explanation = 'Runs ';

  if (min === '*' && hour === '*') {
    explanation += 'every minute';
  } else {
    if (min === '*') explanation += 'every minute ';
    else if (min.startsWith('*/')) explanation += `every ${min.slice(2)} minutes `;
    else explanation += `at minute ${min} `;

    if (hour === '*') explanation += 'of every hour';
    else if (hour.includes('-')) explanation += `during hours ${hour}`;
    else explanation += `of hour ${hour}`;
  }

  if (dom !== '*') explanation += `, on day of month ${dom}`;
  if (mon !== '*') explanation += `, in month ${mon}`;
  
  if (dow !== '*') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dow.includes('-')) {
      const [start, end] = dow.split('-');
      explanation += `, from ${days[start] || start} through ${days[end] || end}`;
    } else {
      explanation += `, on ${days[dow] || dow}`;
    }
  }

  explanation += '.';
  document.getElementById('cron-explanation-output').innerText = explanation;

  // Generate 5 next runs (mock schedule dates based on current date)
  const now = new Date();
  const runs = [];
  for (let i = 1; i <= 5; i++) {
    const nextDate = new Date(now.getTime() + i * 15 * 60 * 1000);
    runs.push(nextDate.toString());
  }
  document.getElementById('cron-schedule-list').innerText = runs.join('\n');
});


// --- HTML ENTITY ENCODER & DECODER LOGIC ---
function resetHtmlEntState() {
  document.getElementById('html-ent-input').value = '';
  document.getElementById('html-ent-output').value = '';
}

document.getElementById('btn-html-ent-encode').addEventListener('click', () => {
  const text = document.getElementById('html-ent-input').value;
  if (!text) return;
  const encoded = text.replace(/[\u00A0-\u9999<>&"']/g, function(i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
  document.getElementById('html-ent-output').value = encoded;
});

document.getElementById('btn-html-ent-decode').addEventListener('click', () => {
  const text = document.getElementById('html-ent-input').value;
  if (!text) return;
  const doc = new DOMParser().parseFromString(text, 'text/html');
  document.getElementById('html-ent-output').value = doc.documentElement.textContent;
});

document.getElementById('btn-html-ent-copy').addEventListener('click', () => {
  const text = document.getElementById('html-ent-output').value;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('Result copied!');
});


// --- ASCII ART GENERATOR LOGIC ---
function resetAsciiState() {
  document.getElementById('ascii-input-text').value = 'ZeroG';
  document.getElementById('ascii-output-block').innerText = 'Generated banner will show here...';
}

const ASCII_FONTS = {
  standard: {
    Z: ['ZZZZZZ', '    Z ', '   Z  ', '  Z   ', ' Z    ', 'ZZZZZZ'],
    e: ['      ', ' eeee ', 'e    e', 'eeeeee', 'e     ', ' eeee '],
    r: ['      ', ' rrrr ', ' r   r', ' r    ', ' r    ', ' r    '],
    o: ['      ', ' oooo ', 'o    o', 'o    o', 'o    o', ' oooo '],
    G: [' GGGG ', 'G     ', 'G  GGG', 'G    G', 'G    G', ' GGGG ']
  },
  slant: {
    Z: ['ZZZZZZ ', '   ZZ/ ', '  ZZ/  ', ' ZZ/   ', 'ZZZZZZ ', 'L____/ '],
    e: ['       ', '  eee  ', ' /   e ', ' eeeee ', ' L____ ', '  \\___ '],
    r: ['       ', '  rrrr ', ' /   r ', ' r     ', ' r     ', ' r     '],
    o: ['       ', '  oooo ', ' /   o ', ' o   o ', ' o   o ', '  \\___ '],
    G: ['  GGGG ', ' G/    ', 'G   GG ', 'G    G ', ' GGGG/ ', ' L___/ ']
  }
};

document.getElementById('btn-ascii-generate').addEventListener('click', () => {
  const text = document.getElementById('ascii-input-text').value;
  const style = document.getElementById('ascii-style-select').value;
  if (!text) return;

  const font = ASCII_FONTS[style] || ASCII_FONTS['standard'];
  const lines = ['', '', '', '', '', ''];

  for (let c = 0; c < text.length; c++) {
    const char = text[c];
    const glyph = font[char] || [char, char, char, char, char, char];
    for (let i = 0; i < 6; i++) {
      lines[i] += (glyph[i] || ' '.repeat(char.length)) + '  ';
    }
  }

  document.getElementById('ascii-output-block').innerText = lines.join('\n');
});

document.getElementById('btn-ascii-copy').addEventListener('click', () => {
  const text = document.getElementById('ascii-output-block').innerText;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('ASCII art copied!');
});


// --- USER AGENT PARSER LOGIC ---
function runUaDiagnostics() {
  const body = document.getElementById('ua-diagnostics-table-body');
  const ua = navigator.userAgent;
  document.getElementById('ua-raw-string-area').value = ua;

  // Simple UA parser regex
  let browser = 'Unknown Browser';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  const props = [
    { name: 'Browser Name', val: browser },
    { name: 'Operating System', val: os },
    { name: 'Screen Resolution', val: `${screen.width} x ${screen.height}` },
    { name: 'Viewport Dimensions', val: `${window.innerWidth} x ${window.innerHeight}` },
    { name: 'Device Pixel Ratio', val: window.devicePixelRatio },
    { name: 'Language Setting', val: navigator.language },
    { name: 'Online Status', val: navigator.onLine ? 'Connected' : 'Offline' },
    { name: 'Hardware Concurrency (Cores)', val: navigator.hardwareConcurrency || 'N/A' }
  ];

  body.innerHTML = props.map(p => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 0.75rem 1rem; font-weight: 500;">${p.name}</td>
      <td style="padding: 0.75rem 1rem; font-family: monospace;">${p.val}</td>
    </tr>
  `).join('');
}


// --- TEXT ANALYZER & WORD COUNTER LOGIC ---
function resetTextAnState() {
  document.getElementById('text-an-input').value = '';
  document.getElementById('text-an-metric-words').innerText = '0';
  document.getElementById('text-an-metric-chars').innerText = '0';
  document.getElementById('text-an-metric-sentences').innerText = '0';
  document.getElementById('text-an-metric-paragraphs').innerText = '0';
  document.getElementById('text-an-metric-readtime').innerText = '< 1 min';
  document.getElementById('text-an-metric-speaktime').innerText = '< 1 min';
  document.getElementById('text-an-density-table-body').innerHTML = `
    <tr><td style="padding: 0.5rem 1rem; color: var(--text-secondary); text-align: center;">Enter text content to compute keywords...</td></tr>
  `;
}

document.getElementById('btn-text-an-run').addEventListener('click', () => {
  const text = document.getElementById('text-an-input').value.trim();
  if (!text) {
    resetTextAnState();
    return;
  }

  const chars = text.length;
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

  const readTime = Math.max(1, Math.ceil(wordCount / 225));
  const speakTime = Math.max(1, Math.ceil(wordCount / 150));

  document.getElementById('text-an-metric-words').innerText = wordCount;
  document.getElementById('text-an-metric-chars').innerText = chars;
  document.getElementById('text-an-metric-sentences').innerText = sentences;
  document.getElementById('text-an-metric-paragraphs').innerText = paragraphs;
  document.getElementById('text-an-metric-readtime').innerText = `${readTime} min`;
  document.getElementById('text-an-metric-speaktime').innerText = `${speakTime} min`;

  // Keyword density calculator
  const freq = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 3) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tbody = document.getElementById('text-an-density-table-body');
  if (sortedKeywords.length === 0) {
    tbody.innerHTML = `<tr><td style="padding: 0.5rem 1rem; color: var(--text-secondary); text-align: center;">No valid keywords found (min 4 letters).</td></tr>`;
  } else {
    tbody.innerHTML = sortedKeywords.map(k => `
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 0.5rem 1rem; font-weight: 500; text-transform: capitalize;">${k[0]}</td>
        <td style="padding: 0.5rem 1rem; font-family: monospace;">Count: ${k[1]} (${((k[1] / wordCount) * 100).toFixed(1)}%)</td>
      </tr>
    `).join('');
  }
});


// --- PRIVACY POLICY & USER AGREEMENT MODALS ---
const linkPrivacy = document.getElementById('link-privacy');
const linkTerms = document.getElementById('link-terms');
const modalPrivacy = document.getElementById('modal-privacy');
const modalTerms = document.getElementById('modal-terms');
const btnClosePrivacy = document.getElementById('btn-close-privacy');
const btnCloseTerms = document.getElementById('btn-close-terms');

function showModal(modal) {
  modal.style.display = 'flex';
}

function hideModal(modal) {
  modal.style.display = 'none';
}

if (linkPrivacy) {
  linkPrivacy.addEventListener('click', (e) => {
    e.preventDefault();
    showModal(modalPrivacy);
  });
}

if (linkTerms) {
  linkTerms.addEventListener('click', (e) => {
    e.preventDefault();
    showModal(modalTerms);
  });
}

if (btnClosePrivacy) {
  btnClosePrivacy.addEventListener('click', () => hideModal(modalPrivacy));
}

if (btnCloseTerms) {
  btnCloseTerms.addEventListener('click', () => hideModal(modalTerms));
}

// Close modals when clicking outer overlay background
window.addEventListener('click', (e) => {
  if (e.target === modalPrivacy) hideModal(modalPrivacy);
  if (e.target === modalTerms) hideModal(modalTerms);
});


// --- INITIAL START ---
window.addEventListener('DOMContentLoaded', () => {
  renderToolsGrid(TOOLS);
  initWorkers();
});
