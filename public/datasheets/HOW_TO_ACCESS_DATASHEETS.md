# 📖 How to Access Your Datasheets

## 🎯 Three Ways to Access the Datasheets

### Method 1: View PDFs Directly (Recommended)

**All generated PDFs are in the `output/` folder:**

```bash
# Open the output folder
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets"
open output/
```

Or in Finder:
1. Navigate to: `Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets/output`
2. All PDFs are here, ready to view!

**File naming:** `PRODUCT_CODE_data.pdf`
- Example: `HY_105_data.pdf`, `PE_505_data.pdf`

### Method 2: View Interactive HTML (Browser)

**Start the local server (if not running):**
```bash
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets"
python3 -m http.server 8765
```

**Then open any datasheet in browser:**

```
http://localhost:8765/flexible-template.html?data=data/HY_105_data.json
http://localhost:8765/flexible-template.html?data=data/PE_505_data.json
http://localhost:8765/flexible-template.html?data=data/CG_503_data.json
```

**Benefits of browser view:**
- ✅ Interactive
- ✅ Can print to PDF yourself
- ✅ See live edits when you update JSON

### Method 3: Create an Index Page

Let me create an index page for easy browsing:

```bash
# This will create index.html with links to all datasheets
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets"
python3 create_index.py
```

Then open: `http://localhost:8765/index.html`

## 📂 File Structure

```
public/datasheets/
├── output/                          ← YOUR PDF FILES ARE HERE!
│   ├── HY_105_data.pdf
│   ├── PE_505_data.pdf
│   ├── CG_503_data.pdf
│   ├── style_150C_data.pdf
│   └── ... (54 PDFs total)
│
├── data/                            ← JSON source files
│   ├── HY_105_data.json
│   ├── PE_505_data.json
│   └── ... (54 JSON files)
│
└── flexible-template.html           ← Template for viewing in browser
```

## 🔍 Finding Specific Products

### Quick Search in Finder:
1. Open: `public/datasheets/output/`
2. Press `Cmd + F`
3. Type product code (e.g., "HY 105")

### List All PDFs:
```bash
cd output
ls -la *.pdf
```

### Search by Industry:

**Fertilizer Products:**
- HY_105_data.pdf
- HY_107_data.pdf
- HY_501_data.pdf
- HY_107HD_data.pdf
- HY_105HD_data.pdf
- HY_105T_data.pdf
- PE_102_data.pdf

**Chemical Products:**
- PE_505_data.pdf
- CG_503_data.pdf
- PE_104_data.pdf
- PE_504P_data.pdf
- PE_104C_data.pdf
- 801CC_data.pdf
- PE_104A_data.pdf
- HY_510EC_data.pdf

**Power Products:**
- HY_606_data.pdf
- PA_106E_data.pdf
- 100fx_data.pdf
- PA_104A_data.pdf
- PA_106_data.pdf
- CG_900_data.pdf
- GM_300Z_data.pdf
- GM_310C_data.pdf

**Water/Waste Water:**
- 120AR_data.pdf
- 150C_data.pdf
- OR_125_data.pdf
- 120_data.pdf
- 504IVC_data.pdf

**Oil & Gas:**
- CG_102_data.pdf
- CG_101_data.pdf
- ULTRA_FE_1003_data.pdf
- ULTRA_LE_1002_data.pdf
- ULTRA_LT_1004_data.pdf
- OR_125SR_data.pdf

## 📧 Sharing Datasheets

### Email Individual Datasheet:
1. Go to `output/` folder
2. Find the PDF (e.g., `HY_105_data.pdf`)
3. Right-click → Share → Email

### Share All Datasheets:
1. Compress the `output/` folder
2. Share the ZIP file

### Upload to Website:
Copy PDFs to your website's download folder:
```bash
cp output/*.pdf /path/to/your/website/downloads/
```

## 🖨️ Printing Datasheets

### Print from PDF:
1. Open PDF in `output/` folder
2. Press `Cmd + P`
3. Select printer
4. Print

### Print from Browser:
1. Open: `http://localhost:8765/flexible-template.html?data=data/PRODUCT_data.json`
2. Press `Cmd + P`
3. ✅ Enable "Background graphics"
4. Print or "Save as PDF"

## 🔧 Editing Datasheets

### To Update a Datasheet:

1. **Edit the JSON file:**
   ```bash
   # Open in text editor
   open data/HY_105_data.json
   ```

2. **Make changes** (edit text, features, specs, etc.)

3. **Regenerate PDF:**
   ```bash
   node generate-pdf.js data/HY_105_data.json output/HY_105.pdf
   ```

4. **View updated PDF:**
   ```bash
   open output/HY_105.pdf
   ```

## 📱 Accessing on Mobile/Tablet

### Option 1: Transfer PDFs
1. Email PDFs to yourself
2. Open on mobile device

### Option 2: Cloud Storage
1. Upload `output/` folder to Dropbox/Google Drive
2. Access from any device

### Option 3: Host on Server
1. Upload to your web server
2. Access via URL: `https://yourwebsite.com/datasheets/PRODUCT.pdf`

## 🌐 Creating a Public Link

### Using GitHub Pages (Free):
1. Create GitHub repository
2. Upload `output/` folder
3. Enable GitHub Pages
4. Access at: `https://username.github.io/datasheets/HY_105.pdf`

### Using Your Web Server:
```bash
# Upload to server
scp output/*.pdf user@yourserver.com:/var/www/html/datasheets/

# Access at
https://yourwebsite.com/datasheets/HY_105_data.pdf
```

## 📊 Organizing Datasheets

### Create Folders by Industry:
```bash
cd output
mkdir Fertilizer Chemical Power Water OilGas

# Move files (example)
mv HY_105_data.pdf Fertilizer/
mv PE_505_data.pdf Chemical/
mv HY_606_data.pdf Power/
```

### Create a Catalog:
Create `CATALOG.md` listing all products:
```markdown
# Inmarco Product Catalog

## Fertilizer
- [HY 105](output/HY_105_data.pdf)
- [HY 107](output/HY_107_data.pdf)

## Chemical
- [PE 505](output/PE_505_data.pdf)
- [CG 503](output/CG_503_data.pdf)
```

## 🚀 Quick Access Commands

### Open output folder:
```bash
open "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets/output"
```

### View in browser:
```bash
open "http://localhost:8765/flexible-template.html?data=data/HY_105_data.json"
```

### List all PDFs:
```bash
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets/output"
ls -1 *.pdf
```

### Count total PDFs:
```bash
ls -1 output/*.pdf | wc -l
```

## 📞 Quick Reference

| What You Want | How to Do It |
|---------------|--------------|
| **View all PDFs** | Open `output/` folder in Finder |
| **View in browser** | `http://localhost:8765/flexible-template.html?data=data/FILE.json` |
| **Print datasheet** | Open PDF, press Cmd+P |
| **Email datasheet** | Right-click PDF → Share → Email |
| **Edit content** | Edit JSON file, regenerate PDF |
| **Add new product** | Create JSON, run generate-pdf.js |

## ✨ Pro Tips

1. **Bookmark in browser:** Create bookmarks for frequently accessed datasheets
2. **Desktop shortcuts:** Create aliases to `output/` folder on desktop
3. **Batch print:** Select multiple PDFs in Finder, right-click → Print
4. **Search content:** Use macOS Spotlight to search PDF content
5. **Quick Preview:** Select PDF in Finder, press Space for Quick Look

---

## 🎯 TL;DR - Fastest Way to Access

**Just open this folder:**
```
Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/public/datasheets/output
```

**All 54 PDFs are there!** Double-click any to open. 🎉
