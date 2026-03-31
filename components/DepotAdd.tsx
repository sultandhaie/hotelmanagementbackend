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
import { createDepot } from "../app/context/context";
import { DepotFormMode } from "../app/(user)/stock/depot/page";
import { DepotInterface } from "../app/type/Depot";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DepotFormProps {
  mode?: DepotFormMode;
  depot?: DepotInterface;
  onClose: () => void;
  onSave?: (depot: DepotInterface) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, "Veuillez Entrez le nom de depot."),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapDepotToForm(depot): FormValues {
  return {
    name: depot?.name?.toString() ?? "",
  };
}

function mapFormToDepot(
  data: FormValues,
  existing?: DepotInterface,
): DepotInterface {
  return {
    ...existing,
    name: data.name,
  } as DepotInterface;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<
  DepotFormMode,
  { title: string; description: string; submit: string }
> = {
  add: {
    title: "Ajouter un Depot",
    description: "Remplissez les informations de le nouvelle Depot.",
    submit: "Ajouter",
  },
  edit: {
    title: "Modifier le depot",
    description: "Modifiez les informations de Depot.",
    submit: "Enregistrer",
  },
  view: {
    title: "Détails de Depot",
    description: "Informations détaillées de Depot.",
    submit: "", // unused
  },
  delete: {
    title: "Effacer le Depot",
    description: "Est Ce que vous etes Sure ?.",
    submit: "Effacer",
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useDepotForm(mode: DepotFormMode, depot?: DepotInterface) {
  const isReadOnly = mode === "view" || mode === "delete";

  const form = useForm<FormValues>({
    resolver: isReadOnly ? undefined : zodResolver(formSchema),
    defaultValues: mapDepotToForm(depot),
  });

  const fieldProps = {
    readOnly: isReadOnly,
    className: isReadOnly ? "bg-muted cursor-default focus-visible:ring-0" : "",
  } as const;

  const selectWrapperClass = isReadOnly ? "pointer-events-none opacity-60" : "";

  return { form, isReadOnly, fieldProps, selectWrapperClass };
}

const DepotAdd = ({ mode = "add", depot, onClose }: DepotFormProps) => {
  const { form, isReadOnly, fieldProps, 
    //selectWrapperClass 
  } = useDepotForm(
    mode,
    depot,
  );
  const { title, description, submit } = MODE_CONFIG[mode];

  async function onSubmit(data: FormValues) {
    const mapped = mapFormToDepot(data, depot);
    if (mode === "add") {
      const result = await createDepot(mapped);
      if (result.status === 201) {
        toast.success(`Depot ${data.name} Ajouté!`);
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
                    <FieldLabel>Nom de Depot</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: Cuisine Central, Economat"
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

export default DepotAdd;
