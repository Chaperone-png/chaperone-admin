import { Tabs } from 'antd';
import '../../../styles/PlantsMasterData.scss';
import CustomPageHeader from '../../PageHeader';
import AllPlants from './AllPlants';
import PlantSizes from './PlantSizes';
import PlantTypes from './PlantTypes';
const { TabPane } = Tabs;

const PlantsMasterData = () => {
    return (
        <div className='plants-master-data'>
            <CustomPageHeader
                title="Plant Details"
            />
            <Tabs defaultActiveKey="1">
                <TabPane tab="All Plants" key="1">
                    <AllPlants />
                </TabPane>
                <TabPane tab="Plant Types" key="2">
                    <PlantTypes />
                </TabPane>
                <TabPane tab="Plant Sizes" key="3">
                    <PlantSizes />
                </TabPane>
                {/* <TabPane tab="Plant Benefits" key="4">
                    <PlantBenefits />
                </TabPane>
                <TabPane tab="Plant Care Tips" key="5">
                    <PlantCareTips />
                </TabPane> */}
            </Tabs>
        </div>
    );
};

export default PlantsMasterData;
