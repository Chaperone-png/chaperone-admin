//PlantTable.tsx
import { Button, Modal, Select, Space, Table, Tag, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { nurseryPlantApi } from "../../../services/apis/nurseryPlantApi";
import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentStep } from "../../../redux/nurseryPlantSlice";
import { AdminPlantTye } from "../../../types";
import { addMargin, capitalizeFirstLetter } from "../../../utils/util";
import ApplyOfferModal from "./ApplyOfferModal";
import PlantFilters from "./PlantFilters";
import { useLoader } from "../../../context/LoaderContext";
import ConfirmDeletionModal from "../common/DeleteModal";

interface PlantProps {
  plants: any[];
  isFetching: boolean;
  setIsFetching: (value: boolean) => void;
  filteredPlants: any[];
  setFilteredPlants: (plants: any[]) => void;
  handleFetchMorePlantsChange: (
    page: number,
    pageSize: number,
    searchQuery: string,
    statusFilter: string,
    sortBy: number
  ) => void;
  totalPlants: number;
  SortBy: number;
  searchString: string;
  setReload: (value: boolean) => void;
}
const PlantsTable: React.FC<PlantProps> = ({
  plants,
  isFetching,
  setIsFetching,
  filteredPlants,
  setFilteredPlants,
  handleFetchMorePlantsChange,
  totalPlants,
  SortBy,
  searchString,
  setReload,
}) => {
  const dispatch = useDispatch();
  const [applyOffer, setApplyOffer] = useState<boolean | AdminPlantTye>(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<any>(null);
  const navigate = useNavigate();
  const { startLoader, stopLoader } = useLoader();

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    handleFetchMorePlantsChange(
      page,
      pageSize || 10,
      searchString,
      "active",
      SortBy
    );
  };

  const handlePlantEdit = (record: any) => {
    dispatch(setCurrentStep(0));
    navigate(`/products/add-product?plantId=${record._id}`);
  };

  const updateItemsPerPage = (itemsPerPage: number) => {
    setPageSize(itemsPerPage);
    handleFetchMorePlantsChange(
      1,
      itemsPerPage,
      searchString,
      "active",
      SortBy
    );
  };

  const handleStatusEdit = (record: any) => {
    setSelectedRecord(record);
    setSelectedStatus(record.status === "active" ? "inactive" : "active");
    setStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (selectedRecord) {
      try {
        startLoader();
        await nurseryPlantApi.updateNurseryPlantStatus(
          selectedRecord.nursery._id,
          { status: selectedStatus },
          selectedRecord._id
        );
        setStatusModal(false);
        handleFetchMorePlantsChange(
          currentPage,
          pageSize || 10,
          searchString,
          "active",
          SortBy
        );
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        stopLoader();
        setReload(true);
      }
    }
  };

  const handleDelete = async () => {
    if (deleteRecord) {
      try {
        startLoader();
        await nurseryPlantApi.deleteNurseryPlant(deleteRecord._id);
      } catch (e) {
        console.error("Error deleting nursery:", e);
      } finally {
        stopLoader();
        setReload(true);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const columns = [
    {
      title: "Plant Name",
      dataIndex: "plantName",
      key: "plantName",
    },
    {
      title: "Nursery Name",
      dataIndex: ["nursery", "name"], // Access the name field of the nested object
      key: "nurseryName", // Use a unique key for the column
    },
    {
      title: "Categories",
      dataIndex: "plantTypeIds",
      key: "plantTypeIds",
      render: (plantTypeIds: any[]) => (
        <>
          {plantTypeIds.length > 0 ? (
            <>
              {plantTypeIds.map((plantType) => (
                <Tag color="#2db7f5" key={plantType._id}>
                  {plantType.title}
                </Tag>
              ))}
            </>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "Container",
      dataIndex: "containerType",
      key: "containerType",
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.containerType
              ? capitalizeFirstLetter(record.containerType)
              : "-"}
          </>
        );
      },
    },
    {
      title: "Container Material",
      dataIndex: "containerType",
      key: "containerType",
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.containerMaterial}

            {record.availableSizes.map((size) => (
              <>
                {/* {size.detail.potTypes.length === 0?'-':''} */}
                {/* {size.detail.potTypes.map((potType, index)=>{
                        return <>{potType.typeTitle}{size.detail.potTypes.length-1 > index && ','}</>
                    })} */}
              </>
            ))}
          </>
        );
      },
    },

    {
      title: "Available Sizes",
      key: "availableSizes", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {" "}
                  <span>
                    <Tag>
                      {size.plantSizeId?.title}{" "}
                      {record.containerType !== "bag" && (
                        <>
                          colors:{" "}
                          {size.detail.colors.map((color: any) => (
                            <>
                              {color.colorName} {color.quantity}{" "}
                            </>
                          ))}
                        </>
                      )}
                    </Tag>
                  </span>
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Original Price",
      key: "price", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {size.plantSizeId?.title} Rs.{size.detail.original_price}{" "}
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Nursery Offer",
      key: "price", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {size.plantSizeId?.title} {size.detail.is_offer}{" "}
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Nursery Offer Price",
      key: "price", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {size.plantSizeId?.title}{" "}
                  {size.detail.is_offer === "yes"
                    ? `Rs.${size.detail.offer_price}`
                    : "N/A"}{" "}
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: `Selling Price 92% Margin`,
      key: "selling", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {size.plantSizeId?.title} Rs.
                  {addMargin(
                    Number(
                      size.detail.offer_price || size.detail.original_price
                    ),
                    process.env.REACT_APP_PLANTS_MARGIN_PERCENTAGE || 92
                  )}{" "}
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: `Admin Offer`,
      key: "selling", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {size.plantSizeId?.title} {size.detail.is_admin_offer}{" "}
                  {size.detail.is_admin_offer === "yes"
                    ? `${size.detail.admin_offer_percentage}%`
                    : ""}
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: `Final Display Price`,
      key: "selling", // Use a unique key for the column
      render: (_text: any, record: AdminPlantTye) => {
        return (
          <>
            {record.availableSizes.length === 0 ? "-" : ""}
            {record.availableSizes?.map((size: any) => {
              return (
                <>
                  {size.plantSizeId?.title} Rs.{size.detail.final_display_price}{" "}
                </>
              );
            })}
          </>
        );
      },
    },
    // {
    //     title: 'Stock',
    //     dataIndex: 'quantity',
    //     key: 'quantity',
    //     render: (_text: any, record: AdminPlantTye) => {
    //
    //         return <>
    //             {record.availableSizes.map((size:any) => <>
    //                 {record.containerType === 'bag' && <div>{size.plantSizeId?.title}</div>}
    //                 {record.containerType === 'pot' && <div>{size}</div>}

    //             </>)}
    //         </>
    //     }
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any) => (
        <Tooltip title="Click to edit status">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleStatusEdit(record)}
          >
            <Tag color={text === "inactive" ? "red" : "green"}>
              {capitalizeFirstLetter(text)}
            </Tag>
            <EditTwoTone style={{ marginLeft: 8 }} />
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Space size="small">
          <Button
            onClick={() => {
              handlePlantEdit(record);
            }}
          >
            <EditTwoTone />
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeleteRecord(record); // Set the record to be deleted
              setDeleteModalVisible(true); // Show the confirmation modal
            }}
            danger
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setApplyOffer(record);
            }}
          >
            Add Offer %
          </Button>
          {/* <Button onClick={() => handleDelete(record)}><DeleteOutlined /></Button> */}
        </Space>
      ),
    },
    // Add more columns as needed
  ];
  const handleApplyFilters = (filters: any) => {
    const filtered = plants.filter((plant: any) => {
      return Object.keys(filters).every((key) => {
        return filters[key].includes(plant[key]);
      });
    });
    setFilteredPlants(filtered);
  };
  return (
    <div>
      {/* <Button onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {showFilters && (
                <PlantFilters plants={filteredPlants} onApplyFilters={handleApplyFilters} />
            )} */}
          <div className='search-filter'>
                <Select
                    placeholder="Items per page"
                    style={{ width: 80, marginBottom: 10 }}
                    onChange={(value) => updateItemsPerPage(value)}
                    value={pageSize}
                    className="status-filter-dropdown"
                >
                    {
                        [10, 20, 50, 100,].map((size) => <Select.Option key={size} value={size}>{size}</Select.Option >)
                    }
                </Select>
                <Input.Search
                    placeholder="Search maalis by name, location, email, contact, etc."
                    allowClear
                    className='search-bar'
                    // onChange={handleSearch}
                    style={{ marginBottom: 10 }}
                />
                <Button><FunnelPlotOutlined /></Button>
            </div>

      <Table
        dataSource={plants}
        columns={columns}
        loading={isFetching}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPlants * pageSize,
          onChange: handlePageChange,
        }}
      />
      {applyOffer && (
        <ApplyOfferModal
          detail={applyOffer as AdminPlantTye}
          isOpen={!!applyOffer}
          onCancel={() => {
            setApplyOffer(false);
          }}
        />
      )}

      <Modal
        title="Update Status"
        open={statusModal}
        onOk={handleStatusUpdate}
        onCancel={() => setStatusModal(false)}
      >
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: "100%" }}
        >
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </Modal>

      <ConfirmDeletionModal
        deleteModalVisible={deleteModalVisible}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default PlantsTable;
