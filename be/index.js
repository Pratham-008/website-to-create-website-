const Groq = require("groq-sdk");
const express = require("express");
const cors = require("cors");
const {getSystemPrompt,BASE_PROMPT} = require("./src/prompt");
const {reactBasePrompt} = require("./src/react");
const {nodeBasePrompt} = require("./src/node");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.listen(port);
app.post("/template",async(req,res)=> {
  const prompt = req.body.prompt ;

  const response = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "user",
        content: prompt,
      },
      
      {
        role: "system",
        content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
      },
      
    ],
    max_tokens: 8000,
  
    
  });
  
  const answer = response.choices && response.choices?.[0].message?.content?.trim().toLowerCase() ; // react or node4
  console.log("Answer from groq:", answer);
    if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [BASE_PROMPT,`Here is an artifact that contains  all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }
    console.log("Answer is not react or node", answer," :");
    res.status(403).json({message: "You cant access this"})
    return;
 
})

app.post("/chat",async(req,res)=>{
  const messages=req.body.messages || [];
  console.log("Messages received:", messages);
  const systemPrompt = getSystemPrompt();
  const response = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],})
    res.json({response: response.choices[0].message.content});
    console.log("Response from groq", response.choices[0].message.content);
})
