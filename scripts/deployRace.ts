import { toNano } from '@ton/core';
import { Race, RaceEntry, Opcodes } from '../wrappers/Race';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const senderAddress = provider.sender().address;

    if (!senderAddress) {
        throw new Error('Sender address is undefined');
    }

    const initialEntries: RaceEntry[] = Array(10).fill({ time: 0, address: senderAddress });

    const race = provider.open(
        Race.createFromConfig(
            initialEntries,
            await compile('Race')
        )
    );

    await race.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(race.address);

    console.log('Leaderboard:', await race.getLeaderboard());
}
