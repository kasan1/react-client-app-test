import { makeAutoObservable, runInAction, reaction } from 'mobx';
import agent from '../api/agent';
import { IRegisterFormValues, IUserListItem } from '../models/user';
import { RootStore } from './rootStore';

export default class AdminStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);

    reaction(
      () => this.pagingParams,
      () => this.getUsers(),
    );
  }

  loading: boolean = false;
  page: number = 0;
  pageLimit: number = 5;
  users: IUserListItem[] = [];
  usersCount: number = 0;

  registerFormIsPending: boolean = false;

  get pagingParams() {
    return {
      page: this.page,
      pageLimit: this.pageLimit,
    };
  }

  getUsers = async () => {
    try {
      this.loading = true;
      const response = await agent.User.list({
        page: this.page,
        pageLimit: this.pageLimit,
      });

      runInAction(() => {
        this.loading = false;
        this.users = response.data.list;
        this.usersCount = response.data.count;
      });
    } catch (ex) {
      runInAction(() => {
        this.loading = false;
        this.users = [];
        this.usersCount = 0;
      });
    }
  };

  registerUser = async (data: IRegisterFormValues) => {
    try {
      this.registerFormIsPending = true;

      await agent.User.register(data);

      runInAction(() => {
        this.registerFormIsPending = false;
      });
    } catch (error) {
      runInAction(() => {
        this.registerFormIsPending = false;
        // @ts-ignore
        throw error.data;
      });
    }
  };

  handleChangePage = (_: unknown, newPage: number) => {
    this.page = newPage;
  };

  handleChangePageLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.page = 0;
    this.pageLimit = parseInt(event.target.value);
  };
}
