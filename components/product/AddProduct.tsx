"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductInterface } from "@/app/type/Product";
import {
  addProduct,
  getAllCategories,
  getAllUnites,
} from "@/context/context";
import { useEffect, useState } from "react";
import { UniteInterface } from "@/app/type/Unite";
import { CategoryInterface } from "@/app/type/Categorie";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductFormMode = "add" | "edit" | "view" | "delete";

interface ProductFormProps {
  mode?: ProductFormMode;
  product?: ProductInterface;
  onClose: () => void;
  onSave?: (product: ProductInterface) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, "Le Nom doit être Superieur a 3 character."),
  categoryId: z.number().min(1, "Veuillez choisir la categorie."),
  uniteId: z.number().min(1, "Veuillez choisir l'unité."),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapProductToForm(product?: ProductInterface): FormValues {
  return {
    name: product?.name?.toString() ?? "",
    categoryId: product?.categoryId ?? 0,
    uniteId: product?.uniteId ?? 0,
  };
}

function mapFormToProduct(
  data: FormValues,
  existing?: ProductInterface,
): ProductInterface {
  return {
    ...existing,
    name: data.name,
    categoryId: data.categoryId,
    uniteId: data.uniteId,
  } as ProductInterface;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<
  ProductFormMode,
  { title: string; description: string; submit: string }
> = {
  add: {
    title: "Ajouter une produit",
    description: "Remplissez les informations de la nouvelle chambre.",
    submit: "Ajouter",
  },
  edit: {
    title: "Modifier le produit",
    description: "Modifiez les informations de la chambre.",
    submit: "Enregistrer",
  },
  view: {
    title: "Détails de produit",
    description: "Informations détaillées de la chambre.",
    submit: "", // unused
  },
  delete: {
    title: "Effacer le produit",
    description: "Est Ce que vous etes Sure ?.",
    submit: "Effacer",
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useProductForm(mode: ProductFormMode, product?: ProductInterface) {
  const isReadOnly = mode === "view" || mode === "delete";

  const form = useForm<FormValues>({
    resolver: isReadOnly ? undefined : zodResolver(formSchema),
    defaultValues: mapProductToForm(product),
  });

  const fieldProps = {
    readOnly: isReadOnly,
    className: isReadOnly ? "bg-muted cursor-default focus-visible:ring-0" : "",
  } as const;

  const selectWrapperClass = isReadOnly ? "pointer-events-none opacity-60" : "";

  return { form, isReadOnly, fieldProps, selectWrapperClass };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddProduct({
  mode = "add",
  product,
  onClose,
}: ProductFormProps) {
  const { form, isReadOnly, fieldProps, selectWrapperClass } = useProductForm(
    mode,
    product,
  );
  const { title, description, submit } = MODE_CONFIG[mode];
  const [error, setError] = useState<string | null>(null);

  const [unites, setUnites] = useState<UniteInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);

  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const data = await getAllUnites();
        setUnites(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      }
    };
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      }
    };

    fetchUnites();
    fetchCategories();
  }, []);

  async function onSubmit(data: FormValues) {
    const mapped = mapFormToProduct(data, product);
    if (mode === "add") {
      const result = await addProduct(mapped);
      if (result.status === 201) {
        toast.success(`Produit ${data.name} Ajouté!`);
        onClose();
      }
    }
  }
  /*
    if (mode === "edit") {
      const result = await updateRoom(data.number, mapped);
      if (result.status === 200) {
        toast.success(`Chambre N° ${data.number} Modified!`);
        onClose();
      }
    }
    if (mode === "delete") {
      const result = await deleteRoom(data.number);
      if (result.status === 200) {
        toast.success(`Chambre N° ${data.number} Effacée!`);
        onClose();
      }
    }
  }
    */

  return (
    <>
      <Card className="w-2xl relative">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            ✕
          </button>
        </CardHeader>

        <CardContent>
          <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Number */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nom de produit</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: Coca Cola"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Floor */}
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Categorie</FieldLabel>
                    <div className={selectWrapperClass}>
                      <Select
                        name={field.name}
                        value={field.value === 0 ? "" : field.value.toString()}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Type */}
              <Controller
                name="uniteId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Unité</FieldLabel>
                    <div className={selectWrapperClass}>
                      <Select
                        name={field.name}
                        value={field.value === 0 ? "" : field.value.toString()}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Sélectionner une unité" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {unites.map((unite) => (
                            <SelectItem
                              key={unite.id}
                              value={unite.id.toString()}
                            >
                              {unite.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            {isReadOnly && mode == "view" ? (
              <Button type="button" onClick={onClose}>
                Fermer
              </Button>
            ) : (
              <>
                {mode != "delete" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Réinitialiser
                  </Button>
                )}
                <Button type="submit" form="product-form">
                  {submit}
                </Button>
              </>
            )}
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
