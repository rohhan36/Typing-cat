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

let extraLetterCount = 0;

document.querySelector(".game").addEventListener('keyup', ev => {
    const key = ev.key;
    const currWord = document.querySelector(".word.current");
    const currLetter = document.querySelector(".letter.current");
    const cursor = document.querySelector('.cursor');
    const expected = currLetter ? currLetter.innerHTML : ' ';
    const isLetter = (key.length === 1);
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currWord && currLetter === currWord.firstChild;
    const isExtraLetter = document.querySelector('.letter.extra-letter');
    //main letter checking logic
    if(expected !== ' ') {
        
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
        removeClass(currWord, 'current');
        if(currWord.nextSibling) {
            addClass(currWord.nextSibling, 'current');
            addClass(currWord.nextSibling.firstChild, 'current');
        }

    } else if(expected === ' ' && key !== ' '  && isLetter && extraLetterCount < 20) {

        //we are at thr end of the word and we are not pressing space bar, in that case we need to add new letters
        //at the end of the  
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
            removeClass(currLetter.previousSibling, 'correct');
            removeClass(currLetter.previousSibling, 'incorrect');
            
        } else if(!currLetter) {
            addClass(currWord.lastChild, 'current');
            removeClass(currWord.lastChild, 'correct');
            removeClass(currWord.lastChild, 'incorrect');
            cursor.style.left = currWord.lastChild.getBoundingClientRect().left + 'px';
            
        } 
        
        if(isExtraLetter) {
            cursor.style.left = currWord.lastChild.getBoundingClientRect().right + 'px';
            currWord.removeChild(currWord.lastChild);
        }

    } 
    //moving the cursor logic
    const nextLetter = document.querySelector('.current.letter');
    const nextWord = document.querySelector('.current.word');

    if(nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
        
    } else {
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';

    } 

    
})

newGame();
