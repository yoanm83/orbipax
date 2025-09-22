# Source Code

Main application source code organized in modular monolith pattern.
Contains vertical modules (patients, clinicians, etc.), shared utilities, and infrastructure adapters.
Follows strict layer separation: UI → Application → Domain, with Infrastructure only accessed by Application.