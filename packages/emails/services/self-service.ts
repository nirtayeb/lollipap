import axios from "axios";
import mondaySdk from "monday-sdk-js";


export class SelfService {

    static async getToken() {
        const monday = mondaySdk();
        const token = await monday.get("sessionToken");
        return token.data;
    }


    static async getSendersList() {
        const token = await this.getToken();
        try{
            const res = await axios.get(`/api/senders?token=${token}`, {withCredentials: true});
            return res.data
        }
        catch(err){
            console.log(err);
            return {senders:[], reachedLimit: false}
        }
    }

    static async addSender(name: string, email: string){
        const token = await this.getToken();
        try{
            await axios.post(`/api/senders?token=${token}`, {name, email}, {withCredentials: true});
        }catch(err){
            console.log(err);
            return false;
        }

        return true;
    }

    static async deleteSender(email: string) {
        const token = await this.getToken();
        try{
            await axios.delete(`/api/senders?token=${token}`, {data: {email}, withCredentials: true})
        }
        catch(err){
            console.log(err);
            return false;
        }

        return true;
    }


    static async getAllTemplates() {
        const token = await this.getToken();
        try{
            const res = await axios.get(`/api/templates?token=${token}`, {withCredentials: true});
            return res.data
        }
        catch(err){
            console.log(err);
            return {templates:[], reachedLimit: false}
        }
    }

    static async getTemplate(templateId: string) {
        const token = await this.getToken();
        try{
            const res = await axios.get(`/api/templates/${templateId}?token=${token}`,{ withCredentials: true })
            return res.data;
        }catch(err){
            console.log(err);
            return '';
        }
    }

    static async saveTemplate(name, content, templateId){
        const token = await this.getToken();
        try{
             await axios.post(`/api/templates?token=${token}`, {name, content, templateId}, {withCredentials: true});
             return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    static async deleteTemplate(templateId){
        const token = await this.getToken();
        try{
            await axios.delete(`/api/templates?token=${token}`, {data: {templateId}, withCredentials: true})
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    static async duplicateTemplate(templateId){
        const token = await this.getToken();
        try{
            await axios.post(`/api/duplicate_template?token=${token}`, {templateId}, {withCredentials: true})
            return {'ok': true, 'error': ''};
        }catch(error){
            console.log(error);
            let errorMessage = 'An error occurred, please try again later';
            if (error.response && error.response.data){
                errorMessage = error.response.data.error
            }
            return {'ok': false, 'error': errorMessage}
        }
    }


    static async resendVerification(senderId){
        const token = await this.getToken();
        try{
            await axios.post(`/api/resend_verification?token=${token}`, {senderId}, {withCredentials: true});
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

}