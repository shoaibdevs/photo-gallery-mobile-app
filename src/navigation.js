import * as React from 'react'
import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation'
import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import SplashScreen from './screens/SplashScreen'
import Walkthrough from './screens/Walkthrough'
import Signup from './screens/Signup'
import Signin from './screens/Signin'
import FirstAlbum from './screens/firstAlbum'
import Camera from './screens/camera/Camera'
import ChooseImages from './screens/camera/ChooseImages'
import EditImage from './screens/camera/EditImage'
import DrawerView from './DrawerView'
import CreateAlbum from './screens/createAlbum'
import MyAlbums from './screens/myAlbums'
import UseGuide from './screens/firstAlbum/UseGuide'
import ShareContacts from './screens/firstAlbum/ShareContacts'
import UseGuideInfo from './screens/UseGuideInfo'
import PreviewAlbum from './screens/albumPreview/PreviewAlbum'
import TermsAndPrivacy from './screens/TermsAndPrivacy'
import WeHaveNewAlbum from './screens/WeHaveNewAlbum/WeHaveNewAlbum'
import EnlargeAlbumCapacity from './screens/WeHaveNewAlbum/EnlargeAlbumCapacity'
import ContactUs from './screens/contactUs/ContactUs'
import Messages from './screens/messages/Messages'
import OrderInfo from './screens/orders/OrderInfo'
import PaymentInfo from './screens/orders/PaymentInfo'
import DisplayMessage from './screens/messages/DisplayMessage'
import ForgotPassword from './screens/ForgotPassword'
import AlbumSettings from './screens/albumSettings/albumSettings'
import WeHaveFullAlbum from './screens/WeHaveNewAlbum/WeHaveFullAlbum'

const DrawerNavigators = createDrawerNavigator(
  {
    //Drawer Optons and indexing
    Camera: {
      screen: Camera
    },
    MyAlbums:
    {
      screen: MyAlbums
    },
    CreateAlbum: {
      screen: CreateAlbum,
    },
    ShareContacts: {
      screen: ShareContacts
    },
    UseGuideInfo: {
      screen: UseGuideInfo,
    },
    TermsAndPrivacy: {
      screen: TermsAndPrivacy,
    },
    WeHaveNewAlbum: {
      screen: WeHaveNewAlbum,
    },
    ContactUs :{
      screen: ContactUs,
    },

    
  },
  {
    drawerPosition: "right",
    initialRouteName: 'Camera',
    drawerWidth: '85%',
    drawerType: 'push-screen',
    contentComponent: ({ navigation }) => <DrawerView navigation={navigation} />,
  }
);

const AppNavigator = createStackNavigator(
  {
    drawerStack: {
      screen: DrawerNavigators,
      navigationOptions: {
        headerShown: false,
      },
    },
    Messages: {
      screen: Messages,
    },
    DisplayMessage: {
      screen: DisplayMessage,
    },
    ChooseImages: {
      screen: ChooseImages,
    },
    EditImage: {
      screen: EditImage,
    },
    PreviewAlbum: {
      screen: PreviewAlbum,
    },
    AlbumSetting: {
      screen: AlbumSettings
    },
    EnlargeAlbumCapacity: {
      screen: EnlargeAlbumCapacity,
    },
    OrderInfo: {
      screen: OrderInfo
    },
    PaymentInfo: {
      screen: PaymentInfo
    },

    WeHaveFullAlbum: {
      screen: WeHaveFullAlbum
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },

)

const FirstAlbumUser = createStackNavigator(
  {
    FirstAlbum: {
      screen: FirstAlbum,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'FirstAlbum',
  },
)

const LoginStack = createStackNavigator(
  {
    Walkthrough: {
      screen: Walkthrough
    },
    Signin: {
      screen: Signin,
      path: 'Signin'
    },
    Signup: {
      screen: Signup,
    },
    ForgotPassword: {
      screen: ForgotPassword
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
      // headerLeft: null,
    },
    initialRouteName: 'Walkthrough',
  },
);

export default createAppContainer(createSwitchNavigator({
  SplashScreen: SplashScreen,
  LoginScreens: LoginStack,
  FirstAlbumUser: FirstAlbumUser,
  homeStack: AppNavigator,
}, {
  initialRouteName: 'SplashScreen',
})
);