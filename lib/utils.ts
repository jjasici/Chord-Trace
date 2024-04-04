import info, { Chord } from '../chords';

export function generatePresetString(preset){
    console.log("preset string being generated");
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
    theory += chord.notes + ". ";
    if (chord.flat) {
        theory += "\n\n" + info.terminology.flat;
    }
    return theory;
}

export function generateSelectedChordsString(chordsSelected) {
    return chordsSelected.map(chord => chord.name).join('-');
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