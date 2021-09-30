const getToken = async (token) => {
  try {
    const response = await fetch(
      "https://api-hyperclova.navercorp.com/v1/auth/token?existingToken=true",
      tokenOptions(token)
    );
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log("error", error);
  }
};

const tokenOptions = (token) => {
  const param = {
    method: "GET",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  };
  return param;
};

export { getToken };
