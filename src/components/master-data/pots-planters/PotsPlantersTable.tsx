import { Button, Modal, Select, Space, Table, Tag, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { nurseryPlantApi } from '../../../services/apis/nurseryPlantApi';
import { EditTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentStep } from '../../../redux/nurseryPlantSlice';
import { AdminPlantTye } from '../../../types';
import { addMargin, capitalizeFirstLetter } from '../../../utils/util';
import ApplyOfferModal from '../plants/ApplyOfferModal';
import PlantFilters from '../plants/PlantFilters';
import { potPlanterApi } from '../../../services/apis/potPlanterApi';
import { useLoader } from '../../../context/LoaderContext';

interface Props {
    activeTab: string;
    searchString: string;
}
const PotPlantersTable: React.FC<Props> = ({
    activeTab,
    searchString
}) => {
    const dispatch = useDispatch();
    const [plants, setPlants] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [applyOffer, setApplyOffer] = useState<boolean | AdminPlantTye>(false);
    const [showFilters, setShowFilters] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPotPlanters, setTotalPotPlanters] = useState(0);
    const [statusModal, setStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('active');
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
    const navigate = useNavigate();
    const { startLoader, stopLoader } = useLoader();

    const fetchNurseriesPlants = useCallback((page: number, pageSize: number, searchString: string) => {
        setIsFetching(true);
        potPlanterApi.getNurseriesPotsPlanters(page, pageSize, searchString)
            .then(response => {
                if (response?.data) {
                    setPlants(response.data?.potPlanters);
                    setTotalPotPlanters(response?.data?.totalPages);
                    setFilteredPlants(response.data?.potPlanters);
                } else {
                    setPlants([]);
                    setFilteredPlants([]);
                }
            })
            .catch(error => console.error('Error fetching pot planters:', error))
            .finally(() => setIsFetching(false));
    }, []);

    useEffect(() => {
        if(activeTab == "2"){
            fetchNurseriesPlants(currentPage, pageSize, searchString);
        }
    }, [fetchNurseriesPlants, pageSize, activeTab, searchString]);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        fetchNurseriesPlants(page, pageSize || 10, searchString);
    };

    const handlePlantEdit = (record: any) => {
        dispatch(setCurrentStep(0));
        sessionStorage.setItem("Updation_type", "Pot");
        navigate(`/products/add-product?plantId=${record._id}`);
    };

    const handleStatusEdit = (record: any) => {
        setSelectedRecord(record);
        setSelectedStatus(record.status === 'active' ? 'inactive' : 'active');
        setStatusModal(true);
    };

    const handleStatusUpdate = async () => {
        if (selectedRecord) {
            try {
                startLoader();
                await potPlanterApi.updatePotPlanterStatus(
                    selectedRecord.nursery._id,
                    { status: selectedStatus },
                    selectedRecord._id
                );
                setStatusModal(false);
                fetchNurseriesPlants(currentPage, pageSize, searchString);
            } catch (error) {
                console.error('Error updating status:', error);
            } finally {
                stopLoader();
            }
        }
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Nursery Name',
            dataIndex: ['nursery', 'name'],
            key: 'nurseryName',
        },
        {
            title: 'Type',
            dataIndex: ['potPlanterType', 'title'],
            key: 'potPlanterType',
        },
        {
            title: 'Category',
            dataIndex: ['potPlanterType', 'category'],
            key: 'category',
        },
        {
            title: 'Available Sizes',
            key: 'availableSizes',
            render: (_text: any, record: AdminPlantTye) => (
                record.availableSizes.map((size: any) => (
                    <Tag key={size.plantSizeId?.title}>
                        {size.plantSizeId?.title} {record.containerType !== 'bag' && (
                            <>Colors: {size.detail.colors.map((color: any) => `${color.colorName} (${color.quantity}) `)}</>
                        )}
                    </Tag>
                ))
            ),
        },
        {
            title: 'Original Price',
            key: 'originalPrice',
            render: (_text: any, record: AdminPlantTye) => (
                record.availableSizes.map((size: any) => `Rs.${size.detail.original_price}`)
            ),
        },
        {
            title: 'Offer Price',
            key: 'offerPrice',
            render: (_text: any, record: AdminPlantTye) => (
                record.availableSizes.map((size: any) => size.detail.is_offer === 'yes' ? `Rs.${size.detail.offer_price}` : 'N/A')
            ),
        },
        {
            title: 'Final Display Price',
            key: 'finalDisplayPrice',
            render: (_text: any, record: AdminPlantTye) => (
                record.availableSizes.map((size: any) => `Rs.${size.detail.final_display_price}`)
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: any, record: any) => (
                <Tooltip title="Click to edit status">
                    <span style={{ cursor: 'pointer' }} onClick={() => handleStatusEdit(record)}>
                        <Tag color={text === 'inactive' ? 'red' : 'green'}>
                            {capitalizeFirstLetter(text)}
                        </Tag>
                        <EditTwoTone style={{ marginLeft: 8 }} />
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_text: any, record: any) => (
                <Space size="small">
                    <Button onClick={() => handlePlantEdit(record)}><EditTwoTone /></Button>
                    <Button onClick={() => setApplyOffer(record)}>Add Offer %</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Select
                placeholder="Items per page"
                style={{ width: 200, marginBottom: 10 }}
                onChange={(value) => setPageSize(value)}
                value={pageSize}
            >
                {[10, 20, 50, 100].map(size => (
                    <Select.Option key={size} value={size}>{size}</Select.Option>
                ))}
            </Select>

            <Table
                dataSource={filteredPlants}
                columns={columns}
                loading={isFetching}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalPotPlanters * pageSize,
                    onChange: handlePageChange,
                }}
            />

            {applyOffer && <ApplyOfferModal productType="Pot/Planter" detail={applyOffer as AdminPlantTye} isOpen={!!applyOffer} onCancel={() => setApplyOffer(false)} />}

            <Modal title="Update Status" open={statusModal} onOk={handleStatusUpdate} onCancel={() => setStatusModal(false)}>
                <Select value={selectedStatus} onChange={setSelectedStatus} style={{ width: '100%' }}>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
            </Modal>
        </div>
    );
};

export default PotPlantersTable;
