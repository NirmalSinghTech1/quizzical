import { useState } from 'react'
import './App.css'
import Entity from './components/Entity'
import useSWRImmutable from 'swr/immutable'
import { ClipLoader } from 'react-spinners'
import Confetti from 'react-confetti'

// Fetcher function for swr
const fetcher = (...args) => fetch(...args).then(res => res.json())

function App() {
  /* State Variables:
    - Control page navigation
    - Store an array of objects with 'option' (selected option) and 'isCorrect' (boolean) properties
    - Count correct answers to show results when "Check Answer" is clicked
  */
  const [page, setPage] = useState('homepage')
  const [checkAnswer, setCheckAnswer] = useState([])
  const [CorrectCount, setCorrectCount] = useState(0)

  // Fetch data from Open trivia db API
  const {data, error, isValidating, mutate, isMutating} = useSWRImmutable(page === 'quizpage' ? 'https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple' : null, fetcher)

  if(error) return <div>Error while fetching data...</div>
  
  // Handle the tranisition from 'homepage' to 'quizpage'
  function startQuiz() {
    setPage('quizpage')
  }

  // Function to verify the selected quiz options 
  function checkAnswers(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values = Object.fromEntries(formData.entries())
    
    // If the user checks answers without completing all questions, show an alert.
    if(Object.keys(values).length < data.results.length){
      return alert('Please answer all the questions.')
    }
    
    setCheckAnswer([])
    for(let i = 1; i<=data.results.length; i++) {
      // Variables to store the user's selected option & the correct answer from API.
      const selectedOption = formData.get(`question_${i}`)
      const correctAnswer = data.results[i-1].correct_answer
 
      // Increase count if the user selected option is correct
      setCorrectCount(prevCount => selectedOption === correctAnswer ? prevCount + 1 : prevCount)
      // Save selected option with its correctness status
      setCheckAnswer(prevState => [...prevState, {option : selectedOption, isCorrect :selectedOption === correctAnswer}])
    }
  }

  // Handle resetTing state and re-fetching data from the API
  function playAgain() {
    setCheckAnswer([])
    setCorrectCount(0)
    setPage('homepage')

    mutate()
  }

  return (
    <>
      <main>
        {/* Confetti drop if all selected options are correct */}
        {data && CorrectCount === data.results.length ? <Confetti /> : null}

        {/* Home Page */}
        {page === 'homepage' && <div className='homepage'>
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button className='btn start-quiz-btn' onClick={startQuiz}>Start quiz</button>
        </div>}

        {/* Quiz Page */}
        {page === 'quizpage' && <div className='form-container'>
          {/* If API data is still loading, show a loader, else render the data */}
          {isValidating || isMutating 
          ? <ClipLoader color='#4D5B9E' /> 
          : <form onSubmit={checkAnswers}>

              {/* Quiz Questions with options */}
              {data && data.results.map( (item, index) => {
                  return (<Entity
                    key={index}
                    id={index+1}
                    question={item.question}
                    options={[...item.incorrect_answers, item.correct_answer]}
                    checkAnswer={checkAnswer.length > 0 ? checkAnswer : null}
                  />)
                })
              }

              {/* 'Check answer' and 'Play again' buttons */}
              {data && checkAnswer.length < 1 ? 
                <button 
                  type='submit' 
                  className='check-answers-btn'
                  >Check answers</button> 
              : <div className='play-again-section'>
                  <p>You scored {CorrectCount}/5 correct answers</p>
                  <button onClick={playAgain}>Play again</button>
                </div>
              }
            </form>
        }
        </div>}
      </main>
    </>
  )
}

export default App