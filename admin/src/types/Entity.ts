export interface IEntity {
  _id: string;
  name: string;
  description: string;
  image: string;
  totalProduct?: number;
  createdAt: Date;
}
