import { Button, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import '../styles/product.scss';
import { useNavigate } from 'react-router-dom';
import PlantsTable from '../components/master-data/plants/PlantsTable';
import CustomPageHeader from '../components/PageHeader';
import { resetCreateNurseryData } from '../redux/nurseryPlantSlice';
import { useDispatch } from 'react-redux';
import PotPlantersTable from '../components/master-data/pots-planters/PotsPlantersTable';
import DealModal from '../components/common/DealModal';
import { nurseryPlantApi } from '../services/apis/nurseryPlantApi';
import { useLoader } from '../context/LoaderContext';
import { dealApi } from '../services/apis/dealApi';

const { TabPane } = Tabs;

const Products: React.FC = () => {
  const [openDealModal, setOpenDealModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [plants, setPlants] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false)
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [activeDeal, setActiveDeal] = useState<any>({});
  const [reload, setReload] = useState(false);
  const [totalPlants, setTotalPlants] = useState(0);
  const { startLoader, stopLoader } = useLoader();

  const fetchNurseriesPlants = useCallback((page: number, pageSize: number, searchQuery: string, statusFilter: string) => {
    setIsFetching(true);
    startLoader();
    nurseryPlantApi.getNurseriesPlants(page, pageSize, searchQuery, statusFilter)
      .then(response => {
        if (response?.data) {
          setPlants(response.data?.plants);
          setTotalPlants(response?.data?.totalPages);
          setFilteredPlants(response.data?.plants);
        } else {
          setPlants([]);
          setFilteredPlants([]);
        }
        setIsFetching(false);
      })
      .catch(error => {
        setIsFetching(false);
        console.error('Error fetching plant types:', error);
      });
    dealApi.getActiveDeal()
      .then((res) => {
        setActiveDeal(res.data.data);
      })
      .catch((err) => {
        console.log({ err })
      })
    stopLoader();
    setReload(false);
  }, [])

  useEffect(() => {
    fetchNurseriesPlants(1, 10, '', 'active')
  }, [reload]);

  const handleAddProduct = () => {
    dispatch(resetCreateNurseryData())
    navigate('/products/add-product')

  }

  const handleOpenDealModal = () => {
    setOpenDealModal(true);
  }

  const handleCloseDealModal = () => {
    setOpenDealModal(false);
  }

  const handlePageChange = (page: number, pageSize: number, searchQuery: string, statusFilter: string) => {
    fetchNurseriesPlants(page, pageSize, searchQuery, statusFilter)
  }

  return (
    <div>
      <CustomPageHeader title="Products" />
      <div className='action-buttons'>
        <Button
          htmlType='button'
          onClick={handleOpenDealModal}

        >
          Add Deal
        </Button>
        <Button
          htmlType='button'
          onClick={handleAddProduct}

        >
          Add Product
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Nursery Plants" key="1">
          <PlantsTable plants={plants} isFetching={isFetching} setIsFetching={setIsFetching} filteredPlants={filteredPlants} setFilteredPlants={setFilteredPlants} handleFetchMorePlantsChange={handlePageChange} totalPlants={totalPlants} />
        </TabPane>
        <TabPane tab="Pots/Planters" key="2">
          <PotPlantersTable />
        </TabPane>
        {/* <TabPane tab="Nursery Tools" key="2">
          <PlantsTable />
        </TabPane>
        <TabPane tab="Nursery Fertilizers" key="3">
          <PlantsTable />
        </TabPane> */}
        {/* <TabPane tab="Other Products" key="2">
            <OtherProductsTable />
          </TabPane> */}
        {/* Add more tabs for other types of products as needed */}
      </Tabs>
      <DealModal plants={plants} open={openDealModal} closeModal={handleCloseDealModal} activeDeal={activeDeal} />
    </div>
  );
};

export default Products;
