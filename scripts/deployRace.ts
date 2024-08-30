import { toNano } from '@ton/core';
import { Race } from '../wrappers/Race';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const senderAddress = provider.sender().address;
    if (!senderAddress) {
        throw new Error('Sender address is undefined');
    }

    // Compile contract code
    const code = await compile('Race');

    // Create the Race contract instance
    const race = provider.open(Race.createFromConfig(senderAddress, code));

    try {
        // Deploy contract
        await race.sendDeploy(provider.sender(), toNano('0.5'));
        await provider.waitForDeploy(race.address);
        console.log('Contract deployed successfully at:', race.address);
    } catch (error) {
        console.error('Deployment failed:', error instanceof Error ? error.message : String(error));
    }
}