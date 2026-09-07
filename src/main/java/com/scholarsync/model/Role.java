package com.scholarsync.model;

/**
 * Roles referenced in the ScholarSync proposal (Section 5 - Security & Auth).
 * Drives Spring Security authorization and gates state transitions in the
 * upcoming Task Lifecycle (State Pattern) milestone.
 */
public enum Role {
    TEACHER,
    STUDENT,
    CO_AUTHOR
}
