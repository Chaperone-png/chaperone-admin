import { Input, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import BookingTable from "../components/maali-bookings/BookingsTable";
import { maaliBookingApi } from "../services/apis/maaliBookingApi";
import CustomPageHeader from "../components/PageHeader";
import { useParams } from "react-router-dom";

const { Option } = Select;

const MaaliBookings: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("all");
  const fetchBookings = async (
    page: number = 1,
    pageSize: number = 10,
    searchQuery: string = "",
    statusQuery: string = "",
    currentTab?: string
  ) => {
    try {
      setIsLoading(true);
      const response = await maaliBookingApi.getMaaliBookings(
        page,
        pageSize,
        searchQuery,
        statusQuery,
        currentTab
      );
      console.log(response);
      if (response.data) {
        setBookings(response.data);
        setCurrentPage(response.currentPage);
        setTotalBookings(response.total);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage, pageSize, searchQuery, statusFilter, currentTab);
  }, [currentTab, searchQuery]);

  useEffect(() => {
    if (type) {
      setCurrentTab(type);
    }
  }, [type]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    fetchBookings(page, pageSize || pageSize, searchQuery, statusFilter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchBookings(1, pageSize, value, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    fetchBookings(1, pageSize, searchQuery, value);
  };

  return (
    <div>
      <CustomPageHeader title="Bookings" />
      <Input.Search
        placeholder="Search by user ID, plan type, etc."
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Select
        placeholder="Filter by status"
        style={{ width: 200, marginBottom: 16 }}
        onChange={handleStatusFilterChange}
        value={statusFilter}
      >
        <Option value="">All Status</Option>
        <Option value="pending">Pending</Option>
        <Option value="completed">Completed</Option>
        <Option value="cancelled">Cancelled</Option>
        <Option value="rescheduled">Rescheduled</Option>
      </Select>
      {isLoading ? (
        <Spin />
      ) : (
        <BookingTable
          data={bookings}
          onShowDetails={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalBookings,
            onChange: handlePageChange,
          }}
          loading={isLoading}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
      )}
    </div>
  );
};

export default MaaliBookings;
