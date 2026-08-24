import { describe, expect, it } from 'vitest';
import {
  cloudflareImageUrl,
  focalPointToCss,
  normalizeFocalPoint,
  shouldUseCloudflareImageTransformations,
} from '../src/lib/media/cloudflare-images';

describe('Cloudflare image transformations', () => {
  it('builds a 4:3 mythology thumbnail URL with a focal point', () => {
    expect(cloudflareImageUrl('/media/mythology/chinese-light.jpg', {
      width: 480,
      height: 360,
      fit: 'cover',
      focalPoint: { x: 0.5, y: 0.42 },
    })).toBe('/cdn-cgi/image/width=480,height=360,fit=cover,gravity=0.500x0.420,quality=82,format=auto/media/mythology/chinese-light.jpg');
  });

  it('keeps the source URL when transformations are disabled', () => {
    expect(cloudflareImageUrl('/media/mythology/chinese-light.jpg', { width: 480 }, false))
      .toBe('/media/mythology/chinese-light.jpg');
  });

  it('clamps focal coordinates and exposes CSS positions', () => {
    expect(normalizeFocalPoint({ x: -0.2, y: 1.4 })).toEqual({ x: 0, y: 1 });
    expect(focalPointToCss({ x: 0.33, y: 0.42 })).toEqual({ x: '33.0%', y: '42.0%' });
  });

  it('enables transformations only on the canonical production hostname', () => {
    const site = new URL('https://mythcanvas.space');
    expect(shouldUseCloudflareImageTransformations(new URL('https://mythcanvas.space/'), site)).toBe(true);
    expect(shouldUseCloudflareImageTransformations(new URL('http://localhost:4321/'), site)).toBe(false);
    expect(shouldUseCloudflareImageTransformations(new URL('https://preview.workers.dev/'), site)).toBe(false);
  });
});
