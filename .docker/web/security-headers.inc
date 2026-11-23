# The security headers of every response, which nginx.conf includes in its server block and in each location that adds a
# header of its own, since an add_header in a location replaces every one of the server block. always adds them to error
# responses too, such as a 404.
#
# nginx serves plain HTTP behind the proxy that terminates TLS, and browsers ignore Strict-Transport-Security over plain
# HTTP, so that proxy sends it instead. X-Frame-Options keeps other sites from framing the app in browsers that ignore
# the frame-ancestors of csp.inc. Permissions-Policy lists only features that Chromium knows, so its console logs no
# warning, and the app uses none of them.
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "same-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
add_header X-Frame-Options "DENY" always;
