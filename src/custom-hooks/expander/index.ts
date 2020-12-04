import { useEffect, useState } from 'react'

export const useExpander = (setExpand) => {
    const [show, setShow] = useState(false)
    useEffect(() => {
        if (setExpand) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [])

    return show
}
