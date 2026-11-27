export interface JournalStory {
  slug: string;
  title: string;
  section: string;
  summary: string;
  paragraphs: [string, string][];
}
export const journalDate = '2026-11-27';
export const journalStories: JournalStory[] = [
  {
    slug: 'a-weekend-away', title: 'Before you book a pet-friendly weekend', section: 'Travel',
    summary: 'A short conversation with your host can save you a second booking and a suitcase full of gear.',
    paragraphs: [
      ['Ask what “pet friendly” covers', 'Before paying, tell the host how many animals are travelling, their size and your arrival time. Ask about species restrictions, stairs, deposits, cleaning fees and rules for leaving an animal in the room. Save the reply with the reservation.'],
      ['Pack for the room you booked', 'Find out which bowls, bedding and cleaning supplies the property actually provides. Pack familiar supplies for the gaps. Keep the first evening’s essentials where you can reach them without unpacking the whole car.'],
      ['Plan the first hour', 'Write down check-in instructions, a quiet place to settle and the nearest appropriate veterinary service before departure. Share the itinerary and your contact details with anyone helping with your pet.'],
    ],
  },
  {
    slug: 'hosting-with-pets', title: 'A quieter house when guests arrive', section: 'Seasonal living',
    summary: 'Give visitors a simple plan for doors, belongings and the place your pet goes to rest.',
    paragraphs: [
      ['Walk the arrival route', 'Think through what happens when the first guest rings the bell. Decide who answers, where coats and parcels go, and who keeps track of your pet. Text guests the door instructions before they arrive.'],
      ['Reserve a familiar corner', 'Keep a usual bed or resting place accessible. Ask visitors to leave the space alone and let the animal choose whether to approach. Put bags and gifts somewhere separate from that resting spot.'],
      ['Write down the routine', 'A small note with feeding times, the usual scoop and the household contact helps visitors avoid accidental second meals. Agree in advance who will carry out the normal routine.'],
    ],
  },
  {
    slug: 'organise-a-grooming-kit', title: 'A grooming kit you can actually find', section: 'Grooming',
    summary: 'Sort the supplies you already use before adding another brush or storage bin.',
    paragraphs: [
      ['Start with the last session', 'Lay out the items you reached for last time. Separate everyday supplies from occasional ones. Read each product label for its intended species, storage instructions and expiry information.'],
      ['Set up the clean side', 'Choose a dry storage spot away from your pet’s reach. Keep clean towels separate from items waiting to be washed, and store tools only after they are clean and dry.'],
      ['Make handovers easier', 'If another person helps with grooming, label the supplies and list what has worked in the past. For questions about a coat or skin condition, take the product details to your veterinarian.'],
    ],
  },
];
