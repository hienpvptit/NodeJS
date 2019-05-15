const AccessControl = require('accesscontrol');
const ac = new AccessControl();
ac.grant('user')
    .createOwn('video')
    .deleteOwn('video')
    .readAny('video');

const permission = ac.can('user').createOwn('video');
console.log(permission.granted);    // —> true
console.log(permission.attributes); // —> ['*'] (all attributes)