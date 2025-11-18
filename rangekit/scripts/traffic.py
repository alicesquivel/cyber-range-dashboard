import requests, random, time

urls = ["http://10.0.0.20", "http://10.0.0.30", "http://10.0.0.30/dashboard_index.html"]

while True:
    try:
        r = requests.get(random.choice(urls), timeout=2)
        print("Benign visit", r.status_code)
    except Exception as e:
        print("Error:", e)
    time.sleep(3)
    