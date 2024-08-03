import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Builder } from '@ton/core';

export type RaceEntry = {
    time: number;
    address: Address;
};

export const Opcodes = {
    update: 0x1,
};

export class Race implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Race(address);
    }

    static createFromConfig(entries: RaceEntry[], code: Cell, workchain = 0) {
        const data = Race.raceEntriesToCell(entries);
        const init = { code, data };
        return new Race(contractAddress(workchain, init), init);
    }

    static raceEntriesToCell(entries: RaceEntry[]): Cell {
        const builder = beginCell();
        
        // Store the number of entries
        builder.storeUint(entries.length, 4);

        let leaderboardBuilder = beginCell();
        let bitsUsed = 0;
        const bitsPerEntry = 64 + 267; // 64 bits for time, 267 bits for address

        entries.forEach((entry) => {
            // If adding this entry exceeds the cell's capacity, store the current cell and start a new one
            if (bitsUsed + bitsPerEntry > 1023) {
                builder.storeRef(leaderboardBuilder.endCell());
                leaderboardBuilder = beginCell();
                bitsUsed = 0;
            }
            
            leaderboardBuilder.storeUint(entry.time, 64).storeAddress(entry.address);
            bitsUsed += bitsPerEntry;
        });

        // Store the remaining data
        builder.storeRef(leaderboardBuilder.endCell());

        return builder.endCell();
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendUpdate(
        provider: ContractProvider,
        via: Sender,
        opts: {
            op: number;
            newTime: number;
            newAddress: Address;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(opts.op, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(BigInt(opts.newTime), 64)
                .storeAddress(opts.newAddress)
                .endCell(),
        });
    }

    async getAddressAndTime(provider: ContractProvider, index: number) {
        const result = await provider.get('get_address_and_time', [{ type: 'int', value: BigInt(index) }]);
        const time = BigInt(result.stack.readNumber());
        const address = result.stack.readAddress();
        return { time, address };
    }

    async getLeaderboard(provider: ContractProvider) {
        const result = await provider.get('get_leaderboard', []);
        const leaderboard = result.stack.readCell();
        const numEntries = leaderboard.beginParse().loadUint(4);
        let entries: RaceEntry[] = [];

        let ds = leaderboard.beginParse();
        for (let i = 0; i < numEntries; i++) {
            const time = ds.loadUint(64);
            const address = ds.loadAddress();
            entries.push({ time, address });
        }

        return entries;
    }
}
