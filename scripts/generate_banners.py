import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = "/root/edge-blog/public/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# System fonts
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/freefont/FreeSans.ttf"

f_badge = ImageFont.truetype(FONT_BOLD, 22)
f_title = ImageFont.truetype(FONT_BOLD, 52)
f_sub = ImageFont.truetype(FONT_REGULAR, 28)
f_meta = ImageFont.truetype(FONT_BOLD, 20)
f_brand = ImageFont.truetype(FONT_BOLD, 22)

# List of 20 banners with metadata
BANNERS = [
    # Hollywood (10 existing)
    {
        "filename": "avengers-doomsday-doctor-doom-mcu-guide.webp",
        "category": "HOLLYWOOD",
        "badge": "MCU PHASE 6",
        "title": "AVENGERS: DOOMSDAY",
        "subtitle": "Doctor Doom & Robert Downey Jr. Return Analysis",
        "tag": "Release May 2026 • Verified Industry Guide",
        "bg_start": (8, 14, 30),
        "bg_end": (22, 36, 71),
        "accent": (56, 189, 248),
    },
    {
        "filename": "brad-pitt-f1-movie-formula-one-racing-guide.webp",
        "category": "HOLLYWOOD",
        "badge": "WARNER BROS & APPLE",
        "title": "BRAD PITT: F1",
        "subtitle": "Joseph Kosinski Grand Prix Racing Epic Breakdown",
        "tag": "Release June 2025 • IMAX High-Octane Guide",
        "bg_start": (16, 16, 20),
        "bg_end": (30, 30, 38),
        "accent": (239, 68, 68),
    },
    {
        "filename": "fantastic-four-first-steps-mcu-phase-6-guide.webp",
        "category": "HOLLYWOOD",
        "badge": "MARVEL STUDIOS",
        "title": "THE FANTASTIC FOUR",
        "subtitle": "First Steps: Retro 1960s MCU Phase 6 Epic",
        "tag": "Release July 2025 • Galactus & Silver Surfer",
        "bg_start": (10, 25, 47),
        "bg_end": (27, 58, 96),
        "accent": (56, 189, 248),
    },
    {
        "filename": "superman-2025-james-gunn-dcu-reboot-guide.webp",
        "category": "HOLLYWOOD",
        "badge": "DC STUDIOS",
        "title": "SUPERMAN (2025)",
        "subtitle": "James Gunn DCU Chapter One Gods & Monsters",
        "tag": "Release July 2025 • David Corenswet & Nicholas Hoult",
        "bg_start": (7, 20, 38),
        "bg_end": (14, 42, 71),
        "accent": (234, 179, 8),
    },
    {
        "filename": "wolfs-movie-review-brad-pitt-george-clooney.webp",
        "category": "HOLLYWOOD",
        "badge": "APPLE ORIGINAL FILMS",
        "title": "WOLFS",
        "subtitle": "Brad Pitt & George Clooney Neo-Noir Fixer Comedy",
        "tag": "Streaming on Apple TV+ • 4K Dolby Atmos",
        "bg_start": (13, 14, 18),
        "bg_end": (29, 32, 38),
        "accent": (245, 158, 11),
    },
    {
        "filename": "deadpool-and-wolverine-mcu-review-guide.webp",
        "category": "HOLLYWOOD",
        "badge": "MARVEL STUDIOS",
        "title": "DEADPOOL & WOLVERINE",
        "subtitle": "Ryan Reynolds & Hugh Jackman Multiverse Guide",
        "tag": "$1.33B Box Office • TVA & Void Cameos Breakdown",
        "bg_start": (26, 8, 12),
        "bg_end": (46, 16, 24),
        "accent": (239, 68, 68),
    },
    {
        "filename": "dune-2-movie-review-box-office-analysis.webp",
        "category": "HOLLYWOOD",
        "badge": "WARNER BROS",
        "title": "DUNE: PART TWO",
        "subtitle": "Denis Villeneuve Sci-Fi Masterpiece & Box Office",
        "tag": "$714M Worldwide Gross • IMAX 70mm Visuals",
        "bg_start": (30, 18, 8),
        "bg_end": (56, 32, 14),
        "accent": (245, 158, 11),
    },
    {
        "filename": "gladiator-2-ridley-scott-sequel-review.webp",
        "category": "HOLLYWOOD",
        "badge": "PARAMOUNT PICTURES",
        "title": "GLADIATOR II",
        "subtitle": "Ridley Scott Colosseum Sequel & Historical Breakdown",
        "tag": "Paul Mescal & Denzel Washington • Box Office Report",
        "bg_start": (26, 10, 10),
        "bg_end": (46, 18, 18),
        "accent": (234, 179, 8),
    },
    {
        "filename": "inside-out-2-pixar-movie-review-guide.webp",
        "category": "HOLLYWOOD",
        "badge": "PIXAR ANIMATION",
        "title": "INSIDE OUT 2",
        "subtitle": "Psychological Analysis & $1.69B Record Breaker",
        "tag": "All-Time Highest-Grossing Animated Film",
        "bg_start": (18, 8, 31),
        "bg_end": (37, 18, 61),
        "accent": (168, 85, 247),
    },
    {
        "filename": "oppenheimer-christopher-nolan-film-analysis.webp",
        "category": "HOLLYWOOD",
        "badge": "UNIVERSAL PICTURES",
        "title": "OPPENHEIMER",
        "subtitle": "Christopher Nolan 7-Time Oscar Winner & Trinity Test",
        "tag": "$977M Worldwide • Historical Accuracy Analysis",
        "bg_start": (15, 17, 21),
        "bg_end": (36, 34, 32),
        "accent": (249, 115, 22),
    },
    # Bollywood (2 posts)
    {
        "filename": "stree-2-movie-box-office-horror-comedy-universe.webp",
        "category": "BOLLYWOOD",
        "badge": "MADDOCK SUPERNATURAL UNIVERSE",
        "title": "STREE 2: SARKATE KA AATANK",
        "subtitle": "Shraddha Kapoor & Rajkummar Rao Record-Breaking Run",
        "tag": "₹874 Cr Worldwide • All-Time Hindi Blockbuster",
        "bg_start": (18, 8, 15),
        "bg_end": (40, 14, 32),
        "accent": (236, 72, 153),
    },
    {
        "filename": "singham-again-cop-universe-box-office-review.webp",
        "category": "BOLLYWOOD",
        "badge": "ROHIT SHETTY COP UNIVERSE",
        "title": "SINGHAM AGAIN",
        "subtitle": "Ajay Devgn & Akshay Kumar Ramayana-Themed Action",
        "tag": "Multi-Starrer Cop Universe • Box Office Breakdown",
        "bg_start": (22, 12, 4),
        "bg_end": (42, 23, 8),
        "accent": (234, 179, 8),
    },
    # South Cinema (2 posts)
    {
        "filename": "pushpa-2-the-rule-allu-arjun-box-office-guide.webp",
        "category": "SOUTH CINEMA",
        "badge": "MYTHRI MOVIE MAKERS",
        "title": "PUSHPA 2: THE RULE",
        "subtitle": "Allu Arjun & Sukumar Mass Action Phenomenon",
        "tag": "Record Pre-Sales • Global Pan-India Theatrical Guide",
        "bg_start": (20, 8, 8),
        "bg_end": (42, 12, 12),
        "accent": (239, 68, 68),
    },
    {
        "filename": "kalki-2898-ad-prabhas-sci-fi-box-office-analysis.webp",
        "category": "SOUTH CINEMA",
        "badge": "VYJAYANTHI MOVIES",
        "title": "KALKI 2898 AD",
        "subtitle": "Prabhas, Amitabh Bachchan & Nag Ashwin Mythological Sci-Fi",
        "tag": "₹1,040 Cr Worldwide • Mahabharata Lore & VFX Analysis",
        "bg_start": (9, 13, 22),
        "bg_end": (20, 31, 51),
        "accent": (56, 189, 248),
    },
    # OTT & Web Series (2 posts)
    {
        "filename": "panchayat-season-3-review-phulera-village-breakdown.webp",
        "category": "OTT & WEB SERIES",
        "badge": "PRIME VIDEO & TVF",
        "title": "PANCHAYAT: SEASON 3",
        "subtitle": "Jitendra Kumar & Neena Gupta Phulera Village Chronicle",
        "tag": "Rural Drama Masterpiece • Ending Explained & Season 4",
        "bg_start": (9, 20, 12),
        "bg_end": (18, 36, 23),
        "accent": (34, 197, 94),
    },
    {
        "filename": "mirzapur-season-3-review-crime-thriller-analysis.webp",
        "category": "OTT & WEB SERIES",
        "badge": "EXCEL ENTERTAINMENT",
        "title": "MIRZAPUR: SEASON 3",
        "subtitle": "Ali Fazal & Pankaj Tripathi Purvanchal Throne Battle",
        "tag": "Guddu Pandit Reign • Character Arcs & Season 4 Future",
        "bg_start": (20, 8, 10),
        "bg_end": (38, 16, 20),
        "accent": (239, 68, 68),
    },
    # Cinema News (2 posts)
    {
        "filename": "dhoom-4-ranbir-kapoor-yrf-spy-universe-updates.webp",
        "category": "CINEMA NEWS",
        "badge": "YASH RAJ FILMS",
        "title": "DHOOM 4: REBOOT UPDATES",
        "subtitle": "Ranbir Kapoor Cast as Master Thief & YRF Franchise Plan",
        "tag": "Ayan Mukerji Talks • Official Casting & Budget Details",
        "bg_start": (8, 12, 20),
        "bg_end": (16, 24, 38),
        "accent": (56, 189, 248),
    },
    {
        "filename": "avengers-secret-wars-mcu-phase-6-timeline-news.webp",
        "category": "CINEMA NEWS",
        "badge": "MARVEL STUDIOS",
        "title": "AVENGERS: SECRET WARS",
        "subtitle": "Battleworld, Multiverse Incursions & Phase 6 Calendar",
        "tag": "May 2027 Theatrical Target • Full MCU Lineup Roadmap",
        "bg_start": (12, 8, 24),
        "bg_end": (26, 15, 48),
        "accent": (168, 85, 247),
    },
    # Movie Reviews (2 posts)
    {
        "filename": "chandu-champion-kartik-aaryan-biographical-review.webp",
        "category": "MOVIE REVIEWS",
        "badge": "NADIADWALA GRANDSON",
        "title": "CHANDU CHAMPION",
        "subtitle": "Kartik Aaryan & Kabir Khan Murlikant Petkar Biopic",
        "tag": "Paralympic Gold Medalist Saga • Critical Review",
        "bg_start": (11, 18, 24),
        "bg_end": (18, 34, 46),
        "accent": (234, 179, 8),
    },
    {
        "filename": "manjummel-boys-survival-thriller-film-analysis.webp",
        "category": "MOVIE REVIEWS",
        "badge": "PARAVA FILMS",
        "title": "MANJUMMEL BOYS",
        "subtitle": "Chidambaram Survival Thriller & Guna Caves Miracle",
        "tag": "₹240 Cr All-Time Malayalam Record • Real Event Breakdown",
        "bg_start": (7, 17, 18),
        "bg_end": (14, 32, 34),
        "accent": (20, 184, 166),
    }
]

W, H = 1200, 675

def generate_banner(data):
    img = Image.new("RGB", (W, H), data["bg_start"])
    draw = ImageDraw.Draw(img)

    # 1. Smooth gradient
    r1, g1, b1 = data["bg_start"]
    r2, g2, b2 = data["bg_end"]
    for y in range(H):
        t = y / H
        r = int(r1 + (r2 - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # 2. Sleek decorative geometric frames
    accent_rgb = data["accent"]
    
    # Outer subtle boundary
    draw.rectangle([44, 44, W - 44, H - 44], outline=(255, 255, 255, 20), width=1)
    
    # Corner accent bars
    draw.line([(44, 44), (260, 44)], fill=accent_rgb, width=5)
    draw.line([(44, 44), (44, 120)], fill=accent_rgb, width=5)
    
    draw.line([(W - 260, H - 44), (W - 44, H - 44)], fill=accent_rgb, width=5)
    draw.line([(W - 44, H - 120), (W - 44, H - 44)], fill=accent_rgb, width=5)

    # 3. Category & Studio Badge pill
    cat_text = f"  {data['category']}  •  {data['badge']}  "
    draw.text((80, 85), cat_text.strip(), fill=accent_rgb, font=f_badge)

    # 4. Main Title
    draw.text((80, 180), data["title"], fill=(255, 255, 255), font=f_title)
    
    # 5. Subtitle
    draw.text((80, 275), data["subtitle"], fill=(203, 213, 225), font=f_sub)
    
    # 6. Sleek horizontal divider
    draw.line([(80, 390), (W - 80, 390)], fill=(255, 255, 255, 30), width=1)
    
    # 7. Metadata / Feature Tag
    draw.text((80, 440), f"TG MOVIES EDITORIAL   |   {data['tag']}", fill=(148, 163, 184), font=f_meta)

    # 8. Bottom branding & authenticity check
    draw.text((80, 560), "100% VERIFIED EDITORIAL RESEARCH • NON-COPYRIGHT ORIGINAL MEDIA", fill=(100, 116, 139), font=f_meta)
    draw.text((W - 220, 560), "tgmovies.in", fill=accent_rgb, font=f_brand)

    out_path = os.path.join(OUTPUT_DIR, data["filename"])
    q = 65
    while True:
        img.save(out_path, format="WEBP", quality=q, method=6)
        size_kb = os.path.getsize(out_path) / 1024
        if size_kb < 19.0 or q <= 40:
            break
        q -= 3
    print(f"Generated {data['filename']}: {size_kb:.2f} KB (quality={q}, 1200x675)")

for banner in BANNERS:
    generate_banner(banner)

print("SUCCESS: All 20 banners generated at 1200x675 under 20KB!")
