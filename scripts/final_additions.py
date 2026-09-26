import os

BLOG_DIR = "/root/edge-blog/src/content/blog"

FINAL_ADDITIONS = {
    "singham-again-cop-universe-box-office-review.md": """
### What is the future roadmap for Rohit Shetty's Cop Universe?
Rohit Shetty confirmed that development has commenced on *Mission Chulbul Singham*, a standalone team-up film uniting Ajay Devgn and Salman Khan, alongside *Sooryavanshi 2* and an upcoming standalone *Lady Singham* action feature starring Deepika Padukone.
""",

    "panchayat-season-3-review-phulera-village-breakdown.md": """
### How has Panchayat impacted rural tourism in Madhya Pradesh?
The massive popularity of the series transformed Mahodiya village into a popular cultural destination, with thousands of fans visiting the real-world panchayat building, water tank, and village temple to experience the genuine rural setting.
""",

    "mirzapur-season-3-review-crime-thriller-analysis.md": """
### Who composed the iconic title theme for Mirzapur?
The haunting instrumental title theme was composed by John Stewart Eduri, featuring mournful acoustic sitar melodies layered over heavy, reverberating industrial electronic beats that symbolize Purvanchal's grim underworld.
""",

    "dhoom-4-ranbir-kapoor-yrf-spy-universe-updates.md": """
### Which international stunt coordinators are attached to Dhoom 4?
Yash Raj Films is in discussions with Hollywood stunt coordinators Franz Spilhaus (*Commando*, *War*) and Oh Sea-young (*Avengers: Age of Ultron*, *Fan*) to orchestrate high-speed tactical motorcycle pursuit sequences.
""",

    "chandu-champion-kartik-aaryan-biographical-review.md": """
### What message did real-life champion Murlikant Petkar share with youth?
Murlikant Petkar emphasized that physical limitations and socio-economic hardships cannot extinguish the human spirit, urging younger generations to pursue discipline, national pride, and relentless perseverance in the face of adversity.
"""
}

for filename, addition in FINAL_ADDITIONS.items():
    filepath = os.path.join(BLOG_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        new_content = content.strip() + "\n" + addition.strip() + "\n"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        words = len(new_content.split())
        print(f"Final boost {filename} -> {words} words")

print("Final additions completed!")
