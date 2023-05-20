import { fetchAlbums,newAlbum,saveImg, deleteAlbumAPI, editAlbumSettings } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPics } from '../redux'
import { useDispatch } from 'react-redux'
import * as RNFS from 'react-native-fs';
import { PermissionsAndroid,Platform } from 'react-native';

let saveAlbumDataInProgress = false;
let saveImageDataInProgress = false;
let editAlbumDataInProgress = false;
let deleteAlbumDataInProgress = false;


  async function NetInfo(){
    const url = `http://www.google.com`;
    // await AsyncStorage.removeItem('saveAlbumData');
    // await AsyncStorage.removeItem('saveImageData');
    // await AsyncStorage.removeItem('editAlbumData');
    // await AsyncStorage.removeItem('deleteAlbumData');

    try {
        const response = await fetch(`${url}`);
        console.log('internet connected')
        return await true;
      }
      catch (err) {     
        console.log('internet not connected')
        return false;
      }

  }

  export async function checkNetInfo(){ 
    const isConnected = await NetInfo();
    try{
      if(isConnected){
        await cacheSyncWithServer();
        await syncFetchAlbumsData();
      }

      return isConnected;
    }
    catch(err){
      console.log(err);
      return isConnected;
    }
  }

  async function cacheSyncWithServer(){
    const rest = await syncAblumData();
    if(!saveAlbumDataInProgress)
      await syncImageData();
    
    if(!saveImageDataInProgress && !saveAlbumDataInProgress)
      await syncEditAblumData();
    
    if(!editAlbumDataInProgress  && !saveImageDataInProgress && !saveAlbumDataInProgress)
      await syncDeleteAblumData();       
    
    // const rest4 = await syncFetchAlbumsData();
    return await rest;    
  }

  async function syncFetchAlbumsData(){
    try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
    
        const response = await fetchAlbums(userInfo.token)
        
        let data = []
        response.data.forEach(album => {
          data.push(album)
          })

          await AsyncStorage.setItem('albumData', JSON.stringify(data));

        return await response.data;
      }
      catch (err) {                 
        return 0;
      }
  }

  async function syncAblumData(){
    const saveAlbumDataString = await AsyncStorage.getItem('saveAlbumData');
    await AsyncStorage.removeItem('saveAlbumData');
    if(saveAlbumDataString != undefined){
      saveAlbumDataInProgress = true;
        const saveAlbumData1 =  JSON.parse(saveAlbumDataString);

        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        for(const saveAlbumData of saveAlbumData1){
          try { 
            const formData = new FormData()
            formData.append('token', userInfo.token)
            formData.append('albume_name', saveAlbumData.formData._parts[1][1])
            formData.append('max_images', saveAlbumData.formData._parts[2][1])
            formData.append('shared_to', saveAlbumData.formData._parts[3][1])
            formData.append('status', saveAlbumData.formData._parts[4][1])
            formData.append('date_created', saveAlbumData.formData._parts[5][1])
            formData.append('deadline', saveAlbumData.formData._parts[6][1])
            formData.append('isImage', saveAlbumData.formData._parts[7][1])
            const response = await newAlbum(formData);
            
            if(response.data != undefined && response.data > 0)
              await updateAlbumIdInCachedImage(response.data, saveAlbumData.albumId);
          }
          catch (err) { 
            console.log('checking  ->> ', err)                
            return 0;
          }
        }
        saveAlbumDataInProgress = false;
    }
  }

  async function syncImageData(){
    const saveImageDataString = await AsyncStorage.getItem('saveImageData');
    await AsyncStorage.removeItem('saveImageData');
    if(saveImageDataString != undefined){
        saveImageDataInProgress = true;
        const saveImageData =  JSON.parse(saveImageDataString);
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        for(const ImageData of saveImageData){
          try { 
            const formData = new FormData()
            formData.append('token', userInfo.token)
            formData.append('album_id', ImageData.formData._parts[1][1])
            formData.append('images[]', ImageData.formData._parts[2][1])
            
            const response = await saveImg(formData);
          }
          catch (err) { 
            return 0;
          }
        }
        saveImageDataInProgress = false;
    }
  }

  async function syncEditAblumData(){
    const editAlbumDataString = await AsyncStorage.getItem('editAlbumData');
    await AsyncStorage.removeItem('editAlbumData');

    if(editAlbumDataString != undefined){
        editAlbumDataInProgress = true;
        const editAlbumData1 =  JSON.parse(editAlbumDataString);
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        for(const editAlbumData of editAlbumData1){
          try {
            const formData = new FormData
              formData.append('token', userInfo.token)
              formData.append('id', editAlbumData.formData.id)
              formData.append('albume_name', editAlbumData.formData.albume_name)
              formData.append('shared_to', editAlbumData.formData.shared_to)  
              const response = await editAlbumSettings(formData);
          }
          catch (err) { 
            console.log('checking  ->> ', err)                
            return 0;
          }
        }
        editAlbumDataInProgress = false;
    }
  }

  async function syncDeleteAblumData(){
    const deleteAlbumDataString = await AsyncStorage.getItem('deleteAlbumData');
    await AsyncStorage.removeItem('deleteAlbumData');
    if(deleteAlbumDataString != undefined){
        const deleteAlbumData1 =  JSON.parse(deleteAlbumDataString);
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        for(const deleteAlbumData of deleteAlbumData1){
          try {
            const formData = new FormData()
            formData.append('token', userInfo.token)
            formData.append('album_id', deleteAlbumData.albumId)
            const response = await deleteAlbumAPI(formData);
          }
          catch (err) { 
            console.log('checking  ->> ', err)                
            return 0;
          }
        };  
    }
  }

  async function updateAlbumIdInCachedImage(albumId, oldAlbumId){
    const saveImageDataString = await AsyncStorage.getItem('saveImageData');
    if(saveImageDataString != undefined){
      const saveImageData =  JSON.parse(saveImageDataString);
      saveImageData.forEach((imageData, i) => {
        let album_New_Ids = [];
        if(isNaN(imageData.formData._parts[1][1])){
          album_New_Ids = imageData.formData._parts[1][1].split(',');
          if(album_New_Ids.includes(oldAlbumId.toString())){
            album_New_Ids.forEach((value, i) => {
              if(value == oldAlbumId)
              album_New_Ids[i] = albumId;
            })
            saveImageData[i].formData._parts[1][1] = album_New_Ids.toString();
          }
        }
        else{
          if(imageData.formData._parts[1][1] == oldAlbumId)
            saveImageData[i].formData._parts[1][1] = albumId;
        }
       
      });
      await AsyncStorage.setItem('saveImageData', JSON.stringify(saveImageData));
    }
  }

  export async function fetchAlbumsData(){
      var isConnected = await checkNetInfo();
      if(isConnected){
          try {
              const userInfoString = await AsyncStorage.getItem('userInfo');
              const userInfo = JSON.parse(userInfoString);
          
              const response = await fetchAlbums(userInfo.token)
              return await response;
            }
            catch (err) {                 
              return -1;
            }
      }
      else{
          const albumDataString = await AsyncStorage.getItem('albumData');
          if(albumDataString != undefined){
              const albumData =  JSON.parse(albumDataString);
              if(albumData.length > 0)
                return await {data: albumData}
          }
            return -1;
      }
  }

  async function getAlbumObject(formData){
    const data = formData._parts;
    const userInfoString = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoString);

    let saveAlbumData = [];
    let albumId = 1;
    const _tempSaveAlbum = await AsyncStorage.getItem('saveAlbumData');
    if(_tempSaveAlbum != undefined)
    {
      saveAlbumData = JSON.parse(_tempSaveAlbum);
      albumId = saveAlbumData.length + 1;
    }
    saveAlbumData.push({albumId:albumId, formData: formData})
    await AsyncStorage.setItem('saveAlbumData', JSON.stringify(saveAlbumData));

  let albumObject =  {
      _owner_id: "1", 
      albume_name: data[1][1],
      belong_to: userInfo.full_name,
      cframe_picture_no: "0",
      created: data[5][1],
      created_by: "System",
      created_by_id: "0",
      current_frame: "0",
      deadline: data[6][1],
      email: userInfo.email,
      first_notification_sentdate: null,
      fourth_notification_sentdate: null,
      half_full_album: "0",
      id: albumId,
      isAlbumLocked: "0", 
      is_album_full: "0",
      max_images: data[2][1],
      phone: userInfo.phone,
      picures: [], 
      remind: "0",
      remind_date: null,
      second_notification_sentdate: null,
      shared_album_id: null,
      shared_by: "0",
      shared_to: data[3][1],
      shared_user_name: "",
      status: data[4][1],
      temp_user_id: null,
      third_notification_sentdate: null,
      updated: "0000-00-00 00:00:00",
      updated_by: "", 
      updated_by_id: "0",
      user_id: userInfo.userId
    }

    return albumObject;

  }  

  async function cacheSaveImageFormData(form){
  }
  
  export async function newAblumData(formData){
    var isConnected = await checkNetInfo();
      if(isConnected){
          try {          
              const response = await newAlbum(formData);
              // await syncFetchAlbumsData();
              return await response.data;
            }
            catch (err) {                 
              return 0;
            }
      }
      else{
          const albumDataString = await AsyncStorage.getItem('albumData');
          if(albumDataString != undefined){
            let albumData =  JSON.parse(albumDataString);
            const albumObject = await getAlbumObject(formData);
            albumData.push(albumObject);
            await AsyncStorage.setItem('albumData', JSON.stringify(albumData));           
            return albumObject.id;
          }
          return 0;
      }
  }

  export async function  saveImgData(formData){
    
    var isConnected = await checkNetInfo();
      if(isConnected){
          try {      
              const response = await saveImg(formData);
              await syncFetchAlbumsData();
              return await response.data;
            }
            catch (err) {                 
              return 0;
            }
      }
      else{
        let newImagePath = `${RNFS.DocumentDirectoryPath}/NewCachedFiles`;

        const pathIsExist = await RNFS.exists(newImagePath);
        if(!pathIsExist){
          await RNFS.mkdir(newImagePath);
        }
        const filePath1 = formData._parts[2][1].uri;
        if (Platform.OS == 'android') {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              const splitted = filePath1.split('/');              
              let FileName = splitted[splitted.length -1];
              newImagePath = newImagePath +"/"+ FileName;
              const copyResult = await RNFS.copyFile(
                filePath1.substring(7),newImagePath)
                newImagePath = 'file://' + newImagePath;

                formData._parts[2][1].uri = newImagePath;
                let album_New_Ids = [];
                if(isNaN(formData._parts[1][1]))
                  album_New_Ids = formData._parts[1][1].split(',');
                else
                  album_New_Ids.push(formData._parts[1][1].toString());
                const albumDataString = await AsyncStorage.getItem('albumData');
                let pictures = [];
                                
                if(albumDataString != undefined){
                    const albumData =  JSON.parse(albumDataString);
                    const userInfoString = await AsyncStorage.getItem('userInfo');
                    const userInfo = JSON.parse(userInfoString);
                    const _tempsaveImage = await AsyncStorage.getItem('saveImageData');
                    let saveImageData = [];
                    let pictureId = 1;
                    albumData.forEach((album, i) => {
                      
                      if(album_New_Ids.includes(album.id.toString())){
                        pictures = album.picures;
                      
                        if(_tempsaveImage != undefined)
                        {
                          saveImageData = JSON.parse(_tempsaveImage);
                          pictureId = saveImageData.length + 1;
                        }

                        const objImage= {
                          _owner_id: formData._parts[0][1],
                          added_by: userInfo.userId,
                          added_by_name: userInfo.full_name, 
                          albumes_id: formData._parts[1][1],
                          frame_number: "2",
                          frame_type: "6",
                          id: pictureId,
                          isApproved: "0",
                          is_s3_uploaded: "0",
                          is_shared: "0",
                          picture: newImagePath
                        }
                        pictures.push(objImage);
                        albumData[i].picures = pictures;

                      }
                    });
                    
                    
                    await AsyncStorage.setItem('albumData', JSON.stringify(albumData));
                    formData._parts[2][1].uri = newImagePath;
                    saveImageData.push({pictureId:pictureId, formData: formData})                
                    await AsyncStorage.setItem('saveImageData', JSON.stringify(saveImageData));
                }

          } else {
              console.log("Photos permission denied")
          }
        }
      }
  }

  export async function deleteAlbumData(id){
    var isConnected = await checkNetInfo();
      if(isConnected){
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
          try {          
            const formData = new FormData()
            formData.append('token', userInfo.token)
            formData.append('album_id', id)
              const response = await deleteAlbumAPI(formData);
              await syncFetchAlbumsData();
              return await response;
            }
            catch (err) { 
              console.log(err);                
              return 0;
            }
      }
      else{

        let updated = false;
        const saveAlbumDataString = await AsyncStorage.getItem('saveAlbumData');
        if(saveAlbumDataString != undefined){
            let saveAlbumData =  JSON.parse(saveAlbumDataString);  
            const obj_temp = saveAlbumData.filter(function(e) {return e.albumId == id })
            saveAlbumData = saveAlbumData.filter(function(e) {return e.albumId !== id })
            await AsyncStorage.setItem('saveAlbumData', JSON.stringify(saveAlbumData));
            if(obj_temp.length > 0)
              updated = true;
          }   

          const editAlbumDataString = await AsyncStorage.getItem('editAlbumData');
          if(editAlbumDataString != undefined){
              let editAlbumData =  JSON.parse(editAlbumDataString); 
              const obj_temp = editAlbumData.filter(function(e) {return e.albumId == id })
              editAlbumData = editAlbumData.filter(function(e) {return e.albumId !== id })
              await AsyncStorage.setItem('editAlbumData', JSON.stringify(editAlbumData));
              if(obj_temp.length > 0)
                updated = true;
            }   
  
        
          if(!updated){
            let deleteAlbumData = [];
            let deleteAlbumId = 1;
            const _tempDeleteAlbum = await AsyncStorage.getItem('deleteAlbumData');
            if(_tempDeleteAlbum != undefined)
            {
              deleteAlbumData = JSON.parse(_tempDeleteAlbum);
              deleteAlbumId = deleteAlbumData.length + 1;
            }
            const obj_New = {deleteAlbumId : deleteAlbumId, albumId: id}
            deleteAlbumData.push(obj_New);
            await AsyncStorage.setItem('deleteAlbumData', JSON.stringify(deleteAlbumData));
          }


          const albumDataString = await AsyncStorage.getItem('albumData');
          if(albumDataString != undefined){
            let albumData =  JSON.parse(albumDataString);
            albumData = albumData.filter(function(e) { return e.id !== id })
            await AsyncStorage.setItem('albumData', JSON.stringify(albumData));

            return {success:1};
          }
          return 0;
      }
  }

  export async function editAlbumSettingsData(data){

    var isConnected = await checkNetInfo();
      if(isConnected){
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
          try {          
              const formData = new FormData
              formData.append('token', userInfo.token)
              formData.append('id', data.id)
              formData.append('albume_name', data.albume_name)
              formData.append('shared_to', data.shared_to)            
              const response = await editAlbumSettings(formData);
              await syncFetchAlbumsData();
              return await response;
            }
            catch (err) { 
              console.log(err);                
              return 0;
            }
      }
      else{
        let updated = false;
        const saveAlbumDataString = await AsyncStorage.getItem('saveAlbumData');
        if(saveAlbumDataString != undefined){
            const saveAlbumData1 =  JSON.parse(saveAlbumDataString);            
            saveAlbumData1.forEach( (saveAlbumData, i) => {
                if(saveAlbumData.albumId == data.id){
                  saveAlbumData1[i].formData._parts[1][1] = data.albume_name
                  saveAlbumData1[i].formData._parts[3][1] = data.shared_to
                  updated = true;
                }
            }); 
            await AsyncStorage.setItem('saveAlbumData', JSON.stringify(saveAlbumData1));
          }   

          if(!updated){
            let editAlbumData = [];
            let editAlbumId = 1;
            const _tempEditAlbum = await AsyncStorage.getItem('editAlbumData');
            if(_tempEditAlbum != undefined)
            {
              editAlbumData = JSON.parse(_tempEditAlbum);
              editAlbumId = editAlbumData.length + 1;
            }
            const obj_New = {editAlbumId : editAlbumId, albumId: data.id, formData: data}
            editAlbumData.push(obj_New);
            await AsyncStorage.setItem('editAlbumData', JSON.stringify(editAlbumData));
          }          

          const albumDataString = await AsyncStorage.getItem('albumData');
          if(albumDataString != undefined){
            let albumData =  JSON.parse(albumDataString);
            
            albumData.forEach( (saveAlbumData, i) => {
              if(saveAlbumData.id == data.id){
                albumData[i].albume_name = data.albume_name
                albumData[i].shared_to = data.shared_to
                updated = true;
              }
          });


            await AsyncStorage.setItem('albumData', JSON.stringify(albumData));

            return {success:1};
          }
          return 0;
      }
  }

  export async function _getPics(){
    const cameraRollPicsString = await AsyncStorage.getItem('picData');
    const cameraRollPics = JSON.parse(cameraRollPicsString);
    let array = cameraRollPics;
    // const result = array.reverse();
    return array;
  }

  export async function _setPics(data){
    await AsyncStorage.setItem('picData', JSON.stringify(data));
  }

  export async function _addPict(data){
    let picData = [];    
    const _tempPics = await AsyncStorage.getItem('picData');
    if(_tempPics != undefined)
    {
      picData = JSON.parse(_tempPics);
    }
    picData.unshift(data);
    await AsyncStorage.setItem('picData', JSON.stringify(picData));
  }