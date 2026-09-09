/**
 * Update these numbers when someone enrols.
 * Use real counts only — invented social proof is misleading.
 */
export const courseStats = {
  managersTrained2026: 77,
  activeLevel1: 10,
  activeLevel2: 4,
  level3Capacity: 10,
  level3SeatsTaken: 2,
  intakeLabel: '14th of November 2026',
  intakeLocation: 'Centrepoint Motel, Lismore',
};

export const seatsRemaining = Math.max(
  0,
  courseStats.level3Capacity - courseStats.level3SeatsTaken,
);

export type CourseTrack = {
  id: 'level-1' | 'level-2' | 'level-3';
  level: string;
  title: string;
  subtitle: string;
  price: string;
  wasPrice: string;
  priceNote?: string;
  paymentPlans?: boolean;
  featured?: boolean;
  badge?: string;
  description: string;
  includesHeading: string;
  includes: string[];
  note?: string;
  ctaLabel: string;
  enquireMessage: string;
};

function enquireHref(message: string) {
  return `/contact/?topic=training&message=${encodeURIComponent(message)}`;
}

export const courseTracks: CourseTrack[] = [
  {
    id: 'level-1',
    level: 'Level 1',
    title: 'The Starter Course',
    subtitle: 'The DIY Blueprint for Aspiring Motel Managers',
    price: '$175',
    wasPrice: '$195',
    description:
      'Designed for those exploring a career transition into the accommodation sector, this self-paced toolkit provides the exact frameworks used by successful motel operators. You will learn the daily operational rhythms without the pressure of live classes.',
    includesHeading: "What's Included",
    includes: [
      'The Essential Guide to Motel Management: your comprehensive textbook covering front office, housekeeping, and backend operations.',
      'The Complete Operational Template Suite: a plug-and-play folder of checklists, daily procedures, and management templates ready to deploy in any motel.',
      'Flexible self-paced training: complete the foundational curriculum on your own schedule over 7 to 21 days.',
      'Guestpoint PMS Access: practise real-world bookings, check-ins, and daily reconciliations in the software motels actually use.',
    ],
    note: 'This tier does not include a completion certificate.',
    ctaLabel: 'Enrol Now',
    enquireMessage: 'I would like to enrol in Level 1: The Starter Course ($175).',
  },
  {
    id: 'level-2',
    level: 'Level 2',
    title: 'The Complete Course',
    subtitle: 'Live Guidance & Hands-On Software Experience',
    price: '$975',
    wasPrice: '$1,085',
    paymentPlans: true,
    featured: true,
    badge: 'Most Popular',
    description:
      'Theory meets practice. The Complete Course is built for individuals who are serious about entering the industry and need hands-on experience with industry-standard Property Management Systems (PMS) to stand out to employers.',
    includesHeading: "What's Included",
    includes: [
      'Everything in Level 1: The Essential Guide to Motel Management and all self-paced training modules (7-21 days).',
      'Guestpoint PMS Access: stop guessing how the software works. Gain direct access to Guestpoint to practice real-world bookings, check-ins, and daily reconciliations.',
      'Live Group Coaching (3 Hours): workshop real operational scenarios, troubleshoot your software questions, and cover the nuances of guest relations.',
    ],
    ctaLabel: 'Enrol Now',
    enquireMessage: 'I would like to enrol in Level 2: The Complete Course ($975).',
  },
  {
    id: 'level-3',
    level: 'Level 3',
    title: 'The On-Site Relief Manager Intensive',
    subtitle: 'Total Immersion, Software Mastery & Career Placement',
    price: '$2,150',
    wasPrice: '$2,390',
    priceNote: 'per seat',
    paymentPlans: true,
    badge: 'Strictly limited to 10 students',
    description:
      'This is a premium, high-impact career accelerator. You will step out of the classroom and into a fully operational motel. Over two days, you will master the exact systems, software, and operational routines required to step confidently into a Relief Manager role. Because we limit this to 10 students, you receive personalised mentoring and hands-on software coaching.',
    includesHeading: 'The On-Site Experience Includes',
    includes: [
      '2 Nights On-Site Accommodation: stay at the Centrepoint Motel for the duration of the training. Your room is fully covered.',
      'Dual PMS Mastery (Guestpoint & RMS): rare, hands-on training in the two most dominant software systems in the Australian market.',
      'Online Preparation Course (7-21 Days): complete your foundational training online before arriving in Lismore.',
      'The Ultimate Operations Kit: a physical copy of The Essential Guide to Motel Management plus a complete physical folder of operational templates and checklists.',
      'Networking Welcome Dinner: join us on Night 1 for a welcome dinner with your cohort and instructor. Breakfast, lunch, and Night 2 dinner are self-catered.',
      'Official Certificate of Completion: proof of your practical, on-site competency.',
      'Relief Manager Job Placement Support: leverage our industry network to secure your first paid relief management contracts upon graduation.',
    ],
    ctaLabel: 'Reserve a Seat',
    enquireMessage:
      'I would like to reserve a seat in the Level 3 On-Site Relief Manager Intensive (starts 14th of November 2026, Centrepoint Motel, Lismore, $2,150).',
  },
];

export function trackHref(track: CourseTrack) {
  return enquireHref(track.enquireMessage);
}
