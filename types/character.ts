export interface Character {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  createdBy?: string;
}
