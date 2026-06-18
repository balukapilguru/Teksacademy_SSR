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
    mapLink: "https://maps.app.goo.gl/rqc7zPPy5uFn718AA",
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
  Kompally: {
    name: "Kompally",
    mapLink: "https://www.google.com/maps/place/Teks+Academy+-+Kompally/@17.5413837,78.4867287,985m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bcb8543ed304b91:0x85fb983df3a2d364!8m2!3d17.5413837!4d78.4867287!16s%2Fg%2F11z51zgrn5!5m1!1e2?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
    address: "Kompally, Hyderabad, Telangana",
  },
};

/**
 * Store branch information in sessionStorage before redirect
 * Should be called from branch page forms before redirecting to /thankyou
 * @param {string} branchName - The name of the branch (e.g., "Ameerpet", "Bangalore", "Kompally")
 */
export const storeBranchData = (branchName) => {
  if (typeof window === "undefined") return; // Server-side guard

  // Format branch name: handle "kompally" -> "Kompally"
  const formattedName = branchName.charAt(0).toUpperCase() + branchName.slice(1);
  
  // Find matching branch data
  let branchData = branchDataMap[formattedName];
  
  // If not found, try to find by case-insensitive match
  if (!branchData) {
    const matchKey = Object.keys(branchDataMap).find(
      key => key.toLowerCase() === branchName.toLowerCase()
    );
    if (matchKey) {
      branchData = branchDataMap[matchKey];
    }
  }
  
  if (branchData) {
    sessionStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branchData));
    console.log("Branch data stored:", branchData);
  } else {
    console.warn("No branch data found for:", branchName);
    // Store basic info as fallback
    sessionStorage.setItem(
      BRANCH_STORAGE_KEY,
      JSON.stringify({
        name: formattedName,
        address: `${formattedName}, Hyderabad`,
        mapLink: "#",
      })
    );
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
    if (data) {
      const parsed = JSON.parse(data);
      console.log("Branch data retrieved:", parsed);
      return parsed;
    }
    return null;
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
    console.log("Branch data cleared from sessionStorage");
  } catch (error) {
    console.error("Error clearing branch data from sessionStorage:", error);
  }
};

/**
 * Check if branch data exists
 * @returns {boolean} True if branch data exists in sessionStorage
 */
export const hasBranchData = () => {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem(BRANCH_STORAGE_KEY);
};