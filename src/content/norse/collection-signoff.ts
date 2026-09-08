import type { NorseIdentityAudit, NorseProductSignoff, NorseSnapshotApproval } from './collection-handoff';

/**
 * The identity/claim audit is a separate editorial decision from product
 * sign-off. It must be bound to the exact Completion Snapshot being handed off.
 */
export const norseIdentityAudit: NorseIdentityAudit = {
  status: 'pending',
};

/**
 * The sole product approval record consumed by the Phase 9 report. Keep this
 * pending until a product owner has reviewed the completed content and visual
 * evidence; an automated check must never promote it to ready.
 */
export const norseProductSignoff: NorseProductSignoff = {
  status: 'pending',
};

/**
 * The Completion Snapshot itself needs a human approval record after the
 * final generated evidence has been inspected. This is separate from the
 * product decision so a regenerated snapshot cannot silently inherit an old
 * approval.
 */
export const norseCompletionSnapshotApproval: NorseSnapshotApproval = {
  status: 'pending',
};
