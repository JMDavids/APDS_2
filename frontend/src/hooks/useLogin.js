import {useState} from 'react'
import { useAuthenticationContext } from './useAuthenticationContext'

//keeping track of our context for session management
// we need to know when the user is logged in our out

export const useLogin = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthenticationContext()

    const login = async(email, password,accountNumber) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5000/api/users/login', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password,accountNumber})
        })

        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setIsLoading(false)
        }
        if(response.ok){
            //1. update auth context with email
            //2. update isLoading to false because we are finished
            //3. update our jsonwebtoken. If a user closes the page and reopens, they still logged in


            //we have to store strings inside localstorage so we convert json object to string
            localStorage.setItem('users', JSON.stringify(json))

            dispatch({type: "LOGIN", payload: json})

            setIsLoading(false)
            
        }
    }
    return {login, isLoading, error}

}