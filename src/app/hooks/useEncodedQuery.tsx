import { Dictionary } from 'lodash';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

class UrlParams {
  qs: string;
  params: Dictionary<string>;

  constructor(search: string) {
    this.qs = (search || window.location.search).substr(1);
    this.params = {};
    this.parseQuerstring();
  }

  parseQuerstring() {
    this.qs.split('&').reduce((a, b) => {
      let [key, val] = b.split('=');
      a[key] = val;
      return a;
    }, this.params);
  }

  get(key: string) {
    return this.params[key];
  }
}

export const useEncodedQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new UrlParams(search), [search]);
};
