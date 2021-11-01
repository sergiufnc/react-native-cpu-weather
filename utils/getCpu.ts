import {NativeModules} from 'react-native';

const {CpuModule} = NativeModules;

export default function getCpu(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        CpuModule.getUsage((usage: number) => {
            resolve(usage);
        });
    });

}