import * as fs from 'fs';
import {ImplementationJSON} from "aws-ec2-autoscaler-impl";

export class SettingsStore {
    constructor(private settingsFile: string) {}
    load() : Promise<ImplementationJSON> {return Promise.resolve<ImplementationJSON>(JSON.parse(fs.readFileSync(this.settingsFile, 'utf8')));}
    save(settings: ImplementationJSON) : Promise<void> {
        fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 2), 'utf8')
        return Promise.resolve();
    }
}