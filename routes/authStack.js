import { View, Platform, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/Home";
import Detail from "../screens/Detail";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Entypo from "react-native-vector-icons/Entypo";

const screens = {
  Register: {
    screen: Register,
    navigationOptions: {
      title: null,
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    },
  },
  Login: {
    screen: (props) => (
      <Login
        {...props}
        handleAuthenticated={props.navigation.getParam("handleAuthenticated")}
      />
    ),
    navigationOptions: ({ navigation }) => {
      return {
        title: null,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                marginTop: 16,
                marginLeft: 16,
                backgroundColor: "#A9329D",
                borderRadius: 50,
                padding: 4,
              }}
            >
              <Entypo name="chevron-left" size={26} color="white" />
            </View>
          </TouchableOpacity>
        ),
      };
    },
  },
};

const HomeStack = createStackNavigator(screens);

const AuthNavigator = createAppContainer(HomeStack);

export default AuthNavigator;
