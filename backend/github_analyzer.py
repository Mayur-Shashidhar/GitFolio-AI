import os
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from github import Github, GithubException
from collections import Counter
import requests


class GitHubAnalyzer:
    """Analyzes GitHub profiles and repositories."""
    
    def __init__(self, github_token: Optional[str] = None):
        """Initialize the analyzer with optional GitHub token."""
        self.token = github_token or os.getenv("GITHUB_TOKEN")
        if self.token:
            self.github = Github(self.token)
        else:
            self.github = Github()  # Anonymous access (lower rate limits)
    
    def analyze_profile(self, username: str) -> Dict:
        """
        Comprehensive analysis of a GitHub profile.
        
        Args:
            username: GitHub username to analyze
            
        Returns:
            Dictionary containing all profile analysis data
        """
        try:
            user = self.github.get_user(username)
            
            # Fetch repositories
            repos = list(user.get_repos())
            
            # Calculate statistics
            stats = self._calculate_stats(user, repos)
            
            # Get top languages
            top_languages = self._get_top_languages(repos)
            
            # Get top repositories
            top_repos = self._get_top_repositories(repos)
            
            # Get contribution summary
            contribution_summary = self._get_contribution_summary(user, repos)
            
            # Calculate collaboration score
            collaboration_score = self._calculate_collaboration_score(user, repos)
            
            # Get collaborators from repositories
            collaborators = self._get_collaborators(user, repos)
            
            # Generate AI summary
            ai_summary = self._generate_ai_summary(user, repos, top_languages)
            
            # Build profile data
            profile_data = {
                "username": username,
                "name": user.name or username,
                "bio": user.bio or "",
                "avatar_url": user.avatar_url,
                "blog": user.blog or "",
                "location": user.location or "",
                "email": user.email or "",
                "twitter_username": user.twitter_username or "",
                "company": user.company or "",
                "hireable": user.hireable or False,
                "created_at": user.created_at.isoformat() if user.created_at else "",
                "updated_at": user.updated_at.isoformat() if user.updated_at else "",
                "stats": stats,
                "top_languages": top_languages,
                "top_repositories": top_repos,
                "contribution_summary": contribution_summary,
                "collaboration_score": collaboration_score,
                "collaborators": collaborators,
                "ai_summary": ai_summary,
                "analyzed_at": datetime.now(timezone.utc).isoformat()
            }
            
            return profile_data
            
        except GithubException as e:
            raise Exception(f"GitHub API error: {str(e)}")
        except Exception as e:
            raise Exception(f"Analysis error: {str(e)}")
    
    def _calculate_stats(self, user, repos: List) -> Dict:
        """Calculate comprehensive statistics."""
        total_stars = sum(repo.stargazers_count for repo in repos)
        total_forks = sum(repo.forks_count for repo in repos)
        total_watchers = sum(repo.watchers_count for repo in repos)
        
        # Calculate total commits (approximate from recent activity)
        total_commits = self._estimate_total_commits(user, repos)
        
        return {
            "total_repos": user.public_repos,
            "total_gists": user.public_gists,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "total_watchers": total_watchers,
            "total_commits": total_commits,
            "followers": user.followers,
            "following": user.following
        }
    
    def _estimate_total_commits(self, user, repos: List) -> int:
        """Estimate total commits across all repositories."""
        total = 0
        # Limit to prevent rate limiting
        for repo in repos[:20]:
            try:
                commits = repo.get_commits(author=user)
                total += commits.totalCount
            except:
                continue
        return total
    
    def _get_top_languages(self, repos: List, top_n: int = 5) -> List[Dict]:
        """Get top programming languages used."""
        language_bytes = Counter()
        
        for repo in repos:
            if repo.language:
                # Get languages breakdown
                try:
                    languages = repo.get_languages()
                    for lang, bytes_count in languages.items():
                        language_bytes[lang] += bytes_count
                except:
                    # Fallback to primary language
                    language_bytes[repo.language] += 1000
        
        # Calculate percentages
        total_bytes = sum(language_bytes.values())
        
        top_languages = []
        for lang, bytes_count in language_bytes.most_common(top_n):
            percentage = (bytes_count / total_bytes * 100) if total_bytes > 0 else 0
            top_languages.append({
                "name": lang,
                "bytes": bytes_count,
                "percentage": round(percentage, 2)
            })
        
        return top_languages
    
    def _get_top_repositories(self, repos: List, top_n: int = 5) -> List[Dict]:
        """Get top repositories by stars."""
        # Sort by stars
        sorted_repos = sorted(repos, key=lambda r: r.stargazers_count, reverse=True)[:top_n]
        
        top_repos = []
        for repo in sorted_repos:
            top_repos.append({
                "name": repo.name,
                "full_name": repo.full_name,
                "description": repo.description or "",
                "url": repo.html_url,
                "homepage": repo.homepage or "",
                "language": repo.language or "Unknown",
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "watchers": repo.watchers_count,
                "open_issues": repo.open_issues_count,
                "created_at": repo.created_at.isoformat() if repo.created_at else "",
                "updated_at": repo.updated_at.isoformat() if repo.updated_at else "",
                "topics": repo.get_topics() if hasattr(repo, 'get_topics') else []
            })
        
        return top_repos
    
    def _get_contribution_summary(self, user, repos: List) -> Dict:
        """Get contribution activity summary."""
        now = datetime.now(timezone.utc)
        last_month = now - timedelta(days=30)
        last_year = now - timedelta(days=365)
        
        recent_repos = [r for r in repos if r.updated_at and r.updated_at > last_month]
        active_year_repos = [r for r in repos if r.updated_at and r.updated_at > last_year]
        
        # Get commit activity for star growth
        star_timeline = self._get_star_timeline(repos)
        
        return {
            "repos_updated_last_month": len(recent_repos),
            "repos_updated_last_year": len(active_year_repos),
            "star_timeline": star_timeline,
            "most_active_day": self._get_most_active_day(repos),
            "contribution_streak": self._estimate_streak(repos)
        }
    
    def _get_star_timeline(self, repos: List) -> List[Dict]:
        """Get star growth timeline based on repository creation dates."""
        timeline = []
        
        # Collect all repos with their creation dates and stars
        repo_data = []
        for repo in repos:
            if repo.created_at and repo.stargazers_count > 0:
                repo_data.append({
                    'date': repo.created_at,
                    'stars': repo.stargazers_count
                })
        
        if not repo_data:
            return []
        
        # Sort by creation date
        repo_data.sort(key=lambda x: x['date'])
        
        # Create monthly cumulative timeline
        month_stars = {}
        cumulative = 0
        
        for item in repo_data:
            month_key = item['date'].strftime("%Y-%m")
            cumulative += item['stars']
            month_stars[month_key] = cumulative
        
        # Convert to list format and get last 12 months or all if less
        sorted_months = sorted(month_stars.keys())
        recent_months = sorted_months[-12:] if len(sorted_months) > 12 else sorted_months
        
        for month in recent_months:
            timeline.append({
                "month": month,
                "stars": month_stars[month]
            })
        
        return timeline
    
    def _get_most_active_day(self, repos: List) -> str:
        """Determine most active day of the week."""
        day_counter = Counter()
        
        for repo in repos[:50]:  # Limit to prevent rate limiting
            try:
                commits = list(repo.get_commits()[:100])
                for commit in commits:
                    if commit.commit.author.date:
                        day = commit.commit.author.date.strftime("%A")
                        day_counter[day] += 1
            except:
                continue
        
        if day_counter:
            return day_counter.most_common(1)[0][0]
        return "Unknown"
    
    def _estimate_streak(self, repos: List) -> int:
        """Estimate current contribution streak in days."""
        # Simplified streak calculation based on repo updates
        if not repos:
            return 0
        
        sorted_repos = sorted(repos, key=lambda r: r.updated_at or datetime.min.replace(tzinfo=timezone.utc), reverse=True)
        
        streak = 0
        current_date = datetime.now(timezone.utc)
        
        for repo in sorted_repos[:30]:
            if repo.updated_at:
                days_diff = (current_date - repo.updated_at).days
                if days_diff <= 1:
                    streak += 1
                    current_date = repo.updated_at
                else:
                    break
        
        return streak
    
    def _generate_ai_summary(self, user, repos: List, top_languages: List[Dict]) -> str:
        """Generate an AI-style summary of the developer."""
        name = user.name or user.login
        
        # Extract key information
        total_repos = len(repos)
        total_stars = sum(repo.stargazers_count for repo in repos)
        
        primary_languages = [lang["name"] for lang in top_languages[:3]]
        lang_str = ", ".join(primary_languages) if primary_languages else "various technologies"
        
        # Determine developer type
        if any(lang in ["Python", "JavaScript", "TypeScript"] for lang in primary_languages):
            dev_type = "full-stack developer"
        elif "Python" in primary_languages:
            dev_type = "Python developer"
        elif any(lang in ["JavaScript", "TypeScript", "React"] for lang in primary_languages):
            dev_type = "frontend developer"
        else:
            dev_type = "software developer"
        
        # Generate summary
        summary = f"{name} is a passionate {dev_type} with {total_repos} public repositories "
        summary += f"and {total_stars} total stars across their projects. "
        summary += f"They specialize in {lang_str}, "
        summary += f"demonstrating expertise through diverse open-source contributions. "
        
        if user.bio:
            summary += f"{user.bio} "
        
        if user.company:
            summary += f"Currently working at {user.company}. "
        
        if user.location:
            summary += f"Based in {user.location}. "
        
        summary += "Actively contributing to the developer community."
        
        return summary
    
    def _get_collaborators(self, user, repos: List) -> Dict:
        """
        Get collaborators and contributors from user's repositories.
        
        Returns a dictionary with:
        - total_unique_people: Total unique collaborators + contributors across all repos
        - total_unique_collaborators: Total unique collaborators (with push access)
        - total_unique_contributors: Total unique contributors (commit authors)
        - collaborators_by_repo: List of repos with their collaborators and contributors
        - top_people: Most frequent collaborators/contributors
        """
        collaborators_data = {
            "total_unique_people": 0,
            "total_unique_collaborators": 0,
            "total_unique_contributors": 0,
            "collaborators_by_repo": [],
            "top_people": []
        }
        
        all_people = {}  # username -> {name, avatar_url, repo_count, type}
        
        # Only check repos where user is the owner (not forks)
        owned_repos = [repo for repo in repos if not repo.fork and repo.owner.login == user.login][:15]
        
        for repo in owned_repos:
            repo_collaborators = []
            repo_contributors = []
            
            # Try to get collaborators (requires push access)
            try:
                collaborators_list = list(repo.get_collaborators())
                
                # Filter out the owner themselves
                repo_collaborators = [
                    {
                        "username": collab.login,
                        "name": collab.name or collab.login,
                        "avatar_url": collab.avatar_url,
                        "type": "collaborator"
                    }
                    for collab in collaborators_list 
                    if collab.login != user.login
                ]
                
                # Track collaborators
                for collab in repo_collaborators:
                    username = collab["username"]
                    if username not in all_people:
                        all_people[username] = {
                            "username": username,
                            "name": collab["name"],
                            "avatar_url": collab["avatar_url"],
                            "repo_count": 0,
                            "type": "collaborator"
                        }
                    all_people[username]["repo_count"] += 1
                        
            except:
                # Permission denied or other API errors - skip collaborators
                pass
            
            # Get contributors (commit authors) - this works for all public repos
            try:
                contributors_list = list(repo.get_contributors())
                
                # Filter out the owner and already tracked collaborators
                collab_usernames = {c["username"] for c in repo_collaborators}
                repo_contributors = [
                    {
                        "username": contrib.login,
                        "name": contrib.name or contrib.login,
                        "avatar_url": contrib.avatar_url,
                        "contributions": contrib.contributions,
                        "type": "contributor"
                    }
                    for contrib in contributors_list 
                    if contrib.login != user.login and contrib.login not in collab_usernames
                ]
                
                # Track contributors
                for contrib in repo_contributors:
                    username = contrib["username"]
                    if username not in all_people:
                        all_people[username] = {
                            "username": username,
                            "name": contrib["name"],
                            "avatar_url": contrib["avatar_url"],
                            "repo_count": 0,
                            "type": "contributor",
                            "total_contributions": 0
                        }
                    all_people[username]["repo_count"] += 1
                    if "total_contributions" in all_people[username]:
                        all_people[username]["total_contributions"] += contrib["contributions"]
                    else:
                        all_people[username]["total_contributions"] = contrib["contributions"]
                        
            except:
                # API errors - skip contributors for this repo
                pass
            
            # Add repo data if it has any collaborators or contributors
            if repo_collaborators or repo_contributors:
                collaborators_data["collaborators_by_repo"].append({
                    "repo_name": repo.name,
                    "repo_url": repo.html_url,
                    "collaborators": repo_collaborators,
                    "contributors": repo_contributors,
                    "total_people": len(repo_collaborators) + len(repo_contributors)
                })
        
        # Set totals
        collaborators_data["total_unique_people"] = len(all_people)
        collaborators_data["total_unique_collaborators"] = len([p for p in all_people.values() if p["type"] == "collaborator"])
        collaborators_data["total_unique_contributors"] = len([p for p in all_people.values() if p["type"] == "contributor"])
        
        # Get top people (sorted by number of repos)
        if all_people:
            sorted_people = sorted(
                all_people.values(),
                key=lambda x: x["repo_count"],
                reverse=True
            )
            collaborators_data["top_people"] = sorted_people[:15]
        
        return collaborators_data
    
    def _calculate_collaboration_score(self, user, repos: List) -> Dict:
        """Calculate comprehensive collaboration score and metrics."""
        
        # Initialize metrics
        total_prs = 0
        total_issues = 0
        forked_repos = 0
        contributed_repos = 0
        pr_review_participation = 0
        issue_participation = 0
        collaborative_projects = 0
        repos_forked_by_others = 0  # Count of times user's repos were forked
        unique_collaborators = 0  # People with push access
        unique_contributors = 0  # Commit authors
        
        # Analyze repositories (limit to prevent rate limiting)
        analyzed_repos = repos[:30]
        all_collaborators_set = set()
        all_contributors_set = set()
        
        for repo in analyzed_repos:
            try:
                # Check if it's a fork (collaboration indicator)
                if repo.fork:
                    forked_repos += 1
                    contributed_repos += 1
                
                # Count how many times this repo has been forked by others
                if not repo.fork and repo.forks_count > 0:
                    repos_forked_by_others += repo.forks_count
                
                # Count unique collaborators and contributors for owned repos
                if not repo.fork and repo.owner.login == user.login:
                    try:
                        # Get collaborators
                        collabs = list(repo.get_collaborators())
                        for collab in collabs:
                            if collab.login != user.login:
                                all_collaborators_set.add(collab.login)
                    except:
                        pass
                    
                    try:
                        # Get contributors
                        contribs = list(repo.get_contributors())
                        for contrib in contribs:
                            if contrib.login != user.login:
                                all_contributors_set.add(contrib.login)
                    except:
                        pass
                
                # Check for team projects using alternative signals
                if not repo.fork and repo.owner.login == user.login:
                    # A project is likely collaborative if:
                    # - Has multiple contributors (based on commit count)
                    # - Has pull requests from others
                    # - Has active issue discussions
                    try:
                        # Check if repo has PRs from other users (indicates collaboration)
                        pulls = list(repo.get_pulls(state='all')[:20])
                        other_contributor_prs = [p for p in pulls if p.user.login != user.login]
                        if len(other_contributor_prs) > 0:
                            collaborative_projects += 1
                    except:
                        pass
                
                # Count issues and PRs (limited to avoid rate limits)
                try:
                    issues = list(repo.get_issues(state='all')[:10])
                    total_issues += len([i for i in issues if not i.pull_request])
                    
                    # Count PR participation
                    pulls = list(repo.get_pulls(state='all')[:10])
                    total_prs += len(pulls)
                    
                    # Check for PR review comments
                    for pr in pulls[:5]:
                        try:
                            reviews = list(pr.get_reviews()[:5])
                            if reviews:
                                pr_review_participation += 1
                        except:
                            pass
                except:
                    pass
                    
            except Exception:
                continue
        
        # Set unique counts
        unique_collaborators = len(all_collaborators_set)
        unique_contributors = len(all_contributors_set)
        total_unique_people = unique_collaborators + unique_contributors
        
        # Calculate scores (0-100 scale)
        
        # 1. Fork Activity Score (shows contribution to other projects)
        fork_score = min(100, (forked_repos / max(1, len(analyzed_repos))) * 200)
        
        # 2. Issue Engagement Score
        issue_score = min(100, (total_issues / max(1, len(analyzed_repos))) * 20)
        
        # 3. Pull Request Score
        pr_score = min(100, (total_prs / max(1, len(analyzed_repos))) * 15)
        
        # 4. Code Review Score
        review_score = min(100, (pr_review_participation / max(1, total_prs)) * 100) if total_prs > 0 else 0
        
        # 5. Team Projects Score
        team_score = min(100, (collaborative_projects / max(1, len([r for r in analyzed_repos if not r.fork]))) * 100)
        
        # 6. Community Impact Score (repos forked by others)
        community_impact_score = min(100, (repos_forked_by_others / max(1, len(analyzed_repos))) * 10)
        
        # 7. Network Size Score (unique collaborators + contributors)
        network_size_score = min(100, (total_unique_people / max(1, len([r for r in analyzed_repos if not r.fork]))) * 20)
        
        # Overall Collaboration Score (weighted average with new metrics)
        overall_score = (
            fork_score * 0.18 +              # 18% weight on contributing to others
            issue_score * 0.13 +              # 13% weight on issue engagement
            pr_score * 0.18 +                 # 18% weight on PR activity
            review_score * 0.18 +             # 18% weight on code reviews
            team_score * 0.13 +               # 13% weight on team projects
            community_impact_score * 0.10 +   # 10% weight on community impact (being forked)
            network_size_score * 0.10         # 10% weight on network size
        )
        
        # Determine collaboration level
        if overall_score >= 75:
            level = "Exceptional Collaborator"
            description = "Highly active in team projects, code reviews, and community contributions"
        elif overall_score >= 60:
            level = "Strong Collaborator"
            description = "Regular contributor to collaborative projects with good team engagement"
        elif overall_score >= 40:
            level = "Moderate Collaborator"
            description = "Participates in team projects with some collaborative activity"
        elif overall_score >= 20:
            level = "Emerging Collaborator"
            description = "Beginning to engage in collaborative development"
        else:
            level = "Independent Developer"
            description = "Primarily works on solo projects, potential for more collaboration"
        
        return {
            "overall_score": round(overall_score, 1),
            "level": level,
            "description": description,
            "metrics": {
                "fork_activity": round(fork_score, 1),
                "issue_engagement": round(issue_score, 1),
                "pull_request_activity": round(pr_score, 1),
                "code_review_participation": round(review_score, 1),
                "team_projects": round(team_score, 1),
                "community_impact": round(community_impact_score, 1),
                "network_size": round(network_size_score, 1)
            },
            "stats": {
                "forked_repos": forked_repos,
                "total_issues": total_issues,
                "total_pull_requests": total_prs,
                "pr_reviews": pr_review_participation,
                "collaborative_projects": collaborative_projects,
                "repos_forked_by_others": repos_forked_by_others,
                "unique_collaborators": unique_collaborators,
                "unique_contributors": unique_contributors,
                "total_unique_people": total_unique_people
            },
            "team_fit": "Collaborative" if overall_score >= 50 else "Independent"
        }
