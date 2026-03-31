"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
  FieldDescription,
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
import { Reservation } from "../app/type/Reservation";
import { ROOMS } from "../app/data/data";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReservationFormMode = "add" | "edit" | "view";

interface ReservationFormProps {
  mode?: ReservationFormMode;
  reservation?: Reservation;
  onClose: () => void;
  onSave?: (reservation) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  nom: z.string().min(3, "Le numéro doit être exactement 3 character."),
  payer: z.string(),
  reservationPar: z
    .string()
    .min(1, "Selectioner le type de reservation."),
  numbers: z
    .array(
      z.object({
        name: z.string().min(1, "Nom obligatoire"),
      }),
    )
    .min(1, "Au moins une personne est requise"),
  chambre: z
    .array(
      z.object({
        number: z.string().min(1, "Chambre obligatoire"),
      }),
    )
    .min(1, "Au moins une chambre est requise"),
  checkIn: z.string().min(1, "Veuillez sélectioner la date de check in."),
  checkOut: z.string().min(1, "Veuillez sélectioner la date de check out."),
  telephone: z.string().min(1, "Veuillez entrez le numéro de téléphone."),
  email: z.string().optional(),
  montant: z.string().min(1, "Veuillez Entrez le montant."),
  status: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapReservationToForm(reservation?: Reservation): FormValues {
  return {
    nom: reservation?.nom?.toString() ?? "",
    payer: reservation?.payer?.toString() ?? "",
    reservationPar: reservation?.reservationPar ?? "",
    numbers: reservation?.numbers ?? [{ name: "" }],
    chambre: reservation?.chambre ?? [{ number: "" }],
    checkIn: reservation?.checkIn?.toString() ?? "",
    checkOut: reservation?.checkOut ?? "",
    telephone: reservation?.telephone?.toString() ?? "",
    email: reservation?.email?.toString() ?? "",
    montant: reservation?.montant?.toString() ?? "",
    status: reservation?.status ?? "",
    notes: reservation?.notes?.toString() ?? "",
  };
}
function mapFormToReservation(
  data: FormValues,
  existing?: Reservation,
): Reservation {
  return {
    ...existing,
    nom: data.nom,
    payer: data.payer,
    reservationPar: data.reservationPar,
    numbers: data.numbers,
    chambre: data.chambre,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    telephone: data.telephone,
    email: data.email,
    montant: Number(data.montant),
    status: data.status,
    notes: data.notes,
  } as Reservation;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<
  ReservationFormMode,
  { title: string; description: string; submit: string }
> = {
  add: {
    title: "Ajouter une reservation",
    description: "Remplissez les informations de la nouvelle reservation.",
    submit: "Ajouter",
  },
  edit: {
    title: "Modifier la reservation",
    description: "Modifiez les informations de la reservation.",
    submit: "Enregistrer",
  },
  view: {
    title: "Détails de la reservation",
    description: "Informations détaillées de la reservation.",
    submit: "", // unused
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useReservationForm(
  mode: ReservationFormMode,
  reservation?: Reservation,
) {
  const isReadOnly = mode === "view";

  const form = useForm<FormValues>({
    resolver: isReadOnly ? undefined : zodResolver(formSchema),
    defaultValues: mapReservationToForm(reservation),
  });

  const fieldProps = {
    readOnly: isReadOnly,
    className: isReadOnly ? "bg-muted cursor-default focus-visible:ring-0" : "",
  } as const;

  const selectWrapperClass = isReadOnly ? "pointer-events-none opacity-60" : "";

  return { form, isReadOnly, fieldProps, selectWrapperClass };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/*
function getUniqueFloors(reservation: Reservation[]): number[] {
  return [...new Set(rooms.map((r) => r.etage))].sort((a, b) => a - b);
}
*/
// ─── Component ────────────────────────────────────────────────────────────────

export function AddReservation({
  mode = "add",
  reservation,
  onClose,
  onSave,
}: ReservationFormProps) {
  const { form, isReadOnly, fieldProps, selectWrapperClass } =
    useReservationForm(mode, reservation);
  const {
    fields: personFields,
    append: appendPerson,
    remove: removePerson,
  } = useFieldArray({
    control: form.control,
    name: "numbers",
  });

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control: form.control,
    name: "chambre",
  });

  const { title, description, submit } = MODE_CONFIG[mode];
  //const floors = getUniqueFloors(ROOMS);

  function onSubmit(data: FormValues) {
    data.status = "en attente";
    const mapped = mapFormToReservation(data, reservation);
    toast(mode === "edit" ? "Reservation modifiée!" : "Reservation ajoutée!", {
      position: "bottom-right",
    });
    onSave?.(mapped);
    onClose();
    console.log(data);
  }
  return (
    <Card className="w-2xl relative max-h-[900px] overflow-y-auto">
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
        <form id="reservation-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="nom"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nom de le reserveur</FieldLabel>
                  <Input
                    {...field}
                    {...fieldProps}
                    aria-invalid={fieldState.invalid}
                    placeholder="Mohamed Ali"
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
              name="reservationPar"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Type de reservation</FieldLabel>
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
                        <SelectItem value="Téléphone">Téléphone</SelectItem>
                        <SelectItem value="Sur place">Sur place</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {personFields.map((item, index) => (
              <Controller
                key={item.id}
                name={`numbers.${index}.name`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Personne {index + 1}</FieldLabel>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="Nom de la personne" />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removePerson(index)}
                        >
                          -
                        </Button>
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            {mode != "view" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => appendPerson({ name: "" })}
              >
                + Ajouter une personne
              </Button>
            )}

            {roomFields.map((item, index) => (
              <Controller
                key={item.id}
                name={`chambre.${index}.number`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Chambre {index + 1}</FieldLabel>
                    <div className={`${selectWrapperClass} flex gap-2`}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Sélectionner un chambre" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOMS.filter(
                            (room) =>
                              room.status.toString().toLowerCase() ==
                              "disponible",
                          ).map((room) => (
                            <SelectItem
                              key={room.number}
                              value={room.number.toString()}
                            >
                              {room.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeRoom(index)}
                        >
                          -
                        </Button>
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            {mode != "view" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => appendRoom({ number: "" })}
              >
                + Ajouter une chambre
              </Button>
            )}

            {/* Price */}
            <Controller
              name="montant"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Prix (DZD)</FieldLabel>
                  <Input
                    {...field}
                    {...fieldProps}
                    aria-invalid={fieldState.invalid}
                    placeholder="11000 DA"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="checkIn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Check In - Check Out</FieldLabel>

                  <Calendar
                    mode="range"
                    selected={{
                      from: field.value ? new Date(field.value) : undefined,
                      to: form.watch("checkOut")
                        ? new Date(form.watch("checkOut"))
                        : undefined,
                    }}
                    onSelect={(range) => {
                      field.onChange(
                        range?.from ? format(range.from, "yyyy-MM-dd") : "",
                      );
                      form.setValue(
                        "checkOut",
                        range?.to ? format(range.to, "yyyy-MM-dd") : "",
                      );
                    }}
                    numberOfMonths={2}
                  />
                </Field>
              )}
            />
            <Controller
              name="telephone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>N° Telephone</FieldLabel>
                  <Input
                    {...field}
                    {...fieldProps}
                    aria-invalid={fieldState.invalid}
                    placeholder="05xx xx xx xx"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email:</FieldLabel>
                  <Input
                    {...field}
                    {...fieldProps}
                    aria-invalid={fieldState.invalid}
                    placeholder="mail@mail.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-notes">Notes</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Notes pour cette reservation."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="payer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Payment</FieldLabel>
                  <div className={selectWrapperClass}>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Payment" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="false">Non Payé</SelectItem>
                        <SelectItem value="true">Payé</SelectItem>
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
          {isReadOnly ? (
            <Button type="button" onClick={onClose}>
              Fermer
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Réinitialiser
              </Button>
              <Button type="submit" form="reservation-form">
                {submit}
              </Button>
            </>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
}
