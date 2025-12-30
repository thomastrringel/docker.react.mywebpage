from fastapi import FastAPI #pip install fastapi uvicorn[standard]

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from finance_api"}
