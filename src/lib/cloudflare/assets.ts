export type StoredAsset = {
  key: string;
  url: string;
  persisted: boolean;
};

export async function persistGeneratedAsset(
  bucket: R2Bucket | undefined,
  input: {
    id: string;
    bytes: Uint8Array;
    mimeType: string;
    width: number;
    height: number;
  },
): Promise<StoredAsset> {
  if (!bucket) {
    return {
      key: '',
      url: toDataUrl(input.bytes, input.mimeType),
      persisted: false,
    };
  }

  const extension = extensionForMime(input.mimeType);
  const now = new Date();
  const key = [
    'generated',
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    `${input.id}.${extension}`,
  ].join('/');

  await bucket.put(key, input.bytes, {
    httpMetadata: {
      contentType: input.mimeType,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      generationId: input.id,
      width: String(input.width),
      height: String(input.height),
    },
  });

  return {
    key,
    url: `/media/${key}`,
    persisted: true,
  };
}

export async function readArtworkAsset(bucket: R2Bucket | undefined, key: string): Promise<R2ObjectBody | null> {
  if (!bucket) return null;
  return bucket.get(key);
}

export async function readArtworkAssetMetadata(bucket: R2Bucket | undefined, key: string): Promise<R2Object | null> {
  if (!bucket) return null;
  return bucket.head(key);
}

function extensionForMime(mimeType: string): string {
  const normalized = mimeType.toLowerCase();
  if (normalized.includes('svg')) return 'svg';
  if (normalized.includes('webp')) return 'webp';
  if (normalized.includes('jpeg') || normalized.includes('jpg')) return 'jpg';
  if (normalized.includes('avif')) return 'avif';
  return 'png';
}

function toDataUrl(bytes: Uint8Array, mimeType: string): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return `data:${mimeType};base64,${btoa(binary)}`;
}
