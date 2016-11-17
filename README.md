# ngNotify
Notifications for angular app.
# Useage
clone this repo
```
git clone https://github.com/kraaas/ng-notify.git
```

```
<link rel="stylesheet" href="./ng-notify/ng-notigy.min.css">
<script src="./ng-notify/ng-notify.min.js"></script>
```

# API
- ngNotify.open(options)
- ngNotify.info(options)
- ngNotify.success(options)
- ngNotify.error(options)
- ngNotify.warn(options)

# options[Object]
|opt|type|default|
|---|----|-------|
|title|string|''|
|content|string|''|
|top|string|'20px'|
|position|string|'top'|
|onOk|function|angular.noop|
|onCancle|function|angular.noop|
|okText|string|'确认'|
|cancleText|string|'取消'|
|showOk|boolean|true|
|showCancle|boolean|false|
|showTitle|boolean|true|
