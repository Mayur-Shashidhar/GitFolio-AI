import os
import json
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import uvicorn

from github_analyzer import GitHubAnalyzer
from charts import ChartGenerator

# Load environment variables
load_dotenv()

app = FastAPI(
    title="GitFolio AI API",
    description="GitHub Profile Analyzer and Portfolio Generator API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("data", exist_ok=True)
os.makedirs("charts", exist_ok=True)

# Mount static files for charts
app.mount("/charts", StaticFiles(directory="charts"), name="charts")

# Initialize services
github_token = os.getenv("GITHUB_TOKEN")
analyzer = GitHubAnalyzer(github_token)
chart_generator = ChartGenerator()


class AnalyzeRequest(BaseModel):
    """Request model for profile analysis."""
    username: str


class AnalyzeResponse(BaseModel):
    """Response model for analysis endpoint."""
    status: str
    message: str
    data: Optional[dict] = None


def analyze_and_save(username: str) -> dict:
    """Analyze a GitHub profile and save results."""
    try:
        # Analyze profile
        print(f"Analyzing profile: {username}")
        profile_data = analyzer.analyze_profile(username)
        
        # Set username for chart generator to use user-specific folder
        chart_generator.set_username(username)
        
        # Generate charts
        print("Generating charts...")
        charts = chart_generator.generate_all_charts(profile_data)
        
        # Verify all chart files exist before proceeding
        import time
        for chart_path in charts.values():
            max_wait = 5  # Maximum 5 seconds
            waited = 0
            while not os.path.exists(chart_path) and waited < max_wait:
                time.sleep(0.1)
                waited += 0.1
            if not os.path.exists(chart_path):
                print(f"Warning: Chart file {chart_path} not found after waiting")
        
        # Add chart paths to profile data (include username folder)
        profile_data["charts"] = {
            name: f"/charts/{username}/{os.path.basename(path)}" 
            for name, path in charts.items()
        }
        
        # Save to username-specific file only
        username_file = f"data/{username}.json"
        
        with open(username_file, 'w') as f:
            json.dump(profile_data, f, indent=2)
        
        print(f"Analysis complete! Data saved to {username_file}")
        
        return profile_data
        
    except Exception as e:
        import traceback
        print(f"ERROR: Analysis failed for {username}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("Full traceback:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "GitFolio AI API",
        "version": "1.0.0",
        "description": "GitHub Profile Analyzer and Portfolio Generator",
        "endpoints": {
            "analyze": "/analyze/{username}",
            "data": "/data",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    token_status = "configured" if github_token else "not configured"
    return {
        "status": "healthy",
        "github_token": token_status,
        "api_version": "1.0.0"
    }


@app.get("/analyze/{username}")
async def analyze_profile(username: str, background_tasks: BackgroundTasks):
    """
    Analyze a GitHub profile and generate portfolio data.
    
    Args:
        username: GitHub username to analyze
        
    Returns:
        Analysis results and generated data
    """
    try:
        # Run analysis
        profile_data = analyze_and_save(username)
        
        return {
            "status": "success",
            "message": f"Successfully analyzed profile: {username}",
            "data": profile_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
async def analyze_profile_post(request: AnalyzeRequest):
    """
    Analyze a GitHub profile (POST method).
    
    Args:
        request: Request body containing username
        
    Returns:
        Analysis results
    """
    try:
        profile_data = analyze_and_save(request.username)
        
        return {
            "status": "success",
            "message": f"Successfully analyzed profile: {request.username}",
            "data": profile_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/data")
async def get_data():
    """
    Get the latest analyzed profile data.
    
    Returns:
        Latest profile.json data
    """
    try:
        data_file = "data/profile.json"
        
        if not os.path.exists(data_file):
            raise HTTPException(
                status_code=404,
                detail="No profile data found. Please analyze a profile first."
            )
        
        with open(data_file, 'r') as f:
            data = json.load(f)
        
        return data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/data/{username}")
async def get_user_data(username: str, force_refresh: bool = False):
    """
    Get data for a specific user (if stored).
    
    Args:
        username: GitHub username
        force_refresh: Force re-analysis even if cached data exists
        
    Returns:
        User's profile data or 404 if not found/expired
    """
    try:
        # Check if we have this user's data
        data_file = f"data/{username}.json"
        
        if os.path.exists(data_file) and not force_refresh:
            with open(data_file, 'r') as f:
                data = json.load(f)
                
                # Check if data is older than 24 hours
                if "analyzed_at" in data:
                    analyzed_time = datetime.fromisoformat(data["analyzed_at"])
                    now = datetime.now(timezone.utc)
                    age = now - analyzed_time
                    
                    # If data is fresh (< 24 hours), return it
                    if age < timedelta(hours=24):
                        return data
                    else:
                        # Data is stale, trigger 404 to force re-analysis
                        raise HTTPException(
                            status_code=404,
                            detail=f"Cached data expired for user: {username}"
                        )
                
                return data
        
        # If not found, return the default profile.json if it matches
        default_file = "data/profile.json"
        if os.path.exists(default_file) and not force_refresh:
            with open(default_file, 'r') as f:
                data = json.load(f)
                if data.get("username") == username:
                    # Check age for default file too
                    if "analyzed_at" in data:
                        analyzed_time = datetime.fromisoformat(data["analyzed_at"])
                        now = datetime.now(timezone.utc)
                        age = now - analyzed_time
                        
                        if age < timedelta(hours=24):
                            return data
        
        raise HTTPException(
            status_code=404,
            detail=f"No data found for user: {username}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/charts/{username}/{chart_name}")
async def get_chart(username: str, chart_name: str):
    """
    Get a specific chart image for a user.
    
    Args:
        username: GitHub username
        chart_name: Name of the chart file
        
    Returns:
        Chart image file
    """
    chart_path = os.path.join("charts", username, chart_name)
    
    if not os.path.exists(chart_path):
        raise HTTPException(status_code=404, detail="Chart not found")
    
    return FileResponse(chart_path)


@app.delete("/data")
async def clear_data():
    """Clear all stored profile data and charts."""
    try:
        # Clear JSON data
        if os.path.exists("data/profile.json"):
            os.remove("data/profile.json")
        
        # Clear charts
        for file in os.listdir("charts"):
            file_path = os.path.join("charts", file)
            if os.path.isfile(file_path):
                os.remove(file_path)
        
        return {
            "status": "success",
            "message": "All data cleared successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
