// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';
import PageHeader from '../components/PageHeader';
import DateFilter from '../components/dashboard/DateFilter';

const Dashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<[string, string] | null>(null);

  const handleDateChange = (dates: any, dateStrings:any) => {
    setSelectedDateRange(dates ? [dateStrings[0], dateStrings[1]] : null);
  };
  return (
    <div className='dashboard'>
      <PageHeader title="Dashboard" />
      <div className='date-filter'>
      <DateFilter onChange={handleDateChange} />

      </div>

      <DashboardWidgets selectedDateRange={selectedDateRange}/>
    </div>
  );
};

export default Dashboard;
