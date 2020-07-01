export async function getProtectedData(path) {
  try {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(response.status);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
}
