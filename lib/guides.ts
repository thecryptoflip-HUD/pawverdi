export interface GuideSource {
  id: number;
  label: string;
  url: string;
  accessed: string;
}

// IDs are registered in the task's source ledger, not inferred from a draft.
export const guideSources: GuideSource[] = [
  { id: 1, label: 'PDSA: New puppy guide', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/new-puppy-checklist', accessed: '2026-11-05' },
  { id: 2, label: 'PDSA: Your first day and night with a new puppy', url: 'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs/first-day-and-night-with-puppy', accessed: '2026-11-05' },
  { id: 3, label: 'Blue Cross: Bringing your new puppy home', url: 'https://www.bluecross.org.uk/advice/dog/wellbeing-and-care/bringing-your-new-puppy-home', accessed: '2026-11-05' },
  { id: 4, label: 'Cats Protection: Bringing a new kitten home', url: 'https://www.cats.org.uk/help-and-advice/getting-a-cat/bringing-a-new-kitten-home', accessed: '2026-11-05' },
  { id: 5, label: 'Cats Protection: Preparing for a cat', url: 'https://www.cats.org.uk/help-and-advice/getting-a-cat/preparing-for-a-cat', accessed: '2026-11-05' },
  { id: 6, label: 'Blue Cross: Indoor dog crates', url: 'https://www.bluecross.org.uk/advice/dog/behaviour-and-training/dog-crates', accessed: '2026-11-18' },
  { id: 7, label: 'Cats Protection: Choosing and using a cat carrier', url: 'https://www.cats.org.uk/help-and-advice/getting-a-cat/how-to-choose-and-use-a-cat-carrier', accessed: '2026-11-18' },
  { id: 8, label: 'Ruffwear: How to measure for your dog’s gear', url: 'https://ruffwear.com/blogs/explored/the-size-is-right-how-to-measure-for-your-dogs-gear', accessed: '2026-11-18' },
  { id: 9, label: 'Cats Protection: Toileting and litter trays', url: 'https://www.cats.org.uk/help-and-advice/cat-behaviour/toileting', accessed: '2026-11-18' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  illustration?: { src: string; alt: string };
}

export interface Guide {
  title: string;
  updated: string;
  introduction: string;
  sourceIds: number[];
  sections: GuideSection[];
  download?: { href: string; label: string };
}

export const guideBySlug: Record<string, Guide> = {
  'new-puppy-checklist': {
    download: { href: '/downloads/first-week-puppy.pdf', label: 'Download the first-week puppy checklist (PDF)' },
    title: 'New puppy checklist: what to buy before day one',
    updated: '2026-11-05',
    introduction: 'Buy enough to bring your puppy home safely, feed them their familiar food and give them somewhere quiet to rest. Leave the matching accessories until you know the dog. This buying order is PawVerdi’s practical recommendation, based on the welfare guidance linked below.',
    sourceIds: [1, 2, 3],
    sections: [
      {
        id: 'before-pickup',
        title: 'Before pickup: the checklist that cannot wait',
        paragraphs: ['PDSA’s essentials cover a resting space, complete puppy food, bowls, identification, walking equipment, a car restraint and suitable toys.[1] Start with those jobs rather than a brand’s “new puppy bundle”.[1]'],
        items: [
          'A secure travel carrier, crate or suitable car restraint, fitted for the journey home.[3]',
          'The exact complete puppy food your puppy is already eating, with written feeding amounts and meal times from the breeder or rescue.[1][2]',
          'Separate food and water bowls, plus access to fresh drinking water.[1][2]',
          'A washable resting area with bedding; a crate is an option, not a requirement to shut a worried puppy away.[1][2]',
          'A correctly fitted collar or harness, a lead and an identification tag. Check the identification requirements where you live; the cited PDSA advice is UK-based.[1]',
          'A few suitable toys, waste bags, cleaning supplies, and a gate or pen if you need to restrict access to hazards.[1][2]',
        ],
      },
      {
        id: 'safe-room',
        title: 'Set up one safe area before buying more gear',
        paragraphs: [
          'Put the bed somewhere quiet, with food and water easy to find and space to move away from busy family activity.[1][2] PDSA recommends introducing rooms gradually rather than giving a puppy the whole house on the first day.[1][2]',
          'Move medicines, cleaning products and chewable cables out of reach.[1][2] Check the garden for escape gaps and hazardous plants.[1] A gate can make the safe area manageable, but it does not replace supervision.[1][2]',
          'Our pick is a simple washable setup over a coordinated furniture set. Spend first on safe containment and bedding you can clean. You can choose a more permanent bed after you see how your puppy sleeps and whether they chew the edges.',
        ],
      },
      {
        id: 'sleeping-space',
        title: 'Choose a bed or crate the puppy can actually use',
        paragraphs: [
          'If you use a crate, introduce it gradually so it becomes a comfortable resting place.[2] Buying one does not mean the puppy knows how to settle inside it. PDSA advises taking time over that introduction.[2]',
          'For transport, Blue Cross says a crate must allow the puppy to stand and turn around easily.[3] Check the restraint instructions and your vehicle before collection day, rather than trying to work out the fitting with a puppy already in the car.[3]',
          'Our buying rule is to measure the animal and the available space before choosing a size. A breed label on a shop listing is not a measurement. If you are unsure about safe containment or fit, ask your vet or a qualified reward-based trainer before using it.',
        ],
      },
      {
        id: 'food',
        title: 'Keep the familiar food; save the diet experiment',
        paragraphs: [
          'Ask for the brand, formula, amount and feeding routine in writing. Continue the familiar food initially.[1] PDSA recommends a complete food labelled for puppies and a gradual transition if a change is needed, rather than an abrupt switch on arrival.[1]',
          'The right amount depends on the puppy and food, not a universal number of cups. Use the current feeding instructions as your starting point and ask your vet to help you adjust as the puppy grows. Keep the packaging so the formula and feeding guidance are available at the first appointment.[1]',
          'Our recommendation is to buy a modest amount of the correct food first. A bulk discount is less useful if you have bought the wrong formula or the puppy needs a different diet after veterinary advice.',
        ],
      },
      {
        id: 'collection',
        title: 'Collection day: paperwork, restraint and a quiet arrival',
        paragraphs: [
          'Plan time at home for the settling-in period.[3] Ask the breeder or rescue about the puppy’s routine and bring a familiar-smelling blanket if one is available.[2][3] Blue Cross recommends a safe travel restraint, breaks on longer journeys and avoiding places used by many dogs when the puppy is not yet fully vaccinated.[3]',
          'Never leave the puppy alone in the car.[3] Take them to the safe area when you get home, show them where their water and bed are, and keep visitors and noise down.[2] Offer an opportunity to toilet and reward them gently when they use the right place.[2][3]',
          'Keep the vaccination, parasite-treatment and microchip information together. Register with a vet and arrange a check-up and an individual care plan; do not assume that a receipt or a seller’s reassurance replaces the records.[1]',
        ],
      },
      {
        id: 'what-can-wait',
        title: 'What can wait, and what still needs planning',
        paragraphs: [
          'Our “later” list includes a second decorative bed, outfits and a large toy collection. Choose those after you learn the puppy’s habits. A simple first setup also makes it easier to tell which items are useful and which are just taking up floor space.',
          'Grooming and dental care should be planned early, even if you do not buy every tool on collection day. PDSA includes a suitable brush, dog toothpaste and a toothbrush in its supply list.[1] Ask which tools suit your puppy’s coat and size.[1]',
          'Training is not something to leave until the puppy is bigger. Start gentle reward-based routines at home and ask about suitable classes and safe social experiences while your vet advises on local infection risks and vaccination protection.[1]',
        ],
      },
      {
        id: 'first-night',
        title: 'The first night: be available, not perfectly equipped',
        paragraphs: [
          'A puppy leaving their mother and littermates may be frightened at night.[2] PDSA says it is appropriate to comfort an upset puppy and suggests sleeping in the same room for the first few nights while they adjust.[2] Keep bedtime calm and expect that toilet breaks may be needed.[2]',
          'You do not need to solve every future sleeping arrangement on night one. You do need a safe resting place, a plan for checking on the puppy and someone who can respond. Do not use a crate as a way to ignore distress.[2]',
          'If the puppy seems unwell, contact your vet rather than assuming the problem is just settling in. This checklist is about preparing the home, not diagnosing symptoms or replacing an examination.',
        ],
      },
    ],
  },
  'new-kitten-checklist': {
    download: { href: '/downloads/first-week-kitten.pdf', label: 'Download the first-week kitten checklist (PDF)' },
    title: 'New kitten checklist: a safe first week at home',
    updated: '2026-11-05',
    introduction: 'Prepare a quiet room before you fill a shopping basket. A kitten needs somewhere safe to hide, familiar food, an accessible litter tray and a carrier for the trip home. The buying priorities here are PawVerdi’s recommendations, informed by Cats Protection’s guidance rather than hands-on product tests.',
    sourceIds: [4, 5],
    sections: [
      {
        id: 'before-collection',
        title: 'Before collection: the essentials to have ready',
        paragraphs: ['Ask the rescue or breeder which food and litter the kitten already uses. Cats Protection recommends keeping both familiar at first and making any changes gradually.[4][5] Bring home the details as well as the kitten, so you do not have to guess at the supermarket.[4][5]'],
        items: [
          'A sturdy, ventilated carrier with working fastenings and enough room for the kitten to lie comfortably and change position.[5]',
          'Complete kitten food in the familiar formula, plus separate food and water bowls.[4]',
          'An easy-access litter tray, the familiar litter and cleaning equipment. Plan additional trays rather than relying on one shared toilet for several cats.[4][5]',
          'A quiet bed, a hiding place, a stable scratching surface and a few suitable toys.[4]',
          'A kitten-proof room with food, water, resting and toilet areas separated as far as practical.[4][5]',
        ],
      },
      {
        id: 'safe-room',
        title: 'Set up the safe room before opening the carrier',
        paragraphs: [
          'Choose a quiet room you can close off from other pets and busy household activity.[4][5] Give the kitten a place to sleep and somewhere to hide.[4][5] Cats Protection suggests options such as a cardboard box, alongside opportunities to climb where they can get up and down safely.[4][5]',
          'Check the room at kitten height. Block gaps behind appliances, secure windows, tidy electrical cords and keep cleaners and medicines inaccessible.[4] Check washing machines, dryers and cupboards before closing or using them: a hidden kitten is easy to miss.[4]',
          'Remove lilies from the home because they are highly toxic to cats.[4] Keep the kitten away from balconies and unsecured openings.[4] Our priority is making this first room safe, not decorating every room before the kitten arrives.[4]',
        ],
      },
      {
        id: 'carrier',
        title: 'Choose the carrier for safe transport and easy cleaning',
        paragraphs: [
          'A carrier is collection-day equipment, not something to buy only when a vet visit comes up. Cats Protection recommends a secure, well-ventilated design that is easy to clean and large enough for the cat to lie down comfortably and move position.[5]',
          'Look at how the carrier opens as well as its appearance. Cats Protection notes that a removable top on a front-opening carrier can help with training, while a top opening can make lifting the cat in easier. Our preference is a carrier with clear access and reliable closures over a bag chosen mainly for its styling.[5]',
          'Follow the carrier and vehicle instructions to secure it for travel. At home, take the closed carrier to the prepared room before opening it. Let the kitten leave when ready rather than tipping them out or reaching in to pull them towards visitors.[4]',
        ],
      },
      {
        id: 'food-and-water',
        title: 'Keep meals familiar and water easy to find',
        paragraphs: [
          'Use a complete food intended for kittens and continue the existing formula initially.[4][5] Cats Protection advises changing food gradually if a change is needed; a new home does not need to coincide with a new diet.[4][5]',
          'Put the food and drinking water in different spots, away from the litter tray.[4][5] Cats Protection recommends this separation because many cats prefer it.[4][5] Make both easy to reach without having to pass another animal.[4][5]',
          'Our shopping advice is to buy the correct starter supply before committing to bulk packs or several flavours. Keep the feeding instructions and ask your vet about a plan suited to the kitten’s age and growth. A household shopping list cannot set an individual feeding amount.[4]',
        ],
      },
      {
        id: 'litter-trays',
        title: 'Litter trays: access and location before gadgets',
        paragraphs: [
          'Start with litter the kitten recognises and a tray they can reach easily.[4][5] Put it somewhere quiet with room to enter and leave, separated from food and water.[4][5] If a change of litter is needed, introduce it gradually rather than replacing everything on the first day.[4][5]',
          'Cats Protection’s general planning rule is one litter tray for each cat, with an extra for the household.[4][5] Place resources in separate useful locations rather than treating a row of trays as the solution to competition.[4][5]',
          'Our first purchase would be a simple tray whose entry height suits the kitten. Before considering an automatic model, check its minimum age and weight requirements and whether it suits your cat. Convenience for the owner should not make the kitten’s only toilet harder to use.',
        ],
      },
      {
        id: 'first-days',
        title: 'The first days: let the kitten set the pace',
        paragraphs: [
          'Open the carrier in the safe room and let the kitten choose when to explore.[4] Keep handling gentle, allow hiding and limit noise and visitors.[4] Some kittens settle quickly; others need considerably longer.[4] Cats Protection advises patience rather than forcing interaction.[4]',
          'Use toys to play instead of encouraging attacks on hands or feet.[4] Put away string-like toys after supervised play and replace damaged toys.[4][5] Offer a scratching surface so the kitten has an appropriate place to scratch from the start.[4][5]',
          'Introduce children and other animals gradually, keeping the kitten able to retreat.[4] Do not make collection day the first unsupervised meeting with a resident dog or cat. Everyone should understand that a kitten resting or hiding is not an invitation to pull them out.[4]',
        ],
      },
      {
        id: 'vet-and-records',
        title: 'Arrange the vet plan and keep the records together',
        paragraphs: [
          'Register with a vet and bring the vaccination, parasite-treatment and microchip records supplied by the rescue or breeder.[4][5] Discuss the next treatments, identification details and neutering plan for this kitten rather than using a generic online timetable.[4][5]',
          'Keep a note of the familiar food, litter and routine with those records. Cats Protection advises keeping kittens indoors until they are settled and the relevant vaccination, neutering and microchipping preparations are complete; ask your vet how that applies to your kitten and local risks.[4]',
          'If the kitten seems unwell or stops eating, contact the vet for individual advice. Do not use this setup checklist to decide how long a sick young kitten can safely wait.',
        ],
      },
      {
        id: 'what-can-wait',
        title: 'What can wait until you know your kitten',
        paragraphs: [
          'Our later list includes expensive beds, a large toy collection and automated feeders or toilets. A cardboard hiding box, a comfortable resting space and suitable play can meet immediate needs without a coordinated set of furniture.[4][5]',
          'Do not postpone the scratching surface or access to a safe retreat.[4][5] Those are part of the first setup. Choose extra furniture after you see where the kitten rests, how confidently they climb and what kind of play they enjoy.[4][5]',
          'Spend the first week noticing what works. Can the kitten reach the tray easily? Are the water and food away from the toilet? Can they hide without getting trapped? Those checks are more useful than adding another accessory to the basket.',
        ],
      },
    ],
  },
  'best-dog-crate': {
    title: 'Dog crate size guide: how to measure and choose a crate',
    updated: '2026-11-18',
    introduction: 'Start with the space your dog needs inside the crate. Then check the doorway, floor space and cleaning access before buying.',
    sourceIds: [3, 6],
    sections: [
      {
        id: 'measure',
        title: 'Measure the dog and the usable interior',
        paragraphs: [
          'Measure your dog from the floor to their highest point while standing naturally, then check their height sitting upright. Measure their nose-to-tail-base length while standing, and watch how much room they use to lie down and stretch. The finished setup must let them stand, sit upright, turn easily and lie comfortably.[3][6]',
          'Ask the retailer for interior length, width and height if only the outside dimensions are listed. Check the smallest part of a tapered shell, the area lost to bedding, and the height and width of the entrance. If measurements are marginal, choose a model you can try and return.',
        ],
      },
      {
        id: 'compare',
        title: 'Compare wire, rigid plastic and fabric',
        paragraphs: ['For use at home, compare latches, cleaning access and how much floor space the open door needs. Blue Cross describes fold-down mesh crates as a common option.[6]'],
        items: [
          'Wire: compare tray removal, latch operation and whether you can open the door in the intended corner.',
          'Rigid plastic: inspect the vents and fastenings, and measure the narrowest part of the shell.',
          'Fabric: useful if packability matters. Skip it if your dog scratches or chews the mesh or zipper.',
        ],
      },
      {
        id: 'divider',
        title: 'Decide whether a puppy needs a divider',
        paragraphs: [
          'A compatible divider can make a larger crate usable as your puppy grows. Measure the space on the puppy’s side and check the fit again after growth spurts. Move or remove the divider whenever it interferes with standing, turning or stretching.[6]',
          'Leave the door open while introducing the crate and build up gradually. Use it as a resting space, never as punishment.[6] For car trips, check the restraint manufacturer’s installation instructions separately. An indoor crate’s dimensions tell you about fit, while its vehicle instructions tell you whether it is designed for transport.[3]',
        ],
      },
    ],
  },
  'best-cat-carrier': {
    title: 'Top-loading vs. front-loading cat carriers',
    updated: '2026-11-18',
    introduction: 'Choose a carrier your cat can enter comfortably and that you can close, carry and clean confidently. The door is only one part of that decision.',
    sourceIds: [5, 7],
    sections: [
      {
        id: 'openings',
        title: 'Compare the openings you will use',
        paragraphs: [
          'A top opening gives you access from above. A front door lets a cat walk in from floor level, which is useful when introducing the carrier at home. A rigid front-loader with a removable upper shell can provide both a walk-in entrance and access from above when the shell comes off.[5][7]',
          'Check how much the lid actually opens. A small top hatch and a fully removable shell offer different access. Try the catches on an empty carrier so you know which ones release the door and which release the shell.',
        ],
      },
      {
        id: 'fit',
        title: 'Check fit, ventilation and carry weight',
        paragraphs: [
          'Compare your cat’s standing height and body length with the usable interior and door opening. Look for space to stand, turn and settle comfortably. Check the manufacturer’s weight limit and remember you will be carrying the carrier, the cat and the bedding together.[7]',
          'Look for a sturdy, ventilated model with secure closures and surfaces you can wipe clean. Check that you can remove the bedding without dismantling the carrier. If you need it for a flight, verify the airline’s requirements for that booking before ordering.[7]',
        ],
      },
      {
        id: 'practice',
        title: 'Make the carrier familiar before the first trip',
        paragraphs: [
          'Leave the carrier out with the door held open and familiar bedding inside. Let your cat investigate at their own pace. Ask the veterinary practice how they prefer to handle check-in and removal if your cat tends to hide or resist handling.[7]',
          'Before leaving, check the door latch and every shell fastener. Lift the empty carrier first to learn its balance. At the practice, keep it closed until staff advise where it can be opened securely.[7]',
        ],
      },
    ],
  },
  'dog-harness-size-guide': {
    title: 'How to measure your dog for a harness',
    updated: '2026-11-18',
    introduction: 'Use a soft tape and the size chart for the exact harness you plan to buy. Keep the measurements handy so you can compare models without relying on a breed label.',
    sourceIds: [8],
    sections: [
      {
        id: 'measure',
        title: 'Find the chest girth',
        illustration: {
          src: '/guide-illustrations/dog-chest-girth.png',
          alt: 'Side view of a standing dog with the tape at the widest point of the rib cage, behind the front legs.',
        },
        paragraphs: [
          'With your dog standing comfortably on all four paws, wrap a soft tape around the widest part of the rib cage. Keep it flat and snug against the coat without squeezing. Take the measurement twice and record the units. If the model also asks for neck girth or back length, use the maker’s diagram for those measurements.[8]',
          'If you only have a flexible cord, mark where it meets around the chest, then lay it flat against a ruler. Avoid adding extra inches for comfort unless the manufacturer’s instructions tell you to do so.[8]',
        ],
      },
      {
        id: 'between-sizes',
        title: 'Handle a measurement between sizes',
        paragraphs: [
          'Use the exact model’s size chart and its advice for measurements near a cutoff. If chest and neck measurements point to different sizes, ask the maker which adjustment ranges apply or try a different shape. Check the return policy before buying.[8]',
          'Keep both measurements if you are buying for a growing dog. Recheck them as your dog grows, and use the adjustment range to decide when to try another size.[8]',
        ],
      },
      {
        id: 'fit-check',
        title: 'Check the fit indoors before walking',
        paragraphs: [
          'Follow the maker’s fitting instructions, then watch your dog take a few relaxed steps and turn in a secure room. Look for straps that stay flat, sit clear of the armpits and do not slide sideways or gape when the dog moves. Adjust and try again if they do.[8]',
          'With the lead attached indoors, check whether the harness shifts toward the head when your dog backs up. Stop and reassess the fit if a shoulder slips free or a strap rides into the neck. Ask a qualified trainer or experienced fitter if you cannot get a secure, comfortable fit.',
        ],
      },
    ],
  },
  'best-cat-litter-box-multiple-cats': {
    title: 'How to set up litter boxes for multiple cats',
    updated: '2026-11-18',
    introduction: 'Plan the locations before choosing a box. Each cat needs a tray they can reach without having to pass another cat or wait for a closed door to open.',
    sourceIds: [5, 9],
    sections: [
      {
        id: 'count-and-place',
        title: 'Start with one tray per cat, plus one extra',
        paragraphs: [
          'Cats Protection recommends one tray per cat plus one extra. For two cats, start by planning three usable locations. Look for quiet spots away from food and water, with enough room for a cat to enter and leave freely.[5][9]',
          'In a small home, sketch your rooms and mark which doors are usually open. Try separate rooms before placing trays side by side. Avoid a spot where another cat can easily block the only route out. A tray behind a laundry-room door only helps if the cat can reach it when needed.[9]',
        ],
      },
      {
        id: 'box-types',
        title: 'Choose a tray each cat can use comfortably',
        paragraphs: ['Start by checking the interior floor area and entry height. Cats Protection recommends room for the cat to turn and dig, and notes that preferences for cover can vary.[9]'],
        items: [
          'Open tray: easy to inspect and scoop. Look for a low entry if a kitten or less mobile cat needs it.',
          'High-sided tray: worth considering if litter scatters over the sides. Check that the entry is still easy to clear.',
          'Covered tray: offer it alongside a familiar open option so you can see which the cat prefers. Check the opening and usable space with the lid fitted.[9]',
        ],
      },
      {
        id: 'adjust',
        title: 'Change one thing at a time',
        paragraphs: [
          'Keep the familiar litter in at least one tray if you are trying a different surface. Scoop regularly and watch which locations get used. If a tray is consistently avoided, check the entry, noise, nearby doors and whether another cat can block access before buying a replacement.[5][9]',
          'Contact your vet if a cat starts toileting outside the tray or changes their usual toilet habits. Treat repeated attempts to urinate with little or no urine as urgent.[9]',
        ],
      },
    ],
  },
};

export function guideReadingMinutes(guide: Guide): number {
  const text = [guide.introduction, ...guide.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.items ?? [])])].join(' ');
  return Math.max(1, Math.ceil(text.replace(/\[\d+\]/g, '').split(/\s+/).filter(Boolean).length / 200));
}
