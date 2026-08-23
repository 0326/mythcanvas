export type GenerationEntityType = 'character' | 'realm';
export type GenerationStatus = 'queued' | 'generating' | 'succeeded' | 'failed' | 'moderated';

export type GenerationRequest = {
  entityType: GenerationEntityType;
  entityId: string;
  styleId: string;
  scene: string;
  composition: string;
  ratio: string;
  description?: string;
  /** 变体：父生成 job id */
  sourceGenerationId?: string;
};

export type GenerationDimensions = {
  width: number;
  height: number;
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
  styleId: string;
  styleName: string;
  scene: string;
  composition: string;
  ratio: string;
  description: string;
  dimensions: GenerationDimensions;
};

export type ProviderGenerationRequest = {
  id: string;
  prompt: string;
  width: number;
  height: number;
  metadata: Record<string, string>;
};

export type ProviderGenerationResult = {
  provider: string;
  providerRequestId?: string;
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
  scene: string;
  composition: string;
  ratio: string;
  description: string;
  prompt: string;
  provider: string;
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
