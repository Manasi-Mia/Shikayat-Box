export async function sendCriticalWhatsApp(message:string):Promise<{sent:boolean;reason?:string}> {
  const token=process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId=process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient=process.env.WHATSAPP_ADMIN_NUMBER;
  if(!token||!phoneNumberId||!recipient) return {sent:false,reason:'WhatsApp Cloud API environment variables are not configured'};
  try {
    const response=await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,{
      method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify({messaging_product:'whatsapp',to:recipient,type:'text',text:{preview_url:false,body:message}})
    });
    if(!response.ok) return {sent:false,reason:`WhatsApp API returned ${response.status}`};
    return {sent:true};
  } catch(error:any){return {sent:false,reason:error?.message||'WhatsApp request failed'};}
}
