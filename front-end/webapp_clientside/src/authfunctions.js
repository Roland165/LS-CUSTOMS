import axios from 'axios'


// global function max test
export async function isAdmin() {
  try {
    let response = null;
    response = await axios.get("http://localhost:9000/auth/admin");
    if (response.data.user_role === "ADMIN") {
      return { data: true };
    }
    return { data: false };
  } catch (error) {
    console.log(error);
    return { data: false };
  }
}

export async function sendRequest(method, endpoint, params) {
  try {
    let response = null;
    if (method === "post") {
      response = await axios.post("http://localhost:9000/auth/" + endpoint, params);
    }
    else {
      response = await axios.get("http://localhost:9000/auth/" + endpoint);
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateIsAdminBool() {
  let isAdminVar = (await isAdmin());
  console.log("isAdmin: " + isAdminVar.data);
  if (!isAdminVar.data) {
    alert("401 Unauthorized: You are not administrator.")
  }
  return isAdminVar.data;
}

export async function logoutUser() {
  let response = await axios.get("http://localhost:9000/auth/logout");
  return response.data.logoutResult;
}

