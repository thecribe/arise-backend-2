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

const PHASE_STATUS_TRANSITIONS = {
  locked: ["in_progress"],

  in_progress: ["locked", "approved"],

  approved: ["in_progress"],
};
/**
 * -----------------------------------------------------------------------------
 * Validate phase status transition.
 * -----------------------------------------------------------------------------
 */

export const validatePhaseStatusTransition = ({
  currentStatus,
  nextStatus,
}) => {
  /**
   * Prevent unnecessary updates.
   */
  if (currentStatus === nextStatus) {
    return;
  }

  const allowedTransitions = PHASE_STATUS_TRANSITIONS[currentStatus] ?? [];

  if (!allowedTransitions.includes(nextStatus)) {
    throw new Error(
      `Cannot change phase status from "${currentStatus}" to "${nextStatus}".`,
    );
  }
};
