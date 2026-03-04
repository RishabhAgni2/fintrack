import { useEffect, useState } from "react";
import API from "../api/axios";

const usePortfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await API.get("/portfolio/summary");
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return { data, loading, error, refresh: fetchPortfolio };
};

export default usePortfolio;