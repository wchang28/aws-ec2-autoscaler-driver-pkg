import {IAutoScalerImplementation, IWorker, WorkerKey, AutoScalerImplementationInfo} from 'autoscalable-grid';
import * as express from 'express';
import * as core from 'express-serve-static-core';
import {AutoScalerImplementationFactory, AutoScalerImplementationOnChangeHandler, GetAutoScalerImplementationProc, getRequestHandlerForImplementation} from 'grid-autoscaler-impl-pkg';
import {Implementation, IImplementationSetup, Options} from "aws-ec2-autoscaler-impl";
import * as AWS from "aws-sdk";
import {EC2} from 'aws-sdk';
import {SettingsStore} from "./settingsStore";

interface Config {
    Info: AutoScalerImplementationInfo;
    AWSRegion: string;
    SettingsFile: string; 
}

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
let factory: AutoScalerImplementationFactory = (getImpl: GetAutoScalerImplementationProc, config: Config, onChange: AutoScalerImplementationOnChangeHandler) => {
    AWS.config.update({region: config.AWSRegion});
    let store = new SettingsStore(config.SettingsFile);
    return store.load()
    .then((options: Options) => {
        //console.log(JSON.stringify(config.Info, null, 2));
        //console.log(JSON.stringify(options, null, 2));
        let impl = new Implementation(  config.Info
                                        ,(worker: IWorker) => worker.RemoteAddress
                                        ,(instance: EC2.Instance) => (instance ? instance.PrivateIpAddress : null)
                                        ,(instance: EC2.Instance, workerKey: WorkerKey) => (instance ? instance.PrivateIpAddress === workerKey : false)
                                        ,options);

        impl.on("change", () => {
            store.save(impl.toJSON());
            onChange();
        });

        let implApiRouter = express.Router();
        let setupRouter = express.Router();
        let wcRouter = express.Router();    // worker characteristic router

        implApiRouter.get('/info', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return impl.getInfo();
        }));
        implApiRouter.use('/setup', setupRouter);

        setupRouter.get('/', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.toJSON());
        }));
        setupRouter.get('/cpus_per_instance', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.CPUsPerInstance);
        }));
        setupRouter.patch('/cpus_per_instance', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.CPUsPerInstance = req.body.value
            return Promise.resolve(impl.CPUsPerInstance);
        }));

        setupRouter.use('/worker_characteristic', wcRouter);

        wcRouter.get('/', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic);
        }));
        wcRouter.get('/key_name', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.KeyName);
        }));
        wcRouter.patch('/key_name', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.KeyName = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.KeyName);
        }));
        wcRouter.get('/instance_type', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.InstanceType);
        }));
        wcRouter.patch('/instance_type', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.InstanceType = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.InstanceType);
        }));
        wcRouter.get('/image_id', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.ImageId);
        }));
        wcRouter.patch('/image_id', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.ImageId = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.ImageId);
        }));
        wcRouter.get('/security_group_id', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.SecurityGroupId);
        }));
        wcRouter.patch('/security_group_id', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.SecurityGroupId = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.SecurityGroupId);
        }));
        wcRouter.get('/subnet_id', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.SubnetId);
        }));
        wcRouter.patch('/subnet_id', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.SubnetId = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.SubnetId);
        }));
        wcRouter.get('/iam_role_name', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.IAMRoleName);
        }));
        wcRouter.patch('/iam_role_name', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.IAMRoleName = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.IAMRoleName);
        }));
        wcRouter.get('/name_tag', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            return Promise.resolve(impl.WorkerCharacteristic.NameTag);
        }));
        wcRouter.patch('/name_tag', getRequestHandlerForImplementation(getImpl, (req: express.Request, impl: Implementation) => {
            impl.WorkerCharacteristic.NameTag = req.body.value;
            return Promise.resolve(impl.WorkerCharacteristic.NameTag);
        }));

        return Promise.resolve<[IAutoScalerImplementation, express.Router]>([impl, implApiRouter]);
    });
};

export {factory};