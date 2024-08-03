import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Race } from '../wrappers/Race';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Race', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Race');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let race: SandboxContract<Race>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        race = blockchain.openContract(Race.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await race.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: race.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and race are ready to use
    });
});
