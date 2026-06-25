import { ProductInterface } from "./Product";

export interface CategoryInterface {
  id: number;
  name: string;
  products?: ProductInterface[];
}