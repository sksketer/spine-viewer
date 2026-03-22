import { ResolvedSpineAssets } from "../interfaces/AssetsInterfaces";

export class SpineUploadManager {
  private readonly files: File[];
  private readonly maxTextureSize = 2048;

  constructor(files: File[]) {
    this.files = files;
  }

  async resolve(): Promise<ResolvedSpineAssets> {
    const skeletonFile = this.findSkeletonFile();
    const atlasFile = this.findAtlasFile();

    if (!skeletonFile) {
      throw new Error("No skeleton file (.json or .skel) found.");
    }

    if (!atlasFile) {
      throw new Error("No atlas file (.atlas) found.");
    }

    const requiredTextures = await this.extractAtlasPages(atlasFile);
    const uploadedTextures = this.findTextureFiles();

    this.validateTextures(requiredTextures, uploadedTextures);
    await this.warnLargeTextures(uploadedTextures);

    return {
      skeleton: {
        file: skeletonFile,
        url: URL.createObjectURL(skeletonFile),
        type: skeletonFile.name.endsWith(".json") ? "json" : "binary",
        version: skeletonFile.name.endsWith(".json")
          ? await this.extractSpineVersion(skeletonFile)
          : undefined,
      },
      atlas: {
        file: atlasFile,
        url: URL.createObjectURL(atlasFile)
      },
      textures: uploadedTextures.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: uploadedTextures[0].name.split('.')[1]
      })),
    };
  }

  // -----------------------------
  // Private Helpers
  // -----------------------------

  private findSkeletonFile(): File | undefined {
    return this.files.find(
      (f) => f.name.endsWith(".json") || f.name.endsWith(".skel")
    );
  }

  private findAtlasFile(): File | undefined {
    return this.files.find((f) => f.name.endsWith(".atlas"));
  }

  private findTextureFiles(): File[] {
    return this.files.filter((f) => /\.(png|jpe?g)$/i.test(f.name));
  }

  private async extractAtlasPages(atlasFile: File): Promise<string[]> {
    const text = await atlasFile.text();
    const lines = text.split("\n");

    const pages: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (/\.(png|jpe?g)$/i.test(trimmed)) {
        pages.push(trimmed);
      }
    }

    if (pages.length === 0) {
      throw new Error("No texture pages found in atlas.");
    }

    return pages;
  }

  private validateTextures(required: string[], uploaded: File[]) {
    const uploadedNames = new Set(uploaded.map((f) => f.name));

    const missing = required.filter(
      (name) => !uploadedNames.has(name)
    );

    if (missing.length > 0) {
      throw new Error(
        `Missing required texture files: ${missing.join(", ")}`
      );
    }
  }

  private async extractSpineVersion(jsonFile: File): Promise<string | undefined> {
    try {
      const text = await jsonFile.text();
      const data = JSON.parse(text);
      return data?.skeleton?.spine;
    } catch {
      return undefined;
    }
  }

  private async warnLargeTextures(textures: File[]): Promise<void> {
    const oversizedTextures: string[] = [];

    for (const texture of textures) {
      const dimension = await this.getImageDimensions(texture);
      if (!dimension) {
        continue;
      }

      if (dimension.width > this.maxTextureSize || dimension.height > this.maxTextureSize) {
        oversizedTextures.push(`${texture.name} (${dimension.width}x${dimension.height})`);
      }
    }

    if (oversizedTextures.length > 0) {
      globalThis.alert(
        "Spine texture file are greater than 2048x2048 can cause memory leak issue on iOS devices.\n\n" +
        oversizedTextures.join("\n")
      );
    }
  }

  private async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const image = new Image();
      const url = URL.createObjectURL(file);

      image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        URL.revokeObjectURL(url);
        resolve({ width, height });
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      image.src = url;
    });
  }
}