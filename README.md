# MedStock Register — Deployment Guide (Hinglish)

Ye guide step-by-step batati hai ki is system ko **free** mein live kaise karein.
Koi step samajh na aaye to Claude ko wahi step ka screenshot bhej dena.

---

## Cheezein jo pehle se ban chuki hain
- [x] GitHub account
- [x] Supabase account
- [x] Render account
- [x] Poora code (ye folder)

---

## STEP 1 — Code ko GitHub pe daalo

1. github.com pe login karo
2. Upar right corner mein **"+"** → **"New repository"**
3. Repository name: `medstore-system`
4. **Private** select karo (taaki koi aur na dekh sake)
5. "Create repository" dabao
6. Ab is folder (jo aapke computer mein hai) ko upload karna hai — GitHub apne page pe hi
   "uploading an existing file" ka link dega, us pe click karke **poora `medstore-system` folder**
   (backend + frontend dono) drag-and-drop kar do
7. Neeche "Commit changes" dabao

---

## STEP 2 — Supabase mein Database banao

1. supabase.com pe login karo → **"New Project"**
2. Project name: `medstore-db`
3. Database password: koi strong password banao aur **kahin likh ke rakh lo** (bhoolna mat)
4. Region: **Mumbai / Singapore** (jo pass ho) select karo
5. "Create new project" dabao — 2 minute lagenge banne mein
6. Project banne ke baad: left sidebar mein **Settings** (gear icon) → **Database**
7. "Connection string" section mein **URI** wala format copy karo
   (kuch aisa dikhega: `postgresql://postgres:[YOUR-PASSWORD]@...`)
8. `[YOUR-PASSWORD]` ki jagah apna wahi password daal do jo Step 3 mein banaya tha
9. Ye poora URL **safe jagah save kar lo** — isko "DATABASE_URL" bolte hain, agle step mein chahiye hoga

---

## STEP 3 — Render mein Backend Deploy karo

1. render.com pe login karo → **"New +"** → **"Web Service"**
2. Apna GitHub repo (`medstore-system`) connect karo
3. Settings bharo:
   - **Name:** `medstore-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
4. **Environment Variables** section mein ye add karo:
   - `DATABASE_URL` → Step 2 mein jo Supabase URL copy kiya tha, wahi paste karo
   - `JWT_SECRET` → koi bhi lamba random text likh do (jaise: `myshop2026supersecretkey123`)
   - `CORS_ORIGIN` → abhi ke liye `*` likh do
5. **"Create Web Service"** dabao — 3-5 minute lagenge deploy hone mein
6. Deploy hone ke baad upar ek URL milega jaisa: `https://medstore-backend.onrender.com`
   — **ye URL save kar lo**, frontend ke liye chahiye hoga

### Pehla Admin login banane ke liye
Render dashboard mein apni service kholo → **"Shell"** tab → ye command chalao:
```
npm run prisma:seed
```
Isse ek admin login ban jayega:
- Email: `admin@medstore.local`
- Password: `Admin@123`

**Login karte hi ye password badal lena** (Users API se, ya humse aage guide karwa lena).

---

## STEP 4 — Vercel mein Frontend Deploy karo

1. vercel.com pe jao → GitHub se login karo
2. **"Add New"** → **"Project"** → apna `medstore-system` repo select karo
3. Settings mein:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (khud detect ho jayega)
4. **Environment Variables** mein ye add karo:
   - `VITE_API_URL` → Step 3 wala Render URL (jaise `https://medstore-backend.onrender.com`)
5. **"Deploy"** dabao — 2 minute lagenge
6. Deploy hone ke baad ek URL milega jaisa `https://medstore-system.vercel.app`
   — **yahi aapki live app hai!** Isi link ko kisi ke saath bhi share kar sakte ho.

---

## STEP 5 — CORS theek karo (zaroori)

Render dashboard mein wapas jao → apni backend service → **Environment**:
- `CORS_ORIGIN` ki value `*` se badal ke apna Vercel URL daal do
  (jaise `https://medstore-system.vercel.app`)
- Save karo, service automatically restart ho jayegi

---

## Test kaise karo

1. Apna Vercel link kholo
2. Login karo: `admin@medstore.local` / `Admin@123`
3. Medicine add karo → Purchase karo (stock badhega) → Sale/Bill banao (stock ghategga)
4. Sab kaam karta hua dikhna chahiye

---

## Agar kuch error aaye

- Render "Logs" tab mein exact error dikhta hai — uska screenshot bhej dena
- Sabse common issue: `DATABASE_URL` mein password galat hona — check kar lena
