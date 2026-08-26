import { afterEach, describe, expect, it, vi } from "vitest";
import { getOutputSpecProfile } from "../src/lib/generation/config-repository";
import { listCreatorOutputSpecs } from "../src/lib/generation/creator-config";
import {
  composeGenerationPrompt,
  composeGenerationPromptLayers,
} from "../src/lib/generation/prompt";
import {
  createImageGenerationProvider,
  ImageProviderError,
} from "../src/lib/generation/provider";
import type { ResolvedGenerationContext } from "../src/lib/generation/types";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("structured generation system", () => {
  it("maps mobile wallpaper to 1440x2560", async () => {
    const spec = await getOutputSpecProfile(undefined, undefined, "9:16");
    expect(spec.id).toBe("mobile-wallpaper");
    expect(spec.width).toBe(1440);
    expect(spec.height).toBe(2560);
    expect(spec.ratio).toBe("9:16");
  });

  it("maps desktop wallpaper to 2560x1440", async () => {
    const spec = await getOutputSpecProfile(undefined, undefined, "16:9");
    expect(spec.id).toBe("desktop-wallpaper");
    expect(spec.width).toBe(2560);
    expect(spec.height).toBe(1440);
    expect(spec.ratio).toBe("16:9");
  });

  it("exposes exactly the two V1 Creator wallpaper specs without D1", async () => {
    const specs = await listCreatorOutputSpecs(undefined);
    expect(specs.map((spec) => spec.id)).toEqual([
      "mobile-wallpaper",
      "desktop-wallpaper",
    ]);
    expect(specs.map((spec) => spec.deviceType)).toEqual(["mobile", "desktop"]);
  });

  it("keeps Character, Interpretation, Variant, Style and OutputSpec in separate prompt layers", () => {
    const context: ResolvedGenerationContext = {
      entityType: "character",
      entityId: "character-athena",
      entityName: "雅典娜",
      mythologyId: "myth-greek",
      mythologyName: "希腊神话",
      visualDna: {
        palette: ["ivory", "bronze"],
        motifs: ["laurel", "columns"],
        materials: ["marble", "bronze"],
        atmosphere: ["high-altitude sacred light"],
      },
      canonicalDesign: {
        anchors: ["poised warrior-goddess silhouette", "Aegis shield"],
        silhouette:
          "tall poised adult warrior-goddess with a strong spear-and-shield profile",
        appearance: {
          face: ["calm strategic adult gaze"],
          body: ["athletic adult proportions"],
        },
        costumeLanguage: ["bronze-and-ivory armor layered over Greek textile"],
        paletteCues: ["ivory", "bronze", "deep olive"],
        temperament: ["calm", "strategic", "authoritative"],
        avoid: ["generic medieval fantasy costume"],
        canonicalPrompt:
          "Depict Athena as an original MythCanvas strategist-warrior while preserving her Aegis, spear and owl identity.",
      },
      canonicalAnchors: ["poised warrior-goddess silhouette", "Aegis shield"],
      symbols: ["spear", "owl"],
      interpretation: {
        id: "athena-classical-polis",
        name: "古典城邦守护神解释层",
        role: "城邦与理性秩序的守护神",
        summary: "以城市守护与智慧秩序为核心的古典传统版本",
        traditionTags: ["古典希腊"],
        sourcePeriods: ["古典时期"],
        identityAnchors: ["olive branch and civic armor"],
        symbols: ["owl on a bronze crest"],
        canonicalDesignOverrides: {},
        promptFragment: "Keep civic, not imperial, ceremonial cues.",
        confidence: "high",
      },
      variant: {
        id: "athena-mature-ceremonial",
        name: "成熟礼仪战甲",
        variantType: "composite",
        description: "mature adult presentation with ceremonial armor",
        identityOverrides: ["ceremonial armor layers"],
        promptFragment: "more formal mantle and armor detailing",
        referenceAssetIds: ["ref-athena-ceremonial"],
      },
      styleId: "cyber-myth",
      styleName: "Cyber Myth",
      styleProfile: {
        promptTemplate:
          "Fuse restrained futuristic materials into the mythological design.",
        renderRules: ["preserve mythology-first silhouette"],
        avoid: ["generic neon-city cyberpunk"],
      },
      scene: "Olympus at night",
      composition: "heroic full-body three-quarter view",
      ratio: "9:16",
      outputSpec: {
        id: "mobile-wallpaper",
        name: "手机壁纸",
        deviceType: "mobile",
        ratio: "9:16",
        safeZone: { topReservedPct: 14 },
        compositionRules: ["use a clear vertical subject silhouette"],
        quality: "high",
      },
      description: "subtle electric-blue divine circuitry",
      dimensions: { width: 1440, height: 2560 },
    };

    const layers = composeGenerationPromptLayers(context);
    expect(layers.identity).toContain("Aegis shield");
    expect(layers.interpretation).toContain("古典城邦守护神解释层");
    expect(layers.identity).toContain("Canonical character direction");
    expect(layers.identity).toContain("bronze-and-ivory armor");
    expect(layers.identity).toContain("generic medieval fantasy costume");
    expect(layers.variant).toContain("成熟礼仪战甲");
    expect(layers.style).toContain("Cyber Myth");
    expect(layers.output).toContain("1440×2560");
    expect(layers.refinement).toContain("electric-blue");

    const prompt = composeGenerationPrompt(context);
    expect(prompt.indexOf("established MythCanvas identity")).toBeLessThan(
      prompt.indexOf("Additional user direction"),
    );
    expect(prompt.indexOf("established MythCanvas identity")).toBeLessThan(
      prompt.indexOf("古典城邦守护神解释层"),
    );
    expect(prompt.indexOf("古典城邦守护神解释层")).toBeLessThan(
      prompt.indexOf("成熟礼仪战甲"),
    );
    expect(prompt).toContain("Do not imitate");
  });

  it("fails closed when OpenAI mode has no secret", () => {
    expect(() =>
      createImageGenerationProvider({ AI_GENERATION_MODE: "openai" }),
    ).toThrow(ImageProviderError);
  });

  it("uses image edits when GPT Image 2 receives Character references", async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        expect(init?.method).toBe("POST");
        expect(init?.body).toBeInstanceOf(FormData);
        const form = init?.body as FormData;
        expect(form.get("model")).toBe("gpt-image-2");
        expect(form.getAll("image[]")).toHaveLength(1);
        expect(form.get("size")).toBe("1440x2560");
        return new Response(
          JSON.stringify({ data: [{ b64_json: "aW1hZ2U=" }] }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
              "x-request-id": "req-edit",
            },
          },
        );
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = createImageGenerationProvider({
      AI_GENERATION_MODE: "openai",
      OPENAI_API_KEY: "test-key",
      OPENAI_IMAGE_MODEL: "gpt-image-2",
    });
    const result = await provider.generate({
      id: "job-1",
      prompt: "Athena canonical identity",
      width: 1440,
      height: 2560,
      quality: "high",
      references: [
        {
          id: "ref-athena-front",
          assetType: "portrait-front",
          mimeType: "image/png",
          bytes: new Uint8Array([1, 2, 3]),
        },
      ],
      metadata: {},
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/v1/images/edits");
    expect(result.providerRequestId).toBe("req-edit");
    expect(result.bytes.byteLength).toBeGreaterThan(0);
  });

  it("uses text generation when no Character reference pack is available", async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        expect(typeof init?.body).toBe("string");
        return new Response(
          JSON.stringify({ data: [{ b64_json: "aW1hZ2U=" }] }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = createImageGenerationProvider({
      AI_GENERATION_MODE: "openai",
      OPENAI_API_KEY: "test-key",
    });
    await provider.generate({
      id: "job-2",
      prompt: "Chang e canonical identity",
      width: 2560,
      height: 1440,
      quality: "high",
      metadata: {},
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "/v1/images/generations",
    );
  });
});
