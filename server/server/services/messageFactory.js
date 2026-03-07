const { z } = require("zod");

function createBaseMessage(user, type, extra = {}) {

  const messageSchema = z.object({

      id : z.string() , 
      type : z.enum(["text","pdf","image","voice","sticker","gif"]) , 
      email : z.string().email()  , 
      username : z.string().min(4)  , 
      avatar : z.string() , 
      timestamp : z.number()  , 
      replyTo : z.object({}).nullable() , 
      content: z.string().optional() , 
      text : z.string().optional() , 
      attachments : z.array(
        z.object({
          name : z.string(),
          content : z.string()
        })
      ).min(1).max(3).optional()

  })

  const message = {
    id: Date.now().toString() + Math.random(),
    type,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    timestamp: Date.now(),
    replyTo: extra.replyTo || null,
    ...extra
  };

  const result  = messageSchema.safeParse(message)

  if(!result.success){

    return  false 

  }else{
    return message
  }
  


}

module.exports = { createBaseMessage };