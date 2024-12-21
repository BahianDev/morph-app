interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Trait {
  id: number;
  documentId: string;
  type: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: Image[];
}


export interface Meme {
  id: number;
  documentId: string;
  type: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: Image[];
}

