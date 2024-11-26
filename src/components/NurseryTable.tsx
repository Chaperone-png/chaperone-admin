import React, { useState } from "react";
import { Button, Space, Table, Tag, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Nursery } from "../types";
import NurseryTableSkeleton from "./skeleton/NurseryTableSkeleton";
import { nurseryApi } from "../services/apis/nurseries";
import { useLoader } from "../context/LoaderContext";
import ConfirmDeletionModal from "./master-data/common/DeleteModal";
import UpdateStatusModal from "./master-data/common/UpdateStatusModal";
const NurseryTable = ({
  data,
  onShowDetails,
  onEdit,
  onDelete,
  pagination,
  loading,
  setReload,
}: any) => {
  const navigate = useNavigate();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<any>(null);
  const [updateRecord, setUpdateRecord] = useState<any>(null);
  const [updateStatusModalVisible, setUpdateStatusModalVisible] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { startLoader, stopLoader } = useLoader();

  const handleDelete = async () => {
    if (deleteRecord) {
      try {
        startLoader();
        await nurseryApi.deleteNursery(deleteRecord._id);
        onDelete(deleteRecord);
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

  const handleRowClick = (event: React.MouseEvent, record: Nursery) => {
    const target = event.target as HTMLElement;
    if (target.closest(".ant-btn")) {
      return;
    }

    navigate(`/nurseries/${record._id}`);
  };

  const handleStatusUpdate = async () => {
    if (updateRecord && selectedStatus) {
      try {
        startLoader();
        await nurseryApi.updateNurseryStatus(updateRecord._id, {
          status: selectedStatus,
        });
        setUpdateStatusModalVisible(false);
      } catch (e) {
        console.error("Error updating status:", e);
      } finally {
        stopLoader();
        setReload(true);
      }
    }
  };

  const handleStatusUpdateCancel = () => {
    setUpdateStatusModalVisible(false);
  };

  const columns = [
    {
      title: "Nursery Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (location: {
        city: any;
        state: any;
        pincode: string;
        addressLine: string;
      }) =>
        `${location.city?.name}, ${location.state?.name}, ${location.pincode}`,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (contactPerson: any) => `${contactPerson.name}`,
    },
    {
      title: "Contact Number",
      dataIndex: "contactPerson",
      key: "phone",
      render: (contactPerson: any) => `${contactPerson.phone}`,
    },
    {
      title: "Email",
      dataIndex: "contactPerson",
      key: "email",
      render: (contactPerson: any) => `${contactPerson.email}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "inactive"
              ? "red"
              : "gold"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Space size="small">
          <Button type="default" onClick={() => onShowDetails(record)}>
            <EyeOutlined />
          </Button>
          <Button type="default" onClick={() => onEdit(record)}>
            <EditOutlined />
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeleteRecord(record);
              setDeleteModalVisible(true);
            }}
            danger
          >
            Delete
          </Button>
          <Button
            type="default"
            icon={<SyncOutlined />}
            onClick={() => {
              setUpdateRecord(record);
              setSelectedStatus(record.status); // Set current status as default
              setUpdateStatusModalVisible(true);
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return loading ? (
    <NurseryTableSkeleton />
  ) : (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        className="nursery-table"
        onRow={(record) => ({
          onClick: (e) => handleRowClick(e, record),
        })}
        rowKey="id"
      />
      {/* Delete Confirmation Modal */}
      <ConfirmDeletionModal
        deleteModalVisible={deleteModalVisible}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
      />

      <UpdateStatusModal
        visible={updateStatusModalVisible}
        currentStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onCancel={handleStatusUpdateCancel}
        onSubmit={handleStatusUpdate}
      />
    </>
  );
};

export default NurseryTable;
