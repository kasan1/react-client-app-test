import { Dictionary } from 'lodash';
import { IFileListItem, ITableData, OrderDirection } from './common';
import { UserRole } from './user';

// List
export interface ILoanApplicationListItem {
  loanApplicationId: string;
  loanApplicationTaskId: string;
  appointmentDate: Date;
  fullname: string;
  iin: string;
  loanType: string;
  loanProduct: string;
  loanStatus: string;
  registerNumber: string;
  clientSegment: string;
}

export interface ILoanApplicationListForm {
  page: number;
  pageLimit: number;
  order: OrderDirection;
  orderBy: keyof ILoanApplicationListItem;
  search: string;
  statusId: string | null;
  roleId: string | null;
}

export interface ILoanApplicationNavigation {
  roleId: string | null;
  name: string;
  items: INavigationItem[];
}

export interface INavigationItem {
  statusId: string | null;
  name: string;
  value: number;
}

// Details
export interface ILoanApplicationDetails {
  application: ILoanApplicationDetailsCommonData;
  clientDetails: IClientDetails;
  clientExtraDetails: IClientExtraDetails;
  assets: IAssets;
  contracts: IContractsTable;
  documents: IFileListItem[];
  forms: IFormSettings[];
  finAnalysis: IFinAnalysis;
}

export interface ILoanApplicationDetailsCommonData {
  loanApplicationId: string;
  createdDate: Date;
  userRole: UserRole;
  status: string;
  pkbFile: IFileListItem;
  loanType: LizingType;
}

export interface IPersonalData {
  fullname: string | null;
  maritalStatus: string | null;
  childrenCount: number;
  iin: string | null;
  identification: string | null;
  address: string | null;
  phoneNumber: string | null;
}

export interface IAssets {
  land: ITableData;
  bio: ITableData;
  flora: ITableData;
  tech: ITableData;
}

export enum LizingType {
  Default = 0,
  Standard = 1,
  Express = 2,
}

export interface IClientExtraDetails {
  owners: ITableData;
  licenses: ITableData;
  vatCertificates: ITableData;
}

export interface IContractsTable {
  calculators: ITableData;
  techniques: ITableData;
  provisions: ITableData;
}

export interface IFinAnalysis {
  dateOfInspection: string;
  overallStatus: string;
  results: IFinAnalysisResultItem[];
}

export interface IFinAnalysisResultItem {
  blockName: string;
  subjects: IFinAnalysisSubject[];
  file: IFileListItem;
}

export interface IFinAnalysisSubject {
  name: string;
  status: VerificationStatus | null;
  statusName: string | null;
}

export enum VerificationStatus {
  ServiceUnavailable = 0,
  Correct = 1,
  Minor = 2,
  Critical = 3,
}

export interface IFormSettings {
  id: string;
  title: string;
  subtitle: string;
  isReadOnly: boolean;
  buttons: IFormSettingsButton[];
  fields: IFormSettingsField[];
}

export interface IFormSettingsButton {
  hasForm: boolean;
  taskStatusId: string;
  isApply: boolean;
  name: string;
  dialogTitle: string;
  dialogMessage: string;
}

export interface IFormSettingsField {
  id: string;
  isChecked: boolean;
  countOfComments: number;
  name: string;
}

export interface ICompleteTaskFormValues {
  taskId: string;
  taskStatusId: string;
  comment: string;
  files: Blob[];
  fields: Dictionary<boolean>;
}

export enum TaskStatus {
  Completed = 'Completed',
  Rejected = 'Rejected',
  InWork = 'InWork',
  Created = 'Created',
}

export interface IUserReportCheckboxFormValues {
  fields: Dictionary<boolean>;
}

export interface IUserReportCommentFormValues {
  comment: string;
  files: FileList;
}

export interface IExpertiseResult {
  roleName: string;
  comment: string;
  files: IFileListItem[];
}

export interface ICreditCommitteeResult {
  userName: string;
  comment: string;
}

export interface IPersonality {
  id?: string;
  identifier: string;
  fullName: string;
  fax: string;
  email: string;
  phone: IPhone;
  address: IAddress;
  identificationDocument: IDocument;
  workExperience?: IWorkExperience;
  region?: string;
}

export interface IWorkExperience {
  id?: string;
  total: string;
  agriculture: string;
}

export interface IPhone {
  id?: string;
  home: string;
  mobile: string;
  work: string;
}

export interface IAddress {
  id?: string;
  fact: string;
  register: string;
}

export interface IDocument {
  id?: string;
  number: string;
  issuer: string;
  dateIssue: Date;
}

export interface IBankAccount {
  id?: string;
  bic: string;
  number: string;
}

export interface ICreditHistory {
  id?: string;
  fullName: string;
  dateIssue: Date;
  period: number;
  sum: number;
  balance: number;
}

export interface IDebt {
  id?: string;
  bic: string;
  debt: number;
}

export interface IPerson extends IPersonality {
  id?: string;
  birthDate: Date;
  birthPlace: string;
  country: string;
  marriageStatus: string;
  education: string;
  spouse?: string;
}

export interface IOrganization extends IPersonality {
  id?: string;
  organizationType: string;
  ownershipForm: string;
  oked: string[];
  registrationDocument: IDocument;
  parent: string;
  bankAccounts: IBankAccount[];
  shareInCapital: number;
  debts: IDebt[];
  isAffiliated: boolean;
  affiliatedOrganizations: IOrganization[];
  creditHistory: ICreditHistory[];
}

export interface IClientDetails {
  id?: string;
  organization: IOrganization;
  head: IPerson;
  booker: IPerson;
  beneficiary?: IPerson;
  representative?: IPerson;
  contacts: IPerson[];
}
