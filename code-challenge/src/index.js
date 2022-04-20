// Your code here

// Deliverables 

// all characters within a div with the id of 'character-bar'

// create a span tag with characters name and add to 'div#character-bar'

//when character is clicked display the character deets in 'div detailed info'

//form submit - add number of votes from input and display in div-detailed info 
//votes should be cumulative


//global variables
const baseURL = 'http://localhost:3000/characters/'
const form = document.getElementById('votes-form');
let characterBar = document.getElementById('character-bar')
let charName = document.getElementById('name')
let charImg = document.getElementById('image')
let charVotes = document.getElementById('vote-count')

//advanced deliverable variables
document.getElementById("votes").type="number";
let resetBtn = document.getElementById('reset-btn')
let totalVotes = 0
let currentChar = {}
let newChar =  {}
let newForm = document.getElementById('character-form')

//initial fetch request
fetch(baseURL)
.then(resp => resp.json())
.then(data => callBackChar(data))


//callback to add char info
function callBackChar(data) {
    data.forEach(character => {
        let span = document.createElement('span')
        span.textContent = character.name
        characterBar.appendChild(span)

        span.addEventListener('click', () => {
            charImg.src = character.image
            charName.textContent = character.name
            currentChar = character
            charVotes.textContent = character.votes

        })
    })
}

//new callback to repopulate span with added characters
function newCallBack(data) {
    data.forEach(character => {
        if(character.id > currentChar.id) {
        let span = document.createElement('span')
        span.textContent = character.name
        characterBar.appendChild(span)

        span.addEventListener('click', () => {
            charImg.src = character.image
            charName.textContent = character.name
            currentChar = character
            charVotes.textContent = character.votes

        })
    }
    })
}

//form event listener + patch data to server for votes
form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    let inputVal = parseInt(e.target['votes'].value) // can just do +...
    totalVotes += inputVal
    charVotes.textContent = totalVotes
    currentChar.votes = totalVotes
    console.log(currentChar)

    form.reset()

    fetch(`${baseURL}${currentChar.id}`, {
        method: 'PATCH',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            votes: currentChar.votes
        })
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
})

//reset button
resetBtn.addEventListener('click', () => {
    currentChar.votes = 0
    charVotes.textContent = currentChar.votes
    fetch(`${baseURL}${currentChar.id}`, {
        method: 'PATCH',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            votes: currentChar.votes
        })
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
})


//add form
newForm.addEventListener('submit', (e) => {
    e.preventDefault();
    charImg.src = e.target['image-url'].value
    charName.textContent = e.target['name'].name
    charVotes.textContent = 0

    fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: e.target['name'].value,
            image: e.target['image-url'].value,
            votes: 0,
        })
      })
      .then(resp => resp.json())
      .then(data => console.log(data))

    fetch(baseURL)
    .then(resp => resp.json())
    .then(data => newCallBack(data))
})