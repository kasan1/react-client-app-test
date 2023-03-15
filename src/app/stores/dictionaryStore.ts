import { Dictionary } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IDictionaryItem } from '../models/common';
import { RootStore } from './rootStore';

export default class DictionaryStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  dictionaries: Dictionary<IDictionaryItem[]> = {};

  getDictionaryValues = async (code: string) => {
    if (code in this.dictionaries) {
      return this.dictionaries[code];
    }

    try {
      const response = await agent.Dictionary.getByCode(code);

      runInAction(() => {
        this.dictionaries[code] = response.data.list;
      });

      return response.data.list;
    } catch (err) {
      // @ts-ignore

      return [];
    }
  };
}
