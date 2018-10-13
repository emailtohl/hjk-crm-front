FROM nginx
LABEL author=emailtohl@163.com
COPY dist/hjk-crm-front/ /usr/share/nginx/html
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]
