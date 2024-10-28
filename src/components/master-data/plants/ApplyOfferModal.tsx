import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Switch, Form, message } from "antd";
import { AdminPlantTye } from "../../../types";
import { nurseryPlantApi } from "../../../services/apis/nurseryPlantApi";
import { potPlanterApi } from "../../../services/apis/potPlanterApi";

interface Props {
    isOpen: boolean;
    onCancel: any;
    detail: AdminPlantTye;
    productType?: 'Pot/Planter' | 'Plant';
}
interface SizeOffer {
    [key: string]: {
        offerEnabled: boolean;
        offerPrice?: number;
        error?: string;
    };
}

const ApplyOfferModal = ({ isOpen, onCancel, detail, productType }: Props) => {
    const [sizeOffers, setSizeOffers] = useState<SizeOffer>({});
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        // Initialize sizeOffers state when modal is opened
        if (isOpen) {
            const initialSizeOffers: SizeOffer = {};
            detail.availableSizes.forEach((size) => {
                initialSizeOffers[size.plantSizeId._id] = {
                    offerEnabled: size.detail.is_admin_offer === "yes",
                    offerPrice: size.detail.admin_offer_percentage || undefined,
                    error: size.detail.is_admin_offer === "yes" && !size.detail.admin_offer_percentage ? "Offer percentage is required" : "",
                };
            });
            setSizeOffers(initialSizeOffers);
        }
    }, [isOpen, detail.availableSizes]);
    const handleToggle = (sizeId: string, checked: boolean) => {
        setSizeOffers((prevOffers) => ({
            ...prevOffers,
            [sizeId]: {
                ...prevOffers[sizeId],
                offerEnabled: checked,
                error: checked && !prevOffers[sizeId]?.offerPrice ? "Offer percentage is required" : "",
            },
        }));
    };

    const handleOfferChange = (sizeId: string, value: string) => {
        setSizeOffers((prevOffers) => ({
            ...prevOffers,
            [sizeId]: {
                ...prevOffers[sizeId],
                offerPrice: Number(value),
                error: value ? "" : "Offer percentage is required",
            },
        }));
    };

    const handleOk = async () => {
        const hasErrors = Object.values(sizeOffers).some(
            (offer) => offer.offerEnabled && !offer.offerPrice
        );

        if (hasErrors) {
            message.error("Please provide a valid offer percentage for all enabled offers.");
            return;
        }

        setIsDisabled(true);
        const formData = new FormData();

        detail.availableSizes.forEach((size, index) => {
            const sizeOffer = sizeOffers[size.plantSizeId._id];
            formData.append(`availableSizes[${index}][plantSizeId]`, size._id);
            formData.append(`availableSizes[${index}][detail][is_admin_offer]`, sizeOffer?.offerEnabled ? 'yes' : 'no');
            formData.append(`availableSizes[${index}][detail][admin_offer_percentage]`, String(sizeOffer?.offerPrice || 0));
        });

        try {
            let response;
            if (productType === 'Pot/Planter') {
                response = await potPlanterApi.updatePotPlanterOffers(detail.nursery._id, detail._id, formData);

            } else {
                response = await nurseryPlantApi.updatePlantOffers(detail.nursery._id, detail._id, formData);

            }
            console.log(response, 'Response....');
            message.success("Offers updated successfully!");
        } catch (e) {
            console.log(e, 'Error,...');
            message.error("Failed to update offers. Please try again.");
        } finally {
            setIsDisabled(false);
            onCancel();
        }
    };

    return (
        <Modal
            title="Apply Offer"
            open={isOpen}
            onOk={handleOk}
            onCancel={onCancel}
            okButtonProps={{ disabled: isDisabled }}
        >
            <div><strong>Plant Name:</strong> {detail.plantName}</div>
            <div><strong>Nursery Name:</strong> {detail.nursery.name}</div>
            <h2>Plant sizes:</h2>
            <Form layout="vertical">
                {detail.availableSizes.map((size) => (
                    <div key={size.plantSizeId._id} style={{ marginBottom: "20px" }}>
                        <h4>{size.plantSizeId.title}</h4>
                        <div><strong>Nursery Selling Price:</strong> {size.detail.original_price}</div>
                        <div><strong>Nursery Offer Price:</strong> {size.detail.offer_price || "N/A"}</div>
                        <div><strong>Chaperone Selling Price:</strong> {size.detail.admin_selling_price || "N/A"}</div>
                        <Switch
                            checked={sizeOffers[size.plantSizeId._id]?.offerEnabled || false}
                            onChange={(checked) => handleToggle(size.plantSizeId._id, checked)}
                            style={{ marginBottom: "10px" }}
                        />
                        {sizeOffers[size.plantSizeId._id]?.offerEnabled && (
                            <Form.Item
                                validateStatus={sizeOffers[size.plantSizeId._id]?.error ? "error" : ""}
                                help={sizeOffers[size.plantSizeId._id]?.error || ""}
                            >
                                <Input
                                    placeholder="Enter Offer Percentage"
                                    onChange={(e) => handleOfferChange(size.plantSizeId._id, e.target.value)}
                                    value={sizeOffers[size.plantSizeId._id]?.offerPrice || ""}
                                    style={{ width: "150px" }}
                                />
                            </Form.Item>
                        )}
                    </div>
                ))}
            </Form>
        </Modal>
    );
};

export default ApplyOfferModal;
