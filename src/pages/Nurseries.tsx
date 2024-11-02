import { Button, Card, Col, Input, Row, Space, Table, Modal, Tabs, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import CustomPageHeader from '../components/PageHeader';
import RegisterNursery from '../components/RegisterNursery';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

import '../styles/Nurseries.scss';
import ConfirmationModal from '../components/ConfirmationModal';
import { nurseryApi } from '../services/apis/nurseries';
import NurseryCard from '../components/NurseryCard';
import NurseryTable from '../components/NurseryTable';
import NurseryDetailsModal from '../components/NurseryDetailsModal';
import { toast } from 'react-toastify';
import axios from 'axios';
const { TabPane } = Tabs;

const Nurseries: React.FC = () => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [selectedNursery, setSelectedNursery] = useState<any>(null);
    const [isViewModal, setIsViewModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false)
    const [nurseries, setNurseries] = useState([])
    const [pageSize, setPageSize] = useState(10); // You can set the default page size
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNurseries, setTotalNurseries] = useState(0);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation modal
    const [selectedStatus, setSelectedStatus] = useState<string>(''); // Initialize with an empty string for all statuses
    const [isLoading, setIsLoading] = useState(false)
    const fetchNurseries = async (page: number = 1, pageSize: number = 10, searchQuery?: string,
        statusQuery?: 'active' | 'pending' | 'inactive' | 'rejected' | any
    ) => {
        try {
            setIsLoading(true)
            const response = await nurseryApi.getNurseries(page, pageSize, searchQuery, statusQuery);
            if (response.data) {
                setNurseries(response.data.nurseries);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setTotalNurseries(response.data.totalNurseries);
            }
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)

            console.error('Error fetching nurseries:', error);
        }
    };
    useEffect(() => {

        fetchNurseries()

    }, [])
    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        // Fetch nurseries for the new page here
        fetchNurseries(page);
    };
    const handleRegisterClick = () => {
        setShowRegisterForm(true);
    };

    const handleCancelRegister = () => {
        setIsEditModal(false);
        setSelectedNursery(null)
        setShowRegisterForm(false);
    };

    const handleEditClick = (nursery: any) => {
        setIsEditModal(true)
        setSelectedNursery(nursery);
        setShowRegisterForm(true);
    };

    const handleShowDetails = (nursery: any) => {
        setIsViewModal(true)
        setSelectedNursery(nursery);
    };

    const handleCloseDetails = () => {
        setIsViewModal(false)
        setSelectedNursery(null);
    };
    
    const handleDeleteConfirm = async() => {
        // Add logic to handle delete here
        console.log(selectedNursery);
        try {
            const res = await nurseryApi.deleteNurseryById(selectedNursery._id);
            console.log(res);
            if (res.status === 200) {
                //removes deleted item from the state
                setNurseries(nurseries.filter((i:any) => i._id !== selectedNursery._id));
                setSelectedNursery(null)
                setIsDeleteModalVisible(false); // Close delete confirmation modal after confirmation
            }  
            } catch (error) {
            toast.error('Not able to delete.')
            console.log(error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false); // Close delete confirmation modal if canceled
    };

    const handleDeleteClick = (nursery: any) => {
        setSelectedNursery(nursery);
        setIsDeleteModalVisible(true); // Show delete confirmation modal
    };
    const handleSearch = (e: any) => {
        // Implement search functionality
        console.log('clicked')
        fetchNurseries(1, pageSize, e.target.value);
    };
    return (
        <div>
            <CustomPageHeader title="Nurseries" />
            <Input.Search
                placeholder="Search nurseries by name, location, owner, etc."
                allowClear
                className='search-bar'
                onChange={handleSearch}
                style={{ marginBottom: 10 }}
            />
            <Select
                placeholder="Filter by status"
                style={{ width: 200, marginBottom: 10 }}
                onChange={(value) => {
                    setSelectedStatus(value);
                    fetchNurseries(1, pageSize, '', value);
                }}
                value={selectedStatus}
                className='status-filter-dropdown'
            >
                <Select.Option value="">All Status</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
            <Button type="primary" onClick={handleRegisterClick} style={{ marginBottom: 10 }} className='add-nursery-button'>
                <PlusOutlined /> Add Nursery
            </Button>

            {false ? (
                <Row gutter={[16, 16]}>
                    {isLoading &&
                        <Col span={24} style={{ textAlign: 'center', marginTop: '10px' }}>

                            <Spin />
                        </Col>}
                    {!isLoading && nurseries.length === 0 &&
                        <Col span={24} style={{ textAlign: 'center', marginTop: '10px' }}>
                            No nurseries found</Col>}
                    {!isLoading && nurseries.map((nursery: any) => (
                        <NurseryCard
                            key={nursery.id}
                            nursery={nursery}
                            onShowDetails={handleShowDetails}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </Row>
            ) : (
                <NurseryTable
                    data={nurseries}
                    onShowDetails={handleShowDetails}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalNurseries,
                        onChange: handlePageChange,
                    }}
                    loading={isLoading}
                />
            )}
            {(showRegisterForm || (selectedNursery && isEditModal)) && (
                <RegisterNursery
                    visible={showRegisterForm}
                    onCancel={handleCancelRegister}
                    nursery={selectedNursery}
                    updateNurseries={fetchNurseries}
                />
            )}
            <NurseryDetailsModal
                visible={!!selectedNursery && isViewModal}
                nursery={selectedNursery}
                onClose={handleCloseDetails}
            />
            <ConfirmationModal
                visible={isDeleteModalVisible}
                title="Confirm Delete"
                description={`Are you sure you want to delete this nursery (${selectedNursery?.name})?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default Nurseries;
