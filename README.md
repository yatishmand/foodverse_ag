# 🌿 Food Verse AI — Smart Food Intelligence Platform

> **A modern, multimodal AI-powered platform for food identification, nutritional estimation, visible produce freshness assessment, generative cooking assistance, personalized meal planning, and visible kitchen hygiene monitoring.**

Designed as a complete, polished, and beginner-friendly college assignment / viva MVP project.

---

## 📌 1. Project Introduction & Objectives

Nutrition awareness, food waste reduction, and kitchen sanitation are critical pillars of daily wellness and food safety. **Food Verse AI** integrates multimodal artificial intelligence into an intuitive, accessible web application that empowers individuals and food service staff to:

1. **AI Food Scanner**: Identify prepared meals or snacks from photographs, calculate calorie estimates, and compute approximate macronutrient distributions (protein, carbohydrates, fats, dietary fiber).
2. **Freshness Checker**: Assess visual appearance indicators of fruits, vegetables, and produce, flagging early signs of senescence and providing proper storage advice.
3. **Smart Cooking Assistant**: Turn whatever ingredients are in your fridge into customized recipes tailored by cuisine, dietary preference, and prep time.
4. **Nutrition Planner**: Formulate structured daily meal schedules matching personalized caloric targets while strictly avoiding user allergens.
5. **Visible Hygiene Monitor**: Screen food preparation counters, cutting boards, and dining tables for visible cleanliness hazards and cross-contamination risks.

---

## 🛠️ 2. Technologies Used

### **Frontend**
- **React.js (v19)** with **Vite** for blazing fast build times and developer ergonomics.
- **Vanilla CSS3** Design System (Deep forest green `#1b4332`, vibrant lime green `#52b788`, and warm cream `#faf8f5`).
- **Framer Motion** for smooth page transitions and micro-interactions.
- **Lucide React** for modern UI iconography.
- Fully responsive layout for desktop, tablet, and mobile screens.
- Dark mode and light mode theme switcher with persistent local storage.

### **Backend**
- **Python (3.10+)** with **FastAPI** for high-performance asynchronous REST API endpoints.
- **Pydantic (v2)** for data validation and schema serialization.
- **Uvicorn** ASGI web server.
- **python-dotenv** for secure environment variable isolation.
- **python-multipart** for multipart image upload processing.

### **AI & Multimodal Engine**
- Multimodal AI architecture supporting **Google Gemini API** (`gemini-1.5-flash`).
- Built-in **Adaptive Demo Mode Engine**: Generates realistic domain simulations if an AI key is not supplied. The app always starts and works 100% of the time, zero-crash guarantee!

### **Database (Optional Cloud & In-Memory)**
- **Supabase Cloud PostgreSQL** integration for persistent activity logs and scan statistics.
- Graceful in-memory fallback store when Supabase is not configured yet.
- Ready-to-run `backend/supabase_schema.sql` file included.

---

## 📁 3. Project Structure

```text
FoodVerseAI/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DemoBadge.jsx       # Polished Live AI vs Demo simulation badge
│   │   │   ├── Header.jsx          # Top bar with status and theme controls
│   │   │   ├── ImageUploader.jsx   # Drag-and-drop, camera trigger, viva sample presets
│   │   │   ├── Sidebar.jsx         # Sticky desktop sidebar & mobile drawer
│   │   │   └── StatCard.jsx        # Telemetry counter card
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Executive summary, stats, 5 feature cards, live feed
│   │   │   ├── FoodScanner.jsx     # Food photo identification & macro breakdown
│   │   │   ├── FreshnessChecker.jsx# Produce quality grading & safety guidance
│   │   │   ├── CookingAssistant.jsx# Pantry ingredient synthesis into custom recipes
│   │   │   ├── NutritionPlanner.jsx# Caloric partition & scheduled daily meal plans
│   │   │   ├── HygieneMonitor.jsx  # Prep area cleanliness audit & recommendations
│   │   │   └── Settings.jsx        # Diagnostics ping, secrets guide, viva notes
│   │   ├── services/
│   │   │   └── api.js              # REST API connector to FastAPI
│   │   ├── utils/
│   │   │   └── sampleImages.js     # Canvas-generated test samples for 1-click viva testing
│   │   ├── App.css
│   │   ├── App.jsx                 # App root with state, theme sync, and navigation
│   │   ├── index.css               # Design system & CSS tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application, CORS, and root endpoints
│   │   ├── routes/
│   │   │   ├── food.py             # POST /api/food/analyze
│   │   │   ├── freshness.py        # POST /api/freshness/analyze
│   │   │   ├── recipes.py          # POST /api/recipes/generate
│   │   │   ├── nutrition.py        # POST /api/nutrition/plan
│   │   │   ├── hygiene.py          # POST /api/hygiene/analyze
│   │   │   └── stats.py            # GET /api/stats, /api/activities, /api/health
│   │   ├── schemas/                # Pydantic data models
│   │   └── services/
│   │       ├── ai_service.py       # Google Gemini vision + text pipeline
│   │       ├── demo_data.py        # High-fidelity domain simulation generator
│   │       └── supabase_service.py # Cloud database & in-memory telemetry
│   ├── .env.example                # Safe template for keys
│   ├── .env                        # Local configuration file (gitignored)
│   ├── requirements.txt            # Python dependencies
│   └── supabase_schema.sql         # SQL tables & policies for Supabase
├── .gitignore
└── README.md
```

