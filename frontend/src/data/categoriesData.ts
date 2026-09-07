import { Listing } from "@/types";

/**
 * Cleaned Experiences: No mock experiences.
 * Live experiences created by hosts will be loaded dynamically from the backend.
 */
export const TODAY_EXPERIENCES: Listing[] = [];
export const TOMORROW_EXPERIENCES: Listing[] = [];

/**
 * Cleaned Services: Services mode is out of scope per Assignment description.
 */
export const SERVICES_LISTINGS: Listing[] = [];

export const ALL_CATEGORIZED_LISTINGS: Listing[] = [];

export function getCategoryListingById(id: number): Listing | undefined {
  return undefined;
}
