let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown); // run first, to 'reset' the previously selected timer

    const now = Date.now();
    const then = now + seconds * 1000; // now is ms
    displayTimeLeft(seconds); // run it immediately once
    displayEndTime(then); // don't put it in your interval, because it just needs to run once
    countdown = setInterval(() => { // with setInterval, the timer will now run. the setInterval will not run immediately
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it
        if(secondsLeft < 0) {
            clearInterval(countdown);
            return; // will stop showing, but will keep running
        }
        // display it
        displayTimeLeft(secondsLeft); // run it again every single time
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60); // floor will grab the lower bound of the minutes
    // const hours = Math.floor(minutes / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`; // before and after the last $ don't put a space, because then when having the seconds, there will be a space inbetween
    document.title = display;
    timerDisplay.textContent = display;
    console.log({minutes, remainderSeconds});
}

function displayEndTime(timestamp) { // to show what time it will be
    const end = new Date(timestamp); // timestamp: when typing in console Date.now() you will see a lot of number --> ms. Then type new Date() with the ms, to convert it back to date and time
    const hour = end.getHours();
    // const adjustedHour = hour > 12 ? hour - 12 : hour;
    const minutes = end.getMinutes();
    endTime.textContent =`Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`; // make sure to put ${minutes} behind to make it work
    // endTime.textContent =`Be back at ${hour > 12 ? hour - 12 : hour}:${minutes}`; -- AM/PM
}

function startTimer() {
    // console.log(this.dataset.time); // will give us a string of the number of minutes (5 mins = 300 seconds)
    const seconds = parseInt(this.dataset.time); // turn it into a real number. will turn the string into a integer
    // console.log(seconds);
    timer(seconds); // now timer will run when clicking the button
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value;
    console.log(mins);
    timer(mins * 60); // without * 60, the input will be seconds. so 5 would be 5 secs instead of mins
    this.reset(); // to clear out the value
})

function resetTimer(){
    location.reload(); 
} 
// getDay will show the day of the week