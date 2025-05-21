import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const saveUser = async (email, name) => {
  try {
    await setDoc(doc(db, 'users', email), {
      email,
      name,
      createdAt: new Date().toISOString(),
    });
    console.log('User data saved!');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const fetchUser = async (email) => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};