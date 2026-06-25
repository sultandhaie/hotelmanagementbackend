import { CategoryInterface } from "./Categorie";
import { FournisseurInterface } from "./Fournisseur";
import { UniteInterface } from "./Unite";

export interface ProductInterface {
  id: number;
  name: string;
  categoryId: number;
  uniteId: number;
  quantity: number;

  categorie?: CategoryInterface;
  unite?: UniteInterface;
  productPrices?: ProductPriceInterface[];
}
export interface ProductPriceInterface {
  id: number;
  prix: number;
  productId: number;
  fournisseurId: number;

  product?: ProductInterface;
  fournisseur?: FournisseurInterface;
}