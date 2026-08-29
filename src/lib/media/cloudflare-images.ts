export type ImageFocalPoint = {
  x: number;
  y: number;
};

export type CloudflareImageTransformOptions = {
  width: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'aspect-crop' | 'pad';
  quality?: number;
  format?: 'auto' | 'avif' | 'webp' | 'json';
  focalPoint?: ImageFocalPoint;
};

export type ArtworkListImageVariant = 'hero' | 'side' | 'tile';

export type ArtworkListImage = {
  src: string | undefined;
  width: number;
  height: number;
};

export const DEFAULT_IMAGE_FOCAL_POINT: ImageFocalPoint = { x: 0.5, y: 0.5 };
export const ARTWORK_LIST_FOCAL_POINT: ImageFocalPoint = { x: 0.5, y: 0.34 };

const clampFocalCoordinate = (value: number) => Math.min(1, Math.max(0, value));

export function normalizeFocalPoint(focalPoint?: ImageFocalPoint): ImageFocalPoint {
  if (!focalPoint) return DEFAULT_IMAGE_FOCAL_POINT;
  return {
    x: clampFocalCoordinate(focalPoint.x),
    y: clampFocalCoordinate(focalPoint.y),
  };
}

export function shouldUseCloudflareImageTransformations(requestUrl: URL, siteUrl?: URL): boolean {
  if (!siteUrl) return false;
  return requestUrl.hostname === siteUrl.hostname;
}

export function cloudflareImageUrl(
  src: string | undefined,
  options: CloudflareImageTransformOptions,
  enabled = true,
): string | undefined {
  if (!src) return undefined;
  if (!enabled || src.startsWith('data:') || src.startsWith('blob:')) return src;

  const focalPoint = normalizeFocalPoint(options.focalPoint);
  const params = [
    `width=${Math.max(1, Math.round(options.width))}`,
    options.height ? `height=${Math.max(1, Math.round(options.height))}` : undefined,
    `fit=${options.fit ?? 'cover'}`,
    `gravity=${focalPoint.x.toFixed(3)}x${focalPoint.y.toFixed(3)}`,
    `quality=${Math.min(100, Math.max(1, Math.round(options.quality ?? 82)))}`,
    `format=${options.format ?? 'auto'}`,
  ].filter(Boolean);

  const source = /^https?:\/\//i.test(src) ? src : src.replace(/^\/+/, '');
  return `/cdn-cgi/image/${params.join(',')}/${source}`;
}

export function cloudflareArtworkListImage(
  src: string | undefined,
  sourceWidth: number,
  sourceHeight: number,
  variant: ArtworkListImageVariant = 'tile',
  enabled = true,
): ArtworkListImage {
  const width = variant === 'hero' ? 1440 : variant === 'side' ? 960 : 720;
  const sourceRatio = sourceWidth > 0 && sourceHeight > 0 ? sourceWidth / sourceHeight : 1;
  const ratio = variant === 'hero' ? 4 / 3 : variant === 'side' ? 16 / 9 : sourceRatio;
  const height = Math.max(1, Math.round(width / ratio));

  return {
    src: cloudflareImageUrl(
      src,
      {
        width,
        height,
        fit: 'cover',
        quality: 78,
        format: 'auto',
        // Keep faces toward the upper half when a wide feature card needs a crop.
        focalPoint: ARTWORK_LIST_FOCAL_POINT,
      },
      enabled,
    ) ?? src,
    width,
    height,
  };
}

export function cloudflareImageSrcSet(
  src: string | undefined,
  widths: readonly number[],
  options: Omit<CloudflareImageTransformOptions, 'width'> = {},
  enabled = true,
): string | undefined {
  if (!src || !enabled || src.startsWith('data:') || src.startsWith('blob:')) return undefined;
  const normalizedWidths = [...new Set(widths.map((width) => Math.max(1, Math.round(width))))]
    .sort((a, b) => a - b);
  if (normalizedWidths.length === 0) return undefined;
  return normalizedWidths
    .map((width) => `${cloudflareImageUrl(src, { ...options, width }, true)} ${width}w`)
    .join(', ');
}

export function focalPointToCss(focalPoint?: ImageFocalPoint): { x: string; y: string } {
  const normalized = normalizeFocalPoint(focalPoint);
  return {
    x: `${(normalized.x * 100).toFixed(1)}%`,
    y: `${(normalized.y * 100).toFixed(1)}%`,
  };
}
