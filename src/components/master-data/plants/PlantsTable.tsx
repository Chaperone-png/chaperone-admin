import { Button, Space, Table, Tag } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { nurseryPlantApi } from '../../../services/apis/nurseryPlantApi';
import { EditTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentStep } from '../../../redux/nurseryPlantSlice';
import { AdminPlantTye } from '../../../types';
import { addMargin, capitalizeFirstLetter } from '../../../utils/util';
import ApplyOfferModal from './ApplyOfferModal';
import PlantFilters from './PlantFilters';

interface PlantProps {
    plants: any[];
    isFetching: boolean;
    setIsFetching: (value: boolean) => void;
    filteredPlants: any[];
    setFilteredPlants: (plants: any[]) => void;
    handleFetchMorePlantsChange: (page: number, pageSize: number, searchQuery: string, statusFilter: string) => void;
    totalPlants: number;
}
const PlantsTable: React.FC<PlantProps> = ({ plants, isFetching, setIsFetching, filteredPlants, setFilteredPlants, handleFetchMorePlantsChange, totalPlants }) => {
    const dispatch = useDispatch()
    const [applyOffer, setApplyOffer] = useState<boolean | AdminPlantTye>(false);
    const [showFilters, setShowFilters] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate()

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        handleFetchMorePlantsChange(page, pageSize || 10, '', 'active');
    };

    const handlePlantEdit = (record: any) => {
        dispatch(setCurrentStep(0))
        navigate(`/products/add-product?plantId=${record._id}`);
    }
    const columns = [

        {
            title: 'Plant Name',
            dataIndex: 'plantName',
            key: 'plantName',
        },
        {
            title: 'Nursery Name',
            dataIndex: ['nursery', 'name'], // Access the name field of the nested object
            key: 'nurseryName', // Use a unique key for the column
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
            title: 'Container',
            dataIndex: 'containerType',
            key: 'containerType',
            render: (_text: any, record: AdminPlantTye) => {

                return <>
                    {record.containerType ? capitalizeFirstLetter(record.containerType) : '-'}
                </>
            }
        },
        {
            title: 'Container Material',
            dataIndex: 'containerType',
            key: 'containerType',
            render: (_text: any, record: AdminPlantTye) => {

                return <>
                    {record.availableSizes.length === 0 ? '-' : ''}
                    {record.containerMaterial}

                    {record.availableSizes.map((size) => <>
                        {/* {size.detail.potTypes.length === 0?'-':''} */}
                        {/* {size.detail.potTypes.map((potType, index)=>{
                        return <>{potType.typeTitle}{size.detail.potTypes.length-1 > index && ','}</>
                    })} */}
                    </>)}
                </>
            }
        },

        {
            title: 'Available Sizes',
            key: 'availableSizes', // Use a unique key for the column
            render: (_text: any, record: AdminPlantTye) => {

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
        const filtered = plants.filter((plant: any) => {
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
                    total: totalPlants,
                    onChange: handlePageChange,
                }} />
            {applyOffer && <ApplyOfferModal detail={applyOffer as AdminPlantTye} isOpen={!!applyOffer} onCancel={() => {
                setApplyOffer(false)
            }} />}
        </div>
    );
};

export default PlantsTable;
