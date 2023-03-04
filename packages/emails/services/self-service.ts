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

    static async getTemplate(templateId: string) {
        try{
            const res = await axios.get('/api/templates', {params:{templateId}, withCredentials: true})
            return res.data;
        }catch(err){
            console.log(err);
            return '';
        }
    }

    static async saveTemplate(name, content, templateId){
        try{
             await axios.post('/api/templates', {name, content, templateId}, {withCredentials: true});
             return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    static async deleteTemplate(templateId){
        try{
            await axios.delete('/api/templates', {data: {templateId}, withCredentials: true})
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    static async duplicateTemplate(templateId){
        try{
            await axios.post('/api/duplicate_template', {templateId}, {withCredentials: true})
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

}