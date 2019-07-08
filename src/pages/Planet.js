import React, { PureComponent } from "react";
import { Platform, StyleSheet, Text, View, ScrollView,ActivityIndicator,TouchableOpacity,Image } from "react-native";
import { ListItem, Icon,Overlay,Header,Button,Avatar } from "react-native-elements";
import { RNCamera } from 'react-native-camera';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'center',
      width:'100%'
    }}
  >
    <Text>Waiting</Text>
  </View>
);

type Props = {};

class Home extends PureComponent {
  constructor(props: Props) {
    super(props);
    this.state = {
      planet:null,
      films:[],
      showCamera:false,
      image:null
    }
  }

 
  componentDidMount() {
    this.loadPlanet(this.props.navigation.getParam('url'));
  }


  renderRow() {
    const showList = ['name','population','diameter','climate','gravity'];
    return showList.map((item)=>(
      <View style={styles.row} key={item}>

        <Text style={[styles.column,styles.titleStyle]}>{capitalizeFirstLetter(item)}</Text>
        <Text style={styles.column}/>
        <Text
          style={[styles.column]}>
          {this.state.planet[item]}
        </Text>
      </View>
    ))

  }

  loadPlanet(url) {
    this.setState({isLoading:true});
    fetch(url)
      .then(response => response.json())
      .then(planet => {
        this.setState({
          isLoading:false,
          planet
        })
        this.loadFilms();
      })
      .catch(error => {
        this.setState({isLoading:false});
        console.error(error);
      });
  }


  takePicture = async() => {
      if (this.camera) {
        const options = { quality: 0.5,base64:true };
        const data = await this.camera.takePictureAsync(options);
        this.setState({image:data.uri,showCamera:false});
      }
    };

  loadFilms(){
    if(this.state.planet!==null){
      const { planet } = this.state;
      planet.films.forEach((item)=>{
        fetch(item)
          .then(response => response.json())
          .then(film => {
            this.setState(previousState => ({
                films: [...previousState.films, film.title]
            }));
          })
          .catch(error => {
            console.error(error);
          });
      })

    }

  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        {
          ((this.state.planet===null && this.state.isLoading) && !this.state.showCamera) &&
          <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator size="large" color="#74b9ff" />
          </View>
        }
        {
          (this.state.planet!==null && !this.state.showCamera) &&
          <View style={{paddingHorizontal:10}}>
          {this.renderRow()}
          <View style={{alignItems:'center',marginTop:20}}>
            <Text style={[styles.titleStyle,{fontSize:18,color:'#74b9ff'}]}>Films</Text>
            {
              this.state.films.map((item)=>(
                <Text key={item} style={[styles.subtitleStyle,{fontSize:16,marginTop:5}]}>{item}</Text>
              ))
            }

          </View>
          <Button
            title="Camera"
            type="outline"
            titleStyle={styles.titleStyle}
             onPress={()=>this.setState({showCamera:true})}
          />
        {
          this.state.image !== null &&
          <Image
            source={{uri:this.state.image}}
            style={{alignSelf:'center',width:100,height:100}}
          />
        }

          </View>

        }

      {   this.state.showCamera && <RNCamera
        ref={ref => {
            this.camera = ref;
          }}
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                <Text style={{ fontSize: 14,color:'white' }}> SNAP </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>}
      </View>

    );
  }
}

const styles = {
  titleStyle: { fontFamily: "Lato-Regular" },
  subtitleStyle: { fontFamily: "Lato-Light",
  fontSize:18 },
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
  },
  preview: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
},
};
Home.navigationOptions = {
  title: "Planet"
};

export default Home;
