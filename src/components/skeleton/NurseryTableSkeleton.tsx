import React from 'react';
import { Skeleton, Spin, Table } from 'antd';
// import '../../styles/NurseryTableSkeleton.scss'
const NurseryTableSkeleton: React.FC = () => {
  const columns = [
    { title: 'Nursery Name', dataIndex: 'name', key: 'name' },
    { title: 'Location', dataIndex: 'address', key: 'address' },
    { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson' },
    { title: 'Contact Number', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];

  const skeletonData = Array.from({ length: 10 }, (_, index) => ({
    key: index.toString(),
  }));

  return (
    <Table
      columns={columns}
      dataSource={skeletonData}
      pagination={false}
      className="nursery-table-skeleton"
      loading={{ indicator: <Spin  />, spinning: true }}
    />
  );
};

export default NurseryTableSkeleton;
