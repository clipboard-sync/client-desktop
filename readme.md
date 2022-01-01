# ClipboardSync / 剪贴板同步

桌面端 | [安卓端](https://github.com/clipboard-sync/client-rn) | [服务端](https://github.com/clipboard-sync/socket-server)  


**一款简单的剪贴板同步工具**

## 功能

- 监听剪贴板并与远程剪贴板同步
- 端加密，允许私有部署服务端
- 移动设备的通知提示
- 允许同时也作为服务端开启

## Install / 安装方式

MAC & Windows： [Github Release](https://github.com/clipboard-sync/client-desktop/releases)

## Usage / 使用方式

点击托盘区图标，进入"偏好设置"

1. 填写服务器地址(以下提供了一些公开的服务)
    - http://sock.mysocket.online:3000
2. 填写 频道（channel），相当于你的用户名，尽量不要与别人重复
3. 填写 密钥（pwd），用于端到端加密的密码，不会向服务器发送

**保证以上的三个配置在你的所有客户端都一致**

## Q&A

1. 服务端是否会看到消息内容？  
    如果你设置了密钥，服务端不会看到任何东西，如果还不放心，可以私有部署。  
2. 为什么需要使用服务端，为什么不提供局域网联机？  
    迫于办公和家庭或者外出时，并不能时刻保证所有终端都在局域网内。如果需要局域网互联，使用 KDE-connect  
3. 剪贴板同步的策略是什么？  
    目前仅支持同步图片和文本，客户端以 1s 1次 的频率检查剪贴板，如果你有更好的策略，欢迎在 issue 提出  


## Develop

- 系统： MacOS 12.1 (Monterey) 、 windows 10.0  
- Node: >16.0  



## License

MIT

