import axios from 'axios';

const BASE_URL = 'https://api-sample-medhome-1r84.onrender.com/ws/point';

export async function getPoints(token) {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const points = response.data.map(point => ({
      id: point.id,
      title: point.patientName,
      position: {
        lat: point.latitude,
        lng: point.longitude,
      },
    }));

    return points;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pontos');
  }
}

export async function postPoint(token, pointData) {
  try {
    const response = await axios.post(BASE_URL, pointData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Erro ao cadastrar atendimento');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar atendimento');
  }
}