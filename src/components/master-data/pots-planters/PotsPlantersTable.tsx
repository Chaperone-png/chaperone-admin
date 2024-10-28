import { Button, Space, Table, Tag } from 'antd';
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

const PotPlantersTable: React.FC = () => {
    const dispatch = useDispatch()
    const [plants, setPlants] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false)
    const [applyOffer, setApplyOffer] = useState<boolean | AdminPlantTye>(false);
    const [showFilters, setShowFilters] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPotPlanters, settotalPotPlanters] = useState(0);
    const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
    const navigate = useNavigate()
    const fetchNurseriesPlants = useCallback((page: number, pageSize: number) => {
        setIsFetching(true);
        potPlanterApi.getNurseriesPotsPlanters(page, pageSize)
            .then(response => {
                if (response?.data) {
                    setPlants(response.data?.potPlanters);
                    settotalPotPlanters(response?.data?.totalPages);
                    setFilteredPlants(response.data?.potPlanters); // Set the filtered plants initially to all plants
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
    }, [])
    useEffect(() => {
        fetchNurseriesPlants(currentPage, pageSize)
    }, [fetchNurseriesPlants]);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        fetchNurseriesPlants(page, pageSize || 10);
    };

    const handlePlantEdit = (record: any) => {
        dispatch(setCurrentStep(0))
        navigate(`/products/add-product?plantId=${record._id}`);
    }
    const columns = [

        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Nursery Name',
            dataIndex: ['nursery', 'name'], // Access the name field of the nested object
            key: 'nurseryName', // Use a unique key for the column
        },
        {
            title: 'Type',
            dataIndex: 'potPlanterType',
            key: 'potPlanterType',
            render: (potPlanterType: any) => (
                <>
                    {potPlanterType.title}
                </>
            ),
        },
        {
            title: 'Nursery Name',
            dataIndex: ['potPlanterType', 'category'], // Access the name field of the nested object
            key: 'category', // Use a unique key for the column
        },
        {
            title: 'Available Sizes',
            key: 'availableSizes', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <> <span>
                            <Tag>
                                {size.plantSizeId?.title}{" "}
                                {record.containerType !== 'bag' && <>
                                    colors: {size.detail.colors.map((color: any) => <>
                                        {color.colorName} {color.quantity}{" "}
                                    </>)}
                                </>}
                            </Tag>
                        </span></>
                    })}
                </>
            }
        },
        {
            title: 'Original Price',
            key: 'price', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <>
                            {size.plantSizeId?.title}{" "}
                            Rs.{size.detail.original_price}{" "}
                        </>
                    })}
                </>
            }
        },
        {
            title: 'Nursery Offer',
            key: 'price', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <>
                            {size.plantSizeId?.title}{" "}
                            {size.detail.is_offer}{" "}
                        </>
                    })}
                </>
            }
        },
        {
            title: 'Nursery Offer Price',
            key: 'price', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <>
                            {size.plantSizeId?.title}{" "}
                            {size.detail.is_offer === 'yes' ? `Rs.${size.detail.offer_price}` : 'N/A'}{" "}
                        </>
                    })}
                </>
            }
        },
        {
            title: `Selling Price 92% Margin`,
            key: 'selling', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <>
                            {size.plantSizeId?.title}{" "}
                            Rs.{addMargin(Number(size.detail.offer_price || size.detail.original_price), process.env.REACT_APP_PLANTS_MARGIN_PERCENTAGE || 92)}{" "}
                        </>
                    })}
                </>
            }
        },
        {
            title: `Admin Offer`,
            key: 'selling', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <>
                            {size.plantSizeId?.title}{" "}
                            {size.detail.is_admin_offer}{" "}
                            {size.detail.is_admin_offer === 'yes' ? `${size.detail.admin_offer_percentage}%` : ''}
                        </>
                    })}
                </>
            }
        },
        {
            title: `Final Display Price`,
            key: 'selling', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {
                console.log(record, 'record')
                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.availableSizes?.map((size: any) => {
                        return <>
                            {size.plantSizeId?.title}{" "}
                            Rs.{size.detail.final_display_price}{" "}
                        </>
                    })}
                </>
            }
        },
        // {
        //     title: 'Stock',
        //     dataIndex: 'quantity',
        //     key: 'quantity',
        //     render: (_text: any, record: AdminPlantTye) => {
        //         console.log(record, 'record')
        //         return <>
        //             {record.availableSizes.map((size:any) => <>
        //                 {record.containerType === 'bag' && <div>{size.plantSizeId?.title}</div>}
        //                 {record.containerType === 'pot' && <div>{size}</div>}

        //             </>)}
        //         </>
        //     }
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: any) => {
                return <>
                    <Tag color={`${text === 'draft' ? 'orange' : 'success'}`}>{capitalizeFirstLetter(text)}</Tag>
                </>
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <Button onClick={() => {
                        handlePlantEdit(record)
                    }
                    }><EditTwoTone /></Button>
                    <Button onClick={() => {
                        setApplyOffer(record)
                    }}>Add Offer %</Button>
                    {/* <Button onClick={() => handleDelete(record)}><DeleteOutlined /></Button> */}
                </Space>
            ),
        },
        // Add more columns as needed
    ];
    const handleApplyFilters = (filters: any) => {
        const filtered = plants.filter(plant => {
            return Object.keys(filters).every(key => {
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
            <Table dataSource={plants} columns={columns} loading={isFetching}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalPotPlanters,
                    onChange: handlePageChange,
                }} />
            {applyOffer && <ApplyOfferModal
                productType={'Pot/Planter'}
                detail={applyOffer as AdminPlantTye} isOpen={!!applyOffer} onCancel={() => {
                    setApplyOffer(false)
                }} />}
        </div>
    );
};

export default PotPlantersTable;
