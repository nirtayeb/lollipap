import axios from "axios";


export class SelfService {

    static async addSender(name: string, email: string){
        try{
            await axios.post('/api/senders', {name, email}, {withCredentials: true});
        }catch(err){
            console.log(err);
            return false;
        }

        return true;
    }

    static async deleteSender(email: string) {
        try{
            await axios.delete('/api/senders', {data: {email}, withCredentials: true})
        }
        catch(err){
            console.log(err);
            return false;
        }

        return true;
    }

    static async getAllColumns(){
        try{
            const res = await axios.get('/api/columns', {withCredentials: true})
            console.log(res.data);
            return res.data;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    static async saveTemplate(name, content){
        try{
             await axios.post('/api/templates', {name, content}, {withCredentials: true});
             return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

}