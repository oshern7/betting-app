import fetch from 'node-fetch';

export const BASE_URL = process.env.BASE_API_URL || 'http://localhost:3000';

const getData = url =>
  fetch(BASE_URL + url)
    .then(res => res.json());

const postData = (url, data) =>
  fetch(BASE_URL + url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json());

export const getTracks = () =>
  getData('/records/tracks');

export const getRacesByTrack = (track) =>
  postData('/records/races', { track });

export const getModels = () =>
  getData('/config/models');
