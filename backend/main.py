import os
import json
import asyncio
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from openai import OpenAI
from apify_client import ApifyClient

# --- Basic Setup ---
load_dotenv()
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] [%(levelname)s] %(message)s')

# --- FastAPI App Initialization ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Clients ---
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
apify_client = ApifyClient(os.getenv("APIFY_API_TOKEN"))

# --- Agent Tool ---
def get_website_technology(url: str):
    """Gets the technology stack for a given website URL."""
    logging.info(f"AGENT TOOL: Executing 'get_website_technology' for URL: {url}")
    
    run_input = { "url": url }
    
    try:
        logging.info(f"APIFY: Calling actor 'canadesk/builtwith' for '{url}'")
        run = apify_client.actor("canadesk/builtwith").call(run_input=run_input)
        logging.info(f"APIFY: Actor run finished. Fetching results from dataset.")
        
        results = list(apify_client.dataset(run["defaultDatasetId"]).iterate_items())
        logging.info(f"APIFY: Found {len(results)} technologies for '{url}'.")
        return results
    except Exception as e:
        logging.error(f"APIFY: An error occurred during actor run: {e}", exc_info=True)
        return [{"error": "Failed to retrieve technology data."}]

# --- LinkedIn Search Function ---
def search_linkedin_companies(company_name: str):
    """Searches for companies on LinkedIn using the company name."""
    logging.info(f"LINKEDIN: Searching for company: '{company_name}'")
    
    run_input = {
        "action": "get-companies",
        "keywords": [company_name],
        "isUrl": False,
        "isName": False,
        "limit": 10,  # Get more results for better data
    }
    
    try:
        logging.info(f"APIFY: Calling LinkedIn actor for '{company_name}'")
        run = apify_client.actor("bebity~linkedin-premium-actor").call(run_input=run_input)
        logging.info(f"APIFY: LinkedIn actor run finished. Fetching results from dataset.")
        
        results = list(apify_client.dataset(run["defaultDatasetId"]).iterate_items())
        logging.info(f"APIFY: Found {len(results)} LinkedIn companies for '{company_name}'.")
        return results
    except Exception as e:
        logging.error(f"APIFY: An error occurred during LinkedIn search: {e}", exc_info=True)
        return [{"error": "Failed to retrieve LinkedIn data."}]

# --- Reddit Search Function ---
def search_reddit_posts(search_term: str):
    """Searches for posts on Reddit using the search term."""
    logging.info(f"REDDIT: Searching for posts about: '{search_term}'")
    
    run_input = {
        "debugMode": False,
        "ignoreStartUrls": False,
        "includeNSFW": True,
        "maxComments": 10,
        "maxCommunitiesCount": 2,
        "maxItems": 10,
        "maxPostCount": 10,
        "maxUserCount": 2,
        "proxy": {
            "useApifyProxy": True,
            "apifyProxyGroups": [
                "RESIDENTIAL"
            ]
        },
        "scrollTimeout": 40,
        "searchComments": False,
        "searchCommunities": False,
        "searchPosts": True,
        "searchUsers": False,
        "searches": [search_term],
        "skipComments": False,
        "skipCommunity": False,
        "skipUserPosts": False,
        "sort": "new"
    }
    
    try:
        logging.info(f"APIFY: Calling Reddit actor for '{search_term}'")
        run = apify_client.actor("trudax~reddit-scraper-lite").call(run_input=run_input)
        logging.info(f"APIFY: Reddit actor run finished. Fetching results from dataset.")
        
        results = list(apify_client.dataset(run["defaultDatasetId"]).iterate_items())
        logging.info(f"APIFY: Found {len(results)} Reddit posts for '{search_term}'.")
        return results
    except Exception as e:
        logging.error(f"APIFY: An error occurred during Reddit search: {e}", exc_info=True)
        return [{"error": "Failed to retrieve Reddit data."}]

# --- Twitter Search Function ---
def search_twitter_posts(search_term: str):
    """Searches for posts on Twitter/X using the search term."""
    logging.info(f"TWITTER: Searching for posts about: '{search_term}'")
    
    run_input = {
        "startUrls": [],
        "handles": [search_term] if not search_term.startswith("@") else [search_term[1:]],
        "userQueries": [search_term] if "@" not in search_term else [],
        "tweetsDesired": 3,
        "profilesDesired": 1,
        "withReplies": False,
        "includeUserInfo": True,
        "storeUserIfNoTweets": False,
        "proxyConfig": {
            "useApifyProxy": True,
            "apifyProxyGroups": ["RESIDENTIAL"]
        }
    }
    
    try:
        logging.info(f"APIFY: Calling Twitter actor for '{search_term}'")
        run = apify_client.actor("web.harvester~twitter-scraper").call(run_input=run_input)
        logging.info(f"APIFY: Twitter actor run finished. Fetching results from dataset.")
        
        results = list(apify_client.dataset(run["defaultDatasetId"]).iterate_items())
        logging.info(f"APIFY: Found {len(results)} Twitter posts for '{search_term}'.")
        return results
    except Exception as e:
        logging.error(f"APIFY: An error occurred during Twitter search: {e}", exc_info=True)
        return [{"error": "Failed to retrieve Twitter data."}]

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_website_technology",
            "description": "Get the technology stack for a given website URL.",
            "parameters": {
                "type": "object",
                "properties": {"url": {"type": "string", "description": "The URL of the website to analyze, e.g., https://www.example.com"}},
                "required": ["url"],
            },
        },
    }
]

