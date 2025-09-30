// Static financial data for charts

export const payablesData = [
  { name: 'Orel', accrualLedger: 70000, invoiceLedger: 50000 },
  { name: 'Condor', accrualLedger: 45000, invoiceLedger: 30000 },
  { name: 'Arsena', accrualLedger: 35000, invoiceLedger: 23000 }
];

export const receivablesData = [
  { name: 'Orel', guestLedger: 70000, cityLedger: 40000 },
  { name: 'Condor', guestLedger: 55000, cityLedger: 50000 },
  { name: 'Arsena', guestLedger: 30000, cityLedger: 78000 }
];

export const agingPayablesData = [
  { name: 'Orel', current: 50000, days30: 30000, days60: 20000 },
  { name: 'Condor', current: 35000, days30: 25000, days60: 10000 },
  { name: 'Arsena', current: 60000, days30: 35000, days60: 12000 }
];

export const agingReceivablesData = [
  { name: 'Orel', current: 50000, days30: 30000, days60: 20000 },
  { name: 'Condor', current: 35000, days30: 25000, days60: 10000 },
  { name: 'Arsena', current: 60000, days30: 35000, days60: 12000 }
];

export const postDepartureDataSource = [
  ['hotel','1-7 days','6-14 days','15-30 days','31-60 days','61-90 days','over 90 days'],
  ['Orel', 5000, 3000, 2000, 1500, 800, 700],
  ['Condor', 8000, 4000, 3000, 2000, 1000, 500],
  ['Arsena', 6000, 2500, 1800, 1200, 600, 400]
];

export const roomsNotAvailableDataSource = [
  ['hotel','PTD','OTB'],
  ['Orel', 180, 120],
  ['Condor', 140, 210],
  ['Arsena', 220, 60]
];