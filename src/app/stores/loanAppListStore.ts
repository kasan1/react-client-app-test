import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { OrderDirection } from '../models/common';
import {
  ILoanApplicationListItem,
  ILoanApplicationNavigation,
} from '../models/loanApplication';
import { RootStore } from './rootStore';

export default class LoanApplicationListStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);

    reaction(
      () => this.page,
      async () => await this.getLoanApplications(),
    );

    reaction(
      () => this.pageLimit,
      async () => await this.getLoanApplications(),
    );

    reaction(
      () => this.order,
      async () => await this.getLoanApplications(),
    );

    reaction(
      () => this.navigationParams,
      async () => {
        if (this.rootStore.userStore.user !== null) {
          await this.getLoanApplications();
        }
      },
    );
  }

  pending = false;
  page = 0;
  pageLimit = 10;
  order: OrderDirection = 'desc';
  orderBy: keyof ILoanApplicationListItem = 'appointmentDate';
  search: string = '';
  count = 0;
  loanApplications: Partial<ILoanApplicationListItem>[] = [];
  loanStatus: string | null = null;
  userRole: string | null = null;
  navigationPending = false;
  navigationItems: ILoanApplicationNavigation[] = [];

  get navigationParams() {
    return {
      loanStatus: this.loanStatus,
      userRole: this.userRole,
    };
  }

  handlePageChange = (_: unknown, newPage: number) => {
    this.page = newPage;
  };

  handlePageLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.pageLimit = parseInt(event.target.value);
  };

  handleOrderingChange = (property: keyof ILoanApplicationListItem) => {
    const isAsc = this.orderBy === property && this.order === 'asc';
    this.order = isAsc ? 'desc' : 'asc';
    this.orderBy = property;
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.search = event.target.value;
  };

  getLoanApplications = async () => {
    try {
      this.pending = true;
      const result = await agent.LoanApplication.getList({
        page: this.page + 1,
        pageLimit: this.pageLimit,
        orderBy: this.orderBy,
        order: this.order,
        search: this.search,
        statusId: this.loanStatus,
        roleId: this.userRole,
      });

      runInAction(() => {
        this.pending = false;
        this.count = result.data.count;
        this.loanApplications = result.data.list;
      });
    } catch (ex) {
      runInAction(() => {
        this.pending = false;
        // @ts-ignore
        if (ex.data) {
          // @ts-ignore
          toast.error(ex.data.message);
        }
      });
    }
  };

  getNavigationItems = async () => {
    try {
      this.navigationPending = true;
      const result = await agent.LoanApplication.getNavigationItems();

      runInAction(() => {
        this.navigationPending = false;
        this.navigationItems = result.data;
      });
    } catch (ex) {
      runInAction(() => {
        this.navigationPending = false;
        // @ts-ignore
        if (ex.data) {
          // @ts-ignore
          toast.error(ex.data.message);
        }
      });
    }
  };

  selectNavigationItem = (
    userRole: string | null,
    loanStatus: string | null,
  ) => {
    this.userRole = userRole;
    this.loanStatus = loanStatus;
  };
}
