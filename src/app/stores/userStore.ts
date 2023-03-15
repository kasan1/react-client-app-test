import { makeAutoObservable, runInAction } from 'mobx';
import jwt_decode from 'jwt-decode';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';
import {
  IUser,
  ILoginFormValues,
  UserRole,
  IRegisterFormValues,
  IChangePasswordFormValues,
  IResetPasswordFormValues,
  IForgotPasswordFormValues,
} from '../models/user';
import { toast } from 'react-toastify';

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  user: IUser | null = null;
  loginModalOpen = false;
  pending = false;

  get isLoggedIn() {
    return !!this.user;
  }

  isInRole = (role: UserRole): boolean => {
    if (!this.user) {
      return false;
    }

    return this.user.role.some((r) => r === role);
  };

  login = async (values: ILoginFormValues) => {
    try {
      this.pending = true;

      const result = await agent.User.login(values);
      runInAction(() => {
        this.loginModalOpen = false;
        this.pending = false;

        this.setUserFromToken(result.data.accessToken);

        this.rootStore.commonStore.setTokens(
          result.data.accessToken,
          result.data.refreshToken,
        );
        history.push('/tasklist');
      });
    } catch (error) {
      runInAction(() => {
        this.pending = false;
        // @ts-ignore
        throw error.data;
      });
    }
  };

  register = async (values: IRegisterFormValues) => {
    try {
      this.pending = true;

      const result = await agent.User.register(values);
      runInAction(() => {
        this.setUserFromToken(result.data.accessToken);

        this.rootStore.commonStore.setTokens(
          result.data.accessToken,
          result.data.refreshToken,
        );
        history.push('/tasklist');
      });
    } catch (error) {
      // @ts-ignore
      throw error.data;
    }
  };

  refreshToken = async () => {
    try {
      const result = await agent.User.refresh();

      runInAction(() => {
        this.setUserFromToken(result.data.accessToken);

        this.rootStore.commonStore.setTokens(
          result.data.accessToken,
          result.data.refreshToken,
        );
        history.push('/tasklist');
      });
    } catch (error) {
      runInAction(() => {
        this.logout();
      });
    }
  };

  changePassword = async (data: IChangePasswordFormValues) => {
    try {
      this.pending = true;

      var result = await agent.User.changePassword(data);
      runInAction(() => {
        this.pending = false;
        toast.success(result.message);
      });
    } catch (ex) {
      runInAction(() => {
        this.pending = false;
        // @ts-ignore
        throw ex.data;
      });
    }
  };

  resetPassword = async (data: IResetPasswordFormValues) => {
    try {
      this.pending = true;

      var result = await agent.User.resetPassword(data);
      runInAction(() => {
        this.pending = false;
        toast.success(result.message);
        history.push('/');
      });
    } catch (ex) {
      runInAction(() => {
        this.pending = false;
        // @ts-ignore
        if (ex.data && 'Message' in ex.data) {
          // @ts-ignore
          toast.error(ex.data.Message);
        }
      });
    }
  };

  forgotPassword = async (data: IForgotPasswordFormValues) => {
    try {
      this.pending = true;

      var result = await agent.User.forgotPassword(data);
      runInAction(() => {
        this.pending = false;
        toast.success(result.message);
        history.push('/');
      });
    } catch (ex) {
      runInAction(() => {
        this.pending = false;
        // @ts-ignore
        if (ex.data && 'Message' in ex.data) {
          // @ts-ignore
          toast.error(ex.data.Message);
        }
      });
    }
  };

  logout = () => {
    this.user = null;
    this.rootStore.profileStore.clearProfile();
    this.rootStore.commonStore.setTokens(null, null);
    this.rootStore.commonStore.setSidebarOpenState(false);
    this.rootStore.loanApplicationListStore.selectNavigationItem(null, null);
    history.push('/');
  };

  setLoginModalOpenState = (state: boolean) => {
    this.loginModalOpen = state;
  };

  setUserFromToken = (access_token: string) => {
    const decoded = jwt_decode<IUser>(access_token);

    this.user = {
      ...decoded,
      role: this.getRolesFromUserPayload(decoded),
    };
  };

  getRolesFromUserPayload = (user: IUser): UserRole[] => {
    if (!user.role) {
      return [];
    }

    if (typeof user.role === 'string') {
      return [user.role];
    }

    return user.role;
  };
}
