export async function getProtectedData(path) {
  try {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        sessionStorage.removeItem("user");
      } else {
        const { errors } = await response.json();
        return errors;
      }
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}
