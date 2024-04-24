
export type Headers = {
    results_count: number
}

export type Result = {
    id : string,
    name : string,
    artist_name : string,
    album_name : string,
    position : number, 
    releasedate : string,
    album_image : string,
    audio: string,
    audiodownload_allowed: boolean
}

export type TrackResults= {
    headers : Headers,
    results : Result[],
}

export type ChordString = {
    chordString: string
}

export type Chord ={
    label : string,
    end: number,
    start: number,
}

export type ChordSequence = {
    chordSequence : Chord[],
    confidence: number,
    duration: number
}

export type SongResult = {
    chords : ChordSequence,
    id: string
}

export type TrackResultProps = {
    result: Result,
}

export type ChosenSong ={
    chosenSong :string;
}