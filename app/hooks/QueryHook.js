'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { authFirebase, db } from '../config/firebase';
import { getCollectionFirebase } from '../utils/firebaseApi';

const useFetchData = ({
  type = 'getDocs',
  limitQuery = 5,
  collectionName = 'webhooks',
  conditions = [],
  dependencies = [],
  authRequired = true
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState({});


  
  const fetchData = async () => {
    if (authRequired && !authFirebase.currentUser?.email) {
      // console.log('auth required and no user');
      // console.log(authFirebase.currentUser?.email,'authFirebase.currentUser?.email');
      return;
    }
    setLoading(true);
    // console.log('fetching...',conditions, 'this is conditions');
    try {
      const response = await getCollectionFirebase(
        collectionName,
        conditions,
        { field: 'createdAt', direction: 'desc' },
        limitQuery
      );
      setData(response);
      // console.log(response, 'response');
      setHasMore(response.length === limitQuery);
      setLastVisible(response[response.length - 1]);
    } catch (error) {
      setError(error);
      // console.log(error.message);
      // Swal.fire({
      //   title: 'error',
      //   text: error.message,
      //   icon: 'error',
      // });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let unsubscribe = () => {};
    if (type === 'getDocs') {
      // console.log('type is getDocs');
      fetchData();
    } else if (type === 'onSnapshot') {
      // console.log('type is onSnapshot');
      const q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc'),
        limit(limitQuery)
      );
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arr = [];
        querySnapshot.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setData(arr);
      });
      return () => unsubscribe();
    }
  }, [...dependencies]);

  const loadMore = async () => {
    if (hasMore) {
      try {
        const res = await getCollectionFirebase(
          collectionName,
          [],
          { field: 'createdAt', direction: 'desc' },
          5,
          lastVisible.createdAt
        );
        const newData = [...data, ...res];
        setData(newData);
        setLastVisible(newData[newData.length - 1]);
      } catch (error) {
        Swal.fire({
          title: 'error',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  return { data, loading, error, loadMore, fetchData };
};

export default useFetchData;
