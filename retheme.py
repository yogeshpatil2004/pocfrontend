import os
import re

dir_path = "/home/yogeshpatil462410/VibodhAi/POCwebsite/frontend/src"

for root, _, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.css') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            orig_content = content
            
            # Replace tailwind classes using indigo
            content = re.sub(r'bg-indigo-(\d+)', r'bg-primary-\1', content)
            content = re.sub(r'text-indigo-(\d+)', r'text-primary-\1', content)
            content = re.sub(r'border-indigo-(\d+)', r'border-primary-\1', content)
            content = re.sub(r'ring-indigo-(\d+)', r'ring-primary-\1', content)
            content = re.sub(r'from-indigo-(\d+)', r'from-primary-\1', content)
            content = re.sub(r'to-indigo-(\d+)', r'to-primary-\1', content)
            content = re.sub(r'hover:text-indigo-(\d+)', r'hover:text-primary-\1', content)
            content = re.sub(r'hover:bg-indigo-(\d+)', r'hover:bg-primary-\1', content)
            
            if content != orig_content:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Updated {filepath}")
