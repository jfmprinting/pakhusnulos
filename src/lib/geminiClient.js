/**
 * Gemini AI Client - Multi API Key with Automatic Failover
 * Adapted from BuatSoal Online ai-generator pattern.
 *
 * STORAGE: Keys disimpan di localStorage ('ph_os_gemini_keys') dan Supabase user_settings.
 * FAILOVER: Jika key 1 kena rate limit (429/403/503), otomatis coba key berikutnya.
 */

const STORAGE_KEY = 'ph_os_gemini_keys';

const DEFAULT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

/** Build Gemini API URL with placeholder */
const geminiUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/**
 * Load API keys from localStorage.
 * Returns array of clean, non-empty key strings.
 */
export function loadGeminiKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((k) => (typeof k === 'string' ? k.trim() : ''))
        .filter((k) => k.length > 0);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Save API keys to localStorage.
 */
export function saveGeminiKeys(keys) {
  const clean = keys
    .map((k) => (typeof k === 'string' ? k.trim() : ''))
    .filter((k) => k.length > 0);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
}

/**
 * Try fetching Gemini with a single key and model.
 * Returns Response or null on network error.
 */
async function fetchWithKey(model, key, body) {
  try {
    const response = await fetch(geminiUrl(model), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (err) {
    console.warn(`Network error for model ${model}:`, err);
    return null;
  }
}

/**
 * Core function: try prompt across multiple keys and models with automatic failover.
 *
 * @param {string} prompt - The text prompt to send
 * @param {object} options - { keys, models, temperature, onStatus, systemInstruction }
 * @returns {Promise<string>} - The generated text
 */
export async function generateWithGemini(prompt, options = {}) {
  const {
    keys = loadGeminiKeys(),
    models = DEFAULT_MODELS,
    temperature = 0.7,
    onStatus = (msg) => console.log('[Gemini]', msg),
    systemInstruction = null,
  } = options;

  if (!keys || keys.length === 0) {
    throw new Error(
      'Tidak ada Gemini API Key tersimpan. Tambahkan minimal 1 API key di menu Pengaturan > API Keys.'
    );
  }

  const cleanKeys = keys
    .map((k) => (typeof k === 'string' ? k.trim() : ''))
    .filter((k) => k.length > 0);

  let lastError = 'Semua key dan model gagal.';

  for (const model of models) {
    onStatus(`Mencoba model: ${model}...`);

    for (const key of cleanKeys) {
      const body = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
        },
      };

      if (systemInstruction) {
        body.system_instruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const response = await fetchWithKey(model, key, body);

      if (!response) {
        lastError = `${model} / key ...${key.slice(-6)}: Network error`;
        continue;
      }

      // Rate limit or quota exceeded - try next key
      if (response.status === 429 || response.status === 403 || response.status === 503) {
        console.warn(
          `Key ...${key.slice(-6)} got ${response.status} on ${model}, trying next key...`
        );
        lastError = `Key ...${key.slice(-6)}: Status ${response.status}`;
        continue;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = `${model}: ${errData?.error?.message || response.statusText}`;
        console.warn(`Model ${model} error:`, lastError);
        break; // Try next model, not next key (structural error)
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text && text.trim().length > 0) {
        onStatus(`Berhasil dengan model: ${model}`);
        return text.trim();
      }

      lastError = `${model}: Response kosong`;
    }
  }

  throw new Error(`Gagal generate konten. Detail: ${lastError}`);
}

/**
 * Test a single API key with a simple prompt.
 * Returns { ok: boolean, model: string, error: string }
 */
export async function testGeminiKey(key) {
  try {
    const text = await generateWithGemini('Halo, balas singkat saja: "API Key Aktif"', {
      keys: [key],
      temperature: 0,
      onStatus: () => {},
    });
    return { ok: true, model: 'gemini-2.5-flash', response: text };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export { DEFAULT_MODELS };
