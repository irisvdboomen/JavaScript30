// Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
// add fullscreen

// Build our function
// you will either call play or pause
function togglePlay() {
    // below can also be used
    // const method = video.paused ? 'play' : 'pause';
    // video[method]();
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateButton() { // button will be either play/pause now
    const icon = this.paused ? '►' : '❚❚'; // ? means if this is true
    toggle.textContent = icon; // toggle is the toggle button (line 6)
    // console.log('update the button'); 
    console.log(icon); // see what button it is 
    // if you type video.play()/video.pause() in the console, it will also work
}

function skip() {
    // console.log('Skipping');
    console.log(this.dataset.skip); // now when pressing the 25 button, it will log 25 in the console and for the 10 button, it will log -10
    video.currentTime += parseFloat(this.dataset.skip); // this.dataset.skip is a string, so parseFloat will convert it into a true number. Now when clicking the skip buttons, it will actually skip the video (without parseFloat it will not work)
}

function handleRangeUpdate() {
    video[this.name] = this.value;
    // console.log(this.name); // the name (volume, playbackrate)
    // console.log(this.value); the number
}

function handleProgress() { // won't work yet, without the event listener line 54
    // we will update the flex-basis value ).progress__filled
    const percent = (video.currentTime / video.duration) * 100 // * 100 so we don't get 0.5 but 50%
    progressBar.style.flexBasis = `${percent}%`; // change styling progressbar
}

function scrub(e) { 
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; // offsetWidth is the entire width of the bar
    video.currentTime = scrubTime; // now when clicking on the bar, you will see where you are in the progressbar and it will jump to it.
    // console.log(e); // you will see a mouseevent when clicking on the progressbar. If you look at offsetX you will see where you have clicked.
}

// Hook up the event listeners

video.addEventListener('click', togglePlay); // when clicking the video screen, play/pause will toggle
video.addEventListener('play', updateButton); // button will be changed
video.addEventListener('pause', updateButton); // button will be changed
video.addEventListener('timeupdate', handleProgress); // change progressbar every few time
toggle.addEventListener('click', togglePlay); // when clicking the play/pause button, they will toggle
skipButtons.forEach(button => button.addEventListener('click', skip)); // when clicking the skip button, the video will be skipped -10 or +25
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate)); // will change the volume (left) and how fast the video will play(right)
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate)); 
let mousedown = false; // is the mouse being click --> no - false
progress.addEventListener('click', scrub);
// progress.addEventListener('mousemove', () => {
//     if(mousedown) {
//         scrub();
//     }
// });
// use this instead:
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); // when someone moves their mouse, we say mousedown and scrub. it first checks mousedown, if this is true, we check scrub. if it is false, it will return false. ifit is true, it will run scrub and make the progressbar move when clicking and dragging
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);