export interface FirebaseUserDTO {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    stsTokenManager:StsTokenManager
}

export interface StsTokenManager{
  accessToken:string;
  expirationTime:number;
  refreshToken:number;
}
