import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IImportCheckingListFormValues } from '../models/import';
import { RootStore } from './rootStore';

export default class ImportStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  loading: boolean = false;

  importCheckingList = async (
    data: IImportCheckingListFormValues,
  ): Promise<void> => {
    var formData = new FormData();
    formData.append('typeId', data.typeId);
    formData.append('file', data.file!);

    try {
      this.loading = true;

      const response = await agent.Import.checkingList(formData);

      runInAction(() => {
        this.loading = false;
        toast.success(response.message);
      });
    } catch (ex) {
      runInAction(() => {
        this.loading = false;
        // @ts-ignore
        throw ex.data;
      });
    }
  };
}
