import { ResolvedSpineAssets } from "../interfaces/AssetsInterfaces";

export class SpineUploadManager {
  private files: File[];

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
        url: URL.createObjectURL(atlasFile),
      },
      textures: uploadedTextures.map((file) => ({
        file,
        url: URL.createObjectURL(file),
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
    return this.files.filter((f) => f.name.endsWith(".png"));
  }

  private async extractAtlasPages(atlasFile: File): Promise<string[]> {
    const text = await atlasFile.text();
    const lines = text.split("\n");

    const pages: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.endsWith(".png")) {
        pages.push(trimmed);
      }
    }

    if (pages.length === 0) {
      throw new Error("No texture pages found in atlas.");
    }

    return pages;
  }

  private validateTextures(required: string[], uploaded: File[]) {
    const uploadedNames = uploaded.map((f) => f.name);

    const missing = required.filter(
      (name) => !uploadedNames.includes(name)
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
}