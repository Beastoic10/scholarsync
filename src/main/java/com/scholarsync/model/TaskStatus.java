package com.scholarsync.model;

/**
 * Represents the academic lifecycle from the proposal's Kanban Engine
 * (Section 3A): Proposed -> Literature Review -> Experimentation ->
 * Under Advisor Review -> Approved.
 *
 * This enum is a placeholder for the current milestone. In the next
 * milestone each value will back a dedicated State class (State Pattern)
 * so transition rules (e.g. "only TEACHER can move to APPROVED") live in
 * code rather than nested if/else logic.
 */
public enum TaskStatus {
    PROPOSED,
    LITERATURE_REVIEW,
    EXPERIMENTATION,
    UNDER_ADVISOR_REVIEW,
    APPROVED
}
