/**
 * -----------------------------------------------------------------------------
 * Section status transitions controlled by Recruitment Managers.
 * -----------------------------------------------------------------------------
 */

export const canManagerUpdateSectionStatus = (currentStatus, nextStatus) => {
  const transitions = {
    /**
     * Manager can review an active section.
     */
    in_progress: ["approved", "rejected"],

    /**
     * Applicant has submitted the section.
     */
    submitted: ["approved", "rejected"],

    /**
     * Manager can either approve a rejected section
     * or reopen it.
     */
    rejected: ["approved", "in_progress"],

    /**
     * Approved sections can be reopened.
     */
    approved: ["in_progress"],

    /**
     * Locked sections cannot be manually reviewed.
     */
    locked: [],
  };

  return transitions[currentStatus]?.includes(nextStatus) ?? false;
};
