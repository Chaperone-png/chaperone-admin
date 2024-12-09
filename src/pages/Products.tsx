import { Button, Input, Tabs, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "../styles/product.scss";
import { useNavigate } from "react-router-dom";
import PlantsTable from "../components/master-data/plants/PlantsTable";
import CustomPageHeader from "../components/PageHeader";
import { resetCreateNurseryData } from "../redux/nurseryPlantSlice";
import { useDispatch } from "react-redux";
import PotPlantersTable from "../components/master-data/pots-planters/PotsPlantersTable";
import DealModal from "../components/common/DealModal";
import { nurseryPlantApi } from "../services/apis/nurseryPlantApi";
import { useLoader } from "../context/LoaderContext";
import { dealApi } from "../services/apis/dealApi";
import { FunnelPlotOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Search } = Input;
const Products: React.FC = () => {
  const [openDealModal, setOpenDealModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [plants, setPlants] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [activeDeal, setActiveDeal] = useState<any>({});
  const [reload, setReload] = useState(false);
  const [totalPlants, setTotalPlants] = useState(0);
  const [searchString, setSearchString] = useState("");
  const { startLoader, stopLoader } = useLoader();
  const [sortBy, setSortBy] = useState(0);

  const fetchNurseriesPlants = useCallback(
    (
      page: number,
      pageSize: number,
      searchQuery: string,
      statusFilter: string,
      sortBy: number
    ) => {
      setIsFetching(true);
      startLoader();
      nurseryPlantApi
        .getNurseriesPlants(page, pageSize, searchQuery, statusFilter, sortBy)
        .then((response) => {
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
        .catch((error) => {
          setIsFetching(false);
          console.error("Error fetching plant types:", error);
        });
      dealApi
        .getActiveDeal()
        .then((res) => {
          setActiveDeal(res.data.data);
        })
        .catch((err) => {
          console.log({ err });
        });
      stopLoader();
      setReload(false);
    },
    []
  );

  useEffect(() => {
    fetchNurseriesPlants(1, 10, searchString, "active", sortBy);
  }, [reload, searchString, sortBy]);

  const handleAddProduct = () => {
    dispatch(resetCreateNurseryData());
    navigate("/products/add-product");
  };

  const handleOpenDealModal = () => {
    setOpenDealModal(true);
  };

  const handleCloseDealModal = () => {
    setOpenDealModal(false);
  };

  const handlePageChange = (
    page: number,
    pageSize: number,
    searchQuery: string,
    statusFilter: string,
    sortBy: number
  ) => {
    fetchNurseriesPlants(page, pageSize, searchQuery, statusFilter, sortBy);
  };

  const handleSearch = (value: string) => {
    setSearchString(value);
  };

  const toggleSortBy = () => {
    if (sortBy === 0) {
      setSortBy(1);
    } else {
      setSortBy(0);
    }
  };

  return (
    <div>
      <CustomPageHeader title="Products" />
      {/* add the search filter here */}
      <div className="search-container">
        <Input.Search
          placeholder="Search maalis by name, location, email, contact, etc."
          allowClear
          className="search-bar"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchString}
          style={{ marginBottom: 10 }}
        />
        <Button onClick={() => toggleSortBy()}>
          <FunnelPlotOutlined />
        </Button>
      </div>
      <div className="action-buttons">
        <Button htmlType="button" onClick={handleOpenDealModal}>
          Add Deal
        </Button>
        <Button htmlType="button" onClick={handleAddProduct}>
          Add Product
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Nursery Plants" key="1">
          <PlantsTable
            plants={plants}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
            filteredPlants={filteredPlants}
            setFilteredPlants={setFilteredPlants}
            handleFetchMorePlantsChange={handlePageChange}
            totalPlants={totalPlants}
            SortBy={sortBy}
            searchString={searchString}
            setReload={setReload}
          />
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
      <DealModal
        plants={plants}
        open={openDealModal}
        closeModal={handleCloseDealModal}
        activeDeal={activeDeal}
      />
    </div>
  );
};

export default Products;
