//master-data/plant-day-care.tsx
import { Tabs } from "antd";
import "../../../styles/PlantsMasterData.scss";
import CustomPageHeader from "../../PageHeader";
import { useEffect, useState } from "react";
import { useLoader } from "../../../context/LoaderContext";
import { toast } from "react-toastify";
import { plantDayCareApi } from "../../../services/apis/plantDayCareApi";
import DayCareTable from "./DayCareTable";
import { maaliApi } from "../../../services/apis/maaliApi";
const { TabPane } = Tabs;

const PlantDayCareMasterData = () => {
  const [allDayCares, setAllDayCares] = useState([]);
  const [allListedMaalis, setAllListedMaalis] = useState([]);
  const [reload, setReload] = useState(false);
  const { startLoader, stopLoader } = useLoader();
  useEffect(() => {
    fetchAllDayCares();
    fetchAllMaalis();
  }, [reload]);

  const fetchAllDayCares = async () => {
    try {
      startLoader();
      const response = await plantDayCareApi.getAllDayCares();
      if (response.data.ok) {
        setAllDayCares(response.data.dayCares);
        toast.success(response.data.message);
      } else {
        setAllDayCares([]);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("got error while fetching plants", error);
    } finally {
      stopLoader();
    }
  };

  const fetchAllMaalis = async () => {
    try {
      startLoader();
      const response = await maaliApi.getMaalis();
      if (response.data.maalis) {
        setAllListedMaalis(response.data.maalis);
      } else {
        setAllListedMaalis([]);
      }
    } catch (error) {
      console.error("got error while fetching maalis", error);
    } finally {
      stopLoader();
    }
  };

  return (
    <div className="plants-master-data">
      <CustomPageHeader title="Plant Day Care" />
      <DayCareTable
        dayCares={allDayCares}
        allListedMaalis={allListedMaalis}
        setReload={setReload}
      />
    </div>
  );
};

export default PlantDayCareMasterData;
