const words = 'this wonder lovely hate about should why funny coward fine do fantacy village dorm city a simple paragraph that is meant to nice and easy to type which why there will be mommas no periods or any capital letters so guess this means that it cannot really be considered but just series of run on sentences this should help you get faster at typing trying not use too many difficult words although think that might start making'.split(' ');
const greets = [ 'Going great!!', 'Practice makes a man perfect!', ' You are soo awesome!!', 'You got some skills', 'Impresive!!', 'That was superb!', 'that was cool..', 'wanna go another round?', 'High praise indeed!!', 'that was somthing!', 'You are so good at it', 'earned respect!', 'Keep Going!!! You are doing great.'];

const wordLen = words.length - 1;
const cursor = document.querySelector('.cursor');
const gameTimer = 30 * 1000;
window.timer = null;
window.gameStart= null;

function randomWord() {
    let randomInd = Math.round(Math.random() * wordLen);
    return words[randomInd];
}

function formatWord(word) {
    return `<div class='word'><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function addClass(element, name) {
    element.className +=  " " + name;
}

function removeClass(element, name) {
    element.className = element.className.replace(name , "");
}

function getWPM(){
    const typed = document.querySelectorAll('.typed');
    return typed.length * 2;
}

function getAccuracy(){
    const correct = document.querySelectorAll('.correct');
    const incorrect = document.querySelectorAll('.incorrect');
    const extra = document.querySelectorAll('.extra-letter');

    return ((correct.length/ (correct.length + Math.max(incorrect.length+ extra.length, 1))) * 100).toFixed(2);
}

function newGame() {
    window.timer = null;
    document.querySelector(".words").innerHTML = '';
    for(let i = 0; i < 200; i++) {
        document.querySelector('.words').innerHTML += formatWord(randomWord());
    }

    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
}

function gameOver(){
    clearInterval(window.timer);
    addClass(document.querySelector('.game'), 'over');
    cursor.style.display = 'none';
    document.querySelector('.info').innerHTML = `${getWPM()} wpm  ${getAccuracy()}% Accuracy`;
    const random = Math.round(Math.random() * 11) + 1;
    document.querySelector(".gif").src = `gifs/${random}.gif`;
    document.querySelector(".greetText").innerHTML = greets[random]+'';

    document.querySelector('.greet').style.display = 'flex';
}

let extraLetterCount = 0;

//main logic start function when we start typing
document.querySelector(".game").addEventListener('keyup', ev => {
    const key = ev.key;
    const currWord = document.querySelector(".word.current");
    const currLetter = document.querySelector(".letter.current");
    const expected = currLetter ? currLetter.innerHTML : ' ';
    const isLetter = ('abcdefghijklmnopqrstuvwxyz '.includes(key));
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currWord && currLetter === currWord.firstChild;
    const extraLetters = document.querySelectorAll('.current.letter.extra-letter');
    const isExtraLetter = extraLetters[extraLetters.length - 1];

    if(!document.querySelector('.game.over')) cursor.style.display = 'block';
    if(document.querySelector('.game.over')) return;

    //capslock logic
    if(ev.getModifierState('CapsLock')) {
        document.getElementById('capslock').style.display = 'block';
        
    } else {
        document.getElementById('capslock').style.display = 'none';

    }

    //Timer logic
    if(!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if(!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }

            const currTime = (new Date()).getTime();
            const seccondsPassed = Math.round((currTime - window.gameStart) / 1000);

            if(seccondsPassed >= 30) {
                gameOver();
                return;
            }
            
            document.querySelector(".info").innerHTML = 30 - seccondsPassed + ""; 
        }, 1000);
    }

    //main letter checking logic
    if(expected !== ' ' && isLetter) {
        
        //reset the extraletterCount bcoz we are at new word and we are not at the end of the word
        extraLetterCount = 0;
        if(currLetter && isLetter) {

            addClass(currLetter, expected === key ? 'correct' : 'incorrect');
            removeClass(currLetter, 'current');

            if(currLetter.nextSibling) {
                addClass(currLetter.nextSibling, 'current');
            }
        }
        
    } else if(expected === ' ' && key === ' ') {

        //we are at the end of the word, and if we press SpaceBar then we move to the next word
        addClass(currWord, 'typed');
        removeClass(currWord, 'current');
        if(currWord.nextSibling) {
            addClass(currWord.nextSibling, 'current');
            addClass(currWord.nextSibling.firstChild, 'current');
        }

    } else if(expected === ' ' && key !== ' '  && isLetter && extraLetterCount < 20) {

        //we are at the end of the word and we are not pressing space bar, in that case we need to add new letters
        //at the end of the word
        //also we can't append more then 20 letters
        extraLetterCount++;
        const extraLetter = document.createElement('span');
        addClass(extraLetter, 'letter');
        addClass(extraLetter, 'extra-letter');
        extraLetter.innerHTML = key;
        currWord.appendChild(extraLetter);
    }

    //backspace logic
    if(isBackspace){

        if(currLetter && currWord.previousSibling && isFirstLetter) {

            removeClass(currWord, 'current');
            removeClass(currLetter, 'current');
            addClass(currWord.previousSibling, 'current');
            addClass(currWord.previousSibling.lastChild, 'current');
            removeClass(currWord.previousSibling.lastChild, 'incorrect');
            removeClass(currWord.previousSibling.lastChild, 'correct');
            
            
        } else if(currLetter && !isFirstLetter){
            removeClass(currLetter, 'current');
            addClass(currLetter.previousSibling, 'current');
            removeClass(currLetter.previousSibling, 'incorrect');
            removeClass(currLetter.previousSibling, 'correct');
            
        } else if(!currLetter) {
            addClass(currWord.lastChild, 'current');
            removeClass(currWord.lastChild, 'incorrect');
            removeClass(currWord.lastChild, 'correct');
            cursor.style.left = currWord.getBoundingClientRect().right + 'px';
            
        } 
        
        if(isExtraLetter) {
            currWord.removeChild(isExtraLetter);
            cursor.style.left = isExtraLetter.getBoundingClientRect().right + 'px';
        }
        
    } 

    //scrooling of paragraph as we type
    const words = document.querySelector(".words");
    const margin = parseInt(words.style.marginTop || '0px');
    if(currWord.getBoundingClientRect().top > 350) {   
        words.style.marginTop = (margin - 35) + "px";
    }

    //moving the cursor logic
    const nextLetter = document.querySelector('.current.letter');
    const nextWord = document.querySelector('.current.word');
    
    if(nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
        
    } else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';

    }   
    
    //keyboard light 
    if(isLetter || isBackspace) {
        let id = key === ' ' ? 'spacebar' : key+'';
        if(isBackspace) id = 'backspace';
        const keyPressed = document.getElementById(`${id}`);
        setColor(keyPressed, '#FFC300');
        setTimeout(setColor, 100, keyPressed, 'none');
        
    } 
})

function setColor(element, color) {
    element.style.background = `${color}`;
}

newGame();
