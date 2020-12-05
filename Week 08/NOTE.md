# 有限状态机
## 有限状态机
![有限状态机](./images/有限状态机.jpg)

### Mealy 状态机
![Mealy状态机](./images/Mealy状态机.jpg)

# HTTP
## 浏览器渲染原理
![浏览器渲染架构图](./images/浏览器渲染.jpg)

## ISO-OSI七层网络模型
|OSI|对应|node|
|--|--|--|
|应用|HTTP|require('http')|
|表示|HTTP|require('http')|
|会话|HTTP|require('http')|
|传输|TCP|require('net')|
|网络|Internet|
|数据链路|4G/5G/Wifi|
|物理|4G/5G/Wifi|

## HTTP协议

http协议，是文本型协议，协议内容都是字符串

Request: ------ line：POST /HTTP/1.1  
headers: ------ Host:127.0.0.1    
         ------ Content-Type: application/x-www-form-urlencoded   
(headers以空行为标志结束)   
body:    ------ (由content-type决定格式)


HTTP换行符都是由 \r\n 组成
