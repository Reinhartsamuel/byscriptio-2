import { useEffect, useState } from 'react';
import { countDocumentsFirebase } from '../utils/firebaseApi';
import { authFirebase } from '../config/firebase';

const useCountDocuments = ({
  collectionName = 'customers',
  conditions = [],
  dependencies = [],
  authRequired = true
}) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCount = async () => {
      if (authRequired && !authFirebase.currentUser?.email) {
        return;
      }
      setLoading(true);
      try {
        const response = await countDocumentsFirebase(
          collectionName,
          conditions
        );
        setCount(response || 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getCount();

    return () => setCount(0);
  }, [...dependencies]);

  return { count, loading };
};

export default useCountDocuments;
