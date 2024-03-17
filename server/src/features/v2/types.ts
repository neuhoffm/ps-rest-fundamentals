export type Item = {
  id: number;
  name: string;
  thumbnailImageUrl?: string;
};

export type ItemDetail = Item & {
  description: string | null;
  staffReview?: string;
  fullImageUrl?: string;
};
