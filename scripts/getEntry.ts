import { Address } from '@ton/core';
import { Race } from '../wrappers/Race';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const raceAddress = Address.parse('EQC_8HjVICJndonC88WPdsekT072YY0vvcj3I2oXgmEcDd9_'); // Pass the contract address as an argument
    const playerAddress = Address.parse(args[1]); // Pass the player address as an argument

    const race = provider.open(Race.createFromAddress(raceAddress));

    try {
        const playerEntry = await race.getPlayerEntry(playerAddress);
        console.log('Player Entry:', playerEntry);
    } catch (error) {
        console.error('Failed to get player entry:', error instanceof Error ? error.message : String(error));
    }
}