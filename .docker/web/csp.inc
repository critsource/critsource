# The Content Security Policy of the HTML files, which nginx.conf includes in the location of each. An add_header in a
# location replaces every one of the server block, so the policy cannot sit there. always adds it to the Not found page,
# which nginx serves with status 404.
#
# The browser enforces the policy: it blocks each script or style that neither the app nor Cloudflare's bot check loads,
# and logs the violation to its console. $request_id is 32 random
# hex characters that are new for each request, and sub_filter writes it in place of every @CSP_NONCE@ in the HTML, so
# the header and the page carry the same nonce. Cloudflare reads the nonce from this header to allow its bot check, which
# is why the nonce cannot move to a <meta> tag. The policy leaves out 'strict-dynamic', since the bot check loads from
# /cdn-cgi/challenge-platform/ on this origin, and allows inline styles, since Cloudflare adds a hidden link with a style
# attribute, which a nonce in style-src would block.
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-$request_id'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
sub_filter '@CSP_NONCE@' $request_id;
sub_filter_once off;
