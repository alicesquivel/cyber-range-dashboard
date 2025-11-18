The dashboard assigns the following colors to each participant role:

Red – Attackers

Blue – Defenders

Yellow – Observers

White – Instructors

Color coding should be applied consistently across labels, charts, and UI elements.

The readiness bar calculates team progress using:

readiness = (current_points / 30) × 100%

Where:

30 points represents full completion of Labs 1–3

The bar updates automatically when points are awarded via the scoring API

Each node includes a tooltip describing its function within the exercise. Recommended text:

Router – “Core routing device connecting subnets”

DMZ – “Public-facing service zone exposed to external traffic”

Server – “Internal API Server”

Client – “User workstation accessing services”

Dashboard – “Central monitoring and scoring interface”

Nodes are defined using a simple JSON structure:

{"name":"Server","status":"up","tooltip":"Internal API Server"}