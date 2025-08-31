
export type FileKey = 'sampleDeed' | 'sellerAadhaar' | 'buyerAadhaar' | 'sellerDeed';

export interface UploadedFiles {
  sampleDeed: File | null;
  sellerAadhaar: File | null;
  buyerAadhaar: File | null;
  sellerDeed: File | null;
}

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}
