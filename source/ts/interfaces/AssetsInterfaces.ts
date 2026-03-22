export interface ResolvedSpineAssets {
  skeleton: {
    file: File;
    url: string;
    type: "json" | "binary";
    version?: string;
  };
  atlas: {
    file: File;
    url: string;
  };
  textures: {
    file: File;
    url: string;
    type: "png" | "jpg" | "jpeg";
  }[];
}