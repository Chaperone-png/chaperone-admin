import { Tabs } from 'antd';
import '../styles/ProductMasterData.scss';
import CustomPageHeader from './PageHeader';
import ProductTypeTable from './ProductTypeTable';
import ManageProductTypesInfo from './ManageProductTypesInfo';

const { TabPane } = Tabs;

const ProductMasterData = () => {
  return (
    <div className="product-master-data">
      <CustomPageHeader title="Products" />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Product Types" key="1">
          <ProductTypeTable />
        </TabPane>
        <TabPane tab="Manage Product Details" key="2">
          <ManageProductTypesInfo />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProductMasterData;
