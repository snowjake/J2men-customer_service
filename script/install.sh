#!/bin/bash

function isRun(){
 ps aux | grep -v 'grep' | grep $1
}

tar xzvf /usr/local/src/jdk1.8.0_101.tar.gz -C /usr/local/

path_file=/etc/profile.d/path.sh
echo "JAVA_HOME=/usr/local/jdk1.8.0_101" >> $path_file
echo 'PATH=$PATH:$JAVA_HOME/bin' >> $path_file
echo 'export PATH JAVA_HOME' >> $path_file

mkdir -p /esdata/data
mkdir -p /esdata/logs
tar xvf /usr/local/src/elasticsearch.tar.gz -C /usr/local/
useradd es -s /bin/bash
chown -R es:es /usr/local/elasticsearch
chown -R es:es /esdata/
tar xzvf /usr/local/src/mysql-5.6.36-linux-glibc2.5-x86_64.tar.gz -C /usr/local
useradd mysql -s /bin/bash
mv /usr/local/mysql-5.6.36-linux-glibc2.5-x86_64 /usr/local/mysql
mkdir /mysql
chown -R mysql:mysql /mysql
yum install -y perl perl-Data-Dumper libaio libaio-devel
cd /usr/local/mysql
./scripts/mysql_install_db --user=mysql --datadir=/mysql

cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
sed -i 's#^basedir=$#basedir=/usr/local/mysql#g' /etc/init.d/mysqld
sed -i 's#^datadir=$#datadir=/mysql#g' /etc/init.d/mysqld

isRun elasticsearch
if [ $? != 0 ] ; then
  su - es -c "/usr/local/elasticsearch/bin/elasticsearch -d"
fi
isRun mysql
if [ $? != 0 ] ; then
  /etc/init.d/mysqld start
fi

isRun mysql
if [ $? == 0 ] ; then
  /usr/local/mysql/bin/mysql -u root test < /usr/local/src/init.sql
fi

tar -xvf /usr/local/src/mvn.tar.gz -C /usr/local/
echo "M2_HOME=/usr/local/mvn" >> $path_file
echo 'PATH=$PATH:$M2_HOME/bin' >> $path_file
echo "export M2_HOME PATH" >> $path_file
. /etc/profile

tar -xvf /usr/local/src/m2.tar.gz -C /root/

mkdir /usr/local/apps
tar -xvf /usr/local/src/myalice.tar.gz -C /usr/local/apps/
cd /usr/local/apps/MyAlice
mvn package -DskipTests -Djar

nohup java -jar myalice-web/target/myalice-web-1.0.jar > myalice.out 2>&1 &





curl -XPUT 'http://127.0.0.1:9200/myalice?pretty' -d '{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "my_tokenizer"
        },
        "my_ik": {
          "tokenizer": "ik"
        }
      },
      "tokenizer": {
        "my_tokenizer": {
          "type": "classic",
          "max_token_length": 150
        },
        "ik": {
          "type": "ik_smart",
          "max_token_length": 150
        }
      }
    }
  },
  "mappings": {
    "answer": {
      "properties": {
        "question_id": {
          "type": "string",
          "analyzer": "my_analyzer"
        }
      }
    },
    "question": {
      "properties": {
        "title": {
          "type": "string",
          "analyzer": "my_ik"
        }
      }
    }
  }
}'
