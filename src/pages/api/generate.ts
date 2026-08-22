import type { APIRoute } from 'astro';
import { generateArtwork } from '../../lib/generation/service';
import { GenerationValidationError, parseGenerationRequest } from '../../lib/generation/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = await request.json().catch(() => null);
    const generationRequest = parseGenerationRequest(payload);
    const result = await generateArtwork(generationRequest, locals.runtime.env);

    return json(result, result.status === 'failed' ? 502 : 200);
  } catch (error) {
    if (error instanceof GenerationValidationError) {
      return json({
        status: 'failed',
        error: { code: error.code, message: error.message },
      }, error.status);
    }

    console.error('Unexpected generation API error', error);
    return json({
      status: 'failed',
      error: { code: 'INTERNAL_ERROR', message: '生成服务暂时不可用，请稍后再试。' },
    }, 500);
  }
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
