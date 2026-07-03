export interface InputPeriodicity {
  time: string;
  status: boolean;
}
export interface Periodicity extends InputPeriodicity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}