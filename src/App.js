import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";
import Home from "./pages/Home";
import Planet from './pages/Planet';
import People from './pages/People';

export default createBottomTabNavigator(
  {
    Planets: createStackNavigator(
      { Home,Planet },
      { navigationOptions: { headerTitleStyle: { fontFamily: "Lato-Light" } } }
    ),
    Peoples: createStackNavigator(
      { People:People },
      { navigationOptions: { headerTitleStyle: { fontFamily: "Lato-Light" } } }
    )
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Peoples") {
          return (
            <Icon
              name="users"
              type="font-awesome"
              size={25}
              color={tintColor}
            />
          );
        }
        return (
          <Icon name="globe" type="font-awesome" size={25} color={tintColor} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#74b9ff",
      inactiveTintColor: "#dcdcdc",
      labelStyle: {
        fontFamily: "Lato-Regular"
      }
    }
  }
);
