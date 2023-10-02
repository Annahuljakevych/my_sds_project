from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Sample data for contacts (replace with your data source)
contacts = [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com"},
]

# Serve the frontend as static files
app.mount("/static", StaticFiles(directory="static"), name="scratch")

# Define a route to serve the main HTML file
@app.get("/")
async def get_frontend():
    return FileResponse("static/index.html")

@app.get("/contacts/")
def get_contacts():
    return contacts

@app.get("/contacts/{contact_id}")
def get_contact(contact_id: int):
    contact = next((c for c in contacts if c["id"] == contact_id), None)
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@app.post("/contacts/")
async def create_contact(contact: dict):
    # Generate a new contact ID (replace this with your logic)
    new_id = max(c["id"] for c in contacts) + 1
    contact["id"] = new_id

    # Add the new contact to the list
    contacts.append(contact)

    return contact

@app.put("/contacts/{contact_id}")
async def update_contact(contact_id: int, updated_contact: dict):
    for i, contact in enumerate(contacts):
        if contact["id"] == contact_id:
            contacts[i] = updated_contact
            return updated_contact
    raise HTTPException(status_code=404, detail="Contact not found")

@app.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: int):
    for i, contact in enumerate(contacts):
        if contact["id"] == contact_id:
            del contacts[i]
            return {"message": "Contact deleted"}
    raise HTTPException(status_code=404, detail="Contact not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
