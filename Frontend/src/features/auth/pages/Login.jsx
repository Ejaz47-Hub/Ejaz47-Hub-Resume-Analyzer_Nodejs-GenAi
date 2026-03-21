import React from 'react'
import "../auth.form.scss"
const Login = () => {

    const handleSubmit = (e) =>{
        e.preventDefault()
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor='email'>Email</label>
                    <input type="email" id='email' name='email' placeholder='Enter Email' />
                </div>

                <div className="input-group">
                    <label htmlFor='Password'>Password</label>
                    <input type="password" id='Password' name='Password' placeholder='Enter Password' />
                </div>

                <button className='button primary-button'>Login</button>
            </form>
        </div>
    </main>
  )
}

export default Login