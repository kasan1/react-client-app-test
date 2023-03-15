import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './rootStore';
import { IProfile, IProfileFormValues } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  loading = false;
  profile: IProfile | null = null;

  get fullname() {
    if (this.profile == null) {
      return '';
    }

    return `${this.profile.lastName} ${this.profile.firstName} ${this.profile.middleName}`.trim();
  }

  clearProfile = () => {
    this.profile = null;
  };

  loadProfile = async () => {
    try {
      this.loading = true;

      var result = await agent.Profile.get();
      runInAction(() => {
        this.profile = result.data;
        this.loading = false;
      });
    } catch (ex) {
      runInAction(() => {
        this.profile = null;
        this.loading = false;
        // @ts-ignore
        if (ex.data) {
          // @ts-ignore
          toast.error(ex.data.message);
        }
      });
    }
  };

  updateProfile = async (data: IProfileFormValues) => {
    try {
      this.loading = true;

      var formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('middleName', data.middleName);
      formData.append(
        'birthDate',
        `${data.birthDate.getDate()}-${
          data.birthDate.getMonth() + 1
        }-${data.birthDate.getFullYear()}`,
      );
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('image', data.image);

      var result = await agent.Profile.update(formData);
      runInAction(() => {
        this.profile = result.data;
        this.loading = false;
        toast.success(result.message);
      });
    } catch (ex) {
      runInAction(() => {
        this.profile = null;
        this.loading = false;
        // @ts-ignore
        throw ex.data;
      });
    }
  };
}
