import axios from "axios"


const api =  axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({username, email, password}){

    try {
   const response =await api.post('/api/auth/register',{
        username, email, password
    })
    return response.data
    } catch (error) {
        console.log(error);
        
    }

}

export async function login({email,password}){
    try {
        const response = await api.post('/api/auth/login',{
            email,password
        },{
            withCredentials:true
        })
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}


export async function logout(){
    try {
        const resposne = await api.get('/api/auth/logout')
        return resposne.data
        
    } catch (error) {
        console.log(error);
    }
}

export async function getMe(){
    try {
        const response = await api.get('/api/auth/get-me')
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}