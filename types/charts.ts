export interface ChartDatum {
  name: string;
  value: number;
  color?: string;
}

export interface SeriesDatum {
  [key: string]: string | number;
}

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}
