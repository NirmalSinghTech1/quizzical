import { Fragment, useState } from "react"
import { decode } from 'html-entities'

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
    const [options, setOptions] = useState(() => shuffle(props.options))
    // console.log('optios', options)
    const areAllOptionsSelected = props.checkAnswer != null
    const currentOption = areAllOptionsSelected && props.checkAnswer[props.id-1].option
    const isCurrentOptionCorrect = areAllOptionsSelected && props.checkAnswer[props.id-1].isCorrect

    const optionElements = options.map((item, index) => {
        return (
            <Fragment key={index}>
                <input 
                    type="radio" 
                    id={item} 
                    value={item} 
                    name={`question_${props.id}`} 
                />
                <label 
                    htmlFor={item}
                    style={{pointerEvents: areAllOptionsSelected ? 'none' : 'all'}}
                    className={ currentOption === item ?
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