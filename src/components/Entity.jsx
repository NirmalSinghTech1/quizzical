import { Fragment, useState } from "react"
import { decode } from 'html-entities'

// Function to shuffle array elements
function shuffle(array) {
    let currentIndex = array.length, t
    // While there are elements to shuffle
    while(currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        
        // Shuffle elements
        t = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = t
    }
    return array
}

export default function Entity(props) {
    // State variable
    const [options, setOptions] = useState(() => shuffle(props.options))
    
    // Derived variables
    const areAllOptionsSelected = props.checkAnswer != null
    const currentOption = areAllOptionsSelected && props.checkAnswer[props.id-1].option
    const isCurrentOptionCorrect = areAllOptionsSelected && props.checkAnswer[props.id-1].isCorrect

    // Option elements
    const optionElements = options.map((item, index) => {
        
        return (
            <Fragment key={index}>
                <input 
                    type="radio" 
                    id={`q${props.id}_${item}`} 
                    value={item} 
                    name={`question_${props.id}`} 
                />
                <label 
                    htmlFor={`q${props.id}_${item}`} 
                    style={{
                        pointerEvents: areAllOptionsSelected ? 'none' : 'all',
                        backgroundColor: areAllOptionsSelected && item === props.checkAnswer[props.id-1].correctAnswer ? '#94D7A2' : ""
                    }}

                    // Add 'correct' class if selected option is correct else add 'incorrect' class and apply 'disable' class to the remaining options.
                    className={currentOption === item ?
                        isCurrentOptionCorrect ? 'correct' : 'incorrect'
                        : areAllOptionsSelected ? 'disable' : ''}
                >
                    {decode(item)}
                </label>
            </Fragment>
        )
    })

    return (
        <fieldset>
            <legend>{decode(props.question)}</legend>
            {optionElements}
        </fieldset>
    )
}