import React, { useState } from 'react';
import { X, Building2, TrendingUp, Settings, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DrillDownIcon from '../components/DrillDownIcon';
import NewTotalRevenueCard from '../components/NewTotalRevenueCard';
import OccupancyKPICard from '../components/OccupancyKPICard';
import KPICard from '../components/KPICard';
import RevenuePerformanceWidget from '../components/RevenuePerformanceWidget';
import FinancialChartsSection from '../components/FinancialChartsSection';
import HelpDrawer from '../components/HelpDrawer';
import Top10CompaniesByPickupChart from '../components/charts/Top10CompaniesByPickupChart';
import GuestNationalitiesMap from '../components/charts/GuestNationalitiesMap';
import DepartmentalExpensesCard from '../components/DepartmentalExpensesCard';
import TotalRevenuePerSoldRoomCard from '../components/TotalRevenuePerSoldRoomCard';
import DepartmentalExpensesPerRoomCard from '../components/DepartmentalExpensesPerRoomCard';
import OperatingExpensesWidget from '../components/OperatingExpensesWidget';
import FutureAnalyticsRoomNightsChart from '../components/charts/FutureAnalyticsRoomNightsChart';
import GOPPerformanceWidget from '../components/GOPPerformanceWidget';
import GOPProfitDevelopmentChart from '../components/charts/GOPProfitDevelopmentChart';

const Home: React.FC = () => {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  // Mock data for Occupancy % card
  const occupancyKPIData = {
    yesterday: {
      absolute: 2.3, // +2.3% occupancy increase yesterday
      vsPrior: { value: 12.4, type: 'positive' as const },
      vsBudget: { value: -3.2, type: 'negative' as const },
      vsForecast: { value: 5.8, type: 'positive' as const }
    },
    ptd: {
      current: 78.5, // 78.5% PTD occupancy
      vsPrior: { value: 9.2, type: 'positive' as const },
      vsBudget: { value: -2.1, type: 'negative' as const },
      vsForecast: { value: 3.4, type: 'positive' as const }
    },
    otb: {
      current: 82.1, // 82.1% OTB occupancy
      vsPrior: { value: -1.8, type: 'negative' as const },
      vsBudget: { value: 4.7, type: 'positive' as const },
      vsForecast: { value: -0.9, type: 'negative' as const }
    },
    total: {
      current: 79.8, // 79.8% total period occupancy
      vsPrior: { value: 6.5, type: 'positive' as const },
      vsBudget: { value: 1.2, type: 'positive' as const },
      vsForecast: { value: 2.1, type: 'positive' as const }
    }
  };

  // Create Unpicked Blocks KPI
  const unpickedBlocksKPI = {
    id: 'unpicked-blocks',
    title: 'Unpicked Blocks (7 days)',
    value: '1,250',
    pickup: {
      value: -45,
      type: 'negative' as const
    },
    comparisons: {
      vsPrior: {
        percentage: 15.3,
        type: 'neutral' as const,
        progress: 75
      },
      vsBudget: {
        percentage: 28.7,
        type: 'neutral' as const,
        progress: 60
      }
    }
  };

  // Format the date range for the title
  const formatKPITitle = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const currentYear = new Date().getFullYear();
    const formattedYesterday = yesterday.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `CTD (01 Jan - ${formattedYesterday}) OTB Actual KPI Indicators`;
  };

  // Help content for KPIs and widgets
  const helpContent = {
    'total-revenue': {
      description: "Total Revenue показва общия приход от всички източници - стаи, ресторант и други услуги. Това е ключовият показател за общата финансова ефективност на хотела.",
      howToRead: "Стойността е в лева и показва натрупаната сума от началото на периода до вчера. Зеленият/червеният процент показва промяната спрямо миналата година.",
      practicalUse: "Използвайте за проследяване на общия растеж на бизнеса. Сравнявайте с бюджет и минала година за оценка на ефективността на стратегиите за увеличаване на приходите."
    },
    'rooms-revenue': {
      description: "Rooms Revenue показва приходите само от продажба на стаи. Това е основният източник на приходи за повечето хотели.",
      howToRead: "Стойността включва всички видове стаи и тарифи. Pickup показва колко е нараснал приходът само вчера.",
      practicalUse: "Ключов показател за ефективността на revenue management стратегиите. Следете тенденциите за оптимизиране на цените и заетостта."
    },
    'revenue-performance': {
      description: "Revenue Performance by Month показва месечното развитие на приходите в сравнение с бюджет, прогноза и минала година. Включва OTB (On The Books) данни.",
      howToRead: "Синята линия е текущата година, пунктираната е миналата година. Вертикалната червена линия показва днешната дата. Лявата част е актуални данни, дясната е прогноза.",
      practicalUse: "Използвайте за планиране на cash flow, корекция на прогнози и сравнение с целите. Помага за вземане на решения за маркетинг и ценообразуване."
    },
    'gop-profit-development': {
      description: "GOP - Profit Development показва как се формира брутната оперативна печалба (Gross Operating Profit) чрез водопадна диаграма. Визуализира приноса на всеки департамент и разходен център към крайния финансов резултат.",
      howToRead: "Всеки стълб представлява принос към GOP-а. Сините/зелени стълбове са положителни приходи, виолетовите/розовите са разходи. Пунктираната линия показва текущата сума след всяка категория.",
      practicalUse: "Използвайте за идентифициране на най-печелившите департаменти и най-скъпите разходни центрове. Помага за вземане на решения за оптимизация на разходите и фокусиране върху най-рентабилните дейности."
    },
    'occupancy-percentage': {
      description: "Occupancy % показва процента заети стаи от общия брой налични стаи за периода. Това е ключов показател за ефективността на продажбите и популярността на хотела.",
      howToRead: "Стойността е в проценти. Pickup показва промяната само за вчера. Зелените/червените проценти показват сравнението с миналата година и бюджета.",
      practicalUse: "Използвайте за оценка на ефективността на маркетинга и ценовата политика. Ниска заетост може да изисква промяна в цените или маркетинговите кампании."
    },
    'unpicked-blocks': {
      description: "Unpicked Blocks показва броя стаи в неизбрани блокове за следващите 7 дни. Това са стаи, които са блокирани за групи или събития, но все още не са потвърдени.",
      howToRead: "Стойността показва абсолютния брой стаи. Pickup показва промяната само за вчера. Сравненията са с миналата година и бюджетните очаквания.",
      practicalUse: "Използвайте за проследяване на ефективността на груповите продажби и планиране на капацитета. Високи стойности могат да сигнализират нужда от по-активно проследяване на потенциалните групи."
    },
    'top10-companies-pickup': {
      description: "Top 10 Companies by Revenue Pickup Yesterday показва кои компании са генерирали най-много приходи от резервации, направени вчера. Това е ключов показател за ефективността на различните канали за продажби.",
      howToRead: "Хоризонталните барове показват сумата на приходите от резервации, направени вчера от всяка компания. По-дългите барове означават по-високи приходи. Стойностите са в лева.",
      practicalUse: "Използвайте за идентифициране на най-ефективните партньори и канали за продажби. Помага за вземане на решения за алокация на маркетингови ресурси и преговори с туроператори."
    },
    'operating-expenses-performance': {
      description: "Total Operating Expenses by Month показва месечното развитие на оперативните разходи в сравнение с бюджет, прогноза и минала година. Включва статус на заключване за всеки месец.",
      howToRead: "Червената линия е текущата година, пунктираната сива е миналата година. Иконите за заключване показват дали данните за месеца са финализирани. Заключените месеци имат окончателни данни.",
      practicalUse: "Използвайте за контрол на разходите, планиране на бюджет и идентифициране на тенденции в оперативните разходи. Статусът на заключване показва надеждността на данните."
    },
    'gop-performance': {
      description: "Gross Operating Profit for Lock Months only показва брутната оперативна печалба (приходи минус разходи) само за заключени месеци, където данните са финализирани.",
      howToRead: "Зелената линия е текущата година, пунктираната сива е миналата година. Показват се само месеци със заключени данни. Положителните стойности означават печалба, отрицателните - загуба.",
      practicalUse: "Използвайте за анализ на рентабилността само с надеждни данни. Помага за точно планиране и сравнение с цели, тъй като включва само финализирани стойности."
    }
  };

  // Add help content for the new map
  const extendedHelpContent = {
    ...helpContent,
    'guest-nationalities-map': {
      description: "Guest Nationalities Revenue Map показва географското разпределение на приходите по националности на гостите. Картата визуализира кои държави генерират най-много приходи за хотела.",
      howToRead: "Цветовете на държавите варират от светлосиньо до тъмносиньо въз основа на приходите. По-тъмните цветове означават по-високи приходи. Можете да увеличавате и придвижвате картата за по-детайлен преглед.",
      practicalUse: "Използвайте за планиране на маркетингови кампании по географски региони, оптимизиране на туристическите пакети за различни пазари и идентифициране на нови възможности за растеж в недостатъчно представени региони."
    },
    'future-analytics-room-nights': {
      description: "Room Nights by Week and Days of Week показва как резервираните вчера стаи за нощувки се разпределят по бъдещи седмици. Всяка седмица е разбита по дни от седмицата, за да се види кога точно гостите ще пристигнат.",
      howToRead: "Всеки бар представлява една седмица, а цветните сегменти показват разпределението по дни от седмицата. Височината на бара показва общия брой нощувки за седмицата. Процентният дял показва каква част от вчерашните резервации се отнася за тази седмица.",
      practicalUse: "Използвайте за планиране на персонала, управление на капацитета и прогнозиране на заетостта. Помага за идентифициране на пикови периоди и оптимизиране на ресурсите според очакваното разпределение на гостите."
    },
    'departmental-expenses': {
      description: "Departmental Expenses показва общите департаментни разходи на хотела. Това включва всички оперативни разходи, свързани с различните департаменти - стаи, ресторант, поддръжка и други.",
      howToRead: "Стойността е в лева и показва натрупаната сума от началото на периода. LOCK показва заключените разходи, UNLCK показва незаключените разходи, TOT е общата сума. За разходите увеличението е лошо (червено), намалението е добро (зелено).",
      practicalUse: "Използвайте за контрол на разходите и идентифициране на области за оптимизация. Сравнявайте с бюджет за проследяване на ефективността на cost control мерките."
    },
    'total-revenue-per-sold-room': {
      description: "Total Revenue per Sold Room показва средния приход на продадена стая. Това е ключов показател за ефективността на revenue management стратегиите и ценовата политика.",
      howToRead: "Стойността е в лева на стая и показва средния приход от всички източници (стаи, F&B, други услуги) разделен на броя продадени стаи. Yesterday показва промяната само за вчера.",
      practicalUse: "Използвайте за оценка на ефективността на upselling стратегиите и общата рентабилност на стая. Сравнявайте с конкурентите и исторически данни за оптимизиране на приходите."
    },
    'departmental-expenses-per-room': {
      description: "Departmental Expenses per Room показва средните департаментни разходи на стая. Това е ключов показател за контрол на разходите и ефективност на операциите.",
      howToRead: "Стойността е в лева на стая и показва средните разходи разделени на броя стаи. LOCK показва данни само за заключени месеци, UNLCK и TOT са достъпни само за заключени периоди.",
      practicalUse: "Използвайте за мониторинг на разходната ефективност и сравнение с бюджетни цели. Помага за идентифициране на области за оптимизация на разходите."
    }
  };
  
  return (
    <div className="space-y-6">
      {!alertDismissed && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between mb-2 mt-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">New Analytics Features Available</h3>
              <p className="text-sm text-blue-700">
                Explore enhanced reporting capabilities and advanced revenue insights.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertDismissed(true)}
            className="p-1 rounded-lg hover:bg-blue-100 text-blue-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Main KPIs | TDR (To Date Records)</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {/* 1. Total Revenue */}
            <NewTotalRevenueCard onHelpClick={() => setActiveHelp('total-revenue')} />
            
            {/* 2. Departmental Expenses */}
            <DepartmentalExpensesCard onHelpClick={() => setActiveHelp('departmental-expenses')} />
            
            {/* Total Revenue per Sold Room Card */}
            <TotalRevenuePerSoldRoomCard onHelpClick={() => setActiveHelp('total-revenue-per-sold-room')} />
            
            {/* Departmental Expenses per Room */}
            <DepartmentalExpensesPerRoomCard onHelpClick={() => setActiveHelp('departmental-expenses-per-room')} />
            
            {/* 5. Occupancy % */}
            <OccupancyKPICard 
              occupancyData={occupancyKPIData}
              onHelpClick={() => setActiveHelp('occupancy-percentage')}
            />
            
            {/* 6. Unpicked Blocks (7 days) */}
            <KPICard 
              kpi={unpickedBlocksKPI} 
              onHelpClick={() => setActiveHelp('unpicked-blocks')}
            />
          </div>
        </div>
      </div>

      {/* Revenue & Expenses Performance Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Performance Overview</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Revenue and Expenses Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="h-full">
                <RevenuePerformanceWidget onHelpClick={() => setActiveHelp('revenue-performance')} />
              </div>
              <div className="h-full">
                <OperatingExpensesWidget onHelpClick={() => setActiveHelp('operating-expenses-performance')} />
              </div>
            </div>
            
            {/* GOP Performance - Full Width */}
            <div className="h-full">
              <GOPPerformanceWidget onHelpClick={() => setActiveHelp('gop-performance')} />
            </div>
            
            {/* GOP Profit Development - Full Width */}
            <div className="h-full">
              <GOPProfitDevelopmentChart 
                onHelpClick={() => setActiveHelp('gop-profit-development')} 
                showLockMonthsBadge={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Analytics Overview Pickup Yesterday</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Top 10 Companies */}
            <div className="lg:col-span-1">
              <Top10CompaniesByPickupChart onHelpClick={() => setActiveHelp('top10-companies-pickup')} />
            </div>
            
            {/* Guest Nationalities Map */}
            <div className="lg:col-span-1">
              <GuestNationalitiesMap onHelpClick={() => setActiveHelp('guest-nationalities-map')} />
            </div>
            
            {/* Future Analytics: Room Nights by Week */}
            <div className="lg:col-span-1">
              <FutureAnalyticsRoomNightsChart onHelpClick={() => setActiveHelp('future-analytics-room-nights')} />
            </div>
          </div>
        </div>
      </div>

      <FinancialChartsSection />

      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            to="/explorer/rooms"
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Rooms Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Analyze room performance, occupancy rates, and revenue trends in detail.
            </p>
          </Link>

          <Link
            to="/settings"
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Settings size={20} className="text-gray-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-sm text-gray-600">
              Configure currency preferences, VAT settings, and commission tracking.
            </p>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">User Guide</h2>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Getting Started with HotelOne BI</h3>
              <p className="text-gray-600">
                Learn how to maximize your analytics experience with our comprehensive video tutorials.
              </p>
            </div>
            <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Play size={16} className="mr-2" />
              <span className="hidden sm:inline">Watch Videos</span>
              <span className="sm:hidden">Watch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Help Drawer */}
      <HelpDrawer
        isOpen={activeHelp !== null}
        onClose={() => setActiveHelp(null)}
        title={activeHelp ? `Помощ: ${activeHelp}` : ''}
        content={activeHelp ? extendedHelpContent[activeHelp as keyof typeof extendedHelpContent] || { description: '', howToRead: '', practicalUse: '' } : { description: '', howToRead: '', practicalUse: '' }}
      />
    </div>
  );
};

export default Home;