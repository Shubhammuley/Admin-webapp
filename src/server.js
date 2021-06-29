/* eslint-disable no-useless-return */
import axios from 'axios';

const callApi = async ({
    url,
    method = 'GET',
    data,
    contentType = 'application/json',
    query = {},
    xActiveUserId,
}) => {
    const fullUrl = `http://localhost:8086${url}`;
    const headers = {
      'Content-Type': `${contentType}`,
      "Access-Control-Allow-Origin": "*"
    };
    if (xActiveUserId) {
      headers['x-active-user-id'] = xActiveUserId;
    }
    const returnData = await axios({
      data,
      headers,
      url: `${fullUrl}`,
      method,
      params: query,
    },  { crossdomain: true });
    return returnData.data;
}

export default callApi;