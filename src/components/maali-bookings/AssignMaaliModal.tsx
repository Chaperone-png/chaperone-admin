import { message, Modal, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { maaliApi } from '../../services/apis/maaliApi';
import { MaaliType } from '../../types';
import './maali-bookings.scss';

interface Props {
    isOpen: boolean;
    bookingDetails: any;
    onSelectMaali?: (maaliId: string) => void;
    onCancel: any
}

const AssignMaaliModal = (props: Props) => {
    const { isOpen, bookingDetails, onCancel } = props;
    const [selectedMaali, setSelectedMaali] = useState<string | null>(null);  // Track selected Maali

    const handleMaaliSelect = (value: string) => {
        setSelectedMaali(value);
    };
    const [maalis, setMaalis] = useState<MaaliType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusQuery, setStatusQuery] = useState<string>('');

    const fetchMaalis = useCallback(async (pageNum: number) => {
        setLoading(true);
        try {
            // const response = await axiosInstance.get('/maalis', {
            //     params: {
            //         page: pageNum,
            //         pageSize: 20,
            //         search: searchQuery,
            //         status: statusQuery,
            //     },
            // });
            const response = await maaliApi.getMaalis(pageNum, 20, searchQuery, statusQuery)
            const { maalis: fetchedMaalis, totalPages } = response.data;
            setMaalis(prev => [...prev, ...fetchedMaalis]);
            setHasMore(pageNum < totalPages);
        } catch (error) {
            console.error('Error fetching maalis:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusQuery]);

    useEffect(() => {
        if (isOpen) {
            setPage(1);
            setMaalis([]);
            fetchMaalis(1);
        }
    }, [isOpen, fetchMaalis]);

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const bottom = e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
        if (bottom && hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setPage(1);
        setMaalis([]);
        fetchMaalis(1);
    };
    // Handle API call on OK
    const handleOk = async () => {
        if (!selectedMaali) {
            message.error('Please select a Maali!');
            return;
        }

        try {
            setLoading(true);
            // Call API to assign Maali to the booking
            await maaliApi.assignMaaliToBooking(bookingDetails._id, selectedMaali);
            message.success('Maali assigned successfully!');
            // onSuccess?.(); // Call success callback if provided
            onCancel();  // Close modal after assigning
        } catch (error) {
            console.error('Error assigning maali:', error);
            message.error('Failed to assign Maali.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal
            open={isOpen}
            title="Assign Maali"
            onCancel={onCancel}
            style={{ maxWidth: '90vw' }}
            onOk={handleOk}
            confirmLoading={loading}  // Show loading spinner on OK button

        >
            <div>
                <table className='assign-maali-table'>
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <td>{bookingDetails.addressId?.fullName}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>
                                House No. - {bookingDetails.addressId?.houseNo} <br />
                                Area - {bookingDetails.addressId?.area} <br />
                                City - {bookingDetails.addressId?.city} <br />
                                State - {bookingDetails.addressId?.state} <br />
                                Pincode - {bookingDetails.addressId?.pincode} <br />
                                Landmark - {bookingDetails.addressId?.landmark}
                            </td>
                        </tr>
                        <tr>
                            <th>Selected Booking Date</th>
                            <td>{moment(bookingDetails.date).format('DD-MM-YYYY')}</td>
                        </tr>
                        <tr>
                            <th>Preferred Booking Time</th>
                            <td>{bookingDetails.prefferedTimes?.join(', ')}</td>
                        </tr>
                        <tr>
                            <th>Plan Type</th>
                            <td>{bookingDetails.planType}</td>
                        </tr>
                        <tr>
                            <th>Hours</th>
                            <td>{bookingDetails.bookingDetails[bookingDetails.planType]?.hours}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '20px' }}>
                <Select
                    placeholder="Select a Maali"
                    style={{ width: '100%' }}
                    showSearch
                    dropdownRender={menu => (
                        <div onScroll={handleScroll}>
                            {menu}
                            {loading && <div style={{ textAlign: 'center', padding: '10px' }}><Spin /></div>}
                        </div>
                    )}
                    onChange={handleMaaliSelect}
                >
                    {maalis.map((maali) => (
                        <Select.Option key={maali._id} value={maali._id}>
                            {maali.firstName} {maali.lastName}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
};

export default AssignMaaliModal;
