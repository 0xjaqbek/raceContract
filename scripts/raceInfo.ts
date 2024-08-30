import { Address } from '@ton/core';
import { Race } from '../wrappers/Race';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    try {
        // Hardcoded contract address
        const raceAddress = Address.parse('EQC_8HjVICJndonC88WPdsekT072YY0vvcj3I2oXgmEcDd9_');

        // Open the contract using the hardcoded address
        const race = provider.open(Race.createFromAddress(raceAddress));

        // Fetch and log the contract information
        const info = await race.getInfo();
        console.log('Contract Info:', info);
    } catch (error) {
        console.error('Failed to get contract info:', error instanceof Error ? error.message : String(error));
    }
}
