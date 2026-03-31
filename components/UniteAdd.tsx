"use client";

import * as React from "react";
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
import { UniteFormMode } from "../app/(user)/stock/unite/page";
import { UniteInterface } from "../app/type/Unite";
import { createUnite } from "../app/context/context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UniteFormProps {
  mode?: UniteFormMode;
  unite?: UniteInterface;
  onClose: () => void;
  onSave?: (unite: UniteInterface) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, "Veuillez Entrez le nom de l'unité."),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapUniteToForm(unite?: UniteInterface): FormValues {
  return {
    name: unite?.name?.toString() ?? "",
  };
}

function mapFormToUnite(
  data: FormValues,
  existing?: UniteInterface,
): UniteInterface {
  return {
    ...existing,
    name: data.name,
  } as UniteInterface;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<
  UniteFormMode,
  { title: string; description: string; submit: string }
> = {
  add: {
    title: "Ajouter une Unité",
    description: "Remplissez les informations de la nouvelle Unité.",
    submit: "Ajouter",
  },
  edit: {
    title: "Modifier l'Unité",
    description: "Modifiez les informations de l'Unité.",
    submit: "Enregistrer",
  },
  view: {
    title: "Détails de l'Unité",
    description: "Informations détaillées de l'Unité.",
    submit: "", // unused
  },
  delete: {
    title: "Effacer l'Unité",
    description: "Est Ce que vous etes Sure ?.",
    submit: "Effacer",
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useUniteForm(mode: UniteFormMode, unite?: UniteInterface) {
  const isReadOnly = mode === "view" || mode === "delete";

  const form = useForm<FormValues>({
    resolver: isReadOnly ? undefined : zodResolver(formSchema),
    defaultValues: mapUniteToForm(unite),
  });

  const fieldProps = {
    readOnly: isReadOnly,
    className: isReadOnly ? "bg-muted cursor-default focus-visible:ring-0" : "",
  } as const;

  const selectWrapperClass = isReadOnly ? "pointer-events-none opacity-60" : "";

  return { form, isReadOnly, fieldProps, selectWrapperClass };
}

const UniteAdd = ({ mode = "add", unite, onClose }: UniteFormProps) => {
  const { form, isReadOnly, fieldProps, selectWrapperClass } = useUniteForm(
    mode,
    unite,
  );
  const { title, description, submit } = MODE_CONFIG[mode];

  async function onSubmit(data: FormValues) {
    const mapped = mapFormToUnite(data, unite);
    if (mode === "add") {
      const result = await createUnite(mapped);
      if (result.status === 201) {
        toast.success(`Unité ${data.name} Ajouté!`);
        onClose();
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
      */
  }
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
          <form id="unite-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nom de l unité</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: Kg"
                      autoComplete="off"
                    />
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
                {mode != "delete" && mode == "add" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Réinitialiser
                  </Button>
                )}
                <Button type="submit" form="unite-form">
                  {submit}
                </Button>
              </>
            )}
          </Field>
        </CardFooter>
      </Card>
    </>
  );
};

export default UniteAdd;
