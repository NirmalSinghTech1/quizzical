import { useState } from 'react'
import './App.css'
import Entity from './components/Entity'
import useSWRImmutable from 'swr/immutable'
import { ClipLoader } from 'react-spinners'

// fetcher function for swr
const fetcher = (...args) => fetch(...args).then(res => res.json())

function App() {
  const [page, setPage] = useState('homepage')

  // Fetch data
  const {data, error, isValidating} = useSWRImmutable(page === 'quizpage' ? 'https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple' : null, fetcher)

  if(error) return <div>Error while fetching data...</div>
  
  function startQuiz() {
    setPage('quizpage')
  }
  console.log(data)
  
  return (
    <>
      <main>
        {/* Home Page */}
        {page === 'homepage' && <div className='homepage'>
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button className='btn start-quiz-btn' onClick={startQuiz}>Start quiz</button>
        </div>}

        {/* Quiz Page */}
        {page === 'quizpage' && <div className='form-container'>
          <form action="#">

            {/* Loading Spinner */}
            <div className='spinner'>
              {isValidating ? <ClipLoader color='#4D5B9E' /> : null}
            </div>
            {data && data.results.map( (item, index) => {
                return (<Entity
                  key={index}
                  id={index+1}
                  question={item.question}
                  options={[...item.incorrect_answers, item.correct_answer]}
                />)
              })
            }
          {data && <button type='submit' className='check-answers-btn'>Check answers</button>}
          </form>
        </div>}
      </main>
    </>
  )
}

export default App
