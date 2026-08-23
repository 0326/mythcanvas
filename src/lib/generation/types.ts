export type GenerationEntityType = 'character' | 'world';
export type GenerationStatus = 'queued' | 'generating' | 'succeeded' | 'failed' | 'moderated';
export type GenerationQuality = 'low' | 'medium' | 'high' | 'auto';

export type GenerationRequest = {
  entityType: GenerationEntityType;
  entityId: string;
  /** Persistent age/costume/form state. Character-only and orthogonal to Style. */
  variantId?: string;
  styleId: string;
  scene: string;
  composition: string;
  /** Backward-compatible aspect ratio. Prefer outputSpecId for product flows. */
  ratio: string;
  /** Device/resolution composition preset, e.g. mobile-wallpaper / desktop-wallpaper. */
  outputSpecId?: string;
  description?: string;
  /** 变体：父生成 job id */
  sourceGenerationId?: string;
};

export type GenerationDimensions = {
  width: number;
  height: number;
};

export type PromptLayers = {
  purpose: string;
  identity: string;
  variant?: string;
  civilization: string;
  style: string;
  scene: string;
  output: string;
  refinement?: string;
  guardrails: string;
};

export type ResolvedGenerationContext = {
  entityType: GenerationEntityType;
  entityId: string;
  entityName: string;
  mythologyId: string;
  mythologyName: string;
  visualDna: {
    palette: readonly string[];
    motifs: readonly string[];
    materials: readonly string[];
    atmosphere: readonly string[];
  };
  canonicalAnchors: readonly string[];
  symbols: readonly string[];
  variant?: {
    id: string;
    name: string;
    variantType: 'age' | 'costume' | 'form' | 'composite';
    description: string;
    identityOverrides: readonly string[];
    promptFragment: string;
    referenceAssetIds: readonly string[];
  };
  styleId: string;
  styleName: string;
  styleProfile: {
    promptTemplate: string;
    renderRules: readonly string[];
    avoid: readonly string[];
  };
  scene: string;
  composition: string;
  ratio: string;
  outputSpec: {
    id: string;
    name: string;
    deviceType: 'desktop' | 'mobile';
    ratio: string;
    safeZone: Readonly<Record<string, unknown>>;
    compositionRules: readonly string[];
    quality: GenerationQuality;
  };
  description: string;
  dimensions: GenerationDimensions;
};

export type ProviderReferenceImage = {
  id: string;
  assetType: string;
  mimeType: string;
  bytes: Uint8Array;
};

export type ProviderGenerationRequest = {
  id: string;
  prompt: string;
  width: number;
  height: number;
  quality?: GenerationQuality;
  references?: ProviderReferenceImage[];
  metadata: Record<string, string>;
};

export type ProviderGenerationResult = {
  provider: string;
  providerRequestId?: string;
  model?: string;
  bytes: Uint8Array;
  mimeType: string;
  width: number;
  height: number;
};

export type GenerationJob = {
  id: string;
  status: GenerationStatus;
  entityType: GenerationEntityType;
  entityId: string;
  mythologyId: string;
  styleId: string;
  characterVariantId?: string;
  outputSpecId?: string;
  scene: string;
  composition: string;
  ratio: string;
  description: string;
  prompt: string;
  promptLayers?: PromptLayers;
  provider: string;
  generationModel?: string;
  generationQuality?: GenerationQuality;
  referenceAssetIds?: string[];
  providerRequestId?: string;
  assetKey?: string;
  assetMime?: string;
  assetWidth?: number;
  assetHeight?: number;
  errorCode?: string;
  errorMessage?: string;
  sourceGenerationId?: string;
  isPublic?: boolean;
  /** 归属用户（匿名 session 或登录用户） */
  userId?: string;
  createdAt: string;
  updatedAt: string;
};

export type GenerationResponse = {
  id: string;
  status: GenerationStatus;
  imageUrl?: string;
  persisted: boolean;
  provider: string;
  promptPreview: string;
  error?: {
    code: string;
    message: string;
  };
};
