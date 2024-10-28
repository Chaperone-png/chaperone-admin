import React, { useState } from 'react';
import { Table, Button, Modal, Select, Tag } from 'antd';
import { format } from 'date-fns';
import './DayCareTable.scss';
import { MaaliType } from '../../../types';
import { useLoader } from '../../../context/LoaderContext';
import { toast } from 'react-toastify';
import { plantDayCareApi } from '../../../services/apis/plantDayCareApi';

interface PlantInfo {
    sizeTitle: string;
    quantity: number;
    days: number;
    imageUrl: string;
}

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface DayCare {
    _id: string;
    createdAt: string;
    description: string;
    journeySummary: any[];
    location: string;
    plantsInfo: PlantInfo[];
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    updatedAt: string;
    userInfo: UserInfo;
}

interface DayCareTableProps {
    dayCares: DayCare[];
    allListedMaalis: MaaliType[];
    setReload: (value: boolean) => void;
}

const DayCareTable: React.FC<DayCareTableProps> = ({ dayCares, allListedMaalis, setReload }) => {
    const [selectedDayCare, setSelectedDayCare] = useState<DayCare | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [maali, setMaali] = useState<string>('');
    const [isMaaliReassigned, setIsMaaliReassigned] = useState<boolean>(false);
    const { startLoader, stopLoader } = useLoader();

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (_: any, __: any, index: number) => index + 1,
            width: '5%',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '15%',
        },
        {
            title: 'Scheduled Date',
            dataIndex: 'scheduledDate',
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
            width: '15%',
        },
        {
            title: 'User Info',
            dataIndex: 'userInfo',
            render: (user: UserInfo) => (
                <div>
                    <div>{user.name}</div>
                    <div>{user.phone}</div>
                    <div>{user.address}</div>
                </div>
            ),
            width: '20%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string) => {
                const color = status === 'processing' ? 'blue' : 'green';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
            width: '10%',
        },
        {
            title: 'Plants Info',
            dataIndex: 'plantsInfo',
            render: (plants: PlantInfo[]) => (
                <div>
                    {plants.map((plant, index) => (
                        <div key={index}>
                            <img className="plant-image" src={plant.imageUrl} alt={plant.sizeTitle} />
                            <div>{`${plant.sizeTitle} (${plant.quantity} plants)`}</div>
                            <div>{`Care Duration: ${plant.days} days`}</div>
                        </div>
                    ))}
                </div>
            ),
            width: '20%',
        },
        {
            title: 'Action',
            dataIndex: '_id',
            render: (_: any, record: DayCare) => (
                <Button type="link" className="assign-maali" onClick={() => handleAssignMaali(record)}>
                    {record.journeySummary.length > 0 ? 'Change Maali' : 'Assign Maali'}
                </Button>
            ),
            width: '15%',
        },
    ];

    const handleAssignMaali = (dayCare: DayCare) => {
        setSelectedDayCare(dayCare);
        setIsMaaliReassigned(dayCare.journeySummary.length > 0)
        setIsModalOpen(true);
    };

    const handleMaaliAssignment = async () => {
        try {
            startLoader();
            const payload = {
                maaliAssignedId: maali
            }
            const response = isMaaliReassigned ? await plantDayCareApi.reAssignMaali(selectedDayCare?._id, payload) : await plantDayCareApi.assignMaali(selectedDayCare?._id, payload);
            if (response.data.ok) {
                toast.success(response.data.message);
            }
            else {
                toast.error(response.data.message);
            }
        }
        catch (Err) {

        }
        finally {
            stopLoader();
            setIsModalOpen(false);
            setIsMaaliReassigned(false);
            setMaali('');
            setSelectedDayCare(null);
            setReload(true);
        }
    };

    return (
        <div className="daycare-table-container">
            <Table
                columns={columns}
                dataSource={dayCares}
                rowKey="_id"
                pagination={false}
                scroll={{ y: 600 }}
            />

            <Modal
                title="Assign Maali"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleMaaliAssignment}
                okText="Assign"
                cancelText="Cancel"
            >
                <div className="assign-maali-modal">
                    <h3>Assign Maali to {selectedDayCare?.userInfo.name}</h3>
                    <Select
                        value={maali}
                        onChange={(value) => setMaali(value)}
                        placeholder="Select Maali"
                        className="maali-select"
                    >
                        {allListedMaalis.map((maali, index) => (
                            <Select.Option key={index} value={maali._id}>{maali?.firstName} {maali.lastName}</Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>
        </div>
    );
};

export default DayCareTable;
