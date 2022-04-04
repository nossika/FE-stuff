(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{447:function(n,e,t){"use strict";t.r(e);var o=t(54),r=Object(o.a)({},(function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[t("h1",{attrs:{id:"nginx"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#nginx"}},[n._v("#")]),n._v(" nginx")]),n._v(" "),t("h2",{attrs:{id:"nginx-conf"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#nginx-conf"}},[n._v("#")]),n._v(" nginx.conf")]),n._v(" "),t("p",[n._v("todo...")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v('# For more information on configuration, see:\n#   * Official English Documentation: http://nginx.org/en/docs/\n#   * Official Russian Documentation: http://nginx.org/ru/docs/\n\nuser nginx;\nworker_processes auto;\nerror_log /var/log/nginx/error.log;\npid /run/nginx.pid;\n\n# Load dynamic modules. See /usr/share/nginx/README.dynamic.\ninclude /usr/share/nginx/modules/*.conf;\n\nevents {\n    worker_connections 1024;\n}\n\nhttp {\n    log_format  main  \'$remote_addr - $remote_user [$time_local] "$request" \'\n                      \'$status $body_bytes_sent "$http_referer" \'\n                      \'"$http_user_agent" "$http_x_forwarded_for"\';\n\n    access_log  /var/log/nginx/access.log  main;\n\n    sendfile            on;\n    tcp_nopush          on;\n    tcp_nodelay         on;\n    keepalive_timeout   65;\n    types_hash_max_size 2048;\n\n    include             /etc/nginx/mime.types;\n    default_type        application/octet-stream;\n\n    # Load modular configuration files from the /etc/nginx/conf.d directory.\n    # See http://nginx.org/en/docs/ngx_core_module.html#include\n    # for more information.\n    include /etc/nginx/conf.d/*.conf;\n\n    server {\n        listen       80 default_server;\n        listen       [::]:80 default_server;\n        server_name  _;\n        root         /usr/share/nginx/html;\n        rewrite ^(.*)$ https://$host$1 permanent;\n        # Load configuration files for the default server block.\n        # include /etc/nginx/default.d/*.conf;\n    }\n\n# Settings for a TLS enabled server.\n#\n#    server {\n#        listen       443 ssl http2 default_server;\n#        listen       [::]:443 ssl http2 default_server;\n#        server_name  _;\n#        root         /usr/share/nginx/html;\n#\n#        ssl_certificate "/etc/pki/nginx/server.crt";\n#        ssl_certificate_key "/etc/pki/nginx/private/server.key";\n#        ssl_session_cache shared:SSL:1m;\n#        ssl_session_timeout  10m;\n#        ssl_ciphers HIGH:!aNULL:!MD5;\n#        ssl_prefer_server_ciphers on;\n#\n#        # Load configuration files for the default server block.\n#        include /etc/nginx/default.d/*.conf;\n#\n#        location / {\n#        }\n#\n#        error_page 404 /404.html;\n#            location = /40x.html {\n#        }\n#\n#        error_page 500 502 503 504 /50x.html;\n#            location = /50x.html {\n#        }\n#    }\n\n\n\n    server {\n        server_name nossika.com www.nossika.com; # managed by Certbot\n       \n        root         /usr/share/nginx/html;\n\n        # Load configuration files for the default server block.\n        include /etc/nginx/default.d/*.conf;\n\n        location / {\n            root /www/statics;\n            index index.html;\n        }\n\n        location /git-hook/ {\n            proxy_pass http://127.0.0.1:10000/;\n        }\n\n        location /json {\n            alias /www/demo-collection/visualize-JSON;\n            index index.html;\n        }\n\n        location /fe/ {\n            proxy_pass http://127.0.0.1:3000/;\n        }\n\n        location /draw {\n            alias /www/draw-something/FE/dist;\n            index index.html;\n        }\n        location /io/socket.io/ {\n            proxy_set_header Upgrade $http_upgrade;\n            proxy_set_header Connection "upgrade";\n            proxy_pass http://127.0.0.1:7777/socket.io/;\n        }\n\n\n        error_page 404 /404.html;\n        location = /404.html {\n            root /www/pages;\n        }\n\n        error_page 500 502 503 504 /500.html;\n        location = /500.html {\n            root /www/pages;\n        }\n    \n\n#    listen [::]:443 ssl ipv6only=on http2; # managed by Certbot\n    listen 443 ssl http2; # managed by Certbot\n    ssl_certificate /etc/letsencrypt/live/nossika.com/fullchain.pem; # managed by Certbot\n    ssl_certificate_key /etc/letsencrypt/live/nossika.com/privkey.pem; # managed by Certbot\n    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot\n    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot\n\n\n\n\n}\n\nserver {\n           \n        server_name fe.nossika.com; # managed by Certbot\n\n        location / {\n            root /www/FE-guide/.vuepress/dist;\n            index index.html;\n        }\n        root         /usr/share/nginx/html;\n        error_page 404 /404.html;\n        location = /404.html {\n            root /www/pages;\n        }\n\n        error_page 500 502 503 504 /500.html;\n        location = /500.html {\n            root /www/pages;\n        }\n\n#    listen [::]:443 ssl ipv6only=on http2; # managed by Certbot\n    listen 443 ssl http2; # managed by Certbot\n    ssl_certificate /etc/letsencrypt/live/nossika.com-0001/fullchain.pem; # managed by Certbot\n    ssl_certificate_key /etc/letsencrypt/live/nossika.com-0001/privkey.pem; # managed by Certbot\n    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot\n    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot\n\n}  \n\n}\n')])])])])}),[],!1,null,null,null);e.default=r.exports}}]);