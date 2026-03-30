import React, { useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const [error, setError] = useState("")

  const {loading,handleRegister} = useAuth()
  const handleSubmit = async(e) => {
      e.preventDefault()
      setError("")
      try {
          const success = await handleRegister({username,email,password})
          if (success) {
              navigate('/')
          } else {
              setError("Registration failed. Please try again.")
          }
      } catch (err) {
          setError(err.message || "Registration failed. Please try again.")
      }
  }

  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }
  return (

 
     <main>
        <div className="form-container">
            <h1>Register</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor='username'>username</label>
                    <input type="text" onChange={(e)=>{setUsername(e.target.value)}}
                    id='username' name='username' placeholder='Enter Username' required />
                </div>
                <div className="input-group">
                    <label htmlFor='email'>Email</label>
                    <input type="email"
                    onChange={(e)=>{setEmail(e.target.value)}} id='email' name='email' placeholder='Enter Email' required />
                </div>

                <div className="input-group">
                    <label htmlFor='Password'>Password</label>
                    <input type="password" 
                   onChange={(e)=>{setpassword(e.target.value)}} id='Password' name='Password' placeholder='Enter Password' required />
                </div>

                <button className='button primary-button' type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <p>Already have an account? <Link to={'/login'}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register