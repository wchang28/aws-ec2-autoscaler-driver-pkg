"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var grid_autoscaler_impl_pkg_1 = require("grid-autoscaler-impl-pkg");
var aws_ec2_autoscaler_impl_1 = require("aws-ec2-autoscaler-impl");
var AWS = require("aws-sdk");
var settingsStore_1 = require("./settingsStore");
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
// factory function
var factory = function (getImpl, config, onChange) {
    AWS.config.update({ region: config.AWSRegion });
    var store = new settingsStore_1.SettingsStore(config.SettingsFile);
    return store.load()
        .then(function (options) {
        //console.log(JSON.stringify(config.Info, null, 2));
        //console.log(JSON.stringify(options, null, 2));
        var impl = new aws_ec2_autoscaler_impl_1.Implementation(config.Info, function (worker) { return worker.RemoteAddress; }, function (instance) { return (instance ? instance.PrivateIpAddress : null); }, function (instance, workerKey) { return (instance ? instance.PrivateIpAddress === workerKey : false); }, options);
        impl.on("change", function () {
            store.save(impl.toJSON());
            onChange();
        });
        var implApiRouter = express.Router();
        var setupRouter = express.Router();
        var wcRouter = express.Router(); // worker characteristic router
        implApiRouter.get('/info', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return impl.getInfo();
        }));
        implApiRouter.use('/setup', setupRouter);
        setupRouter.get('/', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.toJSON());
        }));
        setupRouter.get('/cpus_per_instance', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.CPUsPerInstance);
        }));
        setupRouter.patch('/cpus_per_instance', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.CPUsPerInstance = req.body.value;
            return Promise.resolve(impl.CPUsPerInstance);
        }));
        setupRouter.use('/worker_characteristic', wcRouter);
        wcRouter.get('/', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic);
        }));
        wcRouter.get('/key_name', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.KeyName);
        }));
        wcRouter.patch('/key_name', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.KeyName = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.KeyName);
        }));
        wcRouter.get('/instance_type', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.InstanceType);
        }));
        wcRouter.patch('/instance_type', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.InstanceType = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.InstanceType);
        }));
        wcRouter.get('/image_id', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.ImageId);
        }));
        wcRouter.patch('/image_id', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.ImageId = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.ImageId);
        }));
        wcRouter.get('/security_group_id', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.SecurityGroupId);
        }));
        wcRouter.patch('/security_group_id', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.SecurityGroupId = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.SecurityGroupId);
        }));
        wcRouter.get('/subnet_id', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.SubnetId);
        }));
        wcRouter.patch('/subnet_id', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.SubnetId = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.SubnetId);
        }));
        wcRouter.get('/iam_role_name', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.IAMRoleName);
        }));
        wcRouter.patch('/iam_role_name', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.IAMRoleName = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.IAMRoleName);
        }));
        wcRouter.get('/name_tag', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            return Promise.resolve(impl.WorkerCharacteristic.NameTag);
        }));
        wcRouter.patch('/name_tag', grid_autoscaler_impl_pkg_1.getRequestHandlerForImplementation(getImpl, function (req, impl) {
            impl.WorkerCharacteristic.NameTag = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.NameTag);
        }));
        return Promise.resolve([impl, implApiRouter]);
    });
};
exports.factory = factory;
//# sourceMappingURL=index.js.map