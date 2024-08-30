import { toNano, Address } from '@ton/core';
import { Race } from '../wrappers/Race';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const raceAddress = Address.parse('EQC_8HjVICJndonC88WPdsekT072YY0vvcj3I2oXgmEcDd9_'); // Pass the contract address as an argument
    const time = parseInt(args[1], 10); // Pass the time as an argument

    const race = provider.open(Race.createFromAddress(raceAddress));

    try {
        await race.sendRecordTime(provider.sender(), {
            time: time,
            value: toNano('1.1'), // This should cover the ENTRY_FEE (1 TON) plus gas
        });
        console.log('Time recorded successfully');
    } catch (error) {
        console.error('Failed to record time:', error instanceof Error ? error.message : String(error));
    }
}