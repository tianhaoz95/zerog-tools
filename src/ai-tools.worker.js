import { pipeline, env, RawImage } from '@huggingface/transformers';

env.allowLocalModels = false;

let sentimentPipeline = null;
let translationPipeline = null;
let detectorPipeline = null;
let summarizationPipeline = null;
let embeddingsPipeline = null;

self.onmessage = async (e) => {
  const { type, task, data } = e.data;

  if (type === 'init') {
    try {
      self.postMessage({ type: 'status', task, data: 'loading', progress: 0 });

      const progressCallback = (progressData) => {
        if (progressData.status === 'progress') {
          self.postMessage({
            type: 'status',
            task,
            data: 'loading',
            progress: progressData.progress,
            file: progressData.file
          });
        }
      };

      if (task === 'sentiment' && !sentimentPipeline) {
        sentimentPipeline = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
          progress_callback: progressCallback
        });
      } else if (task === 'translation' && !translationPipeline) {
        translationPipeline = await pipeline('translation', 'Xenova/t5-small', {
          progress_callback: progressCallback
        });
      } else if (task === 'detection' && !detectorPipeline) {
        detectorPipeline = await pipeline('object-detection', 'Xenova/yolos-tiny', {
          progress_callback: progressCallback
        });
      } else if (task === 'summarization' && !summarizationPipeline) {
        summarizationPipeline = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6', {
          progress_callback: progressCallback
        });
      } else if (task === 'embeddings' && !embeddingsPipeline) {
        embeddingsPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          progress_callback: progressCallback
        });
      }

      self.postMessage({ type: 'status', task, data: 'ready' });
    } catch (err) {
      console.error(`Failed to load model for task ${task}:`, err);
      self.postMessage({ type: 'status', task, data: 'error', error: err.message });
    }
  }

  else if (type === 'run') {
    try {
      if (task === 'sentiment') {
        if (!sentimentPipeline) throw new Error('Sentiment model not initialized');
        const result = await sentimentPipeline(data.text);
        self.postMessage({ type: 'result', task, data: result });
      }

      else if (task === 'translation') {
        if (!translationPipeline) throw new Error('Translation model not initialized');
        
        // Map common language pairs for T5
        // T5-small supports english to french, german, romanian
        const sourceLang = data.source.toLowerCase();
        const targetLang = data.target.toLowerCase();
        
        let t5Task = 'translation_en_to_fr';
        if (sourceLang === 'en' && targetLang === 'de') t5Task = 'translation_en_to_de';
        else if (sourceLang === 'en' && targetLang === 'ro') t5Task = 'translation_en_to_ro';
        else if (sourceLang === 'fr' && targetLang === 'en') t5Task = 'translation_fr_to_en';
        else if (sourceLang === 'de' && targetLang === 'en') t5Task = 'translation_de_to_en';

        const result = await translationPipeline(data.text, {
          src_lang: data.source,
          tgt_lang: data.target,
          task: t5Task
        });
        self.postMessage({ type: 'result', task, data: result });
      }

      else if (task === 'detection') {
        if (!detectorPipeline) throw new Error('Detector model not initialized');
        const { width, height, rgbaData } = data;
        
        const rawImage = new RawImage(rgbaData, width, height, 4);
        const result = await detectorPipeline(rawImage);
        
        self.postMessage({ type: 'result', task, data: result });
      }

      else if (task === 'summarization') {
        if (!summarizationPipeline) throw new Error('Summarization model not initialized');
        const length = data.length || 'medium';
        let max_new_tokens = 100;
        let min_new_tokens = 30;
        if (length === 'short') {
          max_new_tokens = 50;
          min_new_tokens = 15;
        } else if (length === 'long') {
          max_new_tokens = 250;
          min_new_tokens = 80;
        }
        
        const result = await summarizationPipeline(data.text, {
          max_new_tokens,
          min_new_tokens
        });
        self.postMessage({ type: 'result', task, data: result });
      }

      else if (task === 'embeddings') {
        if (!embeddingsPipeline) throw new Error('Embeddings model not initialized');
        const results = [];
        for (const text of data.texts) {
          const out = await embeddingsPipeline(text, { pooling: 'mean', normalize: true });
          results.push(Array.from(out.data));
        }
        self.postMessage({ type: 'result', task, data: results });
      }
    } catch (err) {
      self.postMessage({ type: 'error', task, error: err.message });
    }
  }
};