# --- Simple Stream Generator ---
async def stream_generator(messages):
    logging.info("STREAM: Starting OpenAI completion stream.")
    try:
        # Send initial status
        yield "data: Connecting to OpenAI...\n\n"
        
        response = openai_client.chat.completions.create(
            model="gpt-4o", messages=messages, tools=tools, tool_choice="auto"
        )
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        if not tool_calls:
            yield "data: ERROR: Could not identify a website to analyze.\n\n"
            return

        # Process each tool call
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            url_to_analyze = function_args.get("url", "the website")

            logging.info(f"STREAM: Tool call received: {function_name} for {url_to_analyze}")
            
            # Send status update
            yield f"data: Analyzing {url_to_analyze}...\n\n"
            
            # Execute function and get results
            if function_name == "get_website_technology":
                results = get_website_technology(**function_args)
                
                # Send the raw results as a simple string
                results_text = json.dumps(results, indent=2)
                yield f"data: RESULTS:\n{results_text}\n\n"
                logging.info(f"STREAM: Data sent successfully for {url_to_analyze}.")

        # Send completion
        yield "data: COMPLETE\n\n"
        logging.info("STREAM: Stream completed successfully.")

    except Exception as e:
        logging.error(f"STREAM: An unexpected error occurred: {e}", exc_info=True)
        yield f"data: ERROR: {str(e)}\n\n"

# --- API Endpoint ---
@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    user_message = data.get("message")
    logging.info(f"API: Received chat request with message: '{user_message}'")

    if not user_message:
        return {"error": "Message not found"}

    messages = [
        {
            "role": "system", 
            "content": "You are a helpful assistant. Your primary function is to analyze websites. When a user provides a company name or a website, identify the most likely URL (e.g., 'OpenAI' becomes 'https://openai.com'). Then, you must call the 'get_website_technology' function with that URL."
        },
        {"role": "user", "content": user_message}
    ]

    return EventSourceResponse(stream_generator(messages))

# --- LinkedIn API Endpoint ---
@app.post("/linkedin")
async def linkedin_endpoint(request: Request):
    data = await request.json()
    company_name = data.get("company")
    logging.info(f"API: Received LinkedIn search request for company: '{company_name}'")

    if not company_name:
        return {"error": "Company name not found"}

    try:
        results = search_linkedin_companies(company_name)
        logging.info(f"API: Returning {len(results)} LinkedIn results for '{company_name}'")
        return {"success": True, "data": results}
    except Exception as e:
        logging.error(f"API: Error in LinkedIn search: {e}", exc_info=True)
        return {"error": f"LinkedIn search failed: {str(e)}"}

# --- Reddit API Endpoint ---
@app.post("/reddit")
async def reddit_endpoint(request: Request):
    data = await request.json()
    search_term = data.get("search")
    logging.info(f"API: Received Reddit search request for term: '{search_term}'")

    if not search_term:
        return {"error": "Search term not found"}

    try:
        results = search_reddit_posts(search_term)
        logging.info(f"API: Returning {len(results)} Reddit results for '{search_term}'")
        return {"success": True, "data": results}
    except Exception as e:
        logging.error(f"API: Error in Reddit search: {e}", exc_info=True)
        return {"error": f"Reddit search failed: {str(e)}"}

# --- Twitter API Endpoint ---
@app.post("/twitter")
async def twitter_endpoint(request: Request):
    data = await request.json()
    search_term = data.get("search")
    logging.info(f"API: Received Twitter search request for term: '{search_term}'")

    if not search_term:
        return {"error": "Search term not found"}

    try:
        results = search_twitter_posts(search_term)
        logging.info(f"API: Returning {len(results)} Twitter results for '{search_term}'")
        return {"success": True, "data": results}
    except Exception as e:
        logging.error(f"API: Error in Twitter search: {e}", exc_info=True)
        return {"error": f"Twitter search failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 