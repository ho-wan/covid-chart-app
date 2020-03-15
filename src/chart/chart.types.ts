// redux
export interface RootState {
  chart: ChartState;
}

export interface ChartState {
  data: DateData[];
}

export interface ChartAction {
  type: string;
  data: AllDateData;
}

// API
export interface AllDateData {
  data: DateData[];
}

export interface DateData {
  date: string;
  reportNumber: number;
  regionData: RegionData[];
}

export interface RegionData {
  co: string;
  n: number;
}

export interface DeltaData {
  country: string;
  cases: number;
  delta: number;
}
