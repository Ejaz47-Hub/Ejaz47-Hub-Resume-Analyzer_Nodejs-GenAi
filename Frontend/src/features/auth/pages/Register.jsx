import React from 'react'
import {useNavigate,Link} from 'react-router'

const Register = () => {

  const navigate = useNavigate()

  const handleSubmit =(e)=>{
      e.preventDefault()
  }
  return (

 
     <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor='username'>username</label>
                    <input type="text" id='username' name='username' placeholder='Enter Username' />
                </div>
                <div className="input-group">
                    <label htmlFor='email'>Email</label>
                    <input type="email" id='email' name='email' placeholder='Enter Email' />
                </div>

                <div className="input-group">
                    <label htmlFor='Password'>Password</label>
                    <input type="password" id='Password' name='Password' placeholder='Enter Password' />
                </div>

                <button className='button primary-button'>Register</button>
            </form>

            <p>Already have an account? <Link to={'/login'}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register