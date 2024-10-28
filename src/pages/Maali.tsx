import { Button, Col, Input, Row, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import CustomPageHeader from '../components/PageHeader';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import '../styles/Nurseries.scss';

import ConfirmationModal from '../components/ConfirmationModal';
import MaaliTable from '../components/maali/MaaliTable';
import CreateMaaliModal from '../components/maali/CreateMaaliModal';
import MaaliCard from '../components/maali/MaaliCard';
import MaaliDetailsModal from '../components/maali/MaaliDetailsModal';
import { maaliApi } from '../services/apis/maaliApi';
import { Link } from 'react-router-dom';

const { Option } = Select;

const Maalis: React.FC = () => {
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [selectedMaali, setSelectedMaali] = useState<any>(null);
    const [isViewModal, setIsViewModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [maalis, setMaalis] = useState([]);
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMaalis, setTotalMaalis] = useState(0);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation modal
    const [selectedStatus, setSelectedStatus] = useState<string>(''); // Initialize with an empty string for all statuses
    const [isLoading, setIsLoading] = useState(false);

    const fetchMaalis = async (page: number = 1, pageSize: number = 10, searchQuery?: string, statusQuery?: 'active' | 'pending' | 'inactive' | 'rejected' | any) => {
        try {
            setIsLoading(true);
            const response = await maaliApi.getMaalis(page, pageSize, searchQuery, statusQuery);
            if (response.data) {
                console.log(response.data, 'Maali data')
                setMaalis(response.data.maalis);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                setTotalMaalis(response.data.totalMaalis);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching maalis:', error);
        }
    };

    useEffect(() => {
        fetchMaalis();
    }, []);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        fetchMaalis(page);
    };

    const handleRegisterClick = () => {
        setShowRegisterForm(true);
    };

    const handleCancelRegister = () => {
        setIsEditModal(false);
        setSelectedMaali(null);
        setShowRegisterForm(false);
    };

    const handleEditClick = (maali: any) => {
        setIsEditModal(true);
        setSelectedMaali(maali);
        setShowRegisterForm(true);
    };

    const handleShowDetails = (maali: any) => {
        setIsViewModal(true);
        setSelectedMaali(maali);
    };

    const handleCloseDetails = () => {
        setIsViewModal(false);
        setSelectedMaali(null);
    };

    const handleDeleteConfirm = () => {
        // Add logic to handle delete here
        setIsDeleteModalVisible(false); // Close delete confirmation modal after confirmation
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false); // Close delete confirmation modal if canceled
    };

    const handleDeleteClick = (maali: any) => {
        setSelectedMaali(maali);
        setIsDeleteModalVisible(true); // Show delete confirmation modal
    };

    const handleSearch = (e: any) => {
        fetchMaalis(1, pageSize, e.target.value);
    };

    return (
        <div>
            <CustomPageHeader title="Maalis" />
            <Input.Search
                placeholder="Search maalis by name, location, email, contact, etc."
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
                    fetchMaalis(1, pageSize, '', value);
                }}
                value={selectedStatus}
                className='status-filter-dropdown'
            >
                <Option value="">All Status</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
                <Option value="in_review">In Review</Option>
                <Option value="pending">pending</Option>
            </Select>
            {/* <Button type="primary" onClick={handleRegisterClick} style={{ marginBottom: 10 }} className='add-maali-button'>
                <PlusOutlined /> Add New Maali
            </Button> */}
            <Link to={'/maalis/create'} className='ant-btn ant-btn-primary add-maali-button'><PlusOutlined /> Add New Maali</Link>

            {isMobile ? (
                <Row gutter={[16, 16]}>
                    {isLoading && (
                        <Col span={24} style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Spin />
                        </Col>
                    )}
                    {!isLoading && maalis.length === 0 && (
                        <Col span={24} style={{ textAlign: 'center', marginTop: '10px' }}>
                            No maalis found
                        </Col>
                    )}
                    {!isLoading && maalis.map((maali: any) => (
                        <MaaliCard
                            key={maali.id}
                            maali={maali}
                            onShowDetails={handleShowDetails}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </Row>
            ) : (
                <MaaliTable
                    data={maalis}
                    onShowDetails={handleShowDetails}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalMaalis,
                        onChange: handlePageChange,
                    }}
                    loading={isLoading}
                />
            )}

            {(showRegisterForm || (selectedMaali && isEditModal)) && (
                <CreateMaaliModal
                    visible={showRegisterForm}
                    onCancel={handleCancelRegister}
                    maali={selectedMaali}
                    updateMaalis={fetchMaalis}
                />
            )}

            <MaaliDetailsModal
                visible={!!selectedMaali && isViewModal}
                maali={selectedMaali}
                onClose={handleCloseDetails}
            />

            <ConfirmationModal
                visible={isDeleteModalVisible}
                title="Confirm Delete"
                description={`Are you sure you want to delete this maali (${selectedMaali?.name})?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default Maalis;
