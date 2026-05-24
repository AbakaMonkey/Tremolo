const synth = new Tone.Synth({
    oscillator: {
        type: "sine"
    },
    envelope: {
        attack: 0.02,
        decay: 0.75,
        sustain: 0.2,
        release: 0.1
    }
}).toDestination();

var selectedDuration = "4";
var selectedAccidental = "";
var notes = [];

let position = 0;
let positionIndex = 0;

function newNote(notenameString) {

    let selectedOctave = document.getElementById('octave').value;

    position = Number(document.getElementById('position').value);

    let finalNoteString = notenameString + selectedAccidental + String(selectedOctave);

    const newNoteElement = document.createElement('p');
    newNoteElement.innerHTML = finalNoteString + ", " + selectedDuration;
    document.getElementById("notes").appendChild(newNoteElement);

    notes.push({ step: position, note: finalNoteString, length: selectedDuration + "n"});
    document.getElementById('position').value = DurationToStep(selectedDuration) + position;

}

function DurationToStep(duration) {
    if (duration == "16") {
        return 1;
    } else if (duration == "8") {
        return 2;
    } else if (duration == "4") {
        return 4;
    } else if (duration == "2") {
        return 8;
    } else if (duration == "1") {
        return 16;
    }
}

function stepToTransport(step) {

    const bars = Math.floor(step / 16);

    const beat = Math.floor((step % 16) / 4);

    const sixteenth = step % 4;

    return `${bars}:${beat}:${sixteenth}`;
}

window.play = async function() {

    await Tone.start();

    Tone.Transport.stop();
    Tone.Transport.cancel();

    const partData = notes.map(n => ({
        time: stepToTransport(n.step),
        note: n.note,
        duration: n.length
    }));

    const synthTrack = new Tone.Part((time, value) => {

        synth.triggerAttackRelease(
            value.note,
            value.duration,
            time
        );

    }, partData);

    synthTrack.start(0);

    Tone.Transport.start()
}

window.changeDur = function(duration) {
    selectedDuration = duration;
}

window.changeAccidental = function(accidental) {
    selectedAccidental = accidental;
}

window.setNoteName = function(notename) {
    newNote(notename);
}

document.getElementById('position').addEventListener("keydown", function(event) {
    switch(event.key) {
        case "ArrowLeft":
            if (positionIndex > 0) {
                positionIndex -= 1;
                position = notes[positionIndex].step;
                document.getElementById('position').value = position;
            }
            break;
        case "ArrowRight":
            if (positionIndex < notes.length) {
                positionIndex += 1;
                position = notes[positionIndex].step;
                document.getElementById('position').value = position;
            }
            break;
    }
})