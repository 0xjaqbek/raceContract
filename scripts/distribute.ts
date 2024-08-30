import { toNano, Address } from '@ton/core';
import { Race } from '../wrappers/Race';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const raceAddress = Address.parse('EQC_8HjVICJndonC88WPdsekT072YY0vvcj3I2oXgmEcDd9_'); // Pass the contract address as an argument
    const tournamentNumber = parseInt(args[1], 10); // Pass the tournament number as an argument

    const race = provider.open(Race.createFromAddress(raceAddress));

    try {
        await race.sendDistributePrize(provider.sender(), {
            tournamentNumber: tournamentNumber,
            value: toNano('0.1'),
        });
        console.log('Prize distributed successfully');
    } catch (error) {
        console.error('Failed to distribute prize:', error instanceof Error ? error.message : String(error));
    }
}