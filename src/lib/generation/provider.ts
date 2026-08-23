import type { GenerationQuality, ProviderGenerationRequest, ProviderGenerationResult } from './types';

export type GenerationProviderEnv = {
  AI_GENERATION_MODE?: 'mock' | 'http' | 'openai';
  AI_PROVIDER_ENDPOINT?: string;
  AI_PROVIDER_API_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_IMAGE_MODEL?: string;
  OPENAI_IMAGE_QUALITY?: GenerationQuality;
};

export interface ImageGenerationProvider {
  name: string;
  generate(input: ProviderGenerationRequest): Promise<ProviderGenerationResult>;
}

export class ImageProviderError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = 'ImageProviderError';
  }
}

export function createImageGenerationProvider(env: GenerationProviderEnv): ImageGenerationProvider {
  const mode = env.AI_GENERATION_MODE ?? 'mock';
  if (mode === 'openai') {
    if (!env.OPENAI_API_KEY) {
      throw new ImageProviderError('OPENAI_API_KEY_MISSING', 'OPENAI_API_KEY is required when AI_GENERATION_MODE=openai.');
    }
    return new OpenAIImageProvider({
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2',
      quality: env.OPENAI_IMAGE_QUALITY ?? 'high',
    });
  }
  if (mode === 'http' && env.AI_PROVIDER_ENDPOINT) {
    return new HttpImageProvider(env.AI_PROVIDER_ENDPOINT, env.AI_PROVIDER_API_KEY);
  }
  return new MockImageProvider();
}

class OpenAIImageProvider implements ImageGenerationProvider {
  readonly name: string;

  constructor(
    private readonly options: {
      apiKey: string;
      model: string;
      quality: GenerationQuality;
    },
  ) {
    this.name = `openai:${options.model}`;
  }

  async generate(input: ProviderGenerationRequest): Promise<ProviderGenerationResult> {
    const quality = input.quality ?? this.options.quality;
    const references = input.references ?? [];
    const response = references.length
      ? await this.editWithReferences(input, quality, references)
      : await this.generateFromText(input, quality);

    const requestId = response.headers.get('x-request-id') ?? undefined;
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as OpenAIErrorPayload | null;
      const providerCode = payload?.error?.code || payload?.error?.type || `HTTP_${response.status}`;
      const message = payload?.error?.message || `OpenAI image generation failed (${response.status}).`;
      throw new ImageProviderError(
        `OPENAI_${String(providerCode).toUpperCase()}`,
        message,
        response.status,
        response.status === 429 || response.status >= 500,
      );
    }

    const payload = await response.json() as OpenAIImagePayload;
    const imageBase64 = payload.data?.[0]?.b64_json;
    if (!imageBase64) {
      throw new ImageProviderError('OPENAI_EMPTY_IMAGE', 'GPT Image 2 returned no image data.', response.status);
    }

    return {
      provider: this.name,
      providerRequestId: requestId,
      model: this.options.model,
      bytes: decodeBase64(imageBase64),
      mimeType: 'image/png',
      width: input.width,
      height: input.height,
    };
  }

  private generateFromText(input: ProviderGenerationRequest, quality: GenerationQuality): Promise<Response> {
    return fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.options.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.options.model,
        prompt: input.prompt,
        size: `${input.width}x${input.height}`,
        quality,
      }),
    });
  }

  private editWithReferences(
    input: ProviderGenerationRequest,
    quality: GenerationQuality,
    references: NonNullable<ProviderGenerationRequest['references']>,
  ): Promise<Response> {
    const body = new FormData();
    body.set('model', this.options.model);
    body.set('prompt', [
      input.prompt,
      'Use the supplied images as high-fidelity identity references. Preserve the recurring subject identity and approved persistent design anchors while applying the requested variant, style, scene, and wallpaper composition.',
    ].join('\n\n'));
    body.set('size', `${input.width}x${input.height}`);
    body.set('quality', quality);

    references.forEach((reference, index) => {
      const bytes = reference.bytes;
      const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      const blob = new Blob([buffer], { type: reference.mimeType || 'image/png' });
      body.append('image[]', blob, `reference-${index + 1}.${extensionForMime(reference.mimeType)}`);
    });

    // GPT Image 2 processes image inputs at high fidelity automatically; do not
    // send input_fidelity because the current API does not allow overriding it.
    return fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { authorization: `Bearer ${this.options.apiKey}` },
      body,
    });
  }
}

type OpenAIImagePayload = {
  data?: Array<{ b64_json?: string }>;
};

type OpenAIErrorPayload = {
  error?: {
    code?: string | null;
    type?: string;
    message?: string;
  };
};

class MockImageProvider implements ImageGenerationProvider {
  name = 'mock-svg';

  async generate(input: ProviderGenerationRequest): Promise<ProviderGenerationResult> {
    const svg = createMockSvg(input);
    return {
      provider: this.name,
      providerRequestId: `mock-${input.id}`,
      model: 'mock-svg',
      bytes: new TextEncoder().encode(svg),
      mimeType: 'image/svg+xml',
      width: input.width,
      height: input.height,
    };
  }
}

class HttpImageProvider implements ImageGenerationProvider {
  name = 'http-provider';

  constructor(
    private endpoint: string,
    private apiKey?: string,
  ) {}

  async generate(input: ProviderGenerationRequest): Promise<ProviderGenerationResult> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        prompt: input.prompt,
        width: input.width,
        height: input.height,
        quality: input.quality,
        references: input.references?.map((reference) => ({
          id: reference.id,
          assetType: reference.assetType,
          mimeType: reference.mimeType,
          imageBase64: encodeBase64(reference.bytes),
        })) ?? [],
        metadata: input.metadata,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new ImageProviderError(
        'HTTP_PROVIDER_FAILED',
        `Image provider failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ''}`,
        response.status,
        response.status === 429 || response.status >= 500,
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.startsWith('image/')) {
      return {
        provider: this.name,
        providerRequestId: response.headers.get('x-request-id') ?? undefined,
        bytes: new Uint8Array(await response.arrayBuffer()),
        mimeType: contentType.split(';')[0],
        width: input.width,
        height: input.height,
      };
    }

    const payload = await response.json() as {
      requestId?: string;
      imageBase64?: string;
      imageUrl?: string;
      mimeType?: string;
      width?: number;
      height?: number;
      model?: string;
    };

    if (payload.imageBase64) {
      return {
        provider: this.name,
        providerRequestId: payload.requestId,
        model: payload.model,
        bytes: decodeBase64(payload.imageBase64),
        mimeType: payload.mimeType ?? 'image/png',
        width: payload.width ?? input.width,
        height: payload.height ?? input.height,
      };
    }

    if (payload.imageUrl) {
      const imageResponse = await fetch(payload.imageUrl);
      if (!imageResponse.ok) throw new ImageProviderError('HTTP_PROVIDER_IMAGE_FETCH_FAILED', `Provider image fetch failed (${imageResponse.status})`, imageResponse.status, imageResponse.status >= 500);
      const imageType = imageResponse.headers.get('content-type')?.split(';')[0] ?? payload.mimeType ?? 'image/png';
      return {
        provider: this.name,
        providerRequestId: payload.requestId,
        model: payload.model,
        bytes: new Uint8Array(await imageResponse.arrayBuffer()),
        mimeType: imageType,
        width: payload.width ?? input.width,
        height: payload.height ?? input.height,
      };
    }

    throw new ImageProviderError('HTTP_PROVIDER_EMPTY_IMAGE', 'Image provider returned no supported image payload.');
  }
}

function decodeBase64(value: string): Uint8Array {
  const clean = value.includes(',') ? value.slice(value.indexOf(',') + 1) : value;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg': return 'jpg';
    case 'image/webp': return 'webp';
    default: return 'png';
  }
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function createMockSvg(input: ProviderGenerationRequest): string {
  const title = escapeXml(input.metadata.entityName ?? 'MythCanvas');
  const referenceCount = input.references?.length ?? 0;
  const subtitle = escapeXml(`${input.metadata.styleName ?? 'Myth'} · ${input.metadata.scene ?? 'World'}${referenceCount ? ` · ${referenceCount} refs` : ''}`);
  const wide = input.width >= input.height;
  const moonX = wide ? Math.round(input.width * 0.76) : Math.round(input.width * 0.72);
  const moonY = Math.round(input.height * 0.2);
  const moonR = Math.round(Math.min(input.width, input.height) * 0.12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${input.width}" height="${input.height}" viewBox="0 0 ${input.width} ${input.height}" role="img" aria-label="MythCanvas mock generation">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef6fb"/><stop offset="0.52" stop-color="#f6ead1"/><stop offset="1" stop-color="#8bb5c6"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f2d28b"/><stop offset="1" stop-color="#9b6d25"/></linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#sky)"/>
  <circle cx="${moonX}" cy="${moonY}" r="${moonR}" fill="#fff8de" opacity=".9"/>
  <circle cx="${moonX}" cy="${moonY}" r="${moonR + 20}" fill="none" stroke="#d4aa58" stroke-width="2" opacity=".5"/>
  <g fill="#547f87" opacity=".32"><path d="M0 ${input.height * 0.72} L${input.width * 0.18} ${input.height * 0.42} L${input.width * 0.34} ${input.height * 0.7} L${input.width * 0.53} ${input.height * 0.38} L${input.width * 0.76} ${input.height * 0.72} Z"/><path d="M${input.width * 0.5} ${input.height * 0.76} L${input.width * 0.75} ${input.height * 0.45} L${input.width} ${input.height * 0.72} V${input.height} H${input.width * 0.5}Z"/></g>
  <g transform="translate(${input.width * 0.5} ${input.height * 0.57})" fill="none" stroke="#b98734" stroke-width="${Math.max(3, Math.round(input.width / 360))}"><path d="M-${input.width * 0.18} ${input.height * 0.1}H${input.width * 0.18}L${input.width * 0.14} ${input.height * 0.04}H-${input.width * 0.14}Z" fill="#fff8e9"/><path d="M-${input.width * 0.12} ${input.height * 0.04}H${input.width * 0.12}L${input.width * 0.08}-${input.height * 0.02}H-${input.width * 0.08}Z" fill="url(#gold)"/><rect x="-${input.width * 0.07}" y="-${input.height * 0.07}" width="${input.width * 0.14}" height="${input.height * 0.05}" fill="#fff8e9"/><path d="M-${input.width * 0.1}-${input.height * 0.07}H${input.width * 0.1}L${input.width * 0.05}-${input.height * 0.12}H-${input.width * 0.05}Z" fill="url(#gold)"/></g>
  <g fill="#ffffff" opacity=".55" filter="url(#blur)"><ellipse cx="${input.width * 0.25}" cy="${input.height * 0.8}" rx="${input.width * 0.3}" ry="${input.height * 0.08}"/><ellipse cx="${input.width * 0.72}" cy="${input.height * 0.83}" rx="${input.width * 0.38}" ry="${input.height * 0.09}"/></g>
  <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle" fill="#6c4f24"><text x="${input.width * 0.5}" y="${input.height * 0.16}" font-size="${Math.round(Math.min(input.width, input.height) * 0.07)}">${title}</text><text x="${input.width * 0.5}" y="${input.height * 0.21}" font-size="${Math.round(Math.min(input.width, input.height) * 0.025)}" opacity=".76">${subtitle}</text></g>
  <text x="${input.width * 0.5}" y="${input.height * 0.95}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${Math.round(Math.min(input.width, input.height) * 0.018)}" fill="#6a7d80" opacity=".72">MythCanvas · mock pipeline preview</text>
</svg>`;
}
