import { RootStore } from './rootStore';
import { reaction, makeAutoObservable } from 'mobx';
import { ru, enUS, kk } from 'date-fns/locale';
import i18n from '../config/i18n';
import { Lang, Theme } from '../models/common';

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);

    reaction(
      () => this.access_token,
      (token) => {
        if (token == null) window.localStorage.removeItem('jwt_access');
        else window.localStorage.setItem('jwt_access', token);
      },
    );

    reaction(
      () => this.refresh_token,
      (token) => {
        if (token == null) window.localStorage.removeItem('jwt_refresh');
        else window.localStorage.setItem('jwt_refresh', token);
      },
    );
  }

  access_token: string | null = window.localStorage.getItem('jwt_access');
  refresh_token: string | null = window.localStorage.getItem('jwt_refresh');
  appLoaded = false;
  lang: Lang = Lang.ru; // i18n.language
  locale: Locale = ru;
  theme: Theme = Theme.light;
  overlayOpen = false;
  sideBarOpen = false;

  setTokens = (access_token: string | null, refresh_token: string | null) => {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };

  setLanguage = (lang: Lang) => {
    i18n.changeLanguage(lang);
    this.lang = lang;
    switch (lang) {
      case 'kk':
        this.locale = kk;
        break;
      case 'en':
        this.locale = enUS;
        break;
      case 'ru':
      default:
        this.locale = ru;
    }
  };

  setTheme = (theme: Theme) => {
    this.theme = theme;
  };

  setOverlayOpenState = (state: boolean) => {
    this.overlayOpen = state;
  };

  setSidebarOpenState = (state: boolean) => {
    this.sideBarOpen = state;
  };
}
