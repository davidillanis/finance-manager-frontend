export interface UserEntity {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  registrationDate: string | null;
  role:string;
}
