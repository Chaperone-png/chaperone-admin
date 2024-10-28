// src/components/DateFilter.tsx
import React, { useState } from 'react';
import { Select, DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import '../../styles/DateFilter.scss'
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DateFilterProps {
  onChange: (dates: [Moment, Moment] | null, dateString: [string, string]) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onChange }) => {
  const [dateType, setDateType] = useState<'thisMonth' | 'thisYear' | 'lastMonth' | 'custom'>('thisMonth');

  const handleDateTypeChange = (value: 'thisMonth' | 'thisYear' | 'lastMonth' | 'custom') => {
    setDateType(value);
    if (value === 'custom') {
      // Clear date range when switching to custom mode
      onChange(null, ['', '']);
    } else {
      const currentDate = moment();
      let startDate, endDate;

      switch (value) {
        case 'thisMonth':
          startDate = moment(currentDate).startOf('month');
          endDate = moment(currentDate).endOf('month');
          break;
        case 'thisYear':
          startDate = moment(currentDate).startOf('year');
          endDate = moment(currentDate).endOf('year');
          break;
        case 'lastMonth':
          startDate = moment(currentDate).subtract(1, 'month').startOf('month');
          endDate = moment(currentDate).subtract(1, 'month').endOf('month');
          break;
        default:
          startDate = moment(currentDate).startOf('month');
          endDate = moment(currentDate).endOf('month');
          break;
      }

      onChange([startDate, endDate], [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]);
    }
  };
  // Function to disable future dates
  const disabledDate = (current: any) => {
    return current && current > moment().endOf('day');
  };
  return (
    <div>
      <Select value={dateType} onChange={handleDateTypeChange} className="custom-select">
        <Option value="thisMonth">This Month</Option>
        <Option value="lastMonth">Last Month</Option>
        <Option value="thisYear">This Year</Option>
        <Option value="custom">Select Custom Date</Option>
      </Select>
      {dateType === 'custom' && (
        <RangePicker
        className='range-picker'
          onChange={(dates, dateStrings) => {}}
          disabledDate={disabledDate} // Apply the disabledDate function
        />
      )}
    </div>
  );
};

export default DateFilter;
