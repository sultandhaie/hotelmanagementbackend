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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room, RoomType } from "../app/type/Room";
import { createRoom, deleteRoom, updateRoom } from "../context/context";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoomFormMode = "add" | "edit" | "view" | "delete";

interface RoomFormProps {
  mode?: RoomFormMode;
  room?: Room;
  onClose: () => void;
  onSave?: (room: Room) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  number: z.string().length(3, "Le numéro doit être exactement 3 chiffres."),
  floor: z.string().min(1, "Veuillez choisir l'étage."),
  type: z.string().min(1, "Veuillez choisir le type."),
  price: z.string().min(1, "Veuillez entrer le prix."),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapRoomToForm(room?: Room): FormValues {
  return {
    number: room?.number?.toString() ?? "",
    floor: room?.floor?.toString() ?? "",
    type: room?.type?.toString() ?? "",
    price: room?.price?.toString() ?? "",
  };
}

function mapFormToRoom(data: FormValues, existing?: Room): Room {
  return {
    ...existing,
    number: Number(data.number),
    floor: Number(data.floor),
    type: data.type,
    price: Number(data.price),
  } as Room;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<
  RoomFormMode,
  { title: string; description: string; submit: string }
> = {
  add: {
    title: "Ajouter une chambre",
    description: "Remplissez les informations de la nouvelle chambre.",
    submit: "Ajouter",
  },
  edit: {
    title: "Modifier la chambre",
    description: "Modifiez les informations de la chambre.",
    submit: "Enregistrer",
  },
  view: {
    title: "Détails de la chambre",
    description: "Informations détaillées de la chambre.",
    submit: "", // unused
  },
  delete: {
    title: "Effacer la chambre",
    description: "Est Ce que vous etes Sure ?.",
    submit: "Effacer",
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useRoomForm(mode: RoomFormMode, room?: Room) {
  const isReadOnly = mode === "view" || mode === "delete";

  const form = useForm<FormValues>({
    resolver: isReadOnly ? undefined : zodResolver(formSchema),
    defaultValues: mapRoomToForm(room),
  });

  const fieldProps = {
    readOnly: isReadOnly,
    className: isReadOnly ? "bg-muted cursor-default focus-visible:ring-0" : "",
  } as const;

  const selectWrapperClass = isReadOnly ? "pointer-events-none opacity-60" : "";

  return { form, isReadOnly, fieldProps, selectWrapperClass };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddRoom({ mode = "add", room, onClose }: RoomFormProps) {
  const { form, isReadOnly, fieldProps, selectWrapperClass } = useRoomForm(
    mode,
    room,
  );
  const { title, description, submit } = MODE_CONFIG[mode];

  async function onSubmit(data: FormValues) {
    const mapped = mapFormToRoom(data, room);
    if (mode === "add") {
      const result = await createRoom(mapped);
      if (result.status === 201) {
        toast.success(`Chambre N° ${data.number} Ajouté!`);
        onClose();
      }
    }

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
          <form id="room-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Number */}
              <Controller
                name="number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Numéro de la chambre</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: 101"
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
                name="floor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Étage</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: 1"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Type */}
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Type de chambre</FieldLabel>
                    <div className={selectWrapperClass}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {RoomType.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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

              {/* Price */}
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Prix (DZD)</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: 5000"
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
                {mode != "delete" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Réinitialiser
                  </Button>
                )}
                <Button type="submit" form="room-form">
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
