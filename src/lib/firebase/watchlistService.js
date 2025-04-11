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

export const addMovieToWatchlist = async (movieId, watchlistId) => {
  try {
    // Ensure the current user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to update watchlist");
    }

    // Get the watchlist document
    const watchlistRef = doc(db, "watchlists", watchlistId);
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

    // Check if the movie is already in the watchlist
    if (
      watchlistData.movies &&
      watchlistData.movies.includes(movieId.toString())
    ) {
      throw new Error("This movie is already in the watchlist");
    }

    // Add the movie to the watchlist
    await updateDoc(watchlistRef, {
      movies: arrayUnion(movieId.toString()),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Movie added to watchlist successfully",
    };
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    throw error;
  }
};

export const addMemberToWatchlist = async (userId, watchlistId) => {
  try {
    // Ensure the current user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to update watchlist");
    }

    // Get the watchlist document
    const watchlistRef = doc(db, "watchlists", watchlistId);
    const watchlistSnapshot = await getDoc(watchlistRef);

    // Check if the watchlist exists
    if (!watchlistSnapshot.exists()) {
      throw new Error("Watchlist not found");
    }

    // Get watchlist data
    const watchlistData = watchlistSnapshot.data();

    // Check if the current user has access to this watchlist
    // Only allow modifications if user is a member
    if (!watchlistData.members.includes(currentUser.uid)) {
      throw new Error("You don't have access to this watchlist");
    }

    // Check if the user is already a member of the watchlist
    if (watchlistData.members.includes(userId)) {
      throw new Error("This user is already a member of the watchlist");
    }

    // Check if the user exists in the users collection
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    // Verify the user exists before adding them
    if (!userSnapshot.exists()) {
      throw new Error(
        "User not found. Cannot add non-existent user to watchlist"
      );
    }

    // Add the user to the members array
    await updateDoc(watchlistRef, {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });

    // Get the user data to return with the response
    const userData = userSnapshot.data();

    return {
      success: true,
      message: "Member added to watchlist successfully",
      member: {
        id: userId,
        name: userData.fullName || "Unknown User",
        email: userData.email || "No email provided",
        photoURL: userData.photoURL || null,
      },
    };
  } catch (error) {
    console.error("Error adding member to watchlist:", error);
    throw error;
  }
};
