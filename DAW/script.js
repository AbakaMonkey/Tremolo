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
var notes = []
var durations = []

let position = 0;

function newNote(notenameString) {
    const newNoteElement = document.createElement('p');
    newNoteElement.innerHTML = notenameString + ", " + selectedDuration;

    document.getElementById("notes").appendChild(newNoteElement);
    position = Number(document.getElementById('position').value);

    notes.push({ step: position, note: notenameString, length: selectedDuration + "n"});
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

window.setNoteName = function(notename) {
    newNote(notename);
}