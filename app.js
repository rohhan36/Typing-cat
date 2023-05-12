const words = 'this is a simple paragraph that is meant to be nice and easy to type which is why there will be mommas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it although i think that i might start making it'.split(' ');
const wordLen = words.length - 1;


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

function newGame() {
    document.querySelector(".words").innerHTML = '';
    for(let i = 0; i < 200; i++) {
        //console.log(randomInd);
        document.querySelector('.words').innerHTML += formatWord(randomWord());
    }

    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
}

let wrongLetterCount = 0;

document.querySelector(".game").addEventListener('keyup', ev => {
    const key = ev.key;
    const currWord = document.querySelector(".word.current");
    const currLetter = document.querySelector(".letter.current");
    const cursor = document.querySelector('.cursor');
    
    const expected = currLetter ? currLetter.innerHTML : ' ';
    
    const isLetter = (key.length === 1);
    
    console.log({key, expected});
    if(expected !== ' ') {
        
        //reset the wrongletterCount bcoz we are at new word and we are not at the end of the word
        wrongLetterCount = 0;
        if(currLetter && isLetter) {

            addClass(currLetter, expected === key ? 'correct' : 'incorrect');
            removeClass(currLetter, 'current');

            if(currLetter.nextSibling) {
                addClass(currLetter.nextSibling, 'current');
            }
        
        }

    } else if(expected === ' ' && key === ' ') {

        //we are at the end of the word, and if we press SpaceBar then we move to the next word
        removeClass(currWord, 'current');
        if(currWord.nextSibling) {
            addClass(currWord.nextSibling, 'current');
            addClass(currWord.nextSibling.firstChild, 'current');
        }

    } else if(expected === ' ' && key !== ' '  && isLetter && wrongLetterCount < 20) {

        //we are at thr end of the word and we are not pressing space bar, in that case we need to add new letters
        //at the end of the  
        wrongLetterCount++;
        const wrongLetter = document.createElement('span');
        addClass(wrongLetter, 'letter');
        addClass(wrongLetter, 'wrong-letter');
        wrongLetter.innerHTML = key;
        currWord.lastChild.appendChild(wrongLetter);
        console.log(currLetter);
    }

    const nextLetter = document.querySelector('.current.letter');
    const nextWord = document.querySelector('.current.word');

    console.log(cursor);
    if(nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
        
    } else {
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';

    } 
})

newGame();
