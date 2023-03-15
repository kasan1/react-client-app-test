import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor, {
  AxiosAuthRefreshRequestConfig,
} from 'axios-auth-refresh';
import { toast } from 'react-toastify';
import {
  IResponse,
  IFileListItem,
  IListFilesFormValues,
  IListCommentsFormValues,
  ICommentListItem,
  IPagingBase,
  IListResponse,
  IDictionaryItem,
} from '../models/common';
import {
  ILoanApplicationListItem,
  ILoanApplicationListForm,
  ILoanApplicationNavigation,
  ILoanApplicationDetails,
  IExpertiseResult,
  ICreditCommitteeResult,
} from '../models/loanApplication';
import { IProfile } from '../models/profile';
import {
  IToken,
  ILoginFormValues,
  IUserListItem,
  IRegisterFormValues,
  IChangePasswordFormValues,
  IResetPasswordFormValues,
  IForgotPasswordFormValues,
} from '../models/user';
import { IMonitoringSearchFormValues } from '../models/monitoring';

axios.defaults.baseURL = process.env.REACT_APP_BPM_API_URL;

axios.interceptors.request.use(
  (cfg) => {
    const access_token = window.localStorage.getItem('jwt_access');
    const refresh_token = window.localStorage.getItem('jwt_refresh');
    const lang = window.localStorage.getItem('i18nextLng');
    if (access_token && refresh_token) {
      cfg.headers.Authorization = `Bearer ${access_token}`;
      cfg.headers['X-Access-Token'] = access_token;
      cfg.headers['X-Refresh-Token'] = refresh_token;
      cfg.headers['Accept-Language'] = lang;
    }
    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const refreshAuthLogic = (failedRequest: any) =>
  axios.post('users/refresh').then((tokenRefreshResponse) => {
    if (tokenRefreshResponse.data.succeed) {
      localStorage.setItem(
        'jwt_access',
        tokenRefreshResponse.data.data.accessToken,
      );
      localStorage.setItem(
        'jwt_refresh',
        tokenRefreshResponse.data.data.refreshToken,
      );
      failedRequest.response.config.headers['Authorization'] =
        'Bearer ' + tokenRefreshResponse.data.accessToken;

      return Promise.resolve();
    } else {
      localStorage.removeItem('jwt_access');
      localStorage.removeItem('jwt_refresh');

      return Promise.reject();
    }
  });

createAuthRefreshInterceptor(axios, refreshAuthLogic);

axios.interceptors.response.use(undefined, (error) => {
  const locale = window.localStorage.getItem('i18nextLng');
  let message = 'Ошибка сервера. Пожалуйста обратитесь к администратору';

  if (error.message.toLowerCase() === 'network error' && !error.response) {
    message = 'Проблема с интернет подключением';
    if (locale === 'kk') message = 'Интернетке қосылуда ақау байқалуда';
    else if (locale === 'en') message = 'Internet connection problem';

    toast.error(message);
  }

  if (error.response) {
    const { status } = error.response;

    if (status >= 500) {
      if (locale === 'kk')
        message = 'Серверлік қате. Администраторға хабарласуыңызды өтінеміз';
      else if (locale === 'en')
        message = 'Server error. Please contact to administrator';

      toast.error(message);
    }

    if (isResponse(error.response.data)) throw error.response;

    throw error.response;
  }

  return Promise.reject(error);
});

// TODO: make it work
const isResponse = (response: any): response is IResponse<any> => {
  if ((response as IResponse<any>).message) return true;

  return false;
};

const responseBody = (response: AxiosResponse) => response?.data;

const requests = {
  get: (url: string, config?: AxiosRequestConfig | undefined) =>
    axios.get(url, config).then(responseBody),
  post: (
    url: string,
    body: {},
    config?: AxiosRequestConfig | AxiosAuthRefreshRequestConfig,
  ) => axios.post(url, body, config).then(responseBody),
  put: (url: string, body: {}, config?: AxiosRequestConfig) =>
    axios.put(url, body, config).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const User = {
  login: (user: ILoginFormValues): Promise<IResponse<IToken>> =>
    requests.post(`users/login`, user),
  register: (user: IRegisterFormValues): Promise<IResponse<IToken>> =>
    requests.post(`users/register`, user),
  refresh: (): Promise<IResponse<IToken>> =>
    requests.post(`users/refresh`, {}, { skipAuthRefresh: true }),
  list: (
    filter: IPagingBase,
  ): Promise<IResponse<IListResponse<IUserListItem>>> =>
    requests.get(`users?page=${filter.page}&pageLimit=${filter.pageLimit}`),
  changePassword: (data: IChangePasswordFormValues): Promise<IResponse<void>> =>
    requests.put('users/password', data),
  resetPassword: (data: IResetPasswordFormValues): Promise<IResponse<void>> =>
    requests.post('users/password/reset', data),
  forgotPassword: (data: IForgotPasswordFormValues): Promise<IResponse<void>> =>
    requests.post('users/password/forgot', data),
};

const Files = {
  upload: (formData: FormData): Promise<IResponse<void>> =>
    requests.post(`files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (fileId: string): Promise<IResponse<void>> =>
    requests.delete(`files/${fileId}`),
};

const Profile = {
  get: (): Promise<IResponse<IProfile>> => requests.get('users/profile'),
  update: (formData: FormData): Promise<IResponse<IProfile>> =>
    requests.put('users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

const Comments = {
  list: (
    form: IListCommentsFormValues,
  ): Promise<IResponse<IListResponse<ICommentListItem>>> =>
    requests.get('comments/', { params: form }),
  add: (formData: FormData): Promise<IResponse<void>> =>
    requests.post(`comments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (commentId: string): Promise<IResponse<void>> =>
    requests.delete(`comments/${commentId}`),
};

const LoanApplication = {
  getList: (
    form: ILoanApplicationListForm,
  ): Promise<IResponse<IListResponse<ILoanApplicationListItem>>> =>
    requests.get('loanApplications/', { params: form }),
  getNavigationItems: (): Promise<IResponse<ILoanApplicationNavigation[]>> =>
    requests.get('loanApplications/navigation'),
  getDetails: (id: string): Promise<IResponse<ILoanApplicationDetails>> =>
    requests.get(`loanApplications/${id}`),
  getDocuments: (
    form: IListFilesFormValues,
  ): Promise<IResponse<IFileListItem[]>> =>
    requests.get('files', { params: form }),
  completeTask: (formData: FormData): Promise<IResponse<void>> =>
    requests.post(`loanApplications/task/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getExpertiseResults: (id: string): Promise<IResponse<IExpertiseResult[]>> =>
    requests.get(`loanApplications/expertise/${id}`),
  getCreditCommitteeResults: (
    id: string,
  ): Promise<IResponse<ICreditCommitteeResult[]>> =>
    requests.get(`loanApplications/committee/${id}`),
};

const Dictionary = {
  getByCode: (
    code: string,
  ): Promise<IResponse<IListResponse<IDictionaryItem>>> =>
    requests.get(`dictionary?code=${code}`),
};

const Import = {
  checkingList: (formData: FormData): Promise<IResponse<void>> =>
    requests.post('files/checkinglist', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

const Monitoring = {
  report: (data: IMonitoringSearchFormValues): Promise<AxiosResponse> =>
    axios.get(`integrations/monitoring/report`, {
      params: data,
      responseType: 'blob',
    }),
};

const APIs = {
  User,
  Files,
  Comments,
  LoanApplication,
  Profile,
  Dictionary,
  Import,
  Monitoring,
};

export default APIs;
