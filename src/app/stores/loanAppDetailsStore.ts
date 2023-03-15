import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { history } from '../../';
import {
  ICompleteTaskFormValues,
  IExpertiseResult,
  ICreditCommitteeResult,
  ILoanApplicationDetails,
  IUserReportCheckboxFormValues,
} from '../models/loanApplication';
import { RootStore } from './rootStore';
import {
  EntityTypes,
  ICommentListItem,
  IListCommentsFormValues,
  IListFilesFormValues,
} from '../models/common';
import { toast } from 'react-toastify';
import { Dictionary } from 'lodash';

export default class LoadApplicationDetailsStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  detailsAreLoading = false;
  loanApplicationTaskId: string | null = null;
  loanApplicationTaskStatusId: string | null = null;
  loanApplication: ILoanApplicationDetails | null = null;
  expertiseResults: IExpertiseResult[] = [];
  creditCommitteeResults: ICreditCommitteeResult[] = [];

  expertiseResultsLoading = false;
  creditCommitteeResultsLoading = false;
  completeTaskLoading = false;
  uploadingFiles = false;

  userReportFormValues: Dictionary<IUserReportCheckboxFormValues> = {};

  setUserReportFormCheckboxValue = (
    formId: string,
    key: string,
    value: boolean,
  ) => {
    if (this.userReportFormValues[formId] === undefined) {
      this.userReportFormValues[formId] = {
        fields: {},
      };
    }

    this.userReportFormValues[formId].fields[key] = value;
  };

  setLoanApplicationTaskId = (id: string) => {
    this.loanApplicationTaskId = id;
  };

  setLoanApplicationTaskStatusId = (statusId: string | null) => {
    this.loanApplicationTaskStatusId = statusId;
  };

  getLoanApplicationDetails = async (id: string) => {
    try {
      this.detailsAreLoading = true;
      var result = await agent.LoanApplication.getDetails(id);

      runInAction(() => {
        this.detailsAreLoading = false;
        this.loanApplication = result.data;

        this.loanApplication.forms.forEach((form) => {
          this.userReportFormValues[form.id] = {
            fields: {},
          };

          form.fields.forEach((field) => {
            this.setUserReportFormCheckboxValue(
              form.id,
              field.id,
              field.isChecked,
            );
          });
        });
      });
    } catch (ex) {
      runInAction(() => {
        this.detailsAreLoading = false;
        this.loanApplication = null;
        history.push('/not-found');
      });
    }
  };

  getExpertiseResults = async () => {
    try {
      this.expertiseResultsLoading = true;

      const result = await agent.LoanApplication.getExpertiseResults(
        this.loanApplicationTaskId!,
      );

      if (result.succeed) {
        runInAction(() => {
          this.expertiseResultsLoading = false;
          this.expertiseResults = result.data;
        });
      }
    } catch (ex) {
      runInAction(() => {
        this.expertiseResultsLoading = false;
        this.expertiseResults = [];
      });
    }
  };

  getCreditCommitteeResults = async () => {
    try {
      this.creditCommitteeResultsLoading = true;

      const result = await agent.LoanApplication.getCreditCommitteeResults(
        this.loanApplicationTaskId!,
      );

      if (result.succeed) {
        runInAction(() => {
          this.creditCommitteeResultsLoading = false;
          this.creditCommitteeResults = result.data;
        });
      }
    } catch (ex) {
      runInAction(() => {
        this.creditCommitteeResultsLoading = false;
        this.expertiseResults = [];
      });
    }
  };

  completeTask = async (
    formId: string,
    data: Partial<ICompleteTaskFormValues>,
  ) => {
    try {
      this.completeTaskLoading = true;

      const formData = new FormData();
      formData.append('taskId', this.loanApplicationTaskId!);
      formData.append(
        'taskStatusId',
        data.taskStatusId ?? this.loanApplicationTaskStatusId!,
      );

      if (data.comment && data.files) {
        formData.append('comment', data.comment);
        Array.from(data.files).forEach((file, idx) => {
          formData.append(`files`, file);
        });
      }

      for (const [key, value] of Object.entries(
        this.userReportFormValues[formId].fields,
      )) {
        formData.append(`fields[${key}]`, value.toString());
      }

      const result = await agent.LoanApplication.completeTask(formData);

      runInAction(() => {
        this.completeTaskLoading = false;

        if (result.succeed) {
          this.setLoanApplicationTaskStatusId(null);
          history.push('/tasklist');
        }
      });
    } catch (ex) {
      runInAction(() => {
        this.completeTaskLoading = false;
      });
    }
  };

  uploadDocuments = async (files: FileList | null) => {
    try {
      this.uploadingFiles = true;

      const formData = new FormData();
      formData.append(
        'entityId',
        this.loanApplication!.application.loanApplicationId,
      );
      formData.append('entityType', EntityTypes.LoanApplication.toString());
      Array.from(files!).forEach((file) => {
        formData.append(`files`, file);
      });

      const result = await agent.Files.upload(formData).finally(
        async () => await this.getDocuments(),
      );

      runInAction(() => {
        this.uploadingFiles = false;
        toast.success(result.message);
      });
    } catch (ex) {
      runInAction(() => {
        this.uploadingFiles = false;
      });
    }
  };

  removeDocument = async (fileId: string) => {
    try {
      this.uploadingFiles = true;

      const result = await agent.Files.remove(fileId).finally(
        async () => await this.getDocuments(),
      );

      runInAction(() => {
        this.uploadingFiles = false;
        toast.success(result.message);
      });
    } catch (ex) {
      runInAction(() => {
        this.uploadingFiles = false;
      });
    }
  };

  getDocuments = async () => {
    try {
      const form: IListFilesFormValues = {
        entityId: this.loanApplication!.application.loanApplicationId,
        entityType: EntityTypes.LoanApplication,
      };

      var result = await agent.LoanApplication.getDocuments(form);

      runInAction(() => {
        this.uploadingFiles = false;
        this.loanApplication!.documents = result.data;
      });
    } catch (ex) {
      runInAction(() => {
        this.uploadingFiles = false;
      });
    }
  };

  getComments = async (
    entityId: string,
    page: number,
    pageLimit: number,
  ): Promise<{ list: ICommentListItem[]; count: number } | null> => {
    try {
      const queryParams: IListCommentsFormValues = {
        page,
        pageLimit,
        roleControlsFieldId: entityId,
        loanApplicationTaskId: this.loanApplicationTaskId!,
      };

      var result = await agent.Comments.list(queryParams);

      return result.data;
    } catch (ex) {
      // TODO: show error if not > 500
      return null;
    }
  };

  addComment = async (
    entityId: string,
    comment: string,
    files: FileList | null,
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('roleControlsFieldId', entityId);
      formData.append('loanApplicationTaskId', this.loanApplicationTaskId!);
      formData.append('text', comment);
      Array.from(files!).forEach((file) => {
        formData.append(`files`, file);
      });

      const result = await agent.Comments.add(formData);

      runInAction(() => {
        toast.success(result.message);
      });
    } catch (ex) {
      // TODO: show error if not > 500
    }
  };

  removeComment = async (commentId: string): Promise<void> => {
    try {
      const result = await agent.Comments.remove(commentId);

      runInAction(() => {
        toast.success(result.message);
      });
    } catch (ex) {
      // TODO: show error if not > 500
    }
  };
}
