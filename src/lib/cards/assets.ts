export const NORSE_M01_ASSET_PREFIX = 'content/cards/norse/m01-norse-genesis/v1';

export function cardAssetUrl(assetKey: string) {
  return `/media/${assetKey}`;
}

export const norseM01CardBack = {
  assetKey: `${NORSE_M01_ASSET_PREFIX}/card-back.webp`,
  src: cardAssetUrl(`${NORSE_M01_ASSET_PREFIX}/card-back.webp`),
  width: 1060,
  height: 1484,
  format: 'webp',
  sha256: '10047ab8233bc048c1175d1c54296dcd032546b11f6ff15b9220b82b84f7a4ec',
} as const;
