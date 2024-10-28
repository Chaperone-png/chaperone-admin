// src/pages/Customers.tsx
import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext';
import { helpSupportApi } from '../services/apis/helpSupportApi';
import { toast } from 'react-toastify';
import CustomerQueryTable from '../components/CustomerSupport/CustomerQueryTable';
import CustomPageHeader from '../components/PageHeader';

const Customers: React.FC = () => {
  const [allQueries, setAllQueries] = useState([]);
  const [reload, setReload] = useState(false);
  const { startLoader, stopLoader } = useLoader();

  useEffect(() => {
    fetchAllQueries();
  }, [reload]);

  const fetchAllQueries = async () => {
    try {
      startLoader();
      const usersQueriesResponse = await helpSupportApi.getAllUsersQueries();
      if (usersQueriesResponse.data.ok) {
        setAllQueries(usersQueriesResponse.data.userQueries);
        toast.success("Queries fetched successfully");
      }
      else {
        setAllQueries([]);
        toast.error(usersQueriesResponse.data.message);
      }
    }
    catch (err) {
      console.log("got error while fetching the users queries", err);
    }
    finally {
      stopLoader();
    }
  }

  return (
    <div>
      <CustomPageHeader title="Customers" />
      <p>Manage your customers here.</p>
      <CustomerQueryTable
        queries={allQueries}
        setReload={setReload}
      />
    </div>
  );
};

export default Customers;
