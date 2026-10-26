export interface SelectOption<V extends string | number = string> {
  label: string;
  value: V;
  disabled?: boolean;
}
