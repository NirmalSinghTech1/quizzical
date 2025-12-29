import { useState } from 'react'
import './App.css'
import Entity from './components/Entity'
import useSWRImmutable from 'swr/immutable'
import { ClipLoader } from 'react-spinners'
import Confetti from 'react-confetti'

// fetcher function for swr
const fetcher = (...args) => fetch(...args).then(res => res.json())

function App() {
  // State variables
  const [page, setPage] = useState('homepage')
  const [checkAnswer, setCheckAnswer] = useState([])
  const [CorrectCount, setCorrectCount] = useState(0)

  // Fetch data
  const {data, error, isValidating, mutate} = useSWRImmutable(page === 'quizpage' ? 'https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple' : null, fetcher)

  if(error) return <div>Error while fetching data...</div>
  
  function startQuiz() {
    setPage('quizpage')
  }

  function checkAnswers(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values = Object.fromEntries(formData.entries())
    
    if(Object.keys(values).length < data.results.length){
      return alert('Please answer all the questions.')
    }
    
    setCheckAnswer([])
    for(let i = 1; i<=data.results.length; i++) {
      const selectedOption = formData.get(`question_${i}`)
      
      const correctAnswer = data.results[i-1].correct_answer
 
      setCorrectCount(prevCount => selectedOption === correctAnswer ? prevCount + 1 : prevCount)
      setCheckAnswer(prevState => [...prevState, {option : selectedOption, isCorrect :selectedOption === correctAnswer}])
    }
  }

  function playAgain() {
    setCheckAnswer([])
    setCorrectCount(0)
    setPage('homepage')

    mutate()
  }

  return (
    <>
      <main>
        {/* Home Page */}
        {data && CorrectCount === data.results.length ? <Confetti /> : null}
        {page === 'homepage' && <div className='homepage'>
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button className='btn start-quiz-btn' onClick={startQuiz}>Start quiz</button>
        </div>}

        {/* Quiz Page */}
        {page === 'quizpage' && <div className='form-container'>
          <form onSubmit={checkAnswers}>

            {/* Loading Spinner */}
            <div className='spinner' style={{margin: '0 auto', transform: 'transformX(4em)'}}>
              {isValidating ? <ClipLoader color='#4D5B9E' /> : null}
            </div>

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

            {data && checkAnswer.length < 1 ? 
              <button 
                type='submit' 
                className='check-answers-btn'

                // disabled={}
                >Check answers</button> 
            : null}
          </form>
          {checkAnswer.length > 0 ?
          <div className='play-again-section'>
            <p>You scored {CorrectCount}/5 correct answers</p>
            <button onClick={playAgain}>Play again</button>
          </div> : null}
        </div>}
      </main>
    </>
  )
}

export default App
