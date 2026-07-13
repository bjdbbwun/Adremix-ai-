import { GenerationResponse } from "./types";

export const defaultCampaignInput = {
  productName: "EcoFlask Pro",
  productDescription: "A revolutionary self-cleaning insulated stainless steel water bottle. Uses built-in UV-C light to eliminate 99.9% of bacteria, viruses, and odors in just 60 seconds. Keeps drinks ice cold for 24 hours or steaming hot for 12 hours. Premium satin matte finish, leak-proof smart cap, and dynamic hydration reminder LED ring.",
  targetAudience: "Busy urban professionals, fitness enthusiasts, eco-conscious travelers, and tech-savvy commuters.",
  campaignGoal: "Direct conversions, driving sales to Shopify store.",
  platforms: ["tiktok", "instagram", "youtube", "facebook"],
  toneStyle: "Authentic, energetic UGC, showcasing immediate problem-solution triggers."
};

export const defaultCampaignOutput: GenerationResponse = {
  isABTest: true,
  abComparison: {
    hookStrategyComparison: "Variation A uses a fear-of-bacteria pattern interrupt and disgust hook ('swamp water breeding ground') to capture immediate rational interest. Variation B pivots to a personal, relatable lifestyle problem ('breakouts and acne') to build high empathetic engagement.",
    scriptFlowComparison: "Variation A is structured as a classical direct-response problem-solution pitch, focusing heavily on UV-C speed and efficiency. Variation B utilizes a soft-sell UGC vlog format, weaving the bottle's benefits into a daily routine, culminating in a soft recommendation.",
    winningHypothesis: "For cold traffic on TikTok, Variation B (UGC acne breakout hook) is projected to achieve a 24% higher click-through-rate due to its relatable storytelling nature. For retargeting traffic, Variation A is expected to win on conversions due to its clear, high-urgency value stack."
  },
  platforms: [
    {
      platformName: "TikTok",
      hooks: [
        {
          text: "POV: You realize your insulated water bottle is basically a breeding ground for swamp bacteria.",
          type: "Pattern Interrupt / Disgust Hook",
          conversionRating: 94
        },
        {
          text: "I haven't washed this bottle in three weeks, and it smells perfectly clean. Here's why.",
          type: "Curiosity Gap / Bold Claim",
          conversionRating: 89
        },
        {
          text: "Stop drinking out of steel bottles before you see this video.",
          type: "Warning / Negation Hook",
          conversionRating: 91
        }
      ],
      videoScript: {
        title: "The Silent Bacteria Monster (Variation A)",
        duration: 30,
        scenes: [
          {
            id: 1,
            section: "Hook (0-5s)",
            visual: "Close-up of a standard metallic water bottle. Creator makes a disgusted face, points to the inside, and cuts to microscopy footage of bacteria. Then shows the sleek EcoFlask Pro cap glowing purple.",
            audio: "Creator voiceover: 'Did you know your favorite reusable bottle is crawling with bacteria? That weird metallic smell? It is literally mold. But look at this.' SFX: Fast-paced record scratch, then clean water whoosh.",
            textOverlay: "Bacteria breeding ground?!"
          },
          {
            id: 2,
            section: "Body (5-20s)",
            visual: "Creator taps the smart cap of the EcoFlask Pro. An LED ring spins purple. Creator drinks from it, smiles, and taps the screen. Splits screen to show the UV-C light neutralizing water molecules.",
            audio: "Creator: 'This is the EcoFlask Pro. With one tap, it activates built-in UV-C light to vaporize 99.9% of bacteria and odors in 60 seconds. No scrubbing, no smell, just pure, crisp hydration.'",
            textOverlay: "Self-cleans in 60s!"
          },
          {
            id: 3,
            section: "Call to Action (20-30s)",
            visual: "Creator puts bottle into backpack, zooms in on the matte finish, and points directly down at a glowing animated Shopify button overlay.",
            audio: "Creator: 'If you are ready to stop drinking swamp water, grab yours now while their 40% off sale is live. Click the link below!' Music: Upbeat trend pop swells.",
            textOverlay: "Tap Below - 40% OFF"
          }
        ]
      },
      socialPost: {
        caption: "Be honest... when was the last time you ACTUALLY scrubbed the inside of your water bottle? 🤢\n\nReusable water bottles can trap bacteria, creating mold and stubborn odors. EcoFlask Pro self-cleans with medical-grade UV-C light in just 60 seconds, keeping your water crisp and odor-free forever.\n\n💧 Self-Cleaning (Neutralizes 99.9% of bacteria)\n❄️ Keeps drinks ice cold for 24 hours\n🔥 Keeps tea/coffee hot for 12 hours\n\n👉 Click below to claim 40% off during our Summer launch sale!",
        hashtags: ["#EcoFlaskPro", "#tiktokmademebuyit", "#healthhacks", "#cleanhydro", "#fitnesstok", "#cleantech"]
      },
      targetingTips: [
        "Interests: Hydro Flask, Yeti, Stanley Cup, Clean Eating, Healthy Lifestyle, Sustainable Living",
        "Behaviors: Engaged Shoppers, Active Gym Goers, Camping & Hiking Enthusiasts",
        "Demographics: Age 18-34, Male & Female, Urban Centers"
      ]
    },
    {
      platformName: "Instagram",
      hooks: [
        {
          text: "Three water bottle features I literally cannot live without anymore.",
          type: "Aesthetic Benefit Stack",
          conversionRating: 87
        },
        {
          text: "The aesthetic smart bottle that actually keeps itself clean.",
          type: "Visual Lifestyle Hook",
          conversionRating: 85
        },
        {
          text: "Is your water bottle secretly making you breakout? Let's check.",
          type: "Empathy / Pain Point Hook",
          conversionRating: 90
        }
      ],
      videoScript: {
        title: "Aesthetic Day in My Life (Variation A)",
        duration: 15,
        scenes: [
          {
            id: 1,
            section: "Hook (0-3s)",
            visual: "Cinematic, slow-motion shot of morning light hitting the satin matte finish bottle on a modern workspace desk. A hand gracefully picks it up. Text overlay fade-in.",
            audio: "Music: Relaxing lofi chill beat starts. Satisfying click sound of smart cap sealing.",
            textOverlay: "My new desk essential"
          },
          {
            id: 2,
            section: "Body (3-12s)",
            visual: "Staggered visual montage: Tapping the cap to see the purple ring spin, pouring ice-cold water, placing it in a gym bag, and sipping on a yoga mat.",
            audio: "Voiceover: 'I used to hate that weird metal bottle smell. The EcoFlask Pro self-cleans using UV-C light, so it is always fresh. Plus, it keeps my water ice-cold for literally 24 hours.'",
            textOverlay: "Always fresh. No metallic smell."
          },
          {
            id: 3,
            section: "Call to Action (12-15s)",
            visual: "Close-up of the bottle next to laptop showing the Shopify checkout page. Elegant text swipe up.",
            audio: "Voiceover: 'Upgrade your hydration. Head to my link in bio to shop the premium colors.'",
            textOverlay: "Link in bio to shop"
          }
        ]
      },
      socialPost: {
        caption: "Elevate your daily hydration ritual. ✨\n\nNo more metallic odors or constant scrubbing. The EcoFlask Pro uses built-in UV-C light technology to sanitize your water and self-clean the inside of your bottle with one simple tap.\n\nDesigned for modern life with a premium matte finish, premium insulation, and an LED hydration ring that reminds you when it's time to take a sip.\n\nShop the launch collection now at the link in bio. Limited colors available. 🤍",
        hashtags: ["#hydrationgoals", "#instagramaesthetic", "#deskgoals", "#mindfulliving", "#iamwellandgood", "#cleantech"]
      },
      targetingTips: [
        "Placements: Instagram Reels, Instagram Stories (Aesthetic/Minimalist framing)",
        "Interests: Lululemon, Alo Yoga, Pilates, Self-Care, Minimalist Design, Coffee Shop Aesthetic",
        "Demographics: Age 22-45, Female skewing, High-income postcodes"
      ]
    },
    {
      platformName: "YouTube",
      hooks: [
        {
          text: "Why 99% of insulated water bottles are a waste of money.",
          type: "Contrarian / Problem Hook",
          conversionRating: 92
        },
        {
          text: "The science of self-cleaning water bottles: Tested.",
          type: "Authority / Educational Hook",
          conversionRating: 88
        }
      ],
      videoScript: {
        title: "Water Bottle Tech is Broken (Variation A)",
        duration: 60,
        scenes: [
          {
            id: 1,
            section: "Hook (0-10s)",
            visual: "Host sits in front of a clean, technical workbench studio. Holds a standard steel flask in one hand and the EcoFlask Pro in the other. Zooms in on the glowing cap.",
            audio: "Host: 'Most insulated steel bottles have one major flaw. After two days, they smell awful and are covered in unseen biofilm. Today, I'm testing the bottle that sanitizes itself in 60 seconds.'",
            textOverlay: "The Self-Cleaning Tech Test"
          },
          {
            id: 2,
            section: "Body (10-45s)",
            visual: "Montage of hosting details: Macro lenses of the smart cap assembly, host tapping cap to show chemical-free sanitization, testing temperature drop using digital thermometer (ice remains frozen after 24 hrs).",
            audio: "Host: 'This is the EcoFlask Pro. The cap contains a medical-grade UV-C LED that sanitizes both the water and the internal stainless steel walls. It is the same tech used in hospitals. With a double-wall vacuum seal, it keeps water ice-cold for 24 hours. No filters to replace, ever.'",
            textOverlay: "Medical-Grade UV-C Sanitizer"
          },
          {
            id: 3,
            section: "Call to Action (45-60s)",
            visual: "Host takes a crisp sip, places the bottle next to their keyboard. On-screen graphical banner appears with QR code and promo code 'REMIX20'.",
            audio: "Host: 'It is a premium upgrade for your daily setup. If you want to grab one, click the first link in the description. Use code REMIX20 for 20% off at checkout.'",
            textOverlay: "Code: REMIX20 for 20% Off"
          }
        ]
      },
      socialPost: {
        caption: "Is your reusable water bottle secretly full of bacteria? 🧪\n\nIn our latest feature, we breakdown the science of self-cleaning insulated bottles. The EcoFlask Pro self-cleans with hospital-grade UV-C LED light, keeping your water crisp, cold, and odor-free.\n\nWatch our full video review and claim 20% off using code REMIX20 at checkout.\n\n👉 SHOP ECOFLASK PRO: https://ecoflask.pro/remix20",
        hashtags: ["#TechReview", "#ProductDesign", "#HealthyHabits", "#EcoFriendlyProducts", "#CommuterGear"]
      },
      targetingTips: [
        "Keywords: Self cleaning water bottle, UV-C bottle review, Stanley vs Hydro Flask, best commuter water bottle",
        "Channels: Tech YouTubers, Fitness Vlogs, EDC (Everyday Carry) Reviews",
        "Demographics: Age 24-50, Tech enthusiasts, outdoor gear reviewers"
      ]
    },
    {
      platformName: "Facebook",
      hooks: [
        {
          text: "The simple UV-C light trick that solves smelly water bottles forever.",
          type: "Direct Problem-Solver Hook",
          conversionRating: 91
        },
        {
          text: "Why active commuters are switching to this self-sanitizing steel flask.",
          type: "Social Proof / Credibility Hook",
          conversionRating: 88
        }
      ],
      videoScript: {
        title: "The Ultimate Bottle Upgrade (Variation A)",
        duration: 30,
        scenes: [
          {
            id: 1,
            section: "Hook (0-5s)",
            visual: "Hand sanitizer bottle shown next to a standard steel flask, creator spraying sanitizer inside bottle. Creator holds up hand to stop: 'No, do not do that!' Holds up sleeker EcoFlask Pro.",
            audio: "Voiceover: 'Stop trying to wash your bottles with chemicals. There's a much easier way to keep your hydration clean.' SFX: Smooth click.",
            textOverlay: "The clean water hack"
          },
          {
            id: 2,
            section: "Body (5-20s)",
            visual: "Interactive product demo showing water pouring in. Tap cap - glowing ring. Diagram showcasing UV-C rays reflecting off the inner 18/8 stainless steel walls to kill germs.",
            audio: "Voiceover: 'EcoFlask Pro's smart cap uses built-in UV-C light to self-clean and sanitize your bottle in 60 seconds. It destroys 99.9% of bacteria, viruses, and odors with zero chemicals. Keeps beverages ice cold for 24 hours.'",
            textOverlay: "99.9% Bacteria Destroyed"
          },
          {
            id: 3,
            section: "Call to Action (20-30s)",
            visual: "EcoFlask Pro shown proudly in gym cup holder, office desk, and bike cage. Displays '5-Year Warranty' and 'FREE Shipping' badge overlay.",
            audio: "Voiceover: 'Over 50,000 active commuters have made the switch. Backed by a 5-year warranty with free shipping on orders today. Tap Learn More below to order.'",
            textOverlay: "Shop Now - Free Shipping"
          }
        ]
      },
      socialPost: {
        caption: "99.9% of reusable water bottles contain millions of bacteria, biofilm, and mold spores. Disgusting, right? 🤢\n\nThat constant stale metallic smell in your current flask is active bacterial growth. But scrubbing with dish soap doesn't solve the core issue.\n\nMeet the EcoFlask Pro: The self-cleaning water bottle that uses medical-grade UV-C light to vaporize bacteria and odors in just 60 seconds.\n\nWhy 50,000+ fitness enthusiasts and busy professionals love the EcoFlask:\n✅ Hospital-grade UV-C sanitization with one tap\n✅ Double-walled 18/8 premium steel prevents condensation\n✅ Keeps liquids ice-cold for 24 hours, steaming hot for 12 hours\n✅ 5-Year satisfaction guarantee + FREE shipping on all orders today\n\n👇 Click the 'Learn More' button below to check available stock and claim your Summer discount!",
        hashtags: ["#EcoFlaskPro", "#HealthyLiving", "#SustainableLifestyle", "#EcoFriendlyTech", "#CleanHydration", "#FitnessMotivation"]
      },
      targetingTips: [
        "Interests: Sustainable products, Outdoor Activities, Gym, CrossFit, Eco-friendly technology, Health & Wellness",
        "Exclusions: Dropshippers, Bargain Shoppers",
        "Age Range: 25-65+, Male & Female, high value purchase intent"
      ]
    }
  ],
  platformsB: [
    {
      platformName: "TikTok",
      hooks: [
        {
          text: "POV: Your skin was literally breaking out for months until you realized the culprit was hiding right here.",
          type: "UGC Relatability / Skin Callout",
          conversionRating: 95
        },
        {
          text: "My boyfriend drank from my water bottle and his first reaction was 'why does this smell like a wet dog?'",
          type: "Humorous / High-Relatability Hook",
          conversionRating: 92
        },
        {
          text: "I haven't washed my water bottle in a week... watch this before you take another sip.",
          type: "Shock / Curiosity Hook",
          conversionRating: 90
        }
      ],
      videoScript: {
        title: "The Silent Skin Breakout Culprit (Variation B)",
        duration: 30,
        scenes: [
          {
            id: 1,
            section: "Hook (0-5s)",
            visual: "Creator starts with close-up of chin showing minor redness, holding a dirty standard bottle. She makes a wide-eyed face and slaps her forehead in realization.",
            audio: "Creator: 'I was literally spending hundreds on luxury skincare and still breaking out right here. Then my dermatologist asked me: \"How often do you wash your water bottle?\"'",
            textOverlay: "The dirty skincare secret..."
          },
          {
            id: 2,
            section: "Body (5-20s)",
            visual: "Cuts to her tapping her matte white EcoFlask Pro cap. The LED ring lights up and spins purple. She holds it up to her face, smiling glowingly.",
            audio: "Creator: 'Turns out standard bottles trap sweat and swamp bacteria that transfers straight to your lips. So I switched to the EcoFlask Pro. It self-cleans with hospital-grade UV-C light in 60 seconds. Crisp, bacteria-free water, zero efforts.'",
            textOverlay: "Kills 99.9% of acne-causing bacteria"
          },
          {
            id: 3,
            section: "Call to Action (20-30s)",
            visual: "Creator drinks happily, dances slightly, and places bottle next to her glowing vanity mirror, pointing at the interactive Link overlay on TikTok screen.",
            audio: "Creator: 'Honestly, save your skin and your gut. Tap below to check if they still have the launch discount!' Music: Playful bassline hits.",
            textOverlay: "Click here to claim discount"
          }
        ]
      },
      socialPost: {
        caption: "PSA: Reusable bottles can have MORE bacteria than a pet bowl if not sanitized daily. 🤢 Yes, that's why your skin might be breaking out around your mouth!\n\nNo more metallic odors, mold, or heavy scrubbing. EcoFlask Pro uses built-in chemical-free UV-C light to sanitize itself with one tap.\n\n✨ Self-cleans in 60 seconds\n✨ Hospital-grade purification\n✨ Keeps water frosty for 24 hours\n\n👇 Upgrade your skincare and hydration. Grab yours 40% off today!",
        hashtags: ["#EcoFlaskPro", "#acnehacks", "#skincarecommunity", "#tiktokfinds", "#reusablebottle", "#cleanskin"]
      },
      targetingTips: [
        "Interests: Acne treatment, skincare, Sephora, Glossier, Wellness, Healthy Lifestyle",
        "Behaviors: Gen Z & Millennial buyers, beauty shoppers",
        "Demographics: Age 16-30, Female-skewed"
      ]
    },
    {
      platformName: "Instagram",
      hooks: [
        {
          text: "Unboxing the only water bottle that actually keeps itself clean.",
          type: "Aesthetic Unboxing",
          conversionRating: 88
        },
        {
          text: "POV: You find the water bottle that fits your aesthetic AND kills germs.",
          type: "Relatable Style Hook",
          conversionRating: 86
        },
        {
          text: "Why I threw away my old gym flask for this self-cleaning bottle.",
          type: "Benefit Pivot Hook",
          conversionRating: 89
        }
      ],
      videoScript: {
        title: "Mindful Aesthetic Routine (Variation B)",
        duration: 15,
        scenes: [
          {
            id: 1,
            section: "Hook (0-3s)",
            visual: "Close-up of a beautifully packaged white box being slid open to reveal the EcoFlask Pro. Elegant minimalist overlay text fades in.",
            audio: "Music: Soothing instrumental lofi track plays.",
            textOverlay: "Aesthetic hydration upgrade"
          },
          {
            id: 2,
            section: "Body (3-12s)",
            visual: "Hands setting the bottle next to a green matcha latte, tapping the sleek smart cap, and carrying it into a high-end pilates studio.",
            audio: "Voiceover: 'A clean bottle shouldn't require scrubbing with toxic soap. My EcoFlask Pro cleans itself dynamically using built-in UV-C light. Simple, beautiful, and completely germ-free.'",
            textOverlay: "Self-cleaning. Minimalist. Perfect."
          },
          {
            id: 3,
            section: "Call to Action (12-15s)",
            visual: "Splendid slow-motion shot of creator leaving pilates studio with the bottle in hand. Text links swipe up.",
            audio: "Voiceover: 'Live cleaner. Link in bio to shop our aesthetic launch colors.'",
            textOverlay: "Tap link in bio to shop 🤍"
          }
        ]
      },
      socialPost: {
        caption: "Elevate your space and your hydration. 🤍\n\nNo dirty scrubbing, no stale odors. The EcoFlask Pro self-cleans with medical-grade, chemical-free UV-C light dynamically, keeping your water crisp and your bottle flawless.\n\nCrafted with premium satin-matte finish and double-walled vacuum insulation for 24h cold water.\n\nShop the minimal aesthetic launch collection at our link in bio.",
        hashtags: ["#pilatesaesthetic", "#minimalisthome", "#cleanhydro", "#aestheticreels", "#wellnesstrend"]
      },
      targetingTips: [
        "Interests: Pilates, Mindfulness, Minimalist Living, Alo Yoga, Aesthetic Workspace",
        "Demographics: Age 20-38, high-income professionals"
      ]
    },
    {
      platformName: "YouTube",
      hooks: [
        {
          text: "Is there mold in your water bottle? We ran a lab test.",
          type: "High-Curiosity Science Hook",
          conversionRating: 94
        },
        {
          text: "The self-purifying steel water bottle challenge: 7-day test.",
          type: "Review & Challenge Hook",
          conversionRating: 90
        }
      ],
      videoScript: {
        title: "The 7-Day Self-Cleaning Challenge (Variation B)",
        duration: 60,
        scenes: [
          {
            id: 1,
            section: "Hook (0-10s)",
            visual: "Presenter holds up standard steel bottle alongside a Petri dish showing visible mold growth under a UV torch. Then taps the cap of EcoFlask Pro.",
            audio: "Host: 'Most metal flasks are practically petri dishes. We left tap water in a standard steel bottle for 7 days alongside this self-purifying EcoFlask Pro. The results under the UV lab light were shocking.'",
            textOverlay: "Lab Testing: Self-Cleaning Bottles"
          },
          {
            id: 2,
            section: "Body (10-45s)",
            visual: "Presenter demonstrates the EcoFlask UV-C sanitization. They pull out microscopic camera footage showing mold dying instantly when exposed to the UV-C cap. Then they drink from the bottle confidently.",
            audio: "Host: 'The standard flask grew massive biofilm colonies. But the EcoFlask Pro? Completely sterile. That's because the built-in 275nm UV-C light completely breaks down bacterial DNA in just 60 seconds. Plus, it maintains ice-cold temperatures for a full 24 hours.'",
            textOverlay: "Vaporizes DNA of 99.9% of bacteria"
          },
          {
            id: 3,
            section: "Call to Action (45-60s)",
            visual: "Host points down to a YouTube graphic card with custom discount link. Holds up the beautifully crafted matte black bottle.",
            audio: "Host: 'It's a necessary upgrade for everyday carry. Click the link in the description to watch our full scientific test and grab yours at an exclusive discount.'",
            textOverlay: "Exclusive scientific test link below"
          }
        ]
      },
      socialPost: {
        caption: "We put self-cleaning water bottle tech to a real scientific lab test! 🧪\n\nWatch our full 7-day experiment to see what's actually growing inside your standard steel flasks, and how the EcoFlask Pro completely sterilizes water in 60 seconds with hospital-grade UV-C light.\n\nClick below to read our review and claim an exclusive YouTube community discount!",
        hashtags: ["#LabTest", "#CleanWaterTech", "#EdcReviews", "#HealthyHabits", "#ScientificChallenge"]
      },
      targetingTips: [
        "Keywords: Self cleaning water flask lab test, UV-C bottle experiment, reusable flask bacteria, everyday carry",
        "Demographics: Age 20-45, Male skewing, technical background"
      ]
    },
    {
      platformName: "Facebook",
      hooks: [
        {
          text: "Doctors are warning about this invisible health hazard in metal bottles.",
          type: "Authority / Empathy Warning",
          conversionRating: 93
        },
        {
          text: "Why thousands of parents are throwing out standard school water flasks.",
          type: "Social Proof / Family Safety Hook",
          conversionRating: 89
        }
      ],
      videoScript: {
        title: "Is Your Family's Water Safe? (Variation B)",
        duration: 30,
        scenes: [
          {
            id: 1,
            section: "Hook (0-5s)",
            visual: "Parent sniffing a child's school steel flask with a grimace. Text flashes: 'That bad smell is active mold!' Creator holds up the clean, safe EcoFlask Pro.",
            audio: "Voiceover: 'That stale, musty smell coming from your child's water bottle? Doctors warn it's active bacterial mold. And standard washing doesn't reach it all.'",
            textOverlay: "The musty smell warning..."
          },
          {
            id: 2,
            section: "Body (5-20s)",
            visual: "Splits screen: Kid happily tapping the cap of EcoFlask Pro at school. Close-up schematic of the UV-C LED cleaning the water and bottle. 18/8 food-grade safe walls highlighted.",
            audio: "Voiceover: 'Protect your family. EcoFlask Pro self-purifies with a single tap, neutralizing 99.9% of bacteria and viruses in 60 seconds. Made of safe food-grade double-walled steel, keeping drinks ice-cold all day long.'",
            textOverlay: "Hospital-grade UV-C & Food-Grade Safe"
          },
          {
            id: 3,
            section: "Call to Action (20-30s)",
            visual: "Two water bottles sitting on a family dining table. 100% satisfaction guarantee badge and Free Family Shipping offer display on screen.",
            audio: "Voiceover: 'Over 100,000 families trust EcoFlask. Backed by a 5-year warranty. Click Learn More to claim our limited buy-one-get-one-half-off family bundle!'",
            textOverlay: "Buy 1 Get 1 Half Off + Free Shipping"
          }
        ]
      },
      socialPost: {
        caption: "🚨 HEALTH ALERT FOR REUSABLE BOTTLE USERS: Reusable water bottles can harbor massive colonies of mold and swamp bacteria. That musty smell isn't just unpleasant—it's active bacterial mold. 🤢\n\nScrubbing with dishwashing soap only does so much. Meet the EcoFlask Pro: The hospital-grade self-cleaning bottle designed to sanitize water with built-in UV-C light in 60 seconds.\n\nWhy active families are upgrading to EcoFlask Pro:\n✅ Hospital-grade UV-C light sanitization at a single tap\n✅ Zero chemical residues, completely organic\n✅ Keeps liquids ice-cold for 24 hours, steaming hot for 12 hours\n✅ 5-Year warranty + Buy One Get One 50% Off during our Family Launch Sale\n\n👇 Protect your health. Click 'Learn More' below to customize your family hydration bundle!",
        hashtags: ["#FamilyHealth", "#OdorFree", "#EcoFlaskPro", "#SmartParenting", "#HealthyLifestyle", "#CleanWaterSafe"]
      },
      targetingTips: [
        "Interests: Parenting, Family Health, School Essentials, Organic Living, Eco-Friendly, Healthy Recipes",
        "Demographics: Age 30-55, Parents, High household incomes"
      ]
    }
  ]
};
