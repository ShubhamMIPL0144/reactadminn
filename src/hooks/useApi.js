// useApi.js

import { useState, useEffect } from 'react';
import httpCommon from '../services/http-common';

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await httpCommon.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    fetchData();
    //eslint-disable-next-line
  }, []);

  return { data, loading, error,fetchData,setLoading,setData };
};

export default useApi;
