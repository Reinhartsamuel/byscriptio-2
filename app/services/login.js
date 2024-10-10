import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { authFirebase } from '../config/firebase';
import {
  addDocumentFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
  updateDocumentFirebase,
} from '../utils/firebaseApi';
import { increment } from 'firebase/firestore';
import Swal from 'sweetalert2';
import checkExchangesAutotraders from './checkExchangesAutotraders';

const provider = new GoogleAuthProvider();

export const handleLoginGoogle = async ({ setLoading, router }) => {
  setLoading(true);
  try {
    //GOOGLE LOGIN
    const result = await signInWithPopup(authFirebase, provider);
    // console.log(result, 'result');
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    await checkExchangesAutotraders(user.email, user.uid);

    // FIND USER
    const findUser = await getSingleDocumentFirebase('users', user.uid);
    //   const findUser = await getSingleDocumentFirebase('users', 'RomXA3UVAbMZB55BLWzE42Dh3kz2');
    // console.log(findUser, 'find user');
    if (findUser !== null) {
      await updateDocumentFirebase('users', user.uid, {
        lastLogin: new Date(),
        numberOfLogin: increment(1),
        token,
      });
    } else {
      await setDocumentFirebase('users', user.uid, {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        numberOfLogin: parseInt(1),
        lastLogin: new Date(),
        createdAt: new Date(),
        photoURL: user.photoURL,
        token,
      });
    }

    // FIND CUSTOMER
    const findCustomer = await getCollectionFirebase('customers', [
      { field: 'email', operator: '==', value: user.email },
    ]);
    if (findCustomer?.length === 0) {
      await addDocumentFirebase('customers', {
        name: user.displayName,
        email: user.email,
        phone: '',
        lastLogin: new Date(),
        numberOfLogin: 1,
        createdAt: new Date(),
        uid: user.uid,
        isNewUser: true,
        photoURL: user.photoURL,
        token,
      });
    } else {
      // console.log(findCustomer, 'this is findcustomer')
      await updateDocumentFirebase('customers', findCustomer[0].id, {
        isNewUser: false,
        lastLogin: new Date(),
        numberOfLogin: increment(1),
        token,
      });
    }
    const name = user?.displayName || user?.email?.split('@')[0];
    router.push(`/${name?.toLowerCase()?.split(' ')?.join('-')}`);
    const isNewUser = findUser?.length === 0 && findCustomer?.length === 0;
    try {
      fetch(isNewUser ? '/api/email/login/new-user' : '/api/email/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user?.displayName || user?.email || '',
          email: user?.email,
        }),
      });
    } catch (error) {
      // Swal.fire({
      //     icon: 'error',
      //     title: 'Error fetching email api',
      //     text: error.message,
      //   });
      console.log(error.message, 'error send emailemail');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
  } finally {
    setLoading(false);
  }
};


export const handleLoginEmail = async ({email, password, setLoading, router}) => {
  setLoading(true);
  try {
    //GOOGLE LOGIN
    // const result = await signInWithPopup(authFirebase, provider);
    const result = await signInWithEmailAndPassword(authFirebase, email, password);
    // console.log(result, 'result');
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    await checkExchangesAutotraders(user.email, user.uid);

    // FIND USER
    const findUser = await getSingleDocumentFirebase('users', user.uid);
    //   const findUser = await getSingleDocumentFirebase('users', 'RomXA3UVAbMZB55BLWzE42Dh3kz2');
    // console.log(findUser, 'find user');
    if (findUser !== null) {
      await updateDocumentFirebase('users', user.uid, {
        lastLogin: new Date(),
        numberOfLogin: increment(1),
        token,
      });
    } else {
      await setDocumentFirebase('users', user.uid, {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        numberOfLogin: parseInt(1),
        lastLogin: new Date(),
        createdAt: new Date(),
        photoURL: user.photoURL,
        token,
      });
    }

    // FIND CUSTOMER
    const findCustomer = await getCollectionFirebase('customers', [
      { field: 'email', operator: '==', value: user.email },
    ]);
    if (findCustomer?.length === 0) {
      await addDocumentFirebase('customers', {
        name: user.displayName,
        email: user.email,
        phone: '',
        lastLogin: new Date(),
        numberOfLogin: 1,
        createdAt: new Date(),
        uid: user.uid,
        isNewUser: true,
        photoURL: user.photoURL,
        token,
      });
    } else {
      // console.log(findCustomer, 'this is findcustomer')
      await updateDocumentFirebase('customers', findCustomer[0].id, {
        isNewUser: false,
        lastLogin: new Date(),
        numberOfLogin: increment(1),
        token,
      });
    }
    const name = user?.displayName || user?.email?.split('@')[0];
    router.push(`/${name?.toLowerCase()?.split(' ')?.join('-')}`);
    const isNewUser = findUser?.length === 0 && findCustomer?.length === 0;
    try {
      fetch(isNewUser ? '/api/email/login/new-user' : '/api/email/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user?.displayName || user?.email || '',
          email: user?.email,
        }),
      });
    } catch (error) {
      // Swal.fire({
      //     icon: 'error',
      //     title: 'Error fetching email api',
      //     text: error.message,
      //   });
      console.log(error.message, 'error send emailemail');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
  } finally {
    setLoading(false);
  }
}
