// src/components/PageHeader.tsx
import React from 'react';
// import { PageHeader } from 'antd';
import '../styles/PageHeader.scss'
import { LeftSquareOutlined } from '@ant-design/icons';
interface PageHeaderProps {
  title: string;
  onBack?:()=>void;
  hideBack?:boolean;
}

const CustomPageHeader: React.FC<PageHeaderProps> = ({ title,onBack, hideBack }) => {
  return <div className='page-header'>{onBack && !hideBack && <>
  
  <LeftSquareOutlined onClick={onBack}/>{" "}
  </>
  }{title}</div>;
};

export default CustomPageHeader;
