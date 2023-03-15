import { IFileListItem } from './common';

export interface IProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Date;
  email: string;
  phone: string;
  image: IFileListItem | null;
}

export interface IProfileFormValues {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Date;
  email: string;
  phone: string;
  image: File;
}
