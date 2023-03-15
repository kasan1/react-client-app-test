import { AxiosResponse } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IMonitoringSearchFormValues } from '../models/monitoring';
import { RootStore } from './rootStore';

export default class MonitoringStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  loading: boolean = false;

  getReport = async (
    data: IMonitoringSearchFormValues,
  ): Promise<AxiosResponse | null> => {
    try {
      this.loading = true;

      const response = await agent.Monitoring.report(data);

      runInAction(() => {
        this.loading = false;
      });

      return response;
    } catch (ex) {
      runInAction(() => {
        this.loading = false;

        toast.error('Не удалось скачать отчет');
      });

      return null;
    }
  };
}
