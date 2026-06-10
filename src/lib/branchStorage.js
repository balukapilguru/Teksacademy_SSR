/**
 * Utility functions to manage branch data in sessionStorage
 * This allows us to pass branch information without URL query parameters
 */

const BRANCH_STORAGE_KEY = "teks_branch_data";

export const branchDataMap = {
  Ameerpet: {
    name: "Ameerpet",
    mapLink: "https://maps.app.goo.gl/DEJPLcRep2foBWXUA",
    address: "Ameerpet, Hyderabad, Telangana",
  },
  Bangalore: {
    name: "Bangalore",
    mapLink: "https://maps.app.goo.gl/izVbbyxCUguL8HoC8",
    address: "Bangalore, Karnataka",
  },
  Dilsukhnagar: {
    name: "Dilsukhnagar",
    mapLink: "https://maps.app.goo.gl/Qmx1zFRAAQ8xRxq6A",
    address: "Dilsukhnagar, Hyderabad, Telangana",
  },
  "Hitec City": {
    name: "Hitec City",
    mapLink: "https://maps.app.goo.gl/uDTBbgm23Meb4ZYTA",
    address: "Hitec City, Hyderabad, Telangana",
  },
  Kukatpally: {
    name: "Kukatpally",
    mapLink: "https://maps.app.goo.gl/rqc7zPP5y5uFn718AA",
    address: "Kukatpally, Hyderabad, Telangana",
  },
  Mehdipatnam: {
    name: "Mehdipatnam",
    mapLink: "https://maps.app.goo.gl/xsxXrR3icySgjRer6",
    address: "Mehdipatnam, Hyderabad, Telangana",
  },
  Salem: {
    name: "Salem",
    mapLink: "https://maps.app.goo.gl/NtBxRhe4qP3c1LRX8",
    address: "Salem, Tamil Nadu",
  },
  Secunderabad: {
    name: "Secunderabad",
    mapLink: "https://maps.app.goo.gl/NHgBnjTc11wp2WUQ7",
    address: "Secunderabad, Telangana",
  },
  Visakhapatnam: {
    name: "Visakhapatnam",
    mapLink: "https://maps.app.goo.gl/KKTvLKe9hmEgBhtF8",
    address: "Visakhapatnam, Andhra Pradesh",
  },
};

/**
 * Store branch information in sessionStorage before redirect
 * Should be called from branch page forms before redirecting to /thankyou
 * @param {string} branchName - The name of the branch (e.g., "Ameerpet", "Bangalore")
 */
export const storeBranchData = (branchName) => {
  if (typeof window === "undefined") return; // Server-side guard

  const branchData = branchDataMap[branchName];
  if (branchData) {
    sessionStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branchData));
  }
};

/**
 * Retrieve branch information from sessionStorage
 * Should be called on the thankyou page to check if user came from a branch page
 * @returns {Object|null} Branch data object or null if not found
 */
export const getBranchData = () => {
  if (typeof window === "undefined") return null; // Server-side guard

  try {
    const data = sessionStorage.getItem(BRANCH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error retrieving branch data from sessionStorage:", error);
    return null;
  }
};

/**
 * Clear branch information from sessionStorage
 * Should be called on the thankyou page after displaying the map link
 * This prevents the map from showing on direct visits to /thankyou
 */
export const clearBranchData = () => {
  if (typeof window === "undefined") return; // Server-side guard

  try {
    sessionStorage.removeItem(BRANCH_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing branch data from sessionStorage:", error);
  }
};
