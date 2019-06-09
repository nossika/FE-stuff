# nginx

## nginx.conf

todo...


```
http {

    include /etc/nginx/conf.d/*.conf;

    server {

        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;
        rewrite ^(.*)$ https://$host$1 permanent;

    }


    server {

    server_name nossika.com www.nossika.com;
    
    root         /usr/share/nginx/html;

    include /etc/nginx/default.d/*.conf;

    location / {
        root /www/statics;
        index index.html;
    }

    location /fe/ {
        proxy_pass http://127.0.0.1:3000/;
    }

    location /draw {
        alias /www/draw-something/FE/dist;
        index index.html;
    }

    location /io/socket.io/ {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:7777/socket.io/;
    }

    error_page 404 /404.html;

    location = /404.html {
        root /www/pages;
    }

    error_page 500 502 503 504 /500.html;

    location = /500.html {
        root /www/pages;
    }

    listen [::]:443 ssl ipv6only=on http2; # managed by Certbot
    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/nossika.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/nossika.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    }
}
```