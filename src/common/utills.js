// Function to fetch user data
export const fetchData = async (page) => {
  try {
    const response = await fetch(`https://randomuser.me/api?page=${page}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error fetching data:", err.message);
  }
};
