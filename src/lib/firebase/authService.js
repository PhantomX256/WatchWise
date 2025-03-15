import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

export const signUp = async (email, password, fullName) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create a user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      watchlist: [],
      createdAt: new Date().toISOString(),
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || userData.fullName,
      watchlist: userData.watchlist || [],
    };
  } catch (error) {
    if (error.code == "auth/invalid-credential") {
      throw new Error("Invalid email or password");
    }
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out");
  }
};
