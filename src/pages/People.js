
import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, ScrollView,ActivityIndicator } from "react-native";
import { ListItem, Icon,Overlay,Header,Button } from "react-native-elements";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

type Props = {};

class Home extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      peoples: [],
      isVisible:false,
      selected:null,
      isLoading:false
    };
  }

  componentDidMount() {
    this.loadPeoples();
  }

  loadPeoples() {
    this.setState({isLoading:true});
    fetch("https://swapi.co/api/people/")
      .then(response => response.json())
      .then(peoples => {
        this.setState({isLoading:false});
        this.setState({ peoples: peoples.results });
      })
      .catch(error => {
        this.setState({isLoading:false});
        console.error(error);
      });
  }

  renderRow() {
    const showList = ['name','height','gender','birth_year','hair_color','skin_color','homeworld'];
    return showList.map((item)=>(
      <View style={styles.row} key={item}>
        <Text style={styles.column}>{capitalizeFirstLetter(item)}</Text>
        <Text style={styles.column}/>
        <Text
          onPress={()=>{
            if(item==='homeworld'){
              this.setState({isVisible:!this.state.isVisible});
              this.props.navigation.navigate('Planet',{url:this.state.selected[item]});
            }
          }}
          style={[styles.column,styles.titleStyle,item==='homeworld' ? {fontSize:12,color:'#74b9ff'}:undefined]}>
          {this.state.selected[item]}
        </Text>
      </View>
    ))

  }

  render() {
    return (
      <View style={{flex:1}}>
        <ScrollView contentContainerStyle={{flex:1}}>
          {
            (this.state.peoples.length===0 && this.state.isLoading) &&
            <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large" color="#74b9ff" />
            </View>
          }
          {this.state.peoples.length > 0 &&
            this.state.peoples.map((people, i) => (
              <ListItem
                key={i}
                onPress={()=>this.setState({selected:people,isVisible:true})}
                title={people.name}
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
                subtitle={`Height : ${people.height}`}
              />
            ))}
        </ScrollView>
            <Overlay isVisible={this.state.isVisible} height={350} width="90%" >
              <View style={{flex:1}}>
              <View style={styles.header}>
                <Text style={[styles.headerText]}>
                   Details
                </Text>
              </View>
              <View style={{paddingHorizontal:20,marginBottom:20}}>
              {
                this.state.isVisible && this.renderRow()
              }
              </View>
              <Button
                title="Close"
                type="outline"
                titleStyle={styles.titleStyle}
                onPress={()=>this.setState({isVisible:!this.state.isVisible})}
              />
            </View>
          </Overlay>

      </View>

    );
  }
}

const styles = {
  titleStyle: { fontFamily: "Lato-Regular" },
  subtitleStyle: { fontFamily: "Lato-Light"},
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
  title: "Peoples"
};

export default Home;
