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

let letterCount = 0;

document.querySelector(".game").addEventListener('keyup', ev => {
    const key = ev.key;
    const currWord = document.querySelector(".word.current");
    const currLetter = document.querySelector(".letter.current");
    let totalLetters = currWord.childElementCount;
    
    const expected = currLetter ? currLetter.innerHTML : ' ';
    
    const isLetter = (key.length === 1);
    const isSpace = key === ' ';
    
    console.log({key, expected});
    if(expected !== ' ') {
        
        if(currLetter) {

            addClass(currLetter, expected === key ? 'correct' : 'incorrect');
            removeClass(currLetter, 'current');

            if(currLetter.nextSibling) {
                addClass(currLetter.nextSibling, 'current');
            }
        
        }

    } else if(expected === ' ' && key === ' ') {
        removeClass(currWord, 'current');
        if(currWord.nextSibling) {
            addClass(currWord.nextSibling, 'current');
            addClass(currWord.nextSibling.firstChild, 'current');
        }

    }
})

newGame();