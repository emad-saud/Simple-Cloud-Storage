import axios from "axios";
import { showAlert } from "./alerts";

export const sendFile = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://${location.host}/api/files/upload`,
      data,
    });

    if (res.data.status === "success")
      showAlert("success", "file uploaded successfully!");

    window.location.assign("/");
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
