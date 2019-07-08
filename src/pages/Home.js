
import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView,ActivityIndicator } from "react-native";
import { ListItem, Icon,Overlay,Header,Button } from "react-native-elements";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



class Home extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      planets: [],
      isLoading:false
    };
  }

  componentDidMount() {
    this.loadPlanets();
  }

  loadPlanets() {
    this.setState({isLoading:true});
    fetch("https://swapi.co/api/planets/")
      .then(response => response.json())
      .then(planets => {
        this.setState({isLoading:false});
        this.setState({ planets: planets.results });
      })
      .catch(error => {
        this.setState({isLoading:false});
        console.error(error);
      });
  }

  
  render() {
    return (
      <View style={{flex:1}}>
        <ScrollView contentContainerStyle={{flex:1}}>
          {
            (this.state.planets.length===0 && this.state.isLoading) &&
            <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large" color="#74b9ff" />
            </View>
          }
          {this.state.planets.length > 0 &&
            this.state.planets.map((planet, i) => (
              <ListItem
                key={i}
                onPress={()=>this.props.navigation.navigate('Planet',{url:planet.url})}
                title={planet.name}
                titleStyle={styles.titleStyle}
                subtitleStyle={styles.subtitleStyle}
                rightIcon={<Icon name="chevron-right" color="#74b9ff" />}
                leftIcon={
                  <View style={styles.round}>
                    <Icon
                      name="globe"
                      type="font-awesome"
                      size={25}
                      color="#74b9ff"
                    />
                  </View>
                }
                containerStyle={styles.listContainer}
                subtitle={`Population : ${planet.population}`}
              />
            ))}
        </ScrollView>
      </View>

    );
  }
}

const styles = {
  titleStyle: { fontFamily: "Lato-Regular" },
  subtitleStyle: { fontFamily: "Lato-Light" },
  round: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: "#dcdcdc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  listContainer: { borderBottomWidth: 1, borderColor: "#f5f5f5" },
  header:{
    backgroundColor:"#74b9ff",
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  headerText:{fontSize:20,color:'white',fontFamily: "Lato-Light"},
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10
  },
  column:{
    fontFamily: "Lato-Light",
    fontSize:16,
    textAlign:'left',
  }
};
Home.navigationOptions = {
  title: "Planet"
};

export default Home;
