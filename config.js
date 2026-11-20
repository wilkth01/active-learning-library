/* Site configuration.
   brainstormEndpoint: the URL of the deployed brainstorm Worker (see worker/README.md),
   e.g. "https://all-brainstorm.<your-subdomain>.workers.dev". Leave it empty and the
   brainstorm panels fall back to "Open in Claude" and "Copy prompt", which need no server. */
window.ALL_CONFIG = {
  brainstormEndpoint: "",
  requestsPerFormat: 3
};
