import Axios from "axios";

export const proxyService = {
  get,
  post,
  put,
  getJSON,
  deleteAPI,
  multipleDeleteAPI,
};

async function getJSON(
  url,
  params = null,
  headers = null,
  responseType = null,
) {
  const options = buildOptions(headers, params);
  if (responseType) {
    options["responseType"] = responseType;
  }
  return Axios.get(url, options);
}

async function get(url, params = null, headers = null, responseType = null) {
  try {
    const options = buildOptions(headers, params);
    if (responseType) {
      options["responseType"] = responseType;
    }
    return Axios.get(process.env.LGSP_URL + url, options).catch((error) => {
      // console.log("error", error);
    });
  } catch (error) {}
}
async function post(
  url,
  data,
  headers = null,
  params = null,
  responseType = null,
) {
  const options = buildOptions(headers, params);
  if (responseType) {
    options["responseType"] = responseType;
  }
  return Axios.post(process.env.LGSP_URL + url, data, options);
}
async function put(url, data, headers = null, params = null) {
  const options = buildOptions(headers, params);
  return Axios.put(process.env.LGSP_URL + url, data, options);
}

async function deleteAPI(url, headers = null, params = null) {
  const options = buildOptions(headers, params);
  return Axios.delete(process.env.LGSP_URL + url, options);
}

async function multipleDeleteAPI(url, data, params, headers = null) {
  const options = buildOptions(headers, null);
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      url += `?${params}=${data[i]}`;
    } else {
      url += `&${params}=${data[i]}`;
    }
  }
  return Axios.delete(process.env.LGSP_URL + url, options);
}

function buildOptions(headers, params) {
  const options = {
    // headers: headers
    //   ? headers
    //   : { "Content-Type": "application/json; charset=utf8", platform: "web" },
  };
  if (headers) {
    options.headers = headers;
  }

  if (params) {
    options.params = params;
  }

  return options;
}

export default proxyService;
