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
  regionData: RegionData[];
}

export interface RegionData {
  country: string;
  state: string;
  cases: number;
}
