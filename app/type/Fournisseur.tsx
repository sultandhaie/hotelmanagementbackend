import { ProductPriceInterface } from "./Product";

export interface FournisseurInterface {
  id: number;
  name: string;
  adress: string;
  zipCode: string;
  ville: string;
  telephone: string;

  productPrices?: ProductPriceInterface[];
}