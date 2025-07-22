import { useEffect, useState } from 'react';
import { sumFieldFirebase } from '../utils/firebaseApi'; // You'll need to implement this utility
import { authFirebase } from '../config/firebase';

const useSumField = ({
  collectionName = 'dca_bots',
  fieldToSum = 'tradeAmount', // Default field to sum
  conditions = [],
  dependencies = [],
  authRequired = false
}) => {
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSum = async () => {
      if (authRequired && !authFirebase.currentUser?.email) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const total = await sumFieldFirebase(
          collectionName,
          fieldToSum,
          conditions
        );
        setSum(total || 0);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getSum();

    return () => {
      setSum(0);
      setError(null);
    };
  }, [...dependencies]);

  return { sum, loading, error };
};

export default useSumField;
