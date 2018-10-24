import fetch from 'node-fetch';

export default (BASE_URL) => {

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

  const postRawData = (url, data) =>
    fetch(BASE_URL + url, {
      method: 'POST',
      body: data
    })
    .then(res => res.json());

   return {
    getTracksByDate: (date) =>
      postData('/records/tracks', { date }),
    getRacesByDateAndTrack: (date, track) =>
      postData('/records/races', { date, track }),
    getModels: () =>
      getData('/config/models'),
    uploadRatings: (content) =>
      postRawData('/config/ratings', content),
    uploadBettingModels: (content) =>
      postRawData('/config/models', content),
    uploadRebates: (content) =>
      postRawData('/config/rebates', content)
   }

}
