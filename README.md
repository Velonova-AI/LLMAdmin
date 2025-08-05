
  <h1 align="center">LLMAdmin</h1>


<p align="center">
  An Open-Source LLM Admin Dashboard for creating and managing LLM's built With Next.js and the AI SDK by Vercel.
</p>

## Screenshots


  <img src="public/images/create.png" alt="Create Assistant"  />
  <img src="public/images/manage.png" alt="Manage Assistants"  />
  <img src="public/images/chat.png" alt="Chat Interface"  />


## Features

- Nextjs Auth
- Admin dashboard to create LLM's with temperature,max tokens, system prompts and RAG
- Deployable to Vercel with PostGres as the backend DB




## Deploy Your Own or to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVelonova-AI%2FLLMAdmin&env=OPENAI_API_KEY,POSTGRES_URL,AUTH_SECRET&envDescription=OPENAI%20APU%20key%20as%20well%20as%20neon%20db%20and%20an%20Auth%20secret%20is%20required%20for%20it%20to%20work&envLink=https%3A%2F%2Fplatform.openai.com%2Fapi-keys&project-name=llmadmin&repository-name=llmadmin-fork)


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.


```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

You modify the code to your needs as per the documentation on https://ai-sdk.dev/ and https://github.com/vercel/ai-chatbot
