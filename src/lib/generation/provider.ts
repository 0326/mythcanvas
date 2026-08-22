import type { ProviderGenerationRequest, ProviderGenerationResult } from './types';

export type GenerationProviderEnv = {
  AI_GENERATION_MODE?: 'mock' | 'http';
  AI_PROVIDER_ENDPOINT?: string;
  AI_PROVIDER_API_KEY?: string;
};

export interface ImageGenerationProvider {
  name: string;
  generate(input: ProviderGenerationRequest): Promise<ProviderGenerationResult>;
}

export function createImageGenerationProvider(env: GenerationProviderEnv): ImageGenerationProvider {
  const mode = env.AI_GENERATION_MODE ?? 'mock';
  if (mode === 'http' && env.AI_PROVIDER_ENDPOINT) {
    return new HttpImageProvider(env.AI_PROVIDER_ENDPOINT, env.AI_PROVIDER_API_KEY);
  }
  return new MockImageProvider();
}

class MockImageProvider implements ImageGenerationProvider {
  name = 'mock-svg';

  async generate(input: ProviderGenerationRequest): Promise<ProviderGenerationResult> {
    const svg = createMockSvg(input);
    return {
      provider: this.name,
      providerRequestId: `mock-${input.id}`,
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
        metadata: input.metadata,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Image provider failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ''}`);
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
    };

    if (payload.imageBase64) {
      return {
        provider: this.name,
        providerRequestId: payload.requestId,
        bytes: decodeBase64(payload.imageBase64),
        mimeType: payload.mimeType ?? 'image/png',
        width: payload.width ?? input.width,
        height: payload.height ?? input.height,
      };
    }

    if (payload.imageUrl) {
      const imageResponse = await fetch(payload.imageUrl);
      if (!imageResponse.ok) throw new Error(`Provider image fetch failed (${imageResponse.status})`);
      const imageType = imageResponse.headers.get('content-type')?.split(';')[0] ?? payload.mimeType ?? 'image/png';
      return {
        provider: this.name,
        providerRequestId: payload.requestId,
        bytes: new Uint8Array(await imageResponse.arrayBuffer()),
        mimeType: imageType,
        width: payload.width ?? input.width,
        height: payload.height ?? input.height,
      };
    }

    throw new Error('Image provider returned no supported image payload.');
  }
}

function decodeBase64(value: string): Uint8Array {
  const clean = value.includes(',') ? value.slice(value.indexOf(',') + 1) : value;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
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
  const subtitle = escapeXml(`${input.metadata.styleName ?? 'Myth'} · ${input.metadata.scene ?? 'Realm'}`);
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
