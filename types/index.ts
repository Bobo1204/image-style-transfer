export interface Style {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface TransferResult {
  original: string;
  result: string;
  styleId: string;
}
