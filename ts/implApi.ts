import {AutoScalerImplementationInfo} from 'autoscalable-grid';
import {IWorkerCharacteristic, IImplementationSetup, IWorkerCharacteristicSetup, ImplementationJSON} from "aws-ec2-autoscaler-impl";
import {EC2} from 'aws-sdk';
import {ApiCore, GridMessage} from "grid-client-core";

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

class WorkerCharacteristicSetup implements IWorkerCharacteristicSetup {
    constructor(private api: ApiCore<GridMessage>) {}
    toJSON(): Promise<IWorkerCharacteristic> {return this.api.$J("GET", '/', {});}
    getKeyName(): Promise<string> {return this.api.$J("GET", '/key_name', {});}
    setKeyName(value: string): Promise<string> {return this.api.$J("PATCH", '/key_name', {value});}
    getInstanceType(): Promise<EC2.InstanceType> {return this.api.$J("GET", '/instance_type', {});}
    setInstanceType(value: EC2.InstanceType): Promise<EC2.InstanceType> {return this.api.$J("PATCH", '/instance_type', {value});}
    getImageId(): Promise<string> {return this.api.$J("GET", '/image_id', {});}
    setImageId(value: string): Promise<string> {return this.api.$J("PATCH", '/image_id', {value});}
    getSecurityGroupId(): Promise<string> {return this.api.$J("GET", '/security_group_id', {});}
    setSecurityGroupId(value: string): Promise<string> {return this.api.$J("PATCH", '/security_group_id', {value});}
    getSubnetId(): Promise<string> {return this.api.$J("GET", '/subnet_id', {});}
    setSubnetId(value: string): Promise<string> {return this.api.$J("PATCH", '/subnet_id', {value});}
    getIAMRoleName(): Promise<string> {return this.api.$J("GET", '/iam_role_name', {});}
    setIAMRoleName(value: string): Promise<string> {return this.api.$J("PATCH", '/iam_role_name', {value});}
    getNameTag(): Promise<string> {return this.api.$J("GET", '/name_tag', {});}
    setNameTag(value: string): Promise<string> {return this.api.$J("PATCH", '/name_tag', {value});}
}

class ImplementationSetup implements IImplementationSetup {
    constructor(private api: ApiCore<GridMessage>) {}
    toJSON() : Promise<ImplementationJSON> {return this.api.$J("GET", '/', {});}
    getCPUsPerInstance() : Promise<number> {return this.api.$J("GET", '/cpus_per_instance', {});}
    setCPUsPerInstance(value: number) : Promise<number> {return this.api.$J("PATCH", '/cpus_per_instance', {value});}
    get WorkerCharacteristic(): IWorkerCharacteristicSetup {return new WorkerCharacteristicSetup(this.api.mount('/worker_characteristic'));}
}

export interface IImplementation {
    getInfo: () => Promise<AutoScalerImplementationInfo>;
    readonly Setup: IImplementationSetup;
}

class Implementation implements IImplementation {
    constructor(private api: ApiCore<GridMessage>) {}
    getInfo() : Promise<AutoScalerImplementationInfo> {return this.api.$J("GET", '/info', {});}
    get Setup(): IImplementationSetup {return new ImplementationSetup(this.api.mount('/setup'));}
}

export function getImplementationSetup(api: ApiCore<GridMessage>) : IImplementationSetup {return new ImplementationSetup(api);}
export function getImplementation(api: ApiCore<GridMessage>) : IImplementation {return new Implementation(api);}