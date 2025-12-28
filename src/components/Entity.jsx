import { Fragment } from "react"

function shuffle(array) {
    let currentIndex = array.length

    // While there are elements to shuffle
    while(currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;
        
        // Shuffle elements
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

export default function Entity(props) {
    // Shuffle options before rendering
    shuffle(props.options)

    const optionElements = props.options.map((item, index) => {
        return (
            <Fragment key={index}>
                <input type="radio" id={item} value={item} name={`question_${props.id}`} />
                <label htmlFor={item}>{item}</label>
            </Fragment>
        )
    })

    return (
        <fieldset>
            <legend>{props.question}</legend>
            {optionElements}
        </fieldset>
    )
}