import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "../ui/command";
import { ProductInterface } from "@/app/type/Product";

interface ProductSearchProps {
  products?: ProductInterface[];
  onSelect: (product: ProductInterface) => void;
}


const ProductSearch = ({ products = [], onSelect } : ProductSearchProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  // 🔍 Filter المنتجات
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-62.5 justify-start">
          {value || "Search product..."}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-62.5 p-0">
        <Command>
          <CommandInput
            placeholder="Search product..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {filteredProducts.length === 0 && (
              <CommandEmpty>No product found.</CommandEmpty>
            )}

            {filteredProducts.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => {
                  setValue(product.name);
                  onSelect(product);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {product.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSearch;
