import { EditTwoTone, PlusOutlined, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Modal, Select, message, Upload } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import CreatePlantModal from './CreatePlantModal';
import { AdminPlantTye } from '../../../types';
import PlantDetails from './PlantDetails';
import { read, utils } from 'xlsx';
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};


const { Option } = Select;

const AllPlants = () => {
  const [allPlants, setAllPlants] = useState<AdminPlantTye[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false); // State for bulk upload modal
  const [selectedType, setSelectedType] = useState<AdminPlantTye | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<AdminPlantTye | null>(null);
  const [fileContent, setFileContent] = useState<any[]>([]); // State for file content

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await plantApi.getAdminPlants();
      if (response?.data && Array.isArray(response.data)) {
        setAllPlants(response.data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error fetching plant types:', error);
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
      message.success('Plant status updated!');
    } catch (error) {
      console.error('Error updating plant status:', error);
    }
  };

  const handleBulkUpload = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await plantApi.bulkUploadPlants(formData);
      if (response.status === 200) {
        message.success('Bulk upload successful!');
        fetchPlants(); // Refresh the table data after upload
      }
    } catch (error) {
      console.error('Error uploading bulk plants:', error);
      message.error('Failed to upload plants.');
    }
  };
  const handleFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      if (file && file.originFileObj) {
        const fileObj = file.originFileObj as File;
        const arrayBuffer = await fileToArrayBuffer(fileObj);
        const data = new Uint8Array(arrayBuffer);
        const workbook = read(data, { type: 'array' });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

        console.log('Parsed Data:', jsonData);

        // Call the success callback
        onSuccess?.(file);
      } else {
        throw new Error('Invalid file object');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      message.error('Error processing file');
      onError?.(error);
    }
  };



  const columns = [
    {
      title: 'Plant Name',
      dataIndex: 'plantName',
      key: 'plantName',
    },
    {
      title: 'Categories',
      dataIndex: 'plantTypeIds',
      key: 'plantTypeIds',
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
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => (
        <>{moment(createdAt).format('DD-MM-YYYY, hh:mm a')}</>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: any) => (
        <>{moment(updatedAt).format('DD-MM-YYYY, hh:mm a')}</>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
      title: 'Actions',
      key: 'actions',
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="add-new-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Create New
      </Button>{" "}
      <Upload
        // customRequest={handleBulkUpload}
        beforeUpload={(file) => {
          handleBulkUpload(file);
          return false;
        }}
        showUploadList={false}
        accept=".xlsx, .xls"
      >
        <Button icon={<UploadOutlined />} >
          Upload Bulk Plants
        </Button>
      </Upload>
      {isModalOpen && (
        <CreatePlantModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          plantType={selectedType}
          onSuccess={fetchPlants}
          plantDetails={selectedType}
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
          <PlantDetails plant={selectedPlant} />
        </Modal>
      )}
      {isBulkUploadModalOpen && (
        <Modal
          title="Preview Bulk Upload"
          open={isBulkUploadModalOpen}
          onCancel={() => setIsBulkUploadModalOpen(false)}
          onOk={handleBulkUpload}
          okText="Confirm Upload"
          cancelText="Cancel"
        >
          <Table
            columns={columns}
            dataSource={fileContent}
            pagination={false}
            rowKey="plantName"
          />
        </Modal>
      )}
      <Table columns={columns} dataSource={allPlants} pagination={false} />

    </div>
  );
};

export default AllPlants;
