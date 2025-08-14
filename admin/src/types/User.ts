export interface IUser {
  _id: string;
  username: string;
  email: string;
  googleAccount: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  avatar?: string;
  wishList?: { _id: string; name: string; images: string[] }[];
  createdAt: Date;
  updatedAt: Date;
}
