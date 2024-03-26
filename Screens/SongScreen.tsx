import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useRoute} from "@react-navigation/native";
import * as React from 'react';
import {useState, useEffect} from "react";
import {Audio } from 'expo-av';
import {Slider, HStack, Center} from 'native-base';

type ChosenSong ={
  chosenSong :string;
}

type ChordArray = {
    chordArray: object[];
}


export default function SongScreen({navigation}){
    const route =useRoute();
    const params=route.params as ChosenSong;
    const params1 =route.params as ChordArray;
    const songChosen =params.chosenSong;
    const chordArray = params1.chordArray;


    const [isLoading, setLoading]=useState(true);
    const [error, setError]=useState();
    const sound = React.useRef(new Audio.Sound);
    const [songLength, setSongLength] = useState(0);
    const [songPos, setSongPos] = useState(0);
    const [Waveform, setWaveform] = useState([]);
    const[status, setStatus]=useState(false);
    const [data, setData] = useState();
    const [currentChord, setCurrentChord]= useState();
    const [totalChords, setTotalChords] = useState([]);
    const [chordMenuIndex, setChordMenuIndex] = useState(0);

    useEffect(()=>{
        getAudio();
    },[]);

    useEffect(()=>{
        const interval = setInterval(()=>{
            getPosition();
        },1000);

        return () => clearInterval(interval);
    })

    const getPosition = async()=>{
        try{
            const song = await sound.current.getStatusAsync();
            if(song.isLoaded && song.isPlaying==true){
                setSongPos(song.positionMillis);
                chordArray.forEach((item)=>{
                    if((item.start<song.positionMillis/1000)&&(item.end>=song.positionMillis/1000)){
                        setCurrentChord(item.label);
                    }
                })
            }
            else{
                return;
            }
        }
        catch (error){
            console.log(error.message);
        }
    }


    const getAudio = async()=>{
        await fetch("https://api.jamendo.com/v3.0/tracks/?client_id=5ee07b07&format=jsonpretty&id="+songChosen)
        .then(res=>res.json())
        .then(
            (result)=>{
                if (!result.results[0].audiodownload_allowed){
                    console.log("Not allowed to download audio");
                    return;
                }
                console.log("chord array found: " + chordArray);
                console.log(result);
                getTotalChords();
                setData(result);
                getPeaks(result);
                loadSong(result);
            },
            (error)=>{
                setLoading(false);
                setError(error);
                return;
            });
    }

    function getTotalChords(){
        let chords =[];
        chordArray.forEach((item)=>{
            if(!chords.includes(item.label)){
                chords.push(item.label);
            }
        })
        setTotalChords(chords);
        console.log("This is the total chords: " + chords);
    }


    const loadSong = async(data)=>{
         if (data==null){
            console.log("Api data not loaded");
         }
         if (data!=null){
            console.log("Api data found");
            try{
                const song = await sound.current.loadAsync({uri: data.results[0].audio}, {}, true);
               if(!song.isLoaded){
                    console.log("Song did not load");
                } else{
                    console.log("Song loaded");
                    console.log(song);
                    setSongLength(song.durationMillis);
                    setLoading(false);
                    //sound.current.setOnAudioSampleReceived((audio)=>console.log("Object ", audio));
                }
            }
            catch (error){
                console.log(error.message);
            }
         }
    }

    function getPeaks (data){
        console.log(data.results[0].waveform);
        const peaksStringArray = data.results[0].waveform.split(",");
        console.log(peaksStringArray[2]);
        var peaksIntArray=[];
        let j=0;
        for (let i=1;i<peaksStringArray.length; i+=15){
            peaksIntArray[j]= parseInt(peaksStringArray[i]);
            j++;
        }
        setWaveform(peaksIntArray);
        console.log(peaksIntArray);
        console.log("peaks array length: " + peaksIntArray.length);
    } 

    const playPauseSong = async()=>{
        try{
            const song = await sound.current.getStatusAsync();
            if(song.isLoaded && !song.isPlaying &&(song.positionMillis!=song.durationMillis)){
                console.log(song.positionMillis);
                sound.current.playAsync();
                setStatus(true);
                setSongPos(song.positionMillis);
            
            }
            else if(song.isLoaded && song.isPlaying &&(song.positionMillis!=song.durationMillis)){
                console.log(song.positionMillis);
                sound.current.pauseAsync();
                setStatus(false);
                setSongPos(song.positionMillis);
            }
            else{
                console.log("Song not loaded");
            }
        }
        catch (error){
            console.log(error.message);
        }
    }

    const skipSong=async()=>{
        try{
            const song = await sound.current.getStatusAsync();
            if(song.isLoaded){
                sound.current.setPositionAsync(song.durationMillis);
                sound.current.pauseAsync();
                setStatus(false);
                setSongPos(song.durationMillis);
            }
            else{
                console.log("Song not loaded");
            }
        }
        catch (error){
            console.log(error.message);
        }
    }

    const restartSong=async()=>{
        try{
            const song = await sound.current.getStatusAsync();
            if(song.isLoaded && song.isPlaying){
                sound.current.replayAsync();
                setStatus(true);
                setSongPos(0);
            }
            else if(song.isLoaded && !song.isPlaying){
                sound.current.setPositionAsync(0);
                setStatus(false);
                setSongPos(0);
            }
            else{
                console.log("Song not loaded");
            }
        }
        catch (error){
            console.log(error.message);
        }
    }

    const changeTrackPosition = async(pos)=>{
        try{
            const song = await sound.current.getStatusAsync();
            if(song.isLoaded && song.isPlaying){
                setSongPos(pos);
                sound.current.playFromPositionAsync(pos);
            }
            else if(song.isLoaded && !song.isPlaying){
                setSongPos(pos);
                sound.current.setPositionAsync(pos);
                console.log(song.positionMillis);
            }
            else{
                console.log("Song not loaded buddy boy");
            }
        }
        catch (error){
            console.log(error.message);
        }
    }

    let res=[];
    function getWaves(){
        if(Waveform!=null){
            Waveform.forEach((wave, i)=>{
                res.push(<View key={i} style={[styles.waveLine, {height:(wave/Math.max(...Waveform))*50}]}></View>)
            })
        }
        else{
            return null;
        }
    }


    const player=()=>{
        return <View>
            <View>
                <StatusBar style="auto"/>
                <View style={styles.container}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>{data.results[0].name}</Text>
                        <Text>By {data.results[0].artist_name} </Text>
                    </View>
                    <HStack space={.5}>
                        <View>
                          <View style={styles.info}>
                              <Text style={styles.songInfoTitle}>Song Information:</Text>
                          </View>
                          <View style={styles.info}>
                              <Text style={styles.infoText}>{data.results[0].name} was release in {data.results[0].releasedate} by {data.results[0].artist_name}. This is track number {data.results[0].position} on the album {data.results[0].album_name}.</Text>
                          </View>
                        </View>
                        <View>
                          <Image
                              style={styles.albImg}
                              source={{
                              uri:data.results[0].album_image
                              }}
                          />
                        </View>
                    </HStack>
                    <Text style={styles.totalChordsTitle}>Total Chords:</Text>
                    <HStack space={1.5} marginTop={3} justifyContent="center">
                        {chordMenuIndex!=0?
                            <Pressable style={styles.button} onPress={()=>{setChordMenuIndex(chordMenuIndex-3)}}>
                                <Text>Prev</Text>
                            </Pressable>
                        :null}
                        {totalChords?
                            <HStack space={1.5} justifyContent="center">
                                {
                                    totalChords.slice(chordMenuIndex, chordMenuIndex+3).map((chord, i)=>(
                                        <View style={styles.chordArea} key={i}>
                                            <Text>{chord}</Text>
                                        </View>
                                    ))
                                }
                            </HStack>
                        :null}
                        {(totalChords.length-chordMenuIndex)>3?
                            <Pressable style={styles.button} onPress={()=>{setChordMenuIndex(chordMenuIndex+3)}}>
                                <Text>Next</Text>
                            </Pressable>
                        :null}
                    </HStack>
                    <HStack style={{alignItems: 'center'}} space={1.5} marginTop={3}>
                        <Text>Chord Playing: </Text>
                        {currentChord!=null?
                        <View style={styles.chordArea}>
                            <Text>{currentChord}</Text>
                        </View>
                        :
                        <View style={styles.chordArea}>
                            <Text>None</Text>
                        </View>}
                    </HStack>
                </View>
            </View>
            <View style={styles.PlayerContainer}>
            <Slider style={styles.selfUpdatingSlider} width={325} value={songPos} minValue={0} maxValue={songLength} >
                <Slider.Track >
                    <Slider.FilledTrack bg='grey' />
                </Slider.Track >
            </Slider>
            <View style={styles.wave}>
                {getWaves()}
                {res}
            </View>
                <Slider style={styles.draggingSlider} width={325} defaultValue={0} minValue={0} maxValue={songLength} onChangeEnd={pos=>{
                    changeTrackPosition(pos);
                }}>
                    <Slider.Track bg="transparent">
                        <Slider.FilledTrack bg='grey'/>
                    </Slider.Track >
                    <Slider.Thumb bg="transparent" />
                </Slider>
                <HStack style={styles.player} space={3} justifyContent="center" margin={5}>
                    <Pressable style={styles.imgArea} onPress={()=>{restartSong()}}>
                        <Image style={styles.skipReplayImg} source={require('../Img/Replay.png')}/>
                    </Pressable>
                    <Pressable  onPress={()=>{playPauseSong();}}>
                        {!status? <Image style={styles.img} source={require('../Img/Play.png')}/>
                        : <Image style={styles.img} source={require('../Img/Pause.png')}/>}
                    </Pressable>
                    <Pressable style={styles.imgArea} onPress={()=>{skipSong()}}>
                        <Image style={styles.skipReplayImg} source={require('../Img/Skip.png')}/>
                    </Pressable>
                </HStack>
            </View>
        </View>
    }

    const Loading=()=>{
        if (isLoading){
          return <Text>Loading...</Text>;
        }
        if (error){
          return <Text>{error}</Text>;
        }
        if (sound!=null&&data!=null){
            return player();
        }
    };

    return (
        <View style={styles.container}>
          {Loading()}
          <StatusBar style="auto" />
        </View>
    );

}

