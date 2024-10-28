import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { maaliApi } from '../../services/apis/maaliApi';
import CreateMaaliForm from './CreateMaaliForm';

const EditMaali = () => {
    const [maali, setMaali] = useState(null);
    const { maaliId } = useParams();
    const fetchMaaliDetails = useCallback(async()=>{
        if(maaliId){
            const response = await maaliApi.getMaali(maaliId)
            console.log(response, 'Respnse')
            setMaali(response?.data?.data)
        }
    },[])
    useEffect(()=>{
        fetchMaaliDetails()
    },[maaliId])
  return (
    <div>
        <CreateMaaliForm maali={maali}/>
    </div>
  )
}

export default EditMaali