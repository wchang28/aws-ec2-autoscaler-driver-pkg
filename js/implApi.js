"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* implementation API extension
    /info
    /setup
    /setup/cpus_per_instance
    /setup/worker_characteristic
    /setup/worker_characteristic/key_name
    /setup/worker_characteristic/instance_type
    /setup/worker_characteristic/image_id
    /setup/worker_characteristic/security_group_id
    /setup/worker_characteristic/subnet_id
    /setup/worker_characteristic/iam_role_name
    /setup/worker_characteristic/name_tag
*/
var WorkerCharacteristicSetup = /** @class */ (function () {
    function WorkerCharacteristicSetup(api) {
        this.api = api;
    }
    WorkerCharacteristicSetup.prototype.toJSON = function () { return this.api.$J("GET", '/', {}); };
    WorkerCharacteristicSetup.prototype.getKeyName = function () { return this.api.$J("GET", '/key_name', {}); };
    WorkerCharacteristicSetup.prototype.setKeyName = function (value) { return this.api.$J("PATCH", '/key_name', { value: value }); };
    WorkerCharacteristicSetup.prototype.getInstanceType = function () { return this.api.$J("GET", '/instance_type', {}); };
    WorkerCharacteristicSetup.prototype.setInstanceType = function (value) { return this.api.$J("PATCH", '/instance_type', { value: value }); };
    WorkerCharacteristicSetup.prototype.getImageId = function () { return this.api.$J("GET", '/image_id', {}); };
    WorkerCharacteristicSetup.prototype.setImageId = function (value) { return this.api.$J("PATCH", '/image_id', { value: value }); };
    WorkerCharacteristicSetup.prototype.getSecurityGroupId = function () { return this.api.$J("GET", '/security_group_id', {}); };
    WorkerCharacteristicSetup.prototype.setSecurityGroupId = function (value) { return this.api.$J("PATCH", '/security_group_id', { value: value }); };
    WorkerCharacteristicSetup.prototype.getSubnetId = function () { return this.api.$J("GET", '/subnet_id', {}); };
    WorkerCharacteristicSetup.prototype.setSubnetId = function (value) { return this.api.$J("PATCH", '/subnet_id', { value: value }); };
    WorkerCharacteristicSetup.prototype.getIAMRoleName = function () { return this.api.$J("GET", '/iam_role_name', {}); };
    WorkerCharacteristicSetup.prototype.setIAMRoleName = function (value) { return this.api.$J("PATCH", '/iam_role_name', { value: value }); };
    WorkerCharacteristicSetup.prototype.getNameTag = function () { return this.api.$J("GET", '/name_tag', {}); };
    WorkerCharacteristicSetup.prototype.setNameTag = function (value) { return this.api.$J("PATCH", '/name_tag', { value: value }); };
    return WorkerCharacteristicSetup;
}());
var ImplementationSetup = /** @class */ (function () {
    function ImplementationSetup(api) {
        this.api = api;
    }
    ImplementationSetup.prototype.toJSON = function () { return this.api.$J("GET", '/', {}); };
    ImplementationSetup.prototype.getCPUsPerInstance = function () { return this.api.$J("GET", '/cpus_per_instance', {}); };
    ImplementationSetup.prototype.setCPUsPerInstance = function (value) { return this.api.$J("PATCH", '/cpus_per_instance', { value: value }); };
    Object.defineProperty(ImplementationSetup.prototype, "WorkerCharacteristic", {
        get: function () { return new WorkerCharacteristicSetup(this.api.mount('/worker_characteristic')); },
        enumerable: true,
        configurable: true
    });
    return ImplementationSetup;
}());
var Implementation = /** @class */ (function () {
    function Implementation(api) {
        this.api = api;
    }
    Implementation.prototype.getInfo = function () { return this.api.$J("GET", '/info', {}); };
    Object.defineProperty(Implementation.prototype, "Setup", {
        get: function () { return new ImplementationSetup(this.api.mount('/setup')); },
        enumerable: true,
        configurable: true
    });
    return Implementation;
}());
function getImplementationSetup(api) { return new ImplementationSetup(api); }
exports.getImplementationSetup = getImplementationSetup;
function getImplementation(api) { return new Implementation(api); }
exports.getImplementation = getImplementation;
//# sourceMappingURL=implApi.js.map