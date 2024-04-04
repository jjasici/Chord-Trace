import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useRoute} from "@react-navigation/native";
import * as React from 'react';
import {useState, useEffect} from "react";
import {Audio } from 'expo-av';
import {Slider, HStack, Center} from 'native-base';
import * as utils from '../lib/utils';
import * as types from '../lib/types';


export default function SongScreen({navigation}){
    const route =useRoute();
    const params=route.params as types.ChosenSong;
    const params1 =route.params as types.ChordSequence;
    const songChosen =params.chosenSong;
    const chordArray = params1.chordSequence;


    const [isLoading, setLoading]=useState(true);
    const [error, setError]=useState();
    const sound = React.useRef(new Audio.Sound);
    const [songLength, setSongLength] = useState(0);
    const [songPosition, setSongPosition] = useState(0);
    const [Waveform, setWaveform] = useState([]);
    const[status, setStatus]=useState(false);
    const [track, setTrack] = useState<types.TrackResults>();
    const [currentChord, setCurrentChord]= useState<string>();
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
                setSongPosition(song.positionMillis);
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
                if(result.headers.results_count==0){
                    console.log("Song not found");
                    setLoading(false);
                    return;
                }
                if (!result.results[0].audiodownload_allowed){
                    console.log("Not allowed to download audio");
                    setLoading(false);
                    return;
                }
                console.log("chord array found: " + chordArray);
                console.log(result);
                setTotalChords(utils.getTotalChords(chordArray));
                setTrack(result as types.TrackResults);
                setWaveform(utils.getPeaks(result));
                loadSong(result);
            },
            (error)=>{
                setLoading(false);
                setError(error);
                return;
            });
    }

    const loadSong = async(track)=>{
         if (track==null){
            console.log("Api track not loaded");
         }
         if (track!=null){
            console.log("Api track found");
            try{
                const song = await sound.current.loadAsync({uri: track.results[0].audio}, {}, true);
               if(!song.isLoaded){
                    console.log("Song did not load");
                } else{
                    console.log("Song loaded");
                    console.log(song);
                    setSongLength(song.durationMillis);
                    setLoading(false);
                }
            }
            catch (error){
                console.log(error.message);
            }
         }
    }

     

    const playPauseSong = async()=>{
        try{
            const song = await sound.current.getStatusAsync();
            if(song.isLoaded && !song.isPlaying &&(song.positionMillis!=song.durationMillis)){
                console.log(song.positionMillis);
                sound.current.playAsync();
                setStatus(true);
                setSongPosition(song.positionMillis);
            
            }
            else if(song.isLoaded && song.isPlaying &&(song.positionMillis!=song.durationMillis)){
                console.log(song.positionMillis);
                sound.current.pauseAsync();
                setStatus(false);
                setSongPosition(song.positionMillis);
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
                setSongPosition(song.durationMillis);
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
                setSongPosition(0);
            }
            else if(song.isLoaded && !song.isPlaying){
                sound.current.setPositionAsync(0);
                setStatus(false);
                setSongPosition(0);
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
                setSongPosition(pos);
                sound.current.playFromPositionAsync(pos);
            }
            else if(song.isLoaded && !song.isPlaying){
                setSongPosition(pos);
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

    const player=()=>{
        return <View style={styles.container}>
            <StatusBar style="auto"/>
            <View>
                <View style={styles.songInfoArea}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>{track.results[0].name} By {track.results[0].artist_name}</Text>
                    </View>
                    <HStack space={.5}>
                        <View>
                        <View style={styles.info}>
                            <Text style={styles.infoText}>{track.results[0].name} was release in {track.results[0].releasedate} by {track.results[0].artist_name}. This is track number {track.results[0].position} on the album {track.results[0].album_name}.</Text>
                        </View>
                        </View>
                        <View>
                        <Image
                            style={styles.albImg}
                            source={{
                            uri:track.results[0].album_image
                            }}
                        />
                        </View>
                    </HStack>
                </View>
                <Text style={styles.totalChordsTitle}>Total Chords:</Text>
                <HStack space={1.5} marginTop={3} justifyContent="center">
                    {chordMenuIndex!=0?
                        <Pressable onPress={()=>{setChordMenuIndex(chordMenuIndex-3)}}>
                            <Image style={styles.backForwardImg} source={require('../Img/Back.png')}/>
                        </Pressable>
                    :<View style={{width:50}}/>}
                    {totalChords?
                        <HStack space={1.5} justifyContent="center">
                            {
                                totalChords.slice(chordMenuIndex, chordMenuIndex+3).map((chord, i)=>(
                                    <View style={styles.chordArea} key={i}>
                                        <Text style={{color:'white'}}>{chord}</Text>
                                    </View>
                                ))
                            }
                        </HStack>
                    :null}
                    {(totalChords.length-chordMenuIndex)>3?
                        <Pressable onPress={()=>{setChordMenuIndex(chordMenuIndex+3)}}>
                            <Image style={styles.backForwardImg} source={require('../Img/Forward.png')}/>
                        </Pressable>
                    :<View style={{width:50}}/>}
                </HStack>
                <View style={styles.theoryArea}>
                    <HStack style={{alignItems: 'center'}} space={1.5} marginTop={10}>
                        <Text style={{fontWeight:'bold'}}>Chord Playing: </Text>
                        <View style={styles.chordArea}>
                            {currentChord!=null? <Text style={{color:'white'}}>{currentChord}</Text> :<Text style={{color:'white'}}>None</Text>}
                        </View>
                    </HStack>
                </View>
            </View>
            <View style={styles.PlayerContainer}>
                <Slider style={styles.selfUpdatingSlider} width={325} value={songPosition} minValue={0} maxValue={songLength} >
                    <Slider.Track >
                        <Slider.FilledTrack bg='rgb(18,18,18)' />
                    </Slider.Track >
                </Slider>
                <View style={styles.wave}>
                    {Waveform?
                        Waveform.map((wave, i)=>(
                            <View key={i} style={[styles.waveLine, {height:(wave/Math.max(...Waveform))*50}]}/>
                        ))
                    :null}
                </View>
                <Slider style={styles.draggingSlider} width={325} defaultValue={0} minValue={0} maxValue={songLength} onChangeEnd={pos=>{
                    changeTrackPosition(pos);
                }}>
                    <Slider.Track bg="transparent">
                        <Slider.FilledTrack bg='rgb(18,18,18)'/>
                    </Slider.Track >
                    <Slider.Thumb bg="transparent" />
                </Slider>
                <HStack space={3} justifyContent="center" margin={5} style={{marginBottom:-3}}>
                    <Pressable style={styles.imgArea} onPress={()=>{restartSong()}}>
                        <Image style={styles.skipReplayImg} source={require('../Img/ReplayWhite.png')}/>
                    </Pressable>
                    <Pressable  onPress={()=>{playPauseSong();}}>
                        {!status? <Image style={styles.pausePlayImage} source={require('../Img/PlayWhite.png')}/>
                        : <Image style={styles.pausePlayImage} source={require('../Img/PauseWhite.png')}/>}
                    </Pressable>
                    <Pressable style={styles.imgArea} onPress={()=>{skipSong()}}>
                        <Image style={styles.skipReplayImg} source={require('../Img/SkipWhite.png')}/>
                    </Pressable>
                </HStack>
            </View>
        </View>
    }

    const Loading=()=>{
        if (isLoading){
          return <Text>Loading...</Text>;
        }
        else if (error){
          return <Text>{error}</Text>;
        }
        else if (sound!=null&&track!=null){
            return player();
        }
        else{
            return <Text>Song cannot be found</Text>
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
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 10,
        backgroundColor: 'rgb(18, 18, 18)',
        padding: 17,
        marginTop:45,
        margin: 10
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
        backgroundColor: 'white',
    },
    pausePlayImage:{
        padding:1,
        width:40,
        height: 40,
        marginLeft:10,
        marginRight:10
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
    selfUpdatingSlider:{
        marginBottom:-37,
        position: 'relative',
        zIndex:2
    },
    draggingSlider:{
        marginTop:-37,
        position: 'relative',
        zIndex:1
    },
    songContainer: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBox:{
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      width:340,
      margin: 5
    },
    title:{
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white'
    },
    info:{
      padding:5,
      justifyContent:'flex-start',
      alignItems:'flex-start',
      margin: 5,
      width:175,
    },
    infoText:{
      fontSize:15,
      color: 'white'
    },
    songInfoTitle:{
      fontSize:18,
      fontWeight: 'bold'
    },
    albImg:{
      padding:1,
      width:160,
      height:160,
      borderRadius: 10,
      margin: 5,
    },
    chordArea:{
        backgroundColor: 'gray',
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
        marginLeft:20,
        fontWeight:'bold'
    },
    backForwardImg:{
        padding:1,
        width:50,
        height: 50,
    },
    songInfoArea:{
        backgroundColor: 'rgb(18, 18, 18)',
        borderRadius:10,
        margin: 10,
        padding: 2
    },
    theoryArea:{
        justifyContent:'flex-start',
        alignItems:'flex-start',
        alignContent:'flex-start',
        marginLeft:20
    }
  });
  