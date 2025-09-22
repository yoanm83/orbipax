# Vertical Modules

Self-contained business modules following clean architecture patterns.
Each module has ui, application, domain, infrastructure, and tests layers.
Dependencies flow: ui → application → domain, with infrastructure only called by application.