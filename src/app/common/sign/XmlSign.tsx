import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../stores/rootStore';

// Material UI
import Button from '@material-ui/core/Button';

const XmlSign: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { openConnection, closeConnection, signXml, authorize } = rootStore.ncaLayerStore;

  useEffect(() => {
    openConnection();

    return () => {
      closeConnection();
    };
  }, [openConnection, closeConnection]);

  return (
    <div>
      <Button color="primary" variant="contained" onClick={() => signXml('<price>29.99</price>')}>Подписать</Button>
      <Button color="secondary" variant="contained" onClick={() => authorize()}>Авторизация</Button>
    </div>
  )
}

export default observer(XmlSign);
