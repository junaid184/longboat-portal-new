import axios from 'axios';

export async function fetchApi({ method, endPoint, params, data, token, isFormData = false }) {
    const headers = {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        'authorization': token ? `Bearer ${token}` : '',
    };

    const config = {
        method,
        url: `${process.env.NEXT_PUBLIC_BaseURL}/api/${endPoint}`,
        headers,
        params,
        data: data ? data : {},
    };

    try {
        const response = await axios(config);
        return [response.data, null];
    } catch (error) {
        console.log('error: ', error);
        return [null, error];
    }
}