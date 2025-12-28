import { useState } from 'react'
import './App.css'
import Entity from './components/Entity'

function App() {
  const [page, setPage] = useState('homepage')

  function startQuiz() {
    setPage('quizpage')
  }

  return (
    <>
      <main>
        {page === 'homepage' && <div>
          <h1>Quizzical</h1>
          <p>Some description if needed</p>
          <button className='btn start-quiz-btn' onClick={startQuiz}>Start quiz</button>
        </div>}
        {page === 'quizpage' && <div className='form-container'>
          <form action="#">
            <Entity 
              id={1}
              question='Which coding language was the #1 programming language in terms of usage on GitHub in 2015?'
              options={['JavaScript', 'C#', 'Python', 'PHP']}
            />
            <Entity 
              id={2}
              question='Which programming language was developed by Sun Microsystems in 1995?'
              options={['Java', 'Python', "Solaris OS", " C++"]}
            />
            <button type='submit' className='check-answers-btn'>Check answers</button>
          </form>
        </div>}
      </main>
    </>
  )
}

export default App
