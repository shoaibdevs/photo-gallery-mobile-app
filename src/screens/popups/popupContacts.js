import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, PermissionsAndroid, TextInput } from 'react-native';
import Contacts from 'react-native-contacts';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { colors } from '../../colors'
import Button from '../../utilities/button'
import { useSelector, useDispatch } from 'react-redux'
import { setContacts, setPopupContacts, setpopupSharedInvintationSent } from '../../redux'
import Modal from 'react-native-modal';
import PopupSharedInvintationSent from './popupSharedInvintationSent';
import LinearGradient from 'react-native-linear-gradient';
import { openSettings } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function popupContacts(props) {
    const { popupContacts, setSharedTo,album_id, sharedTo, cutNumbers,isSharedAlbum,isOwnerAlbum,ownerPhoneNumber, selfPhone } = props
    const [oldShared , setOldShared] = useState([])
    const { contacts, popupSharedInvintationSent } = useSelector(state => state.user)
    const [validationPopup, setVaidationPopup] = useState(false)
    const [searchStr, setSearchStr] = useState('')
    const [loadedContacts, setloadedContacts] = useState(false)
    const [chosenContact, setChosenContact] = useState(null)
    const [isFocused, setIsFocused] = useState(false)
    const [addContactButton, setAddContactButton] = useState(false)

    

    const dispatch = useDispatch()

    const buttonStyles = {
        backgroundColor: colors.register,
        color: colors.white,
        height: 45,
        fontSize: 12,
        width: 105,
        borderRadius: 19,
        justifyContent: 'center',
        fontFamily: 'Arimo-Bold',
        bottom: 12
    }

    function removePrefix(number, makeConsole=false) {
        if(number){
            let new_num = number
            if(new_num.startsWith("972") || new_num.startsWith(972) ){
                new_num= new_num.substring(3);
            }else{
                if(new_num.startsWith("0") || new_num.startsWith(0)){
                    new_num= new_num.substring(1);
                }else{
                    if(new_num.startsWith("72") || new_num.startsWith(72)){
                        new_num= new_num.substring(2);
                    }
                }
            }
            if(makeConsole){
                console.log(new_num)
            }
            return new_num
        }else{
            return number;
        }
      }
    function removeSharedPrefix(numbers) {
        const modifiedNumbers = numbers.map(number => number.replace(/^(\+|0|972\s?)/, ''));
        return modifiedNumbers;
      }
    async function updateContacts(){
        try{
            let data = await AsyncStorage.getItem('contacts')
            let newUpdateContacts = []
            if(data != null){
                data = JSON.parse(data)
                let i=0;
                let newContact = []

                for(i = 0; i < data.length; i++){
                    newUpdateContacts = newUpdateContacts.filter(val => val.recordID != data[i].recordID)
                    newUpdateContacts = [...newUpdateContacts, data[i]]
                }
                // for(i = 0; i < newContact.length; i++){
                //     newUpdateContacts = newUpdateContacts.filter(val => val.recordID != newContact[i].recordID)
                //     newUpdateContacts.push(newContact[i])
                // }
                const uniqueData = newUpdateContacts.reduce((acc, current) => {
                    if (!acc[current.recordID]) {
                      acc[current.recordID] = current;
                    }
                    return acc;
                  }, {});
                  
                  const result = Object.values(uniqueData);
                setLocalContacts(result)

            }
        }catch(err){
        }

    }
    async function removeItemValue(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
            return false;
        }
    }
    useEffect(async () => {
        // await removeItemValue('contacts')
        Contacts.checkPermission().then(permission => {
            console.log("permission ---<", permission);
        })
        updateContacts()

        if (Platform.OS === 'android') {
            console.log("here");
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts',
                    message: ' This app would like to see your contacts'
                })
            console.log("granted", granted);
            if (granted === 'never_ask_again') {
                openSettings()
            }
            else if (granted != 'denied') {
                Contacts.getAll()
                    .then((contacts) => {

                        dispatch(setContacts(contacts))
                    })
                    .catch((e) => { console.log(e); })
            }

            else { console.log("Denied"); }

        }

        else if (Platform.OS === 'ios') {
            Contacts.getAll()
                .then((contacts) => {
                    dispatch(setContacts(contacts))
                })
                .catch((e) => { console.log(e); })
        }
    }, [])

      
    const [unknownContacts, setUnknownContacts] = useState([]);

    function checkPhoneContact(num, returnName=false){
        let i=0;
        let add = false
        let con_name = num;
        for(i; i < contacts.length; i++){
            try{
                let con_num = formatNumber(contacts[i].phoneNumbers[0]?.number)
                // if(con_name === "9807654321" && con_num.includes("9807654321")){
                //     console.log("Yes it working -->>", con_num)
                //     console.log("part2 ", removePrefix(con_num, true) , removePrefix(num, true))
                // }
                
                if(removePrefix(con_num) === removePrefix(num)){
                    con_name = contacts[i].givenName + ' ' + contacts[i].familyName
                    add = true
                    break;
                }
            }catch{}

        }
        if(returnName){
            if(add){
                return con_name
            }else{
                return num
            }
        }else{
            return add
        }
    }
    function checkLocalContact(num){
        let i=0;
        let add = false
        for(i; i < localContacts.length; i++){
            let con_num = formatNumber(localContacts[i].phoneNumbers[0]?.number)
            if(String(removePrefix(con_num)) === removePrefix(num)){
                
                add = true
                break;
            }
        }
        return add
    }



    function sortAllContacts() {
        let filterSharedContactsFromContacts = []

        Array.prototype.forEach.call(sharedTo, sharedNumber => {
            const index = contacts.findIndex(c => {
                let cutContactsNumber = []
                if (cutNumbers) {
                    cutContactsNumber = c.phoneNumbers.map(n => formatNumber(n.number))
                    return cutContactsNumber.includes(sharedNumber)
                } else {
                    cutContactsNumber = c.phoneNumbers.map(n => n.number)
                    const sharedContactAllNumbers = sharedNumber.phoneNumbers.map(n => n.number)

                    let res = false
                    sharedContactAllNumbers.forEach(contactNumber => {
                        if (cutContactsNumber.includes(contactNumber)) {
                            res = true
                        }
                    })

                    return res
                }
            })

            if (index >= 0 && !filterSharedContactsFromContacts.includes(index)) {
                filterSharedContactsFromContacts = [...filterSharedContactsFromContacts, index]
            }
        });

        filterSharedContactsFromContacts = filterSharedContactsFromContacts.sort((i1, i2) => parseInt(i1) - parseInt(i2))

        let newContacts = [...contacts]

        filterSharedContactsFromContacts = filterSharedContactsFromContacts.reverse().map(contactIndex => {
            const res = newContacts.splice(contactIndex, 1)
            return res[0]
        })

        filterSharedContactsFromContacts = sortContactsByName(filterSharedContactsFromContacts)
        newContacts = sortContactsByName(newContacts)

        const res = [...filterSharedContactsFromContacts, ...newContacts]
        dispatch(setContacts(res))
    }
    const [localContacts, setLocalContacts] = useState([])
    async function addContact(number){
        console.log("addContact")
        const newContact = {
            givenName: number,
            familyName: '',
            recordID:number,
            phoneNumbers: [
              {
                label: 'mobile',
                number: number,
              },
            ],
          };
          
        let con=  localContacts
        try{
            let data = await AsyncStorage.getItem('contacts')
            if(data != null){
                data = JSON.parse(data)
                data.push(newContact)
                await AsyncStorage.setItem('contacts', JSON.stringify(data))
            }else{
                await AsyncStorage.setItem('contacts', JSON.stringify([newContact]))
            }
        }catch(err){console.log("error while saving contact",err)}


        con.unshift(newContact);
        setLocalContacts(con)
        UpdateNewContacts();
        setAddContactButton(false)
          
    }

    function sortContactsByName(contacts) {
        let sortByNames = [...contacts]

        sortByNames = sortByNames.sort((c1, c2) => {
            if (c1.givenName > c2.givenName) return 1
            if (c1.givenName < c2.givenName) return -1
            if (c1.givenName === c2.givenName) {
                if (c1.familyName > c2.familyName) return 1
                if (c1.familyName < c2.familyName) return -1
                if (c1.familyName === c2.familyName) return 0
            }
        })

        return sortByNames
    }
    function convertPhoneNumber(n) {
        return n.replace(/\D/g, "");
      }
    function formatNumber(num) {
        try{
            let formateNumber = num.replace(/[()/+ -]+/g, "")

            if (formateNumber.length > 12) {
                formateNumber = formateNumber.slice(formateNumber.length - 12)
            }

            formateNumber = formateNumber.split('')

            if (formateNumber[0] === '9' && formateNumber[1] === '7' && formateNumber[2] === '2') {
                formateNumber.shift()
                formateNumber.shift()
                formateNumber.shift()
            }
            formateNumber = formateNumber.join('')
            return formateNumber
        }catch{
            return null
        }



    }
    
    async function addToShared(item) {

        if (cutNumbers) {
            let shareToCopy = [...sharedTo]

            for (let i = 0; i < item.phoneNumbers.length; i++) {
                const formatedNum = formatNumber(item.phoneNumbers[i].number)

                if (sharedTo.includes(formatedNum)) {
                    shareToCopy = shareToCopy.filter((contact) => contact !== formatedNum);
                } else {
                    shareToCopy = [...shareToCopy, formatedNum]
                    setVaidationPopup(true)
                    setTimeout(() => {
                        setVaidationPopup(false)
                    }, 700)
                }

                const uniqueArray = shareToCopy.filter(function (item, pos) {
                    return shareToCopy.indexOf(item) == pos;
                })
                setSharedTo(uniqueArray)
            }
        } else {
            if (sharedTo.includes(item)) {
                const newList = sharedTo.filter((contact) => contact !== item);
                setSharedTo(newList)
            }
            else {
                setSharedTo(sharedTo => [...sharedTo, item]);
                setVaidationPopup(true)
                setTimeout(() => {
                    setVaidationPopup(false)
                }, 700)
            }
        }
        console.log(sharedTo)
    }

    const findItemInNumbers = (sharedNumber, item) => {
        try{
            if(item?.length ==0)
            {
                return false;
            }
        }catch{
            return false
        }

        try{
            const numbers = removePrefix(formatNumber(item.phoneNumbers[0]?.number))
            const res = numbers.includes(removePrefix(sharedNumber))
            return res
        }catch{
            return false;
        }

    }

    function resendinvite() {
        setVaidationPopup(true)
        setTimeout(() => {
            setVaidationPopup(false)
        }, 700)
    }

    function handlePress(item) {
        setSearchStr('');
        setChosenContact(item)
        dispatch(setpopupSharedInvintationSent(true))
    }

    function onButtonPress(item) {
        addToShared(item)
    }
    const updateUnknownContact = React.useCallback(num => {
        setUnknownContacts(num);
    }, [setUnknownContacts]);
      

    useEffect(() => {
        if (contacts.length && popupContacts) {
            sortAllContacts()
            const Check = () => {
                // updateNewFormatedContacts([])
                let i=0;
                let newCon = []
                for(i; i < sharedTo.length; i++){
                    let num = sharedTo[i];
                    console.log(num)
                    let isCheck = checkPhoneContact(num)
                    if(!isCheck){
                        let issCheck = checkLocalContact(num)
                        if(!issCheck){
                            newCon.push(
                                {
                                    givenName: num,
                                    familyName: '',
                                    recordID:num,
                                    phoneNumbers: [
                                      {
                                        label: 'mobile',
                                        number: num,
                                      },
                                    ],
                                  }
                            )
                            console.log("updateing contact", num)
                            // updateUnknownContact(num)
                        }
                    }
                    
                }
                console.log("Update unkniw contact, ", newCon)
                updateUnknownContact(newCon)
            }
            if(sharedTo){
                setOldShared(sharedTo)
                if(album_id){
                    Check()
                }
            }else{
                console.log("Shared to failed")
            }
        }
    }, [popupContacts, contacts.length])

    function removedContactFromShared(item){
        if(props.ownerAlbum && selfPhone && findItemInNumbers(selfPhone,item)){
            props.setRemoveOwner(!props.removeOwner)
        }else if(ownerPhoneNumber && findItemInNumbers(ownerPhoneNumber,item)){
            props.setRemoveOwner(!props.removeOwner)
        }else{
            addToShared(item)
        }
    }
  
    useEffect(() => {
        console.log("updatecontact 0",unknownContacts);
      }, [unknownContacts]);
    const renderItem = (renderItem, phone=false) => {
        if(renderItem.length ==0){
            return null
        }
        const isContactShared = props.ownerAlbum && findItemInNumbers(selfPhone ,renderItem)? props.removeOwner :ownerPhoneNumber && findItemInNumbers(ownerPhoneNumber ,renderItem) ? props.removeOwner :sharedTo.length && sharedTo.map(num => {
            let res = null
            if (cutNumbers) {
                if(phone){
                    res = true
                }else{
                    if(findItemInNumbers(ownerPhoneNumber,renderItem)){
                        res = true
                    }else{
                        let new_num = removePrefix(formatNumber(renderItem.phoneNumbers[0]?.number))
                        res = sharedTo.includes(new_num)
                    }
                }
            } else {
                res = sharedTo.map(item => item.recordID).includes(renderItem.recordID)
            }
            if(props.ownerAlbum){
                if(findItemInNumbers(selfPhone ,renderItem)){
                    res = true
                }
            }

            return res
        }).includes(true)

        return (
            <View style={styles.contactItemWrapper}>
                {isContactShared  ? (
                    <TouchableOpacity onPress={() => handlePress(renderItem)} style={styles.contactItem}>
                        <Image style={{ height: 33, width: 34, bottom: 2, left: 40 }} source={require('../../../assets/images/iconsCircleCheckGreen.png')} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={[styles.contactText, { fontFamily: 'Arimo-Regular', fontSize: 17, paddingRight: 10, fontWeight: phone || ownerPhoneNumber == renderItem.recordID && renderItem.givenName == "אני (בעלים)" ? "bold": "normal" }]}> {renderItem.givenName + ' ' +renderItem.familyName }</Text>
                            <Image source={require('../../../assets/images/iconsUser.png')} />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.contactItem}>
                        <Button text="הזמן" buttonStyles={buttonStyles} onPress={() => { console.log('Button press');onButtonPress(renderItem) }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={[styles.contactText, { fontFamily: 'Arimo-Regular', fontSize: 17, paddingRight: 10, fontWeight: phone || ownerPhoneNumber == renderItem.recordID  && renderItem.givenName == "אני (בעלים)"? "bold": "normal" }]}>{renderItem.givenName + ' ' +renderItem.familyName }</Text>
                            <Image source={require('../../../assets/images/iconsUser.png')} />
                        </View>
                    </View>
                )}
            </View>
        )
    }

    const [newFormatedContacts, setNewFormatedContacts] = useState([])
    const updateNewFormatedContacts = React.useCallback(new_contacts => {
        setNewFormatedContacts(new_contacts);
      }, [setNewFormatedContacts]);
    useEffect(() => {
          UpdateNewContacts();
      }, [popupContacts, localContacts, contacts, unknownContacts]);
    const UpdateNewContacts = () => {
        let newArray =[]
        let newContactArray = [...new Set(contacts)]
        let newLocalContactArray = localContacts
        const newArray1 = [...newContactArray];
        const newArray2 = [...newLocalContactArray];

        let knowContacts =[]
        let me =[]
        let owner = []
        if(props.ownerAlbum && !ownerPhoneNumber){
            console.log("hello world fo shared")
            console.log(sharedTo)
            let i=0;
            for(i; i < newContactArray.length; i++){
                let num =formatNumber(newContactArray[i].phoneNumbers[0]?.number)
                if(removeSharedPrefix(sharedTo).includes(num) || String(props.ownerAlbum.phone) == String(num)){
                    if(String(props.ownerAlbum.phone) != String(num)){
                       // console.log("/}{}{}{}{}{}{}{}{}{}{}",String(props.ownerAlbum.phone) , String(num))
                        knowContacts.unshift(newContactArray[i])
                        const index = newContactArray.findIndex(obj => obj.recordID === newContactArray[i].recordID);
                        newArray1.splice(index, 1);
                    }
                }
            }
            let j=0;
            for(j; j < newLocalContactArray.length; j++){
                let num =formatNumber(newLocalContactArray[j].phoneNumbers[0]?.number)
                if(removeSharedPrefix(sharedTo).includes(num) ||String(props.ownerAlbum.phone) == String(num)){
                    if(String(props.ownerAlbum.phone) != String(num)){
                        // console.log("/}{}{}{}{}{}{}{}{}{}{} local",String(props.ownerAlbum.phone) , String(num))
                        if(!checkPhoneContact(num)){
                            knowContacts.unshift(newLocalContactArray[j])
                        }
                        const index = newLocalContactArray.findIndex(obj => obj.recordID === newLocalContactArray[j].recordID);
                        newArray2.splice(index, 1);
                    }
                }
            }
            let new_Array = [...newArray2, ...newArray1]
            me = [
                isOwnerAlbum ? {
                    givenName: "אני",
                    familyName: '',
                    recordID:ownerPhoneNumber,
                    phoneNumbers: [
                    {
                        label: 'mobile',
                        number: ownerPhoneNumber,
                    },
                    ],
                } : props.selfPhone ? {
                    givenName: "אני",
                    familyName: '',
                    recordID:props.selfPhone,
                    phoneNumbers: [
                    {
                        label: 'mobile',
                        number: props.selfPhone,
                    },
                    ],
                }: [] 
            ]

            owner = []
            // console.log(me)
            const filteredData = new_Array.filter((item1) => {
                return !sharedTo.includes(() => {
                  try{
                      return convertPhoneNumber(item1.phoneNumbers[0]?.number)
                  }catch{
                      return false
                  }
                });
            }).filter(item3 => findItemInNumbers(ownerPhoneNumber, item3) == false);
            console.log("know contacts",knowContacts,"  unknown contacts -->", unknownContacts)
            knowContacts = knowContacts.filter(val => findItemInNumbers(props.selfPhone, val) == false);
            let newUnknownContacts = unknownContacts.filter(val => findItemInNumbers(props.selfPhone, val) == false);


            newArray = [...knowContacts,...newUnknownContacts,...me]
            // console.log("newArray", newArray)
        }else{
            if(sharedTo != '' && ownerPhoneNumber){
                console.log("hello world")
                console.log(sharedTo)
                let i=0;
                // newContactArray = newContactArray.filter(val => {String(formatNumber(val.phoneNumbers[0]?.number)) != String(props.selfPhone)})
                // newLocalContactArray = newLocalContactArray.filter(val => String(formatNumber(val.phoneNumbers[0]?.number)) != String(props.selfPhone))

                for(i; i < newContactArray.length; i++){
                    let num =removePrefix(formatNumber(newContactArray[i].phoneNumbers[0]?.number))
                    if(removeSharedPrefix(sharedTo).includes(num)){
                        knowContacts.unshift(newContactArray[i])
                        const index = newContactArray.findIndex(obj => obj.recordID === newContactArray[i].recordID);
                        newArray1.splice(index, 1);
                        // console.log(knowContacts)
                    }
                }
                let j=0;
                for(j; j < newLocalContactArray.length; j++){
                    let num =removePrefix(formatNumber(newLocalContactArray[j].phoneNumbers[0]?.number))
                    if(removeSharedPrefix(sharedTo).includes(num)){
                        console.log("local kljklj",typeof(num), num)
                        if(!checkPhoneContact(num)){
                            newLocalContactArray[j].givenName = checkPhoneContact(num, true)
                            knowContacts.unshift(newLocalContactArray[j])
                        }
                        const index = newLocalContactArray.findIndex(obj => obj.recordID === newLocalContactArray[j].recordID);
                        newArray2.splice(index, 1);
                        // console.log(knowContacts)

                    }
                }
                let new_Array = [...newArray2, ...newArray1]

                if(ownerPhoneNumber){
                    me = [
                        isOwnerAlbum ? {
                            givenName: "אני (בעלים)",
                            familyName: '',
                            recordID:ownerPhoneNumber,
                            phoneNumbers: [
                            {
                                label: 'mobile',
                                number: ownerPhoneNumber,
                            },
                            ],
                        } : props.selfPhone ? {
                            givenName: "אני",
                            familyName: '',
                            recordID:props.selfPhone,
                            phoneNumbers: [
                            {
                                label: 'mobile',
                                number: props.selfPhone,
                            },
                            ],
                        }: [] 
                    ]
                    // let owner = [
                    //     {
                    //         givenName: checkPhoneContact(ownerPhoneNumber),
                    //         familyName: '',
                    //         recordID:ownerPhoneNumber,
                    //         phoneNumbers: [
                    //         {
                    //             label: 'mobile',
                    //             number: ownerPhoneNumber,
                    //         },
                    //         ],
                    //     }
                    // ]
                    const filteredData = new_Array.filter((item1) => {
                      return !sharedTo.includes(() => {
                        try{
                            return convertPhoneNumber(item1.phoneNumbers[0]?.number)
                        }catch{
                            return false
                        }
                      });
                  }).filter(item3 => findItemInNumbers(ownerPhoneNumber, item3) == false);
                    
                  const result = filteredData.filter(item7 => !knowContacts.includes(item7)).filter(item8 => !unknownContacts.includes(item8))
                  
                //   let newKnowContact =[]
                //   for(let x=0; x<knowContacts.length; x++){
                //     let add = false
                //     for(let y=0; y<contacts.length; y++){
                //         if(findItemInNumbers(knowContacts[x].phoneNumbers[0]?.number, contacts[y])){
                //             add = true
                //         }
                //     }
                //     if(!add){
                //         newKnowContact.push(knowContacts[x])
                //     }
                //   }
                  newArray = [...me,...knowContacts,...unknownContacts,  ...result]
                }else{
                    newArray = [...localContacts, ...contacts]

                }
                
                // console.log(newArray)
                  

            }else{
                // console.log("create album")
                newArray = [...newArray2, ...newArray1]

            }
        }

        updateNewFormatedContacts(newArray)
    }
    const MemoizedRenderItem = React.memo(({ item }) => {
        // Your existing renderItem code here
        return renderItem(item);
      });
      const shouldItemUpdate = (prevItem, nextItem) => {
        return prevItem.id !== nextItem.id;
      };
    return (
        <Modal animationOutTiming={500} animationInTiming={500} backdropColor={'black'} isVisible={popupContacts}>
            <View style={styles.modal}>
                <View style={styles.container}>
                    <View style={{ width: '90%', alignItems: 'center', alignSelf: 'center' }}>
                        <Image source={require('../../../assets/images/imgBackgroundCover.png')} />
                        <View style={{ position: 'absolute', top: 50 }}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row-reverse', backgroundColor: colors.white }}>
                                <TouchableOpacity onPress={() => { 
                                    dispatch(setPopupContacts(false)) 
                                    if(props.ownerAlbum){
                                        props.setRemoveOwner(true)
                                    }
                                    if(!props.albumSettings){
                                        setSharedTo([])
                                    }else{
                                        // console.log('old ahared contacts', props.oldShared)
                                        setSharedTo(props.oldShared)
                                    }
                                }} style={{ alignSelf: 'flex-end' }} >
                                    <Image style={{ height: 40, width: 40 }} source={require('../../../assets/images/gobackbutton.png')} />
                                </TouchableOpacity>
                                <Text style={[styles.cardText, { fontSize: 17, alignSelf: 'center' }]}>{'שותפים לאלבום'}</Text>
                                <View style={{ width: 40 }} />
                            </View>
                            <VerticalSpace height={0.03} />
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17, alignSelf: 'flex-end', }]}>{'מי מהחברים יוכל להוסיף תמונות'}</Text>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17, alignSelf: 'flex-end' }]}>{'לאלבום המשותף?'}</Text>
                            <VerticalSpace height={0.03} />
                            <View style={{ width: width * 0.9 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {addContactButton == false&&(
                                        <TouchableOpacity style={styles.addContact}  >
                                        <Image style={{ position: 'absolute', top: 12 }} 
                                                                            
                                        source={require('../../../assets/images/iconsSearch.png')} />
                                        </TouchableOpacity>
                                    )}

                                    {addContactButton == true&&(
                                    <TouchableOpacity
                                        style={styles.addContactButton}
                                        onPress={() => { addContact(searchStr) }} 
                                        activeOpacity={0.5}>
                                        <Image
                                        source={require('../../../assets/images/iconsCirclePlusWhite.png')}
                                        style={{ position: 'absolute', top:4}}
                                        />
                                    </TouchableOpacity>



                                    )}
                                    
                                    <TextInput 
                                        placeholder={'חיפוש איש קשר'}
                                        placeholderTextColor={'rgba(134,128,145,0.5)'}
                                        style={{ height: 60, width: '70%', textAlign: "right", fontFamily: 'Arimo-Bold', fontSize: 20 }}
                                        onChangeText={text => {
                                            setAddContactButton(false)
                                            let check =newFormatedContacts?.filter(contact =>
                                               {
                                                const modifiedSearchStr = searchStr.startsWith('0') || searchStr.startsWith(0) && /^\d/.test(searchStr.slice(1)) ? searchStr.slice(1) : searchStr;
                                                return (contact?.givenName + ' ' + contact?.familyName)?.toLowerCase().includes(modifiedSearchStr.toLowerCase())
                                                || contact?.displayName?.toLowerCase().includes(modifiedSearchStr.toLowerCase())  || findItemInNumbers(modifiedSearchStr, contact)})
                                            if (check.length != 0){
                                                setAddContactButton(false)
                                                setSearchStr(text)
                                            }else{
                                                if(!isNaN(text) && text != '' && text.length == 10){
                                                    // console.log('Contact to be added 2',text)
                                                    setAddContactButton(true)
                                                    setSearchStr(text)
                                                }else{
                                                    setSearchStr(text)
                                                    // console.log("Not a number 2")
                                                    setAddContactButton(false)
                                                }

                                            }
                                        
                                        }}
                                        value={searchStr}
                                        />
                                </View>
                                <View style={[styles.line, { borderColor: isFocused ? colors.whyPicIt : colors.textInputBorder }]} />
                            </View>
                            <View>
                            </View>
                            <VerticalSpace height={0.03} />

                            <FlatList
                                style={{ height: height - 300 }}
                                // ListFooterComponentStyle={{ width: '100%', height: 60}}
                                // ListFooterComponent={<View style={{ height:200}} />}
                                // showsVerticalScrollIndicator={false}
                                ListHeaderComponent={props.selfPhone? renderItem({
                                            givenName: `${checkPhoneContact(props.ownerAlbum.phone, true)} (בעלים)`,
                                            familyName: '',
                                            recordID:props.ownerAlbum.phone,
                                            phoneNumbers: [
                                            {
                                                label: 'mobile',
                                                number: props.ownerAlbum.phone,
                                            },
                                            ],
                                        }, true) :null}
                                data={props.selfPhone ? [...new Set(newFormatedContacts
                                    ?.filter(item => String(findItemInNumbers(props.ownerAlbum.phone, item)) !== true)
                                    .map(item => item.recordID)
                                  )]
                                  .map(recordID => newFormatedContacts.find(item => item.recordID === recordID))?.filter(contact =>
                                    {
                                        const modifiedSearchStr = searchStr.startsWith('0') || searchStr.startsWith(0) && /^\d/.test(searchStr.slice(1)) ? searchStr.slice(1) : searchStr;
                                        return (contact?.givenName + ' ' + contact?.familyName)?.toLowerCase().includes(modifiedSearchStr.toLowerCase())
                                    || contact?.displayName?.toLowerCase().includes(modifiedSearchStr.toLowerCase()) || findItemInNumbers(modifiedSearchStr, contact)
                                }):
                                  
                                  newFormatedContacts?.filter(contact =>
                                    {
                                        const modifiedSearchStr = searchStr.startsWith('0') || searchStr.startsWith(0) && /^\d/.test(searchStr.slice(1)) ? searchStr.slice(1) : searchStr;
                                        return (contact?.givenName + ' ' + contact?.familyName)?.toLowerCase().includes(modifiedSearchStr.toLowerCase())
                                    || contact?.displayName?.toLowerCase().includes(modifiedSearchStr.toLowerCase()) || findItemInNumbers(modifiedSearchStr, contact)
                                })}
                                // renderItem={({ item }) => renderItem(item)}
                                renderItem={({ item }) => <MemoizedRenderItem item={item} />}
                                initialNumToRender={20}
                                shouldItemUpdate={shouldItemUpdate}
                                keyExtractor={(item) => item.recordID * Math.random(0, 999999)}
                            />
                            
                            <View style={{ width: '100%', height: 60, bottom: 0, left: 0, position: 'absolute' }}>
                                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
                                    <TouchableOpacity onPress={() => { dispatch(setPopupContacts(false)) }} style={{
                                        backgroundColor: colors.nextButton,
                                        height: 64,
                                        width: 196,
                                        borderRadius: 26,
                                        justifyContent: 'center',
                                        alignSelf: 'flex-start',
                                        alignItems: 'center',
                                    }} contentContainerStyle={{ paddingBottom: 100 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: colors.black, fontSize: 17, fontFamily: 'Arimo-Bold', paddingRight: 2 }}>{'אישור'}</Text>
                                            <Image source={require('../../../assets/images/iconsCircleCheck.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                        </View>
                    </View>
                </View>


            </View>

            <PopupSharedInvintationSent
                popupSharedInvintationSent={popupSharedInvintationSent}
                item={chosenContact}
                addToShared={addToShared}
                removedContactFromShared={removedContactFromShared}
                resendinvite={resendinvite}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        width: width,
        height: height,
        backgroundColor: 'white',
        alignSelf: 'center',
        overflow: 'hidden',
        borderWidth: 1,
    },
    cardText: {
        fontFamily: 'Arimo-Regular',
        fontSize: 27,
        // fontWeight: 'bold',
        alignSelf: 'center',
        // width:width*0.5, 
        overflow: 'hidden',
        textAlign: 'right'
    },
    contactText: {
        fontFamily: 'Arimo-Regular',
        fontSize: 27,
        overflow: 'hidden',
        textAlign: 'right',
        width: width * 0.45,
        overflow: 'hidden',
        flexWrap: 'nowrap'
    },
    line: {
        borderWidth: 0.5,
        borderColor: colors.textInputBorder,
    },
    modal: {
        width: '100%',
        margin: 0,
        height: height,
        justifyContent: 'flex-end',
        paddingTop: 100
    },
    popView: {
        height: 40,
        width: 206,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(64,64,64,0.5)',
        borderRadius: 17,
        alignSelf: 'center',
        bottom: 50
    },
    popViewText: {
        color: 'white',
        fontSize: 15
    },
    contactItemWrapper: {
        marginVertical: 5
    },
    contactItem: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addContact: {
        flexDirection: 'row',
        width: '5%',
        height:'10%'
    },
    addContactButton: {
        flexDirection: 'row',
        width: '15%',
        height:'70%',
        backgroundColor: colors.register,
        color: colors.white,
        borderRadius: 19,
        justifyContent: 'center',
        fontFamily: 'Arimo-Bold',
    },
});