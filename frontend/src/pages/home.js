import { useEffect} from "react"
import PaymentDetails from "../components/PaymentDetails"
import Payment from "../components/payment"
import { usePaymentContext } from "../hooks/usepaymentContext"

const Home = () => {
    const {payments, dispatch} = usePaymentContext()
    useEffect(() => {
        const SET_PAYMENT = async () => {
            const response = await fetch('api/payments')
            const json = await response.json()

            if(response.ok){
                dispatch({type: 'SET_PAYMENT', payload: json})
            }
        }
        SET_PAYMENT()
    }, [dispatch])

    return(
    <div className="Home">
        <div className="payments">
        <Payment/>
            {payments && payments.map((payment) =>(
                <PaymentDetails key ={payment._id} payment={payment}/>
            ))}
        </div>
    </div>
    )
}

export default Home