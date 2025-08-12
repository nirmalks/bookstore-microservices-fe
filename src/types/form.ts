import { UseFormRegister, FieldValues, RegisterOptions, Path } from "react-hook-form";

export interface FormInputProps<T extends FieldValues> {
  label: string;
  name: string;
  type: string;
  defaultValue?: string;
  placeholder?: string;
  size?: string;
  register: UseFormRegister<T>;
  validationSchema?: RegisterOptions<T, Path<T>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}

export interface FormSelectProps {
  label: string;
  name: string;
  defaultValue?: string;
  size?: string;
  register: UseFormRegister<FieldValues>;
  validationSchema?: RegisterOptions;
  list: string[]
}

export interface FormRangeProps {
  label: string;
  name: string;
  size?: string;
  value?: string;
  step?: number;
  maxValue: number;
  register: UseFormRegister<FieldValues>;
}

