
在原有的基础上做了修改 增加了swagger 修改兼容了es6.x以上版本（因为6.x不允许多种type创建）  后续继续增加功能

更详细的使用过程：
1.安装elasticsearch服务，安装es-ik插件(直接拷贝到plugin/ik目录下)，安装es-head插件(需要安装nodejs,npm install后使用grunt server启动),启动es，启动es-head
2.安装mysql服务，(初始化mysqld --initialize 配置端口)启动mysql 然后修改密码, 再使用./mysql -uroot -ppassowrd登陆执行.sql文件中的sql语句创建表和默认数据
3.启动web工程里App.java springboot启动成功
4.访问localhost:8080/index.html 用数据库中的用户名密码登陆  创建问题和答案，实现客服问答
5.访问localhost:8080/swagger-ui.html 查看所有接口，直接调用接口测试

!!!attention!!!
启动es和mysql需要新建用户 useradd snow 
然后su snow 用新用户启动服务 
es需要设置虚拟缓存 ulimit -v unlimited 

es-ik分词插件在线安装
./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.2.4/elasticsearch-analysis-ik-6.2.4.zip

es-head 需要 grunt server 启动  如果报错则需要 npm install 安装服务 



## PageHelper mybatis 分页插件
```
依赖jar包：
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.0.0</version>
</dependency>
		
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.1.0</version>
</dependency>

配置：@AutoConfigureBefore(PageHelperAutoConfiguration.class)
aplication.properties 配置参考 com.github.pagehelper.autoconfigure.PageHelperProperties

使用：
Page<QuestionOrder> startPage = PageHelper.startPage(pageId, 10);
questionOrderMapper.query(); 
首先执行 PageHelper.startPage(pageId, 10) 之后第一个查询方法会进行分页处理 
返回参数在 startPage里， 获取查询结果：
startPage.getTotal() //获取记录条数
startPage.getResult() //获取查询结果
```
from：https://github.com/hpgary/MyAlice
## es 分词插件
```
curl -XPUT 'http://127.0.0.1:19200/myalice?pretty' -d '{
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
          "type": "ik_max_word",
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
```
