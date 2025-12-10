# Backend - GitFolio AI

Python backend service for GitHub profile analysis and chart generation.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your GitHub token
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /analyze/{username}` - Analyze a GitHub profile
- `POST /analyze` - Analyze a profile (POST method)
- `GET /data` - Get latest profile data
- `GET /data/{username}` - Get specific user data
- `GET /charts/{chart_name}` - Get chart images
- `DELETE /data` - Clear all data

## Directory Structure

```
backend/
├── main.py              # FastAPI application
├── github_analyzer.py   # GitHub API analysis logic
├── charts.py           # Chart generation
├── requirements.txt    # Python dependencies
├── data/              # Generated JSON data
└── charts/            # Generated chart images
```
