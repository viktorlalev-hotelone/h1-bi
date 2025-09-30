import React, { useState } from 'react';
import {
  payablesData,
  receivablesData,
  agingPayablesData,
  agingReceivablesData,
  postDepartureDataSource,
  roomsNotAvailableDataSource
} from '../data/financialData';
import FinancialChart from './charts/FinancialChart';
import HelpDrawer from './HelpDrawer';

const FinancialChartsSection: React.FC = () => {
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Operational Status Overview (Till Yesterday) */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Operational Status Overview (Till Yesterday)</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Row 1 */}
            <FinancialChart
              type="payables"
              title="Account Payables"
              data={payablesData}
              onHelpClick={() => setActiveHelp('payables')}
              showVatBadge={true}
            />
            <FinancialChart
              type="receivables"
              title="Account Receivables"
              data={receivablesData}
              onHelpClick={() => setActiveHelp('receivables')}
              showVatBadge={true}
            />
            <FinancialChart
              type="aging-payables"
              title="Aging of Payables (Invoice Ledger)"
              data={agingPayablesData}
              onHelpClick={() => setActiveHelp('agingPayables')}
              showVatBadge={true}
            />
            
            {/* Row 2 */}
            <FinancialChart
              type="aging-receivables"
              title="Aging of Receivables (City Ledger)"
              data={agingReceivablesData}
              onHelpClick={() => setActiveHelp('agingReceivables')}
              showVatBadge={true}
            />
            <FinancialChart
              type="post-departure"
              title="Open Charges after Service (Post-Departure)"
              dataSource={postDepartureDataSource}
              onHelpClick={() => setActiveHelp('postDeparture')}
              showVatBadge={true}
            />
            <FinancialChart
              type="rooms-not-available"
              title="Rooms not available for Sales (in Room Nights)"
              dataSource={roomsNotAvailableDataSource}
              onHelpClick={() => setActiveHelp('roomsNotAvailable')}
              showVatBadge={false}
            />
          </div>
        </div>
      </div>

      <HelpDrawer
        isOpen={activeHelp !== null}
        onClose={() => setActiveHelp(null)}
        title={activeHelp ? `Помощ: ${getHelpTitle(activeHelp)}` : ''}
        content={activeHelp ? getHelpContent(activeHelp) : { description: '', howToRead: '', practicalUse: '' }}
      />
    </div>
  );
};

const getHelpTitle = (helpKey: string) => {
  const titles = {
    payables: 'Account Payables',
    receivables: 'Account Receivables',
    agingPayables: 'Aging of Payables',
    agingReceivables: 'Aging of Receivables',
    postDeparture: 'Post-Departure Open Charges',
    roomsNotAvailable: 'Rooms not available for Sales'
  };
  return titles[helpKey as keyof typeof titles] || '';
};

const getHelpContent = (helpKey: string) => {
  const helpContent = {
    payables: {
      description: "Account Payables показва общата сума, която дължим на доставчици и партньори към вчерашна дата. Разделени са на Accrual Ledger (начислени, но неполучени фактури) и Invoice Ledger (получени фактури за плащане).",
      howToRead: "Всеки бар е разделен на две части - синята част показва Accrual Ledger, зелената показва Invoice Ledger. Общата дължина на бара е общата сума задължения.",
      practicalUse: "Използвайте за контрол на cash flow и планиране на плащания. Високи Accrual Ledger стойности показват очаквани фактури, докато Invoice Ledger показва готови за плащане суми. Помага за по-точно планиране на ликвидността."
    },
    receivables: {
      description: "Account Receivables показва сумите, които ни дължат клиенти и партньори. Разделени са на Guest Ledger (директни клиенти) и City Ledger (корпоративни клиенти, туроператори).",
      howToRead: "Всеки бар е разделен на две части - синята част показва Guest Ledger, зелената показва City Ledger. Общата дължина на бара е общата сума вземания.",
      practicalUse: "Следете баланса между двата типа вземания. Високи City Ledger стойности могат да изискват по-активно проследяване на корпоративните клиенти. Използвайте за планиране на входящи плащания."
    },
    agingPayables: {
      description: "Aging of Payables показва разпределението на задълженията по възраст - колко дълго не са платени фактурите. Разделени са на 0-30 дни, 31-60 дни и 61+ дни.",
      howToRead: "Всеки бар е разделен на три цветни части: зелено (нови задължения 0-30 дни), оранжево (31-60 дни) и червено (просрочени над 61 дни). По-голямата червена част сигнализира проблеми.",
      practicalUse: "Използвайте за приоритизиране на плащанията. Червените части показват критични просрочени задължения, които могат да повлияят на отношенията с доставчици. Планирайте плащания започвайки от най-просрочените."
    },
    agingReceivables: {
      description: "Aging of Receivables показва разпределението на вземанията по възраст - колко дълго чакаме плащане от клиентите. Разделени са на 0-30 дни, 31-60 дни и 61+ дни.",
      howToRead: "Всеки бар е разделен на три цветни части: зелено (нови вземания 0-30 дни), оранжево (31-60 дни) и червено (просрочени над 61 дни). По-голямата червена част показва проблеми със събирането.",
      practicalUse: "Използвайте за управление на кредитния риск и cash flow. Червените части показват критични просрочени вземания, които изискват незабавни действия за събиране. Може да наложи преразглеждане на кредитната политика."
    },
    postDeparture: {
      description: "Post-Departure Open Charges показва неплатени такси след напускане на гостите. Включва поддръжка, почистване и други допълнителни услуги, които не са били уредени при check-out.",
      howToRead: "Всеки бар е разделен на три части: синьо (поддръжка), зелено (почистване) и жълто (други такси). По-дългите барове показват по-големи неплатени суми.",
      practicalUse: "Използвайте за подобряване на check-out процеса и намаляване на неплатените такси. Високи стойности могат да сигнализират проблеми с комуникацията с гостите или недостатъчно ясни политики."
    },
    roomsNotAvailable: {
      description: "Rooms not available for Sales показва стаите, които не могат да бъдат продавани поради поддръжка или технически проблеми. Измерва се в нощувки (room nights).",
      howToRead: "Всеки бар е разделен на две части: зелено (планирана поддръжка) и жълто (извънредни проблеми/out of order). По-дългите барове означават повече загубени възможности за продажби.",
      practicalUse: "Използвайте за планиране на поддръжката и минимизиране на загубените приходи. Високи стойности в жълтата част показват нужда от по-добра превантивна поддръжка."
    }
  };
  
  return helpContent[helpKey as keyof typeof helpContent] || { description: '', howToRead: '', practicalUse: '' };
};

export default FinancialChartsSection;