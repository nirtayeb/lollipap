"use client";
import { useEffect, useState } from "react"
import mondaySdk from "monday-sdk-js";
import TemplateAdmin from "../comps/TemplatesTable";
import UsagePage from "../comps/UsagePage";

const Usage = () => {

    const [emailsSent , setEmailSent] = useState(null);
    const [templateUsage , setTemplateUsage] = useState(null);
    const [verifiedSendersCount , setVerifiedSendersCount] = useState(null);
    const [plan, setPlan] = useState(null);
    

    useEffect(() => {
        const monday = mondaySdk();
        const getData = async () => {
            const token = await monday.get("sessionToken");
            console.log(token);
            const res = await fetch(`/api/usage?token=${token.data}`);
            const data = await res.json();
            setEmailSent(data.emailsSent);
            setTemplateUsage(data.templateUsage);
            setVerifiedSendersCount(data.verifiedSendersCount);
            setPlan(data.plan);
        }
        getData();
    }, [])

  
    if(!plan){
        return <div>Loading...</div>
    }

    return (
        <UsagePage emailUsage={emailsSent} 
        templateUsage={templateUsage}
        sendersCount={verifiedSendersCount}
        plan={plan} />
    )


}

export default Usage;