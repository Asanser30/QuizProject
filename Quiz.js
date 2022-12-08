//βασικες μεταβλητες που χρησιμευουν
const sum = document.getElementById("sum")
const currentQuestion = document.getElementById("current")
const startButton = document.getElementById("start-btn")
const nextButton = document.getElementById("next-btn")
const resultButton = document.getElementById("result-btn")
const questionContainer = document.getElementById("question-container")
const questionΕlement = document.querySelector('[data-question]')
const answerButtons = document.getElementById("answers")
const form = document.getElementById("form")
const timer= document.getElementById("timer")
const TimerObject= document.getElementById("time")

//ta get apoto menu.js
const Questions = parseInt(localStorage.getItem('questions'))
const Category = parseInt(localStorage.getItem('category'))
const Difficulty = localStorage.getItem('difficulty')
const Type = localStorage.getItem('type')
const input_time = parseInt(localStorage.getItem('Timer'))
const Check = localStorage.getItem('check')
//διαφορες μεταβλητες
let shuffledQuestions,current, i,help,shuffledAnswers,answers,tries,swsto
tries = 0
let time = input_time+1 //+1 gia na mhn xanei sthn arxh mono to input_time grhgora kai den fanei 
let interval



startButton.addEventListener('click',startGame)
startButton.classList.add('hide');

nextButton.addEventListener('click', () =>{
    currentQuestion.innerHTML= i++
    current++
    setNextQuestion()
    clearInterval(interval)
    if(Check == 0){
        TimerObject.style.opacity = "0"
    }else{
        TimerObject.style.opacity = "1"
        time = input_time
        if (time>=10){
            timer.innerHTML = time
        }else{
            timer.innerHTML = `0${time}`
        }
        interval = setInterval(setTimer, 1000) 
    }
})


function startGame(){
    if(Check == 0){
        TimerObject.style.opacity = "0"
    }else{
        TimerObject.style.opacity = "1"
        interval = setInterval(setTimer, 1000) 
    }
    JSONtoArray(json)
    swsto = 0 
    i=2;
    tries +=1
    startButton.classList.add('hide');
    resultButton.classList.add('hide');
    SetArray(precodedArray)
    shuffledQuestions = finalQuest.sort(() => Math.random() - .5)
    current = 0
    questionContainer.classList.remove('hide')
    if(help){
        currentQuestion.innerHTML= 1
    }
    SetHowMuch(finalQuest);
    setNextQuestion();
}


function setNextQuestion(){
    resetState()
    showQuestion(shuffledQuestions[current])
}

function showQuestion(question){
    questionΕlement.innerText = question.question
    shuffledAnswers = question.answers.sort(() => Math.random() - .5)
    if (shuffledAnswers[0].text == "True" || shuffledAnswers[0].text == "False" ){
      for(let i=0; i<2; i++){
        const button = document.createElement('button')
        if(i==0){
          button.innerText = 'True'
        } 
        else if(i==1){
          button.innerText = 'False'
        } 
        button.classList.add('btn')
        if(shuffledAnswers[i].correct){
            button.dataset.correct = shuffledAnswers[i].correct
        }
        button.addEventListener('click',selectAnswer)
        answerButtons.appendChild(button)
      }
      return
    }
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if(answer.correct){
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click',selectAnswer)
        answerButtons.appendChild(button)
    })
}

function resetState(){
    nextButton.classList.add('hide')
    while(answerButtons.firstChild){
        answerButtons.removeChild
        (answerButtons.firstChild)
    }
}

function selectAnswer(e){
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if(correct){
        swsto +=1
    }
    setStatusClass(document.body,correct)
    Array.from(answerButtons.children).forEach(button =>{
        setStatusClass(button,button.dataset.correct)
    })
    if(shuffledQuestions.length > current + 1){
        nextButton.classList.remove('hide')
    }
    else{
        startButton.innerText = 'Restart'
        resultButton.classList.remove('hide')
        startButton.classList.remove('hide')
        startButton.addEventListener('click',startGame)
        help = true;   
    }
    if (time>=10){
        timer.innerHTML = time 
    }else{
        timer.innerHTML = `0${time}`
    }
    time = input_time+1
    clearInterval(interval)
}

function setStatusClass(element,correct){
    clearStatusClass(element)
    if(correct){
        element.classList.add('correct')
    }
    else{
        element.classList.add('wrong')
    }
}

function clearStatusClass(element){
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

function SetHowMuch(finalQuest){
    sum.innerText = finalQuest.length
}

form.addEventListener('submit', function(e){
    e.preventDefault();

    const Sum =  finalQuest.length
    const Tries = tries
    const Correct = swsto
    const Time = time

    localStorage.setItem('sum', Sum)
    localStorage.setItem('tries', Tries)
    localStorage.setItem('correct', Correct)
    localStorage.setItem('time', Time)

})

function Click(){
    location.replace('results.html')
}

var precodedArray
                   
function JSONtoArray(jquest){  //json file 
  precodedArray = [] //before encoding entities 
  DecodeJSON(jquest)
  for(let i=0;i<jquest.results.length;i++){
    if(typeof json.results[i].correct_answer  == 'string'){
        precodedArray.push({'question': jquest.results[i].question,'answers': [{'text': json.results[i].correct_answer, 'correct':true}]})
    }
    else{
        precodedArray.push({'question': jquest.results[i].question,'answers': []})
        for(let k=0;k<jquest.results[i].correct_answer.length;k++){
            precodedArray[i].answers.push({'text': jquest.results[i].correct_answer[k], 'correct':true})
        }
    }
    for(let j=0;j<jquest.results[i].incorrect_answers.length;j++){
        precodedArray[i].answers.push({'text': jquest.results[i].incorrect_answers[j], 'correct':false})
    }
  }
}

var finalQuest = []
let positions = []
let WantedLength = Questions //max 49 

function SetArray(quest/*array*/){
    positions.length = 0
    finalQuest.length = 0
    if(quest.length == WantedLength){
        finalQuest = quest
        return
    }
    for(let i=0; i<quest.length; i++){
        positions[i] = i
    }
    positions = positions.sort(() => Math.random() - .5)
    for(let i=0; i<WantedLength; i++){
        finalQuest[i] = quest[positions[i]]
    }
}

var link = `https://opentdb.com/api.php?amount=${Questions}`

if(Category != 0){
    link += `&category=${Category}`
}
if(Difficulty != ""){
    link += `&difficulty=${Difficulty}`
}
if(Type != ""){
    link += `&type=${Type}` 
}


var file = "Documents/10-Entertainment_ Books.oq"
var file_peinaw = "Documents/quiz_peinaw.json"
var file2 = "10-Entertainment_ Books.oq"
var json

function getFile(){
    fetch(link)
    .then(response => {
        return response.json() //retunrs our data
    })              
    .then(jsondata => {
        //json file
        json = jsondata
        startGame()
    })
}

function DecodeJSON(dquest){
    for (let i=0; i<dquest.results.length; i++){
        var qstring = decodeHTMLEntities(json.results[i].question)
        json.results[i].question = qstring
        if(typeof json.results[i].correct_answer  != 'string')
            for (let j=0; j<dquest.results[i].correct_answer.length; j++){
                var acstring = decodeHTMLEntities(json.results[i].correct_answer[j])
                json.results[i].correct_answer[j] = acstring
            }
        else{
            var cstring = decodeHTMLEntities(json.results[i].correct_answer)
            json.results[i].correct_answer = cstring
        }
        for (let k=0; k<dquest.results[i].incorrect_answers.length; k++){
            var istring = decodeHTMLEntities(json.results[i].incorrect_answers[k])
            json.results[i].incorrect_answers[k] = istring
        }
    }
    
}

function decodeHTMLEntities(inputStr) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = inputStr;
    return textArea.value;
}

let setTimer = () =>{
    if(time == 0){
        Array.from(answerButtons.children).forEach(button =>{
            setStatusClass(button,button.dataset.correct)
        })
        if(shuffledQuestions.length > current + 1){
            nextButton.classList.remove('hide')
        }
        else{
            startButton.innerText = 'Restart'
            resultButton.classList.remove('hide')
            startButton.classList.remove('hide')
            help = true;   
        }
        time = input_time+1
        clearInterval(interval)
    }
    else if (time>10){
        timer.innerHTML = --time
    }
    else{
        timer.innerHTML = `0${+(--time)}` 
    }
}


