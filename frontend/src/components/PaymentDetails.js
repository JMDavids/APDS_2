import { usePaymentContext } from "../hooks/usepaymentContext"


const PaymentDetails = ({payment}) => {
    const {dispatch} = usePaymentContext()
   
   
    const handleClick = async() => {
        const response  = await fetch('api/payments/' + payment._id, {
            method: 'DELETE'
        })

        const json = await response.json()

        if(response.ok){
            dispatch({type: 'DELETE_payment', payload: json})
        }
        else{
            console.log("error")
        }
    }

    return(
    <div className="Payment-details">
        
        <p><strong>Amount: </strong>{payment.amount}</p>
        <p><strong>Currency: </strong>{payment.currency}</p>
        <p><strong>Provider: </strong>{payment.provider}</p>
        <p><strong>Account Info: </strong>{payment.accountinfo}</p>
        <p><strong>Swift C: </strong>{payment.swiftcode}</p>
      
        <span class="material-symbols-outlined" onClick={handleClick}>Delete</span>
    </div>
    )
}


export default PaymentDetails
