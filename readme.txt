Working examples and description: https://www.tpd.zone/data-demos

PLEASE ADD file: api/[LANG]/creds.* with content: {"k":"YOUR_KEY_HERE"}

These examples show possible useage of TDP data.

Client requests data via YOUR server (examples given in /api).

YOUR server side is where you add your KEY and client requested params.

Do NOT request data from TPD directly from the client as your key will be exposed.

Data is passed back to the client and used to drive garphics.

You MAY use the TDP API to get and store the data locally and serve directly without calling the TDP API for each request, or cache the data as requested.

Please be aware data can alter with updated information at any time.

If you use caching, we suggested caching for only a few hours until the race is more than 2 weeks old. 