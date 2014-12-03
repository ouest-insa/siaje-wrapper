siaje-wrapper
=============

An API for SIAJE. Early dev, be careful.

Usage
-----

Currently, you can only retrieve your studies from SIAJE.

```javascript
Siaje = require('siaje-wrapper');
var s = new Siaje(ouest_insa, a-smith, s3cr3t, function(err) {
  if (!err) {
    s.getStudies(function(err, res) {
      if(!err)
        console.log(res);
    });
  }
});
```

### Connection

```javascript
var s = new Siaje(<Your JE Slug>, <A member account>, <Member's password>, <Callback>);
```

### Get studies

```javascript
s.getStudies(<Callback>);
```
The callback return a javascript array like the following : 

```javascript
[ { name: 'Enterprise 1',
    type: 'Type 1',
    status: 'Status 1' },
  { name: 'Enterprise 2',
    type: 'Type 2',
    status: 'Status 2' } ]

```
