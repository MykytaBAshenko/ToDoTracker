import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ActivationEmail(props) {
    const { activation_token } = useParams()

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                
                    const res = await axios.post('/api/auth/activation', { activation_token })
                    if(res?.data?.success){
                        alert("All created")
                        props.history.push("/login")
                        return
                    }
                    alert("Something went wrong");
            }
            activationEmail()
        }
    }, [activation_token])

    return (
        <div className="active_page">
      
        </div>
    )
}

export default ActivationEmail
