import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  arrayUnion,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./config";

export const createWatchlist = async (watchlistData) => {
  try {
    // Ensure the current user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to create a watchlist");
    }

    // Validate that title exists
    if (!watchlistData.title || watchlistData.title.trim() === "") {
      throw new Error("Watchlist title is required");
    }

    // Initialize the members array if it doesn't exist
    if (!watchlistData.members) {
      watchlistData.members = [];
    }

    // Add the current user to the members array if they're not already included
    if (!watchlistData.members.includes(currentUser.uid)) {
      watchlistData.members.push(currentUser.uid);
    }

    // Ensure we have an empty movies array if not provided
    if (!watchlistData.movies) {
      watchlistData.movies = [];
    }

    // Add metadata
    const watchlistWithMetadata = {
      ...watchlistData,
      title: watchlistData.title.trim(), // Ensure title is trimmed
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add the document to the 'watchlists' collection
    const docRef = await addDoc(
      collection(db, "watchlists"),
      watchlistWithMetadata
    );

    return {
      id: docRef.id,
      ...watchlistWithMetadata,
    };
  } catch (error) {
    console.error("Error creating watchlist:", error);
    throw error;
  }
};

export const getWatchLists = async () => {
  try {
    // Ensure the current user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to get watchlists");
    }

    // Create a query against the watchlists collection
    // Find documents where the current user's ID is in the members array
    const q = query(
      collection(db, "watchlists"),
      where("members", "array-contains", currentUser.uid)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map the query results to an array of watchlist objects
    const watchlists = [];
    querySnapshot.forEach((doc) => {
      watchlists.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return watchlists;
  } catch (error) {
    console.error("Error getting watchlists:", error);
    throw error;
  }
};

export const getWatchListDetails = async (id) => {
  try {
    // Ensure the current user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to get watchlist details");
    }

    // Get the watchlist document
    const watchlistRef = doc(db, "watchlists", id);
    const watchlistSnapshot = await getDoc(watchlistRef);

    // Check if the watchlist exists
    if (!watchlistSnapshot.exists()) {
      throw new Error("Watchlist not found");
    }

    // Get watchlist data
    const watchlistData = watchlistSnapshot.data();

    // Check if the current user has access to this watchlist
    if (!watchlistData.members.includes(currentUser.uid)) {
      throw new Error("You don't have access to this watchlist");
    }

    // Fetch all member details in parallel
    const memberPromises = watchlistData.members.map(async (memberId) => {
      try {
        const userRef = doc(db, "users", memberId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          return {
            id: memberId,
            name: userData.fullName || "Unknown User",
            email: userData.email || "No email provided",
            photoURL: userData.photoURL || null,
          };
        } else {
          return {
            id: memberId,
            name: "Unknown User",
            email: "User not found",
            photoURL: null,
          };
        }
      } catch (userError) {
        console.error(
          `Error fetching details for user ${memberId}:`,
          userError
        );
        return {
          id: memberId,
          name: "User Info Unavailable",
          email: "Error loading user data",
          photoURL: null,
        };
      }
    });

    // Wait for all member details to be fetched concurrently
    const memberDetails = await Promise.all(memberPromises);

    // Return combined watchlist and member data
    return {
      id,
      ...watchlistData,
      memberDetails,
    };
  } catch (error) {
    console.error("Error getting watchlist details:", error);
    throw error;
  }
};