---

## 💻 4. Software Prerequisites

Make sure the following are installed on your Windows machine:
1. **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
2. **Python**: v3.10, v3.11, v3.12, or v3.13 ([Download Python](https://www.python.org/))
   - *Important*: During Python setup on Windows, check the box **"Add Python to PATH"**.

---

## 🚀 5. Windows Installation & Setup Guide

### Step 1: Open Windows PowerShell or Command Prompt
Open two separate terminal windows (Terminal 1 for the Backend, Terminal 2 for the Frontend).

---

### Step 2: Configure & Start the Python Backend (Terminal 1)

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create a Python virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows PowerShell:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
     *(If Windows displays a script execution policy error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` and re-run the activate command, or use `.\venv\Scripts\activate.bat` in CMD).*

4. Install the required backend dependencies:
   ```powershell
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. Create your environment configuration file:
   ```powershell
   copy .env.example .env
   ```
   *(Note: The default `.env` is already configured for Demo Mode so you can start right away without entering any keys!)*

6. Launch the FastAPI server:
   ```powershell
   python -m uvicorn app.main:app --reload --port 8000
   ```
   You should see:
   ```text
   🌱 Food Verse AI Backend Starting
   🤖 AI Engine Status: Demo Mode Enabled (Realistic Simulation Fallback)
   🗄️ Database Status:  Local Reactive Memory Store
   🚀 Interactive Swagger Docs: http://localhost:8000/docs
   Uvicorn running on http://0.0.0.0:8000
   ```

---

### Step 3: Install & Start the React Frontend (Terminal 2)

1. Open your second terminal and navigate to `frontend`:
   ```powershell
   cd frontend
   ```

2. Install the frontend packages:
   ```powershell
   npm.cmd install
   ```

3. Start the Vite development server:
   ```powershell
   npm.cmd run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 🔑 6. Optional: Connecting Live Google Gemini AI & Supabase

The platform works **out of the box** in Demo Mode with zero configuration. When ready to enable live AI or Cloud Database storage:

### A. Google Gemini Multimodal AI API
1. Visit [Google AI Studio](https://aistudio.google.com/) and generate a free API key.
2. Open `backend/.env` in any text editor.
3. Paste your key:
   ```ini
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   ```
4. Save the file. The backend will automatically reload and show `AI Provider: Gemini Live`!

### B. Supabase Cloud Database
1. Create a free project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** tab in Supabase, paste the contents of `backend/supabase_schema.sql`, and click **Run**.
3. Under Project Settings -> API, copy your `Project URL` and `anon public key`.
4. Add them to `backend/.env`:
   ```ini
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Restart your backend terminal. The status will immediately switch to `Connected Supabase Cloud DB`.

---

## 🛡️ 7. Safety, Health & Legal Disclaimers

The application incorporates transparent safety notices:
- **Nutritional Values**: Visual food analysis produces non-clinical estimations. Actual caloric density depends on portion mass, cooking oils, and hidden preparation ingredients.
- **Freshness Guidance**: AI visual inspection reviews visible surface characteristics. It cannot identify invisible microbiological pathogens (such as *Salmonella*, *Listeria*, or *E. coli*).
- **Sanitation Monitoring**: Visual inspection audits surface orderliness and cross-contamination vectors; it does not certify commercial health code compliance or replace official health inspectors.

---

## ❓ 8. Common Errors & Troubleshooting

| Issue / Error | Cause | Solution |
| :--- | :--- | :--- |
| `PSSecurityException: running scripts is disabled` | Windows PowerShell default execution policy | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell window, or use `npm.cmd` directly. |
| `Failed to fetch / Network Error` | Frontend cannot reach backend | Verify that the FastAPI backend is running on `http://localhost:8000`. Test via the **Settings -> Diagnostics** tab in the app. |
| `File size exceeds 10MB limit` | Uploaded image is too large | Upload an image under 10MB or use our instant 1-click viva sample buttons. |
| `Port 8000 already in use` | Another program is running on port 8000 | Kill the process or launch on a different port: `python -m uvicorn app.main:app --port 8080` (and update `VITE_API_URL` if needed). |

---

## 🔮 9. Future Scope & Enhancements

1. **Barcode & Packaging OCR Scanner**: Direct nutrition facts label parsing from grocery item packaging.
2. **Weekly Meal Batch Prep Generator**: Automatically generate grocery shopping lists grouped by supermarket aisle.
3. **IoT Smart Fridge Integration**: Edge computer vision camera streams monitoring refrigerator expiration dates automatically.
4. **Wearable Health Sync**: Synchronize estimated daily calorie burns from Apple Health or Google Fit with meal plan recommendations.

---

## 🎓 10. Student Viva Quick Reference

- **Q: Where are the API secrets stored?**
  *A:* All API keys are isolated exclusively inside the Python FastAPI backend (`backend/.env`). No secret keys are ever exposed or bundled in client-side React code.
- **Q: What happens if there is no internet or no API key?**
  *A:* The backend activates an intelligent rule-based simulation engine with clear visual `DEMO` badges, ensuring the examiner sees complete, interactive workflows without crashes.
- **Q: How does the AI parse images?**
  *A:* Uploaded images are validated for size and MIME type, converted to base64, and forwarded to Google Gemini's multimodal vision API with strict JSON schema instructions.
