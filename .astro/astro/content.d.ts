declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"a-day-in-life-of-motel-manager.md": {
	id: "a-day-in-life-of-motel-manager.md";
  slug: "a-day-in-life-of-motel-manager";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"booking-review-rank.md": {
	id: "booking-review-rank.md";
  slug: "booking-review-rank";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"buying-a-management-rights.md": {
	id: "buying-a-management-rights.md";
  slug: "buying-a-management-rights";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"buying-a-motel-business.md": {
	id: "buying-a-motel-business.md";
  slug: "buying-a-motel-business";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"free-online-guestpoint-training.md": {
	id: "free-online-guestpoint-training.md";
  slug: "free-online-guestpoint-training";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"front-desk-training-checklist.md": {
	id: "front-desk-training-checklist.md";
  slug: "front-desk-training-checklist";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"front-desk-training-hospitality.md": {
	id: "front-desk-training-hospitality.md";
  slug: "front-desk-training-hospitality";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"global-distribution-system-optimization.md": {
	id: "global-distribution-system-optimization.md";
  slug: "global-distribution-system-optimization";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"guestpoint-pms-account-troublshooting.md": {
	id: "guestpoint-pms-account-troublshooting.md";
  slug: "guestpoint-pms-account-troublshooting";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"hiring-housekeepers-as-contractors.md": {
	id: "hiring-housekeepers-as-contractors.md";
  slug: "hiring-housekeepers-as-contractors";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"hospitality-careers-getting-started.md": {
	id: "hospitality-careers-getting-started.md";
  slug: "hospitality-careers-getting-started";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"hotel-motel-website-speed.md": {
	id: "hotel-motel-website-speed.md";
  slug: "hotel-motel-website-speed";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"how-tripadvisor-rankings-calculated.md": {
	id: "how-tripadvisor-rankings-calculated.md";
  slug: "how-tripadvisor-rankings-calculated";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"increase-bookingdotcom-rank-checklist.md": {
	id: "increase-bookingdotcom-rank-checklist.md";
  slug: "increase-bookingdotcom-rank-checklist";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"learn-google-hotel-ads.md": {
	id: "learn-google-hotel-ads.md";
  slug: "learn-google-hotel-ads";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"managing-motel-room-inventory.md": {
	id: "managing-motel-room-inventory.md";
  slug: "managing-motel-room-inventory";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-ai.md": {
	id: "motel-ai.md";
  slug: "motel-ai";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-front-desk-checklist.md": {
	id: "motel-front-desk-checklist.md";
  slug: "motel-front-desk-checklist";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-maintenance-schedule.md": {
	id: "motel-maintenance-schedule.md";
  slug: "motel-maintenance-schedule";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-management-21-day-transition-strategy.md": {
	id: "motel-management-21-day-transition-strategy.md";
  slug: "motel-management-21-day-transition-strategy";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-management-basics.md": {
	id: "motel-management-basics.md";
  slug: "motel-management-basics";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-manager-onboarding-checklist.md": {
	id: "motel-manager-onboarding-checklist.md";
  slug: "motel-manager-onboarding-checklist";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-marketing-audit.md": {
	id: "motel-marketing-audit.md";
  slug: "motel-marketing-audit";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-marketing-basics.md": {
	id: "motel-marketing-basics.md";
  slug: "motel-marketing-basics";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-marketing-checklist.md": {
	id: "motel-marketing-checklist.md";
  slug: "motel-marketing-checklist";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-organizational-structure.md": {
	id: "motel-organizational-structure.md";
  slug: "motel-organizational-structure";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-room-inventory-management-guide.md": {
	id: "motel-room-inventory-management-guide.md";
  slug: "motel-room-inventory-management-guide";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-room-rate-calculator.md": {
	id: "motel-room-rate-calculator.md";
  slug: "motel-room-rate-calculator";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-seo-checklist-2026.md": {
	id: "motel-seo-checklist-2026.md";
  slug: "motel-seo-checklist-2026";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"motel-website-optimization-checklist.md": {
	id: "motel-website-optimization-checklist.md";
  slug: "motel-website-optimization-checklist";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"optimize-bookingdotcom-for-more-bookings.md": {
	id: "optimize-bookingdotcom-for-more-bookings.md";
  slug: "optimize-bookingdotcom-for-more-bookings";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"what-is-motel-room-pick-up.md": {
	id: "what-is-motel-room-pick-up.md";
  slug: "what-is-motel-room-pick-up";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"what-is-schema.md": {
	id: "what-is-schema.md";
  slug: "what-is-schema";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
};
"pages": {
"about.md": {
	id: "about.md";
  slug: "about";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"advanced-motel-management-courses.md": {
	id: "advanced-motel-management-courses.md";
  slug: "advanced-motel-management-courses";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"become-motel-coach.md": {
	id: "become-motel-coach.md";
  slug: "become-motel-coach";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"beginner-motel-management-course.md": {
	id: "beginner-motel-management-course.md";
  slug: "beginner-motel-management-course";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"contact.md": {
	id: "contact.md";
  slug: "contact";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"disclaimer.md": {
	id: "disclaimer.md";
  slug: "disclaimer";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"faq.md": {
	id: "faq.md";
  slug: "faq";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"front-desk-training-guide-motel.md": {
	id: "front-desk-training-guide-motel.md";
  slug: "front-desk-training-guide-motel";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"home.md": {
	id: "home.md";
  slug: "home";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"how-to-run-a-motel.md": {
	id: "how-to-run-a-motel.md";
  slug: "how-to-run-a-motel";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"improve-motel-occupancy.md": {
	id: "improve-motel-occupancy.md";
  slug: "improve-motel-occupancy";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"intermediate-motel-management-courses.md": {
	id: "intermediate-motel-management-courses.md";
  slug: "intermediate-motel-management-courses";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"learn-guest-point-pms.md": {
	id: "learn-guest-point-pms.md";
  slug: "learn-guest-point-pms";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"llms.md": {
	id: "llms.md";
  slug: "llms";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-consultancy.md": {
	id: "motel-consultancy.md";
  slug: "motel-consultancy";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-front-desk-quick-reference-guide.md": {
	id: "motel-front-desk-quick-reference-guide.md";
  slug: "motel-front-desk-quick-reference-guide";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-management-book-free-shortened.md": {
	id: "motel-management-book-free-shortened.md";
  slug: "motel-management-book-free-shortened";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-management-book.md": {
	id: "motel-management-book.md";
  slug: "motel-management-book";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-management-course-purchase.md": {
	id: "motel-management-course-purchase.md";
  slug: "motel-management-course-purchase";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-management-courses.md": {
	id: "motel-management-courses.md";
  slug: "motel-management-courses";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-management-training-course.md": {
	id: "motel-management-training-course.md";
  slug: "motel-management-training-course";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-management.md": {
	id: "motel-management.md";
  slug: "motel-management";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-marketing.md": {
	id: "motel-marketing.md";
  slug: "motel-marketing-strategies-for-independent-operators-increase-direct-bookings-occupancy";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-receptionist-jobs.md": {
	id: "motel-receptionist-jobs.md";
  slug: "motel-receptionist-jobs";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-resources.md": {
	id: "motel-resources.md";
  slug: "motel-resources";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-room-pick-up.md": {
	id: "motel-room-pick-up.md";
  slug: "motel-room-pick-up";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"motel-websites-design.md": {
	id: "motel-websites-design.md";
  slug: "motel-websites-design";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"privacy-policy.md": {
	id: "privacy-policy.md";
  slug: "privacy-policy";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"starter-motel-management-course.md": {
	id: "starter-motel-management-course.md";
  slug: "starter-motel-management-course";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"terms-conditions.md": {
	id: "terms-conditions.md";
  slug: "terms-conditions";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
"what-does-a-motel-manager-do.md": {
	id: "what-does-a-motel-manager-do.md";
  slug: "what-does-a-motel-manager-do";
  body: string;
  collection: "pages";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
