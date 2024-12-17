import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://${location.host}/api/users/login`,
      data: {
        email,
        password,
      },
    });
    console.log(res);
    if (res.data.status === "success") {
      showAlert("success", "Logged In successfully");
      setTimeout(() => {
        window.location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
