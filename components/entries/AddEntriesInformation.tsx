"use client";

import React, { useState } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AddEntriesInformation = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex bg-white p-4 gap-4 items-end rounded-lg mb-4">
      <Field className="w-44">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-simple"
              className="justify-start font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field className="w-44">
        <FieldLabel htmlFor="depot">Depot</FieldLabel>
        <Select defaultValue="economat">
          <SelectTrigger id="depot" className="w-full">
            <SelectValue placeholder="Select a depot" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Selectionner Depot</SelectLabel>
              <SelectItem value="economat" defaultChecked>Economat</SelectItem>
              <SelectItem value="cuisine-central">Cuisine Central</SelectItem>
              <SelectItem value="cafeteria">Cafeteria</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="w-44">
        <FieldLabel htmlFor="fournisseur">Fournisseur</FieldLabel>
        <Select>
          <SelectTrigger id="fournisseur" className="w-full">
            <SelectValue placeholder="Select a fournisseur" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Selectionner Fournisseur</SelectLabel>
              <SelectItem value="economat" defaultChecked>Economat</SelectItem>
              <SelectItem value="cuisine-central">Cuisine Central</SelectItem>
              <SelectItem value="cafeteria">Cafeteria</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
};

export default AddEntriesInformation;
