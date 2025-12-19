import json
import random
import datetime
import os

# --- CONFIGURATION ---
# In real life, you add hundreds of dealer URLs here
TARGET_URLS = [
    "https://www.example-dealer.com/inventory/excavators",
    "https://www.another-dealer.com/search/skid-steers"
]

# --- NORMALIZATION LOGIC ---
def normalize_listing(title, price):
    """
    Cleans messy dealer data into structured searchable data.
    """
    title_upper = title.upper()
    
    # 1. Detect Make
    make = "Other"
    if "DEERE" in title_upper: make = "John Deere"
    elif "CAT" in title_upper: make = "Caterpillar"
    elif "KUBOTA" in title_upper: make = "Kubota"
    elif "BOBCAT" in title_upper: make = "Bobcat"
    
    # 2. Detect Category
    category = "Heavy Equipment"
    if "EXCAVATOR" in title_upper: category = "Excavator"
    elif "SKID" in title_upper or "LOADER" in title_upper: category = "Skid Steer"
    
    # 3. Clean Price
    try:
        clean_price = int(''.join(filter(str.isdigit, str(price))))
    except:
        clean_price = 0
        
    return {
        "id": abs(hash(title)) % 1000000,
        "title": title,
        "make": make,
        "category": category,
        "price": clean_price,
        "formatted_price": f"${clean_price:,.0f}" if clean_price > 0 else "Call for Price",
        "image": f"https://source.unsplash.com/800x600/?{make.replace(' ','')},{category}", # Dynamic placeholder
        "link": "#", # This would link to the real dealer
        "date_added": datetime.date.today().isoformat()
    }

# --- THE SCRAPER ---
def run_scraper():
    inventory = []
    
    # SIMULATION MODE: Generates realistic data so your site looks full immediately.
    # Replace this block with real requests + BeautifulSoup logic when ready.
    makes = ["John Deere", "Caterpillar", "Kubota", "Bobcat"]
    models = ["310SL", "259D", "SV75", "KX040"]
    types = ["Excavator", "Skid Steer", "Backhoe"]
    
    print("⚡ Starting Scrape Job...")
    
    for _ in range(45): # Generate 45 listings
        make = random.choice(makes)
        model = random.choice(models)
        year = random.randint(2015, 2024)
        hours = random.randint(500, 4500)
        price = random.randint(25000, 85000)
        
        raw_title = f"{year} {make} {model} - {hours} Hours"
        item = normalize_listing(raw_title, f"${price}")
        inventory.append(item)
        
    print(f"✅ Scraped {len(inventory)} units.")
    
    # Ensure directory exists
    os.makedirs("data", exist_ok=True)
    
    # Save Database
    with open("data/inventory.json", "w") as f:
        json.dump(inventory, f, indent=2)

if __name__ == "__main__":
    run_scraper()