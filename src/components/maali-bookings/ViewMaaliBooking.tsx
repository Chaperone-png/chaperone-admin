import { Modal } from 'antd';
import moment from 'moment';
import React from 'react';
import './maali-bookings.scss';

interface Props {
    isOpen: boolean;
    bookingDetails: any;
    onCancel: () => void;
}

const ViewMaaliBooking = ({ isOpen, bookingDetails, onCancel }: Props) => {
    // Render dynamic booking information based on planType
    const renderBookingPlanDetails = () => {
        const plan = bookingDetails.planType;
        if (plan && bookingDetails.bookingDetails[plan]) {
            const details = bookingDetails.bookingDetails[plan];
            return (
                <div>
                    <tr>
                        <th>Plan Type</th>
                        <td>{plan}</td>
                    </tr>
                    {details.no_of_days && (
                        <tr>
                            <th>Number of Days</th>
                            <td>{details.no_of_days}</td>
                        </tr>
                    )}
                    {details.hours && (
                        <tr>
                            <th>Hours</th>
                            <td>{details.hours}</td>
                        </tr>
                    )}
                </div>
            );
        }
        return null;
    };

    // Render additional details if available
    const renderAdditionalDetails = () => {
        if (bookingDetails.additionalDetails && bookingDetails.additionalDetails.length > 0) {
            return (
                <div>
                    <h3>Additional Details</h3>
                    <table className='assign-maali-table'>
                        <tbody>
                            {bookingDetails.additionalDetails.map((item: any) => (
                                <tr key={item._id}>
                                    <th>{item.key}</th>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    };

    return (
        <Modal
            open={isOpen}
            title="Assign Maali"
            onCancel={onCancel}
            footer={null}
            style={{ maxWidth: '90vw' }}
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
                            <th>Preferred Week Days</th>
                            <td>{bookingDetails.prefferedWeekDays?.join(', ')}</td>
                        </tr>
                        <tr>
                            <th>Rare Case Preferred Times</th>
                            <td>{bookingDetails.prefferedRareCasesTimes?.join(', ')}</td>
                        </tr>
                        <tr>
                            <th>Subtotal</th>
                            <td>{bookingDetails.subtotal}</td>
                        </tr>
                        <tr>
                            <th>GST</th>
                            <td>{bookingDetails.gst}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>{bookingDetails.total}</td>
                        </tr>
                        {/* Dynamic plan details */}
                        {renderBookingPlanDetails()}
                    </tbody>
                </table>
                {/* Additional details section */}
                {renderAdditionalDetails()}
            </div>
        </Modal>
    );
};

export default ViewMaaliBooking;
