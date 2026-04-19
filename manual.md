Step 1 — Initialize Convex (run this yourself in the terminal):                                                                                                                     
  cd /home/prime/projects/plantchain-new                                                                                                                                              
  pnpm run dev:setup                           
  This opens a browser to log into Convex, creates your project, and generates packages/backend/convex/_generated/.                                                                   
                                                                                                                                                                                      
  Step 2 — Set environment variables (after Convex setup):                                                                                                                            
  cd packages/backend                                                                                                                                                                 
  pnpm convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)                                                                                                                   
  pnpm convex env set SITE_URL http://localhost:5173                                                                                                                                  
  pnpm convex env set GOOGLE_GENERATIVE_AI_API_KEY <your-gemini-key>                                                                                                                  
                                                                                                                                                                                      
  Step 3 — Copy env to web app:                                                                                                                                                       
  # packages/backend/.env.local gets created by dev:setup                                                                                                                             
  # Copy VITE_CONVEX_URL and VITE_CONVEX_SITE_URL to apps/web/.env                                                                                                                    
                                                                                                                                                                                      
  Step 4 — Start dev:                                                                                                                                                                 
  pnpm run dev                                                                                                                                                                        
                                                                                                                                                                                      
  For Auth0 (verification agent), add these Convex env vars when ready:                                                                                                               
  pnpm convex env set AUTH0_DOMAIN your-tenant.auth0.com                                                                                                                              
  pnpm convex env set AUTH0_AGENT_CLIENT_ID ...                                                                                                                                       
  pnpm convex env set AUTH0_AGENT_CLIENT_SECRET ...                                                                                                                                   
  pnpm convex env set AUTH0_AUDIENCE https://api.plantchain.dev  