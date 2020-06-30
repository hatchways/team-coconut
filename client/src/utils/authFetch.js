export async function registerUser(newUserData) {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });
    if (!response.ok) throw new Error(response.status);
    const json = await response.json();
    console.log(json);

    // Redirect to login page
    window.location = "/login";
  } catch (error) {
    console.error(error);
  }
}

export async function loginUser(loginData) {
  try {
    const response = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) throw new Error(response.status);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}
