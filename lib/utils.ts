import info, { Chord } from '../chords';
import * as types from './types';

export function getTotalPresets(){
  let totalPresets =[];
    info.presets.forEach((preset)=>{
      totalPresets.push(preset.key)
    }) 
    return totalPresets;
}

export function generatePresetString(preset){
    let theory ="";
    info.presets.forEach((item)=>{
      if(item.key==preset){
        theory+=info.terminology[item.type];
      }
    });
    return theory;
}

export function generateTheoryString(chord: Chord, presetSelected) {
    let theory = "";
    if(presetSelected){
      theory+="\n";
    }
    theory += info.terminology[chord.type];
    theory += chord.notes + ".";
    if (chord.flat) {
        theory += "\n\n" + info.terminology.flat;
    }
    return theory;
}

export function generateSelectedChordsString(chordsSelected : Chord[]) {
    return chordsSelected.map(chord => chord.name).join('-');
}

export function generateIDString(songs : types.SongResult[]){
    return songs.map((song=>song.id.split(":")[1])).join('+');
}

export function getChordSequence(songs: types.SongResult[], id: string){
  return songs.find((song)=>song.id.split(":")[1]==id).chords.chordSequence;
}

export function getPeaks (track){
  const peaksStringArray = track.results[0].waveform.split(",");
  var peaksIntArray=[];
  for (let i=0;i<peaksStringArray.length; i+=15){
      if (i==0){
          peaksIntArray.push(parseInt(peaksStringArray[0].split("[")[1]))
      }
      else if (i==peaksIntArray.length-1){
          peaksIntArray.push(parseInt(peaksStringArray[i].split("]")[0]))
      }
      else{
          peaksIntArray.push(parseInt(peaksStringArray[i]));
      }
  }
  return peaksIntArray;
}

export function getTotalChords(chordArray){
  let chords =[];
  chordArray.forEach((item)=>{
      if(!chords.includes(item.label)){
          chords.push(item.label);
      }
  })
  return chords;
}

export const loadTrack = async(sound, track : types.TrackResults)=>{
  try{
      const song = await sound.current.loadAsync({uri: track.results[0].audio}, {}, true);
     if(!song.isLoaded){
          console.log("Song did not load");
          return null;
      } else{
          console.log("Song loaded");
          return song;
      }
  }
  catch (error){
      console.log(error.message);
      return null;
  }
}

export const getSongStatus = async(sound)=>{
    try{
        const song = await sound.current.getStatusAsync();
        return song;
    }
    catch (error){
      console.log(error.message);
    }
}