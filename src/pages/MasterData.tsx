import React from 'react';
import { Layout, Tabs } from 'antd';
import '../styles/MasterData.scss';
import ProductMasterData from '../components/ProductMasterData';
import MaaliMasterData from '../components/MaaliMasterData';
import RentalPlantsMasterData from '../components/RentalPlantsMasterData';
import PlantDayCareMasterData from './PlantDayCareMasterData';
import CustomPageHeader from '../components/PageHeader';

const { Content } = Layout;
const { TabPane } = Tabs;

const MasterData: React.FC = () => {
    return (
        <div>
            <CustomPageHeader title='Master Data' />
            <Content className="master-data-container">
                <Tabs defaultActiveKey="plants" >
                    <TabPane tab="Product" key="products">
                        <ProductMasterData />
                    </TabPane>
                    <TabPane tab="Maali" key="maali">
                        <MaaliMasterData />
                    </TabPane>
                    <TabPane tab="Rental Plants" key="rentalPlants">
                        <RentalPlantsMasterData />
                    </TabPane>
                    <TabPane tab="Plant Day Care" key="plantDayCare">
                        <PlantDayCareMasterData />
                    </TabPane>
                </Tabs>
            </Content>
        </div>

    );
};

export default MasterData;
