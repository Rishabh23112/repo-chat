import os
import shutil
import subprocess
import re
from typing import List, Dict, Any

REPO_STORAGE_PATH = "./cloned_repos"

def get_repo_name(url: str) -> str:
    pattern = r"https?://github.com/([^/]+)/([^/]+)"
    match = re.match(pattern, url)
    if match:
        owner = match.group(1)
        repo = match.group(2)
        return f"{owner}_{repo}"
    raise ValueError("Invalid GitHub URL")

def clone_repository(url: str) -> str:
    repo_name = get_repo_name(url)
    repo_path = os.path.abspath(os.path.join(REPO_STORAGE_PATH, repo_name))
    
    # Create storage directory if it doesn't exist
    os.makedirs(REPO_STORAGE_PATH, exist_ok=True)
    
    # Force cleanup of existing directory
    if os.path.exists(repo_path):
        print(f"Removing existing directory: {repo_path}")
        max_retries = 3
        for attempt in range(max_retries):
            try:
                def force_remove_readonly(func, path, excinfo):
                    """Force remove read-only files"""
                    import stat
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                
                shutil.rmtree(repo_path, onerror=force_remove_readonly)
                break
            except Exception as e:
                if attempt < max_retries - 1:
                    import time
                    time.sleep(1)  # Wait a bit before retry
                else:
                    raise RuntimeError(f"Failed to remove existing directory after {max_retries} attempts: {e}")
    
    # Clone using subprocess with list arguments
    clone_url = url if url.endswith('.git') else f'{url}.git'
    
    try:
        print(f"Cloning repository to: {repo_path}")
        # Use list format for better Windows compatibility
        result = subprocess.run(
            ['git', 'clone', clone_url, repo_path],
            capture_output=True,
            text=True,
            check=True,
            timeout=300  # 5 minute timeout
        )
        
        # Remove .git directory to save space
        git_dir = os.path.join(repo_path, ".git")
        if os.path.exists(git_dir):
            def force_remove_readonly(func, path, excinfo):
                import stat
                os.chmod(path, stat.S_IWRITE)
                func(path)
            shutil.rmtree(git_dir, onerror=force_remove_readonly)
            
    except subprocess.TimeoutExpired:
        raise RuntimeError("Repository cloning timed out. The repository might be too large.")
    except subprocess.CalledProcessError as e:
        error_output = e.stderr if e.stderr else str(e)
        # Clean error message
        if "already exists" in error_output.lower():
            raise RuntimeError(f"Directory already exists and couldn't be removed. Please manually delete: {repo_path}")
        raise RuntimeError(f"Failed to clone repository: {error_output}")
    except FileNotFoundError:
        raise RuntimeError("Git is not installed or not in PATH. Please install Git from https://git-scm.com/")
    except Exception as e:
        raise RuntimeError(f"Unexpected error during cloning: {str(e)}")
        
    return repo_path

def generate_file_tree(path: str) -> List[Dict[str, Any]]:
    tree = []
    try:
        # Sort to show directories first, then files
        items = sorted(os.listdir(path), key=lambda x: (not os.path.isdir(os.path.join(path, x)), x.lower()))
        
        for item in items:
            item_path = os.path.join(path, item)
            if os.path.isdir(item_path):
                tree.append({
                    "name": item,
                    "type": "folder",
                    "children": generate_file_tree(item_path)
                })
            else:
                tree.append({
                    "name": item,
                    "type": "file"
                })
    except PermissionError:
        pass # Skip folders we can't access
        
    return tree