const styles = StyleSheet.create({
    PlayerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    wave:{
        flexDirection: 'row',
        gap: 3,
        width: 325,
        alignItems: 'center',
        bottom:0
    },
    waveLine:{
        flex:1,
        width: 0,
        backgroundColor: 'grey',
    },
    img:{
        padding:1,
        width:50,
        height: 50,
    },
    skipReplayImg:{
        padding:1,
        width:40,
        height: 40,
    },
    imgArea:{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    player:{
        borderRadius: 10,
        backgroundColor: 'lightgray',
        padding: 10,
        width: 350
    },
    selfUpdatingSlider:{
        marginBottom:-37
    },
    draggingSlider:{
        marginTop:-37
    },
    songContainer: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleBox:{
      backgroundColor: 'lightgray',
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      borderRadius: 10,
      width:365,
      margin: 5
    },
    title:{
      fontSize: 20,
      fontWeight: 'bold'
    },
    info:{
      backgroundColor: 'lightgray',
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      borderRadius: 10,
      margin: 5,
      width:175,
    },
    infoText:{
      fontSize:15
    },
    songInfoTitle:{
      fontSize:18,
      fontWeight: 'bold'
    },
    albImg:{
      padding:1,
      width:175,
      height:175,
      borderRadius: 10,
      margin: 5,
    },
    button:{
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignContent:'center',
        padding:10,
        borderRadius: 10,
        width: 65,
        height: 50,
        alignItems: 'center'
    },
    chordArea:{
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignContent:'center',
        padding:10,
        borderRadius: 10,
        width: 70,
        height: 50,
        alignItems: 'center'
    },
    totalChordsTitle:{
        justifyContent:'flex-start',
        alignItems:'flex-start',
        alignContent:'flex-start',
        marginTop:5,
    }
  });
  