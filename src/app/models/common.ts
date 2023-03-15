import { Dictionary } from 'lodash';

export enum Lang {
  kk = 'kk',
  ru = 'ru',
  en = 'en',
}

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export interface IName {
  kk: string;
  ru: string;
  en: string;
}

export enum Status {
  positive = 'positive',
  negative = 'negative',
  stable = 'stable',
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface INamedFile {
  name: IName;
  url: string;
}

export interface IResponse<T> {
  data: T;
  message: string | null;
  succeed: boolean;
  errors: Dictionary<string[]>;
}

export type OrderDirection = 'asc' | 'desc';

export interface ITableData {
  header: ITableHeader[];
  body: Dictionary<any>[];
}

export interface ITableHeader {
  code: string;
  name: string;
  isOrderBy: boolean;
  orderByDirection: OrderDirection;
}

export interface IFileListItem {
  id: string;
  filename: string;
  url: string;
}

export enum EntityTypes {
  LoanApplication = 1,
  LoanApplicationTask = 2,
  PBK = 3,
  Comment = 4,
}

export interface IEntityBase {
  entityId: string;
  entityType: EntityTypes;
}

export interface IPagingBase {
  page: number;
  pageLimit: number;
}

export interface ICommentListItem {
  commentId: string;
  date: string;
  author: string;
  text: string;
  files: IFileListItem[];
}

export interface IUploadFilesFormValues extends IEntityBase {
  files: Blob[];
}

export interface IListFilesFormValues extends IEntityBase {}

export interface IListCommentsFormValues extends IPagingBase {
  roleControlsFieldId: string;
  loanApplicationTaskId: string;
}

export interface IListResponse<T> {
  list: T[];
  count: number;
}

export interface IDictionaryItem {
  id: string;
  parentId: string;
  code: string;
  name: string;
}
