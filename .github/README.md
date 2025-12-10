### Quick Start

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
echo "GITHUB_TOKEN=your_token" > .env
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### One-Command Setup

```bash
chmod +x setup.sh
./setup.sh
```

### Features at a Glance

✅ GitHub profile analysis  
✅ Auto-generated portfolios  
✅ 4 beautiful themes  
✅ Daily auto-updates  
✅ Charts & visualizations  
✅ Fully responsive  
✅ Dark mode support  

### Tech Stack

**Backend:** Python, FastAPI, PyGithub, Matplotlib  
**Frontend:** Next.js 14, TailwindCSS, Framer Motion  
**DevOps:** GitHub Actions, Vercel/GitHub Pages  

### Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)
- [API Docs](http://localhost:8000/docs) (when running)

### Support

⭐ Star this repo  
🐛 [Report bugs](../../issues)  
💡 [Request features](../../issues)  
📖 [Read docs](README.md)
