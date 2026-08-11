import os
import zipfile
import subprocess
import sys

def install_kaggle():
    try:
        import kaggle
    except ImportError:
        print("Installing kaggle package...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "kaggle"])

def download_paysim_dataset():
    """
    Downloads the PaySim dataset from Kaggle.
    Requires Kaggle API credentials (kaggle.json).
    Place your kaggle.json in ~/.kaggle/kaggle.json
    """
    install_kaggle()
    import kaggle
    
    dataset_name = "ealaxi/paysim1"
    download_path = "./Dataset"
    
    print(f"Downloading {dataset_name} to {download_path}...")
    try:
        kaggle.api.dataset_download_files(dataset_name, path=download_path, unzip=True)
        print("Dataset downloaded and extracted successfully!")
        
        # Rename the extracted file to paysim.csv to match the project requirements
        for file in os.listdir(download_path):
            if file.endswith('.csv') and file != 'paysim.csv':
                old_file = os.path.join(download_path, file)
                new_file = os.path.join(download_path, 'paysim.csv')
                os.rename(old_file, new_file)
                print(f"Renamed {file} to paysim.csv")
                break
                
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please ensure your kaggle.json is properly set up in ~/.kaggle/")

if __name__ == "__main__":
    download_paysim_dataset()
