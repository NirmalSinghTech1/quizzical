import { Fragment } from "react"

export default function Entity(props) {

    const optionElements = props.options.map((item, index) => {
        return (
            <Fragment key={index}>
                <input type="radio" id={item} value={item} name={`questions${props.id}`} />
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