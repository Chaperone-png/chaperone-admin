import { EditTwoTone, PlusOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Space, Table, Tag, Modal, Select, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { plantApi } from "../../../services/apis/plantApi";
import CreatePotPlanterModal from "./CreatePotPlanterModal";
import { AdminPlantTye } from "../../../types";
import PotPlanterDetail from "./PotPlanterDetail";
const { Option } = Select;
const AllPotsPlanters = () => {
  const [allPlants, setAllPlants] = useState<AdminPlantTye[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal
  const [selectedType, setSelectedType] = useState<AdminPlantTye | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<AdminPlantTye | null>(
    null
  ); // State for selected plant

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await plantApi.getAdminPlants("");
      if (response?.data && Array.isArray(response.data)) {
        setAllPlants(response.data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error fetching plant types:", error);
    }
  };

  const handleEdit = (record: AdminPlantTye) => {
    setSelectedType(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedType(null);
    fetchPlants();
  };

  const handleView = (record: AdminPlantTye) => {
    setSelectedPlant(record);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedPlant(null);
  };
  const handleStatusChange = async (value: string, record: AdminPlantTye) => {
    try {
      await plantApi.updatePlant(record._id, { status: value });
      fetchPlants(); // Refresh the table data after update
      message.success("Plant status updated!");
    } catch (error) {
      console.error("Error updating plant status:", error);
    }
  };
  const columns = [
    {
      title: "Plant Name",
      dataIndex: "plantName",
      key: "plantName",
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: any) => (
        <>{moment(createdAt).format("DD-MM-YYYY, hh:mm a")}</>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: any) => (
        <>{moment(updatedAt).format("DD-MM-YYYY, hh:mm a")}</>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any, record: AdminPlantTye) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(value, record)}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: AdminPlantTye) => (
        <Space size="small">
          <Button onClick={() => handleEdit(record)}>
            <EditTwoTone />
          </Button>
          <Button onClick={() => handleView(record)}>
            <EyeTwoTone />
          </Button>
          {/* <Button onClick={() => handleDelete(record)}><DeleteOutlined /></Button> */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={allPlants} pagination={false} />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="add-new-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Create New
      </Button>
      {isModalOpen && (
        <CreatePotPlanterModal
        // isOpen={isModalOpen}
        // onClose={handleModalClose}
        // plantType={selectedType}
        // onSuccess={fetchPlants}
        // plantDetails={selectedType}
        />
      )}
      {isViewModalOpen && selectedPlant && (
        <Modal
          title="Plant Details"
          open={isViewModalOpen}
          onCancel={handleViewModalClose}
          footer={null}
          width={800}
        >
          <PotPlanterDetail
          // plant={selectedPlant}
          />
        </Modal>
      )}
    </div>
  );
};

export default AllPotsPlanters;
