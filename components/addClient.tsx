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
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Guest } from "@/app/type/Client";
import { createGuest } from "@/context/context";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GuestFormMode = "add" | "edit" | "view";

interface GuestFormProps {
  mode?: GuestFormMode;
  guest?: Guest;
  onClose: () => void;
  onSave?: (guest: Guest) => void;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z
  .object({
    guestType: z.string().min(3, "Le numéro doit être exactement 3 character."),
    nom: z
      .string()
      .min(3, "Le nom doit être exactement 3 character.")
      .optional(),
    companyName: z
      .string()
      .min(3, "Le nom de company doit être exactement 3 character.")
      .optional(),
    phone: z
      .string()
      .min(3, "Le nom de company doit être exactement 3 character."),
    email: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().email("Email invalide").optional(),
    ),
    dateBirth: z.preprocess((val) => {
      if (val === "" || val === null) return undefined;
      return val instanceof Date ? val : new Date(val as string);
    }, z.date().optional()),
    idNumber: z
      .string()
      .min(3, "Le nom de company doit être exactement 3 character."),
    idType: z
      .string()
      .min(3, "Le nom de company doit être exactement 3 character."),
    address: z.string().optional(),
    nationality: z
      .string()
      .min(3, "Le nom de company doit être exactement 3 character.")
      .optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.guestType === "INDIVIDUAL" && !data.nom) {
      ctx.addIssue({
        path: ["nom"],
        message: "Nom requis pour un client individuel",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.guestType === "COMPANY" && !data.companyName) {
      ctx.addIssue({
        path: ["companyName"],
        message: "Nom de société requis",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapGuestToForm(guest?: Guest): FormValues {
  return {
    nom: guest?.nom?.toString() ?? "",
    guestType: guest?.guestType?.toString() ?? "INDIVIDUAL",
    companyName: guest?.companyName?.toString() ?? "",
    phone: guest?.phone?.toString() ?? "",
    email: guest?.email?.toString() ?? "undefined",
    dateBirth: guest?.dateBirth ?? undefined,
    idNumber: guest?.idNumber?.toString() ?? "",
    idType: guest?.idType?.toString() ?? "",
    address: guest?.address?.toString() ?? "",
    nationality: guest?.nationality?.toString() ?? "",
    notes: guest?.notes?.toString() ?? "",
  };
}
function mapFormToGuest(data: FormValues, existing?: Guest): Guest {
  return {
    ...existing,
    nom: data.nom,
    guestType: data.guestType,
    companyName: data.companyName,
    phone: data.phone,
    email: data.email,
    dateBirth: data.dateBirth,
    idNumber: data.idNumber,
    idType: data.idType,
    address: data.address,
    nationality: data.nationality,
    notes: data.notes,
  } as Guest;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<
  GuestFormMode,
  { title: string; description: string; submit: string }
> = {
  add: {
    title: "Ajouter un client",
    description: "Remplissez les informations de la nouvelle client.",
    submit: "Ajouter",
  },
  edit: {
    title: "Modifier le client",
    description: "Modifiez les informations de la client.",
    submit: "Enregistrer",
  },
  view: {
    title: "Détails de le client",
    description: "Informations détaillées de la client.",
    submit: "", // unused
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useGuestForm(mode: GuestFormMode, guest?: Guest) {
  const isReadOnly = mode === "view";

  const form = useForm<FormValues>({
    resolver: isReadOnly ? undefined : zodResolver(formSchema),
    defaultValues: mapGuestToForm(guest),
  });

  const fieldProps = {
    readOnly: isReadOnly,
    className: isReadOnly ? "bg-muted cursor-default focus-visible:ring-0" : "",
  } as const;

  const selectWrapperClass = isReadOnly ? "pointer-events-none opacity-60" : "";

  return { form, isReadOnly, fieldProps, selectWrapperClass };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddGuest({
  mode = "add",
  guest,
  onClose,
  onSave,
}: GuestFormProps) {
  const { form, isReadOnly, fieldProps, selectWrapperClass } = useGuestForm(
    mode,
    guest,
  );

  const { title, description, submit } = MODE_CONFIG[mode];
  //const floors = getUniqueFloors(ROOMS);

  async function onSubmit(data: FormValues) {
    //data.status = "en attente";
    console.log(data);
    const mapped = mapFormToGuest(data, guest);

    if (mode === "add") {
      const result = await createGuest({data : mapped});
      if (result.status === 201) {
        toast.success(`Client ${data.companyName || data.nom} Ajouté!`);
        onClose();
      }
    }
    toast(mode === "edit" ? "Client modifiée!" : "Client ajoutée!", {
      position: "bottom-right",
    });
    onSave?.(mapped);
    onClose();
    console.log(data);
  }

  const guestType = form.watch("guestType");

  return (
    <Card className="w-2xl relative max-h-225 overflow-y-auto">
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
        <form 
        id="guest-form" 
        onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Guest Type */}
            <Controller
              name="guestType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Type de client</FieldLabel>
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
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="COMPANY">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {guestType === "INDIVIDUAL" && (
              <Controller
                name="nom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nom de Client</FieldLabel>
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
            )}

            {guestType === "COMPANY" && (
              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nom de Company</FieldLabel>
                    <Input
                      {...field}
                      {...fieldProps}
                      aria-invalid={fieldState.invalid}
                      placeholder="Company"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            <Controller
              name="phone"
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
              name="dateBirth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date de Naissance</FieldLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!field.value}
                        className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              )}
            />

            <Controller
              name="idType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Type d&apos;identité</FieldLabel>
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
                        <SelectItem value="NATIONAL_ID">
                          Carte National
                        </SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                        <SelectItem value="DRIVER_LICENSE">
                          Permis de Conduire
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="idNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>N° identité</FieldLabel>
                  <Input
                    {...field}
                    {...fieldProps}
                    aria-invalid={fieldState.invalid}
                    placeholder="00000000"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-notes">
                    Addresse
                  </FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      //id="form-rhf-demo-description"
                      //placeholder=""
                      //rows={6}
                      //className="min-h-24 resize-none"
                      autoComplete="off"
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
              name="nationality"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nationalité</FieldLabel>
                  <div className={selectWrapperClass}>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Sélectionner la nationalité" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="algerien">Algerian</SelectItem>
                        <SelectItem value="tunisien">Tunisien</SelectItem>
                        <SelectItem value="chinois">Chinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      placeholder="Notes pour ce client."
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
              <Button type="submit" 
              form="guest-form"
              >
                {submit}
              </Button>
            </>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
}
