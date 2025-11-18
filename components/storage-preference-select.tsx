import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectTriggerProps } from "@radix-ui/react-select";

type StoragePreference = "session" | "local";

interface StoragePreferenceSelectProps {
  value: StoragePreference;
  onChange: (value: StoragePreference) => void;
  disabled?: boolean;
  classname?: SelectTriggerProps["className"];
}

export function StoragePreferenceSelect({
  value,
  onChange,
  disabled,
  classname,
}: StoragePreferenceSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      defaultValue="session"
      disabled={disabled}
    >
      <SelectTrigger className={classname}>
        <SelectValue placeholder="Select storage" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Storage Type</SelectLabel>
          <SelectItem value="session">Session Storage</SelectItem>
          <SelectItem value="local">Local Storage</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
