import React, { useEffect, useState } from "react";
import { Modal, Tabs, Button, Input, DatePicker, Row, Col, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs"; 
import { useLoader } from "../../context/LoaderContext";
import { toast } from "react-toastify";
import { dealApi } from "../../services/apis/dealApi";

//deal model
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface DealModalProps {
    open: boolean;
    closeModal: () => void;
    plants: any;
    activeDeal?: any; // Add activeDeal prop
}

const DealModal: React.FC<DealModalProps> = ({ open, closeModal, plants, activeDeal }) => {
    const [selectedTab, setSelectedTab] = useState<string>("0");
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [dealDescription, setDealDescription] = useState<string>("");
    const [percentage, setPercentage] = useState('');

    // useEffect(() => {
    //     setSelectedTab("2")
    // },[selectedPlant])
    const { startLoader, stopLoader } = useLoader();

    const handleTabChange = (key: string) => {
        setSelectedTab(key);
    };

    const handlePlantSelect = (plant: any) => {
        setSelectedPlant(plant);
        setSelectedTab("2"); 
    };

    const resetData = () => {
        
    };

    const closeHandler = () => {
        setSelectedTab("0");
        setSelectedPlant(null);
        setStartDate(null);
        setEndDate(null);
        setDealDescription("");
        closeModal();
    };

    const formatDate = (date: Date | string) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleSubmit = async () => {
        if (selectedPlant && startDate && endDate && dealDescription && percentage) {
            try {
                startLoader();
                const dealPayload = {
                    plantId: selectedPlant._id,
                    plantName: selectedPlant.plantName,
                    discountPercentage: selectedPlant.availableSizes[0]?.detail.offer_price,
                    price: selectedPlant.availableSizes[0]?.detail.final_display_price,
                    startDate,
                    endDate,
                    dealDescription,
                    offerPercentage: percentage
                };
                const response = await dealApi.addDealOfWeek(dealPayload);
                if (response.data?.ok) {
                    toast.success("Deal created successfully");
                } else {
                    toast.error(response.data?.message);
                }
            } catch (error: any) {
                toast.error(error?.data?.message);
                console.log("Got error while creating deal", error);
            } finally {
                stopLoader();
                closeModal();
                window.location.reload();
            }
        }
    };

    return (
        <Modal
            title={selectedTab === "0" ? "Current Active Deal" : "Set Deal Details"}
            visible={open}
            onCancel={closeHandler}
            footer={null}
            closeIcon={<CloseOutlined />}
        >
            <Tabs activeKey={selectedTab} onChange={handleTabChange}>
                <TabPane tab="Current Active Deal" key="0">
                    <Title level={4}>Active Deal Details</Title>
                    {activeDeal?.plantId ? (
                        <div style={{ marginBottom: "20px" }}>
                            <Title level={5}>{activeDeal.plantName}</Title>
                            <Text>
                                Price: ₹{activeDeal.plantId?.availableSizes?.[0]?.detail?.final_display_price}
                                {activeDeal.plantId?.availableSizes?.[0]?.detail?.offer_price > 0 ? ` | Discount: ${activeDeal.plantId?.availableSizes?.[0]?.detail?.offer_price}%` : ''}
                            </Text>
                            <Text>
                                <br />
                                Start Date: {formatDate(activeDeal.startDate)}
                                <br />
                                End Date: {formatDate(activeDeal.endDate)}
                            </Text>
                            <div style={{ marginTop: "20px" }}>
                                <Text>{activeDeal.dealDescription}</Text>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <img
                                    src={activeDeal.plantId?.images[0]?.url} // Ensure to get the correct image path
                                    alt={activeDeal.plantName}
                                    style={{ width: "80px", height: "80px", marginTop: "10px" }}
                                />
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <Button onClick={() => handleTabChange("1")}>
                                    Change Plant
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div><Text>No active deal available.</Text>
                        <Button onClick={() => handleTabChange("1")}>
                                    Change Plant
                                </Button></div>
                    )}
                </TabPane>

                <TabPane disabled={!selectedPlant?._id} tab="Select Plant" key="1">
                    <Title level={4}>Select a Plant</Title>
                    <div style={{ maxHeight: "500px", overflowY: "auto", padding: "10px" }}>
                        <Row gutter={[16, 16]}>
                            {plants?.map((plant: any) => (
                                <Col span={24} key={plant.id}>
                                    <div
                                        onClick={() => handlePlantSelect(plant)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            border: "1px solid #ddd",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                        }}
                                        key={plant.id}
                                    >
                                        <img
                                            src={plant?.images[0]?.url}
                                            alt={plant?.plantName}
                                            style={{ width: "80px", height: "80px", marginRight: "10px" }}
                                        />
                                        <div>
                                            <Title level={5}>{plant.plantName}</Title>
                                            <Text>
                                                Price: ₹{plant.availableSizes?.[0]?.detail.final_display_price}
                                                {plant.availableSizes?.[0]?.detail.is_offer !== 'no' ? ` | Discount: ${plant.availableSizes?.[0]?.detail.offer_price}%` : ''}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </TabPane>

                <TabPane disabled={!selectedPlant} tab="Deal Details" key="2">
                    <Title level={4}>Enter Deal Details</Title>
                    {selectedPlant && (
                        <div style={{ marginBottom: "20px" }}>
                            <Title level={5}>{selectedPlant.plantName}</Title>
                            <Text>
                                Price: ₹{selectedPlant?.availableSizes?.[0]?.detail.final_display_price} 
                                {selectedPlant?.availableSizes?.[0]?.detail.is_offer !== 'no' ? ` | Discount: ${selectedPlant?.availableSizes?.[0]?.detail.offer_price}%` : ''}
                            </Text>
                        </div>
                    )}
                    <Row>
                        <Col span={24} style={{ marginTop: "20px" }}>
                        <Typography>Percentage:</Typography>
                        <TextArea  value={percentage} onChange={(e) => setPercentage(e.target.value)} rows={3}/>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <DatePicker
                                placeholder="Start Date"
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                format="D MMMM YYYY"
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col span={12}>
                            <DatePicker
                                placeholder="End Date"
                                value={endDate}
                                onChange={(date) => setEndDate(date)}
                                format="D MMMM YYYY"
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col span={24} style={{ marginTop: "20px" }}>
                            <TextArea
                                placeholder="Deal Description"
                                value={dealDescription}
                                onChange={(e) => setDealDescription(e.target.value)}
                                rows={3}
                            />
                        </Col>
                    </Row>
                    
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={!startDate || !endDate || !dealDescription}
                        >
                            Submit Deal
                        </Button>
                    </div>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default DealModal;
