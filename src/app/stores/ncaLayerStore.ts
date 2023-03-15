import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './rootStore';
import { toast } from 'react-toastify';

export default class NcaLayerStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  module = 'kz.gov.pki.knca.commonUtils';
  storageName = 'PKCS12'; // тип хранилища
  keyTypeValue = 'SIGNATURE'; // тип использования ключа
  tbsElementXPath = ''; // XPath выражение ссылающееся на элемент XML файла предназначенного для подписи
  signatureParentElementXPath = ''; // XPath выражение ссылающееся на родительский элемент, куда будет записана подпись

  webSocket: WebSocket | null = null;
  isConnectionOpen = false;

  openConnection = () => {
    this.webSocket = new WebSocket(process.env.REACT_APP_NCA_LAYER_URL!);

    this.webSocket.onopen = (event: Event) => {
      runInAction(() => {
        this.isConnectionOpen = true;
      });
    };

    this.webSocket.onclose = (event: CloseEvent) => {
      if (!event.wasClean)
        toast.warn(
          'Ошибка при подключении к NCALayer, запустите NCALayer и попробуйте снова',
        );

      runInAction(() => {
        this.isConnectionOpen = false;
      });
    };

    this.webSocket.onerror = (event: Event) => {
      console.error(event);
    };

    this.webSocket.onmessage = (event: MessageEvent) => {
      // TODO: do something with response and define method name
      if (event.type === 'message') {
        console.log(JSON.parse(event.data));
      }
      console.log(event);
    };
  };

  closeConnection = () => {
    if (this.webSocket !== null && this.isConnectionOpen) {
      this.webSocket.close();
    }
  };

  authorize = () => {
    if (!this.isConnectionOpen) this.openConnection();

    if (this.webSocket !== null && this.isConnectionOpen) {
      const data = {
        module: this.module,
        method: 'getKeyInfo',
        args: [this.storageName],
      };

      this.webSocket.send(JSON.stringify(data));
    }
  };

  signXml = (xml: string) => {
    if (!this.isConnectionOpen) this.openConnection();

    if (this.webSocket !== null && this.isConnectionOpen) {
      const data = {
        module: this.module,
        method: 'signXml',
        args: [
          this.storageName,
          this.keyTypeValue,
          xml,
          this.tbsElementXPath,
          this.signatureParentElementXPath,
        ],
      };

      this.webSocket.send(JSON.stringify(data));
    }
  };
}
