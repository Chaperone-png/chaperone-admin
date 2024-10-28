import { Tabs } from 'antd';
import '../../../styles/PlantsMasterData.scss';
import CustomPageHeader from '../../PageHeader';
import PotsPlanterTypes from './PotsPlantersType';
import PotPlanterShape from './PotPlanterShape';
const { TabPane } = Tabs;

const PotsPlantersMasterData = () => {
    return (
        <div className='plants-master-data'>
            <CustomPageHeader
                title="Pot & Planter Details"
            />
            <Tabs defaultActiveKey="1">
                <TabPane tab="Pot Planter Type" key="1">
                    <PotsPlanterTypes />
                </TabPane>
                <TabPane tab="Pot Planter Shapes" key="2">
                    <PotPlanterShape />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default PotsPlantersMasterData;
