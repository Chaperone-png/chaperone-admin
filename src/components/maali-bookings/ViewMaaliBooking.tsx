import { Modal } from 'antd';
import moment from 'moment';
import React, { useMemo } from 'react';
import './maali-bookings.scss';

interface Props {
    isOpen: boolean;
    bookingDetails: any;
    onCancel: () => void;
}

const ViewMaaliBooking = ({ isOpen, bookingDetails, onCancel }: Props) => {

    // Calculate GST value and final paid amount using useMemo
    const { subtotal } = bookingDetails;

    console.log({ bookingDetails })

    const { bookingGSTValue, bookingFinalPaidValue } = useMemo(() => {
        const gstRate = 0.18; // 18%
        const gstValue = subtotal * gstRate;
        const finalPaidValue = subtotal + gstValue;

        return {
            bookingGSTValue: gstValue.toFixed(2), // Format to 2 decimal places
            bookingFinalPaidValue: finalPaidValue.toFixed(2) // Format to 2 decimal places
        };
    }, [subtotal]);

    const { isPaymentPaidAlready } = useMemo(() => {
        let isPaymentPaidAlready = false;
        if (bookingDetails?.orderId !== "" && bookingDetails?.paymentId !== "")
            isPaymentPaidAlready = true;
        return { isPaymentPaidAlready }
    }, [bookingDetails])

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
            title="View Maali Booking Info"
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
                            <th>Customer Phone Number</th>
                            <td>{bookingDetails.addressId?.mobileNumber}</td>
                        </tr>

                        <tr>
                            <th>Address</th>
                            <td>
                                House No. - {bookingDetails.addressId?.houseNo} <br />
                                Area - {bookingDetails.addressId?.area} <br />
                                City - {bookingDetails.addressId?.city} <br />
                                State - {bookingDetails.addressId?.state} <br />
                                Pincode - {bookingDetails.addressId?.pincode} <br />
                                Mobile Number - {bookingDetails?.addressId?.mobileNumber}  <br />
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
                            <td>{bookingGSTValue}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>Rs. {Math.round(bookingFinalPaidValue)}</td>
                        </tr>

                        <tr>
                            <th>Payment Status</th>
                            <td>{isPaymentPaidAlready ? 'Paid' : 'Unpaid'}</td>
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
