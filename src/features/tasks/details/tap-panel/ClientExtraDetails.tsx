import React from 'react';
import { useTranslation } from 'react-i18next';
import { IClientExtraDetails } from '../../../../app/models/loanApplication';
import UniversalTable from '../../../../app/common/tables/UniversalTable';

interface IProps {
  data: IClientExtraDetails;
}

const ClientExtraDetails: React.FC<IProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div>
      <UniversalTable
        title={t('COMPONENTS.CLIENT_EXTRA_DETAILS.OWNERS')}
        data={data.owners}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      <UniversalTable
        title={t('COMPONENTS.CLIENT_EXTRA_DETAILS.LICENSES')}
        data={data.licenses}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
      <UniversalTable
        title={t('COMPONENTS.CLIENT_EXTRA_DETAILS.VAT_CERTIFICATE')}
        data={data.vatCertificates}
        handleOrderingChange={(code, direction) => console.log(code, direction)}
      />
    </div>
  );
};

export default ClientExtraDetails;
