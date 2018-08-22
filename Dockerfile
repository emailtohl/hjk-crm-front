FROM nginx
MAINTAINER emailtohl@163.com
COPY dist/hjk-crm-front/ /usr/share/nginx/html
VOLUME /var/log/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
