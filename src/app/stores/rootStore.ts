import { createContext } from 'react';
import { configure } from 'mobx';
import CommonStore from './commonStore';
import UserStore from './userStore';
import ProfileStore from './profileStore';
import NcaLayerStore from './ncaLayerStore';
import LoanApplicationListStore from './loanAppListStore';
import LoadApplicationDetailsStore from './loanAppDetailsStore';
import AdminStore from './adminStore';
import DictionaryStore from './dictionaryStore';
import ImportStore from './importStore';
import MonitoringStore from './monitoringStore';

configure({ enforceActions: 'always' });

export class RootStore {
  commonStore: CommonStore;
  userStore: UserStore;
  adminStore: AdminStore;
  profileStore: ProfileStore;
  ncaLayerStore: NcaLayerStore;
  loanApplicationListStore: LoanApplicationListStore;
  loadApplicationDetailsStore: LoadApplicationDetailsStore;
  dictionaryStore: DictionaryStore;
  importStore: ImportStore;
  monitoringStore: MonitoringStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.userStore = new UserStore(this);
    this.loanApplicationListStore = new LoanApplicationListStore(this);
    this.loadApplicationDetailsStore = new LoadApplicationDetailsStore(this);
    this.ncaLayerStore = new NcaLayerStore(this);
    this.profileStore = new ProfileStore(this);
    this.adminStore = new AdminStore(this);
    this.dictionaryStore = new DictionaryStore(this);
    this.importStore = new ImportStore(this);
    this.monitoringStore = new MonitoringStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
