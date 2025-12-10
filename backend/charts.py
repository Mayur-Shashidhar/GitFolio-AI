import os
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
from typing import Dict, List
import numpy as np
from datetime import datetime
import calendar


class ChartGenerator:
    """Generates visualization charts for GitHub profile data."""
    
    def __init__(self, output_dir: str = "charts", username: str = None):
        """Initialize chart generator with output directory."""
        self.base_dir = output_dir
        self.username = username
        
        # Create user-specific directory if username provided
        if username:
            self.output_dir = os.path.join(output_dir, username)
        else:
            self.output_dir = output_dir
            
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Set style
        plt.style.use('seaborn-v0_8-darkgrid')
    
    def set_username(self, username: str):
        """Set username and create corresponding directory."""
        self.username = username
        self.output_dir = os.path.join(self.base_dir, username)
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_language_chart(self, languages: List[Dict], filename: str = "languages.png"):
        """Generate a pie chart for language distribution."""
        if not languages:
            return None
        
        names = [lang["name"] for lang in languages]
        percentages = [lang["percentage"] for lang in languages]
        
        # Create color palette
        colors = ['#3572A5', '#f1e05a', '#e34c26', '#563d7c', '#b07219', 
                  '#00ADD8', '#89e051', '#178600', '#A97BFF', '#DA5B0B']
        
        fig, ax = plt.subplots(figsize=(10, 8))
        
        wedges, texts, autotexts = ax.pie(
            percentages,
            labels=names,
            autopct='%1.1f%%',
            startangle=90,
            colors=colors[:len(names)],
            textprops={'fontsize': 12, 'weight': 'bold'}
        )
        
        # Enhance text
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontsize(11)
        
        ax.set_title('Top Programming Languages', fontsize=16, weight='bold', pad=20)
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, filename)
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
        return output_path
    
    def generate_star_timeline(self, timeline: List[Dict], filename: str = "stars.png"):
        """Generate a line chart for star growth over time."""
        if not timeline:
            return None
        
        months = [item["month"] for item in timeline]
        stars = [item["stars"] for item in timeline]
        
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Create gradient effect
        ax.plot(months, stars, marker='o', linewidth=2.5, markersize=8, 
                color='#2ea44f', markerfacecolor='#1a7f37', markeredgewidth=2, 
                markeredgecolor='white')
        
        ax.fill_between(range(len(months)), stars, alpha=0.3, color='#2ea44f')
        
        ax.set_xlabel('Month', fontsize=12, weight='bold')
        ax.set_ylabel('Cumulative Stars', fontsize=12, weight='bold')
        ax.set_title('Star Growth Timeline', fontsize=16, weight='bold', pad=20)
        
        # Rotate x-axis labels
        plt.xticks(rotation=45, ha='right')
        
        # Add grid
        ax.grid(True, alpha=0.3, linestyle='--')
        
        # Format y-axis
        ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'{int(x):,}'))
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, filename)
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
        return output_path
    
    def generate_contribution_heatmap(self, profile_data: Dict, filename: str = "contributions.png"):
        """Generate a heatmap showing contribution patterns based on repo activity."""
        repos = profile_data.get("top_repositories", [])
        if not repos:
            return None
        
        # Analyze actual repository update patterns
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        # Initialize data matrix
        data = np.zeros((7, 24))
        
        # Analyze repo update times to estimate activity pattern
        for repo in repos:
            if repo.get("updated_at"):
                try:
                    from datetime import datetime
                    update_time = datetime.fromisoformat(repo["updated_at"].replace('Z', '+00:00'))
                    day_of_week = update_time.weekday()  # 0 = Monday
                    hour = update_time.hour
                    # Weight by repo activity (stars + forks)
                    weight = 1 + (repo.get("stars", 0) + repo.get("forks", 0)) * 0.1
                    data[day_of_week][hour] += weight
                except:
                    pass
        
        # If we have sparse data, add some smoothing
        if data.max() > 0:
            from scipy.ndimage import gaussian_filter
            try:
                data = gaussian_filter(data, sigma=0.8)
            except:
                pass  # If scipy not available, use raw data
        else:
            # No data available, create a minimal placeholder pattern
            data = np.ones((7, 24)) * 0.5
        
        fig, ax = plt.subplots(figsize=(14, 5))
        
        im = ax.imshow(data, cmap='Greens', aspect='auto')
        
        # Set ticks
        hours = list(range(24))
        ax.set_xticks(np.arange(len(hours)))
        ax.set_yticks(np.arange(len(days)))
        ax.set_xticklabels([f'{h:02d}:00' if h % 3 == 0 else '' for h in hours])
        ax.set_yticklabels(days)
        
        # Rotate the tick labels
        plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")
        
        ax.set_xlabel('Hour of Day', fontsize=12, weight='bold')
        ax.set_ylabel('Day of Week', fontsize=12, weight='bold')
        ax.set_title('Repository Activity Pattern', fontsize=16, weight='bold', pad=20)
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('Activity Level', rotation=270, labelpad=20, weight='bold')
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, filename)
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
        return output_path
    
    def generate_all_charts(self, profile_data: Dict) -> Dict[str, str]:
        """Generate all charts for a profile."""
        charts = {}
        
        # Language chart
        if profile_data.get("top_languages"):
            lang_chart = self.generate_language_chart(profile_data["top_languages"])
            if lang_chart:
                charts["languages"] = lang_chart
        
        # Star timeline
        if profile_data.get("contribution_summary", {}).get("star_timeline"):
            star_chart = self.generate_star_timeline(
                profile_data["contribution_summary"]["star_timeline"]
            )
            if star_chart:
                charts["stars"] = star_chart
        
        # Contribution heatmap
        contrib_chart = self.generate_contribution_heatmap(profile_data)
        if contrib_chart:
            charts["contributions"] = contrib_chart
        
        return charts
    
    def generate_repo_stats_chart(self, repos: List[Dict], filename: str = "repo_stats.png"):
        """Generate bar chart comparing repository statistics."""
        if not repos or len(repos) < 2:
            return None
        
        names = [repo["name"][:20] for repo in repos[:5]]  # Truncate long names
        stars = [repo["stars"] for repo in repos[:5]]
        forks = [repo["forks"] for repo in repos[:5]]
        
        x = np.arange(len(names))
        width = 0.35
        
        fig, ax = plt.subplots(figsize=(12, 6))
        
        bars1 = ax.bar(x - width/2, stars, width, label='Stars', color='#ffd33d')
        bars2 = ax.bar(x + width/2, forks, width, label='Forks', color='#2188ff')
        
        ax.set_xlabel('Repository', fontsize=12, weight='bold')
        ax.set_ylabel('Count', fontsize=12, weight='bold')
        ax.set_title('Top Repositories - Stars vs Forks', fontsize=16, weight='bold', pad=20)
        ax.set_xticks(x)
        ax.set_xticklabels(names, rotation=45, ha='right')
        ax.legend()
        
        # Add value labels on bars
        for bars in [bars1, bars2]:
            for bar in bars:
                height = bar.get_height()
                ax.annotate(f'{int(height)}',
                           xy=(bar.get_x() + bar.get_width() / 2, height),
                           xytext=(0, 3),
                           textcoords="offset points",
                           ha='center', va='bottom', fontsize=9)
        
        plt.tight_layout()
        output_path = os.path.join(self.output_dir, filename)
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
        return output_path
