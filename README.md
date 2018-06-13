## from：https://github.com/hpgary/MyAlice

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
