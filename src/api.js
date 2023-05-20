import { consts } from './consts'

export async function updatePushToken(formData) {
  const url = `${consts.server_url}/pushToken`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't updatePushToken, error: ${err}`);
    return 0;
  }
}

export async function createUser(formData) {
  const url = `${consts.server_url}/user`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't createUser, error: ${err}`);
    return 0;
  }
}

export async function createOrder(formData) {
  console.log(formData);
  const url = `${consts.server_url}/createOrder`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't createOrder, error: ${err}`);
    return 0;
  }
}

export async function login(formData) {
  const url = `${consts.server_url}/login`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't login, error: ${err}`);
    return 0;
  }
}
export async function updateAlbumDate(formData) {
  const url = `https://Picitsimple.com/api/rest/albumByID`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't update album date, error: ${err}`);
    return 0;
  }
}

export async function deleteTempAlbum(id, parent_id, phone_number) {
  console.log("vbc -->",id, parent_id, phone_number);
  const url = `${consts.server_url}/getAlbumsUpdateUsers?id=${id}&parent_id=${parent_id}&phone_number=${phone_number}`;
  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't temp delete album, error: ${err}`);
    return 0;
  }
}
export async function fetchAlbums(token) {
  const url = `${consts.server_url}/getAlbums?token=${token}`;
  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
    });
    let res =  await response.json();
    if(res.success == 1){
      res.data = res.data.filter(album => album.deleted == "false")
    }

    return res
  }
  catch (err) {
    console.log(`can't fetchAlbums, error: ${err}`);
    return 0;
  }
}


export async function validateToken(formData) {
  console.log("formData -->", formData);
  const url = `${consts.server_url}/validateToken`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't validateToken, error: ${err}`);
    return 0;
  }
}

export async function getAlbumById(token, album_id) {
  const url = `${consts.server_url}/getAlbumById?token=${token}&album_id=${album_id}`;
  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't getAlbumById, error: ${err}`);
    return 0;
  }
}

export async function sendAlbumReminder(formData) {
  console.log('form data apicall', formData)
  const url = `${consts.server_url}/sendReminder`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't sendAlbumReminder, error: ${err}`);
    return 0;
  }
}

export async function saveImg(formData) {
  console.log('form data apicall', formData)
  const url = `${consts.server_url}/addPictureToAlbum`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't saveImg, error: ${err}`);
    return 0;
  }
}

export async function checkCupon(formData) {
  console.log('form data apicall', formData)
  const url = `${consts.server_url}/validateCouponCode`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't checkCupon, error: ${err}`);
    return 0;
  }
}


export async function newAlbum(formData) {
  const url = `${consts.server_url}/createAlbum`;
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.json();
  }
  catch (err) {
    console.log(`can't newAlbum API Request, error: ${err}`);
    return 0;
  }
}

export async function deleteAlbumAPI(formData) {
  const url = `${consts.server_url}/deleteAlbum`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't deleteAlbumAPI API Request, error: ${err}`);
    return 0;
  }
}

export async function removePictureFromAlbumApi(formData) {
  const url = `${consts.server_url}/removePictureFromAlbum`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't removePictureFromAlbumApi API Request, error: ${err}`);
    return 0;
  }
}

export async function updateAlbumImageApi(formData) {
  const url = `${consts.server_url}/updateAlbumImage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't updateAlbumImageApi API Request, error: ${err}`)
    return 0
  }
}

export async function updateAlbumApi(formData) {
  const url = `${consts.server_url}/updateAlbum`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't updateAlbumApi API Request, error: ${err}`)
  }
}

export async function contactUsApi(formData) {
  const url = `${consts.server_url}/contactUs`;
  try {
    console.log('url', url)
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't contactUsApi API Request, error: ${err}`)
    return 0
  }
}

export async function sendEmailApi(formData) {
  const url = `${consts.server_url}/forgotPassword`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't sendEmailApi API Request, error: ${err}`)
    return 0
  }
}

export async function getMessagesApi(token) {
  const url = `${consts.server_url}/feed?token=${token}`;
  try {
    const response = await fetch(`${url}`, {
      method: 'GET',
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't getMessagesApi, error: ${err}`);
    return 0;
  }
}

export async function setApprovePhoto(formData) {
  const url = `${consts.server_url}/approvePicture`
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    return await response.json();
  }
  catch (err) {
    console.log(`can't setApprovePhoto, error: ${err}`);
    return 0;
  }
}

export async function editAlbumSettings(formData) {
  const url = `${consts.server_url}/updateSharedToAlbum`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't editAlbumSettings API Request, error: ${err}`)
    return 0
  }
}

export async function updatePictureData(formData) {
  const url = `${consts.server_url}/updatePictureData`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't updatePictureData API Request, error: ${err}`)
    return 0
  }
}

export async function markNotificationAsRead(formData) {
  const url = `${consts.server_url}/markNotificationAsRead`;
  console.log(formData);
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't markNotificationAsRead API Request, error: ${err}`)
    return 0
  }
}
export async function getCounter() {
  const url = `https://Picitsimple.com/api/counters.php`;
  console.log("here");
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't counter API Request, error: ${err}`)
  }
}
export async function getAllSharedImages(token) {
  const url = `${consts.server_url}/getAlbumsByUserId?token=${token}`;
  console.log("here");
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't getAllSharedImages API Request, error: ${err}`)
  }
}

export async function setFullAlbum(formData) {
  const url = `${consts.server_url}/setFullAlbum`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't setFullAlbum API Request, error: ${err}`)
  }
}

export async function setHalfFullAlbum(formData) {
  const url = `${consts.server_url}/setHalfFullAlbum`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`can't setHalfFullAlbum API Request, error: ${err}`)
  }
}