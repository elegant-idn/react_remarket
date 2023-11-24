import axios from "axios";
export default {
  loadDevices(url) {
    return axios({
      method: "get",
      url,
      progress: function (loaded, total) {
        console.log(loaded, total);
        let divProgress = document.getElementById("progress");
        divProgress.style.width = (loaded / total) * 100 + "%";
      },
    });
  },
  getFilterOptions() {
    return axios.get("/api/reference");
  },

  getModels(url, body) {
    return axios({
      data: body,
      method: "post",
      url,
      progress: function (loaded, total) {
        let divProgress = document.getElementById("progress");
        divProgress.style.width = (loaded / total) * 100 + "%";
      },
    });
  },
  getModelsVerkaufen(deviceId) {
    return axios({
      method: "get",
      url: `/api/devicesModelsForPurchase?modelName=${deviceId}`,
      progress: function (loaded, total) {
        let divProgress = document.getElementById("progress");
        divProgress.style.width = (loaded / total) * 100 + "%";
      },
    });
  },
  getModelsList(id) {
    return axios.get(`/api/modelslist/${id}`);
  },
};
