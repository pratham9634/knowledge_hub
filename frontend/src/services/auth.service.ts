import api from "@/lib/axios"

export const signupUser = async (
    data: {
        name : string,
        email : string,
        password : string,
        confirmPassword : string,
    }
)=>{
    try{
        const response = await api.post("/auth/signup",data)
        return response.data
    }
    catch(err){
        throw err
    }
}

export const loginUser = async (
    data: {
        email : string,
        password : string,
    }
)=>{
    try{
        const response = await api.post("/auth/login",data)
        return response.data
    }
    catch(err){
        throw err
    }
}

export const logoutUser = async ()=>{
    try{
        const response = await api.post("/auth/logout")
        return response.data
    }
    catch(err){
        throw err
    }
}

export const getCurrentUser = async()=>{
    try{
        const response = await api.get("/auth/me")
        console.log(response.data)
        return response.data
    }
    catch(err){
        throw err
    }
}