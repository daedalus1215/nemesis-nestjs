import { BadRequestException } from "@nestjs/common";
import { UsersService } from "./services/users.service";

export class UserAggregator {
    constructor(private readonly usersService: UsersService) { }

    async transfer(senderId: string, receiverId: string, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new BadRequestException('Transfer amount must be positive');
        }

        const sender = await this.usersService.findById(senderId);
        const receiver = await this.usersService.findById(receiverId);

        if (!sender || !receiver) {
            throw new BadRequestException('Sender or receiver not found');
        }

        if (sender.balance < amount) {
            throw new BadRequestException('Insufficient funds');
        }

        sender.balance -= amount;
        receiver.balance += amount;

        await this.usersService.update(sender.id, sender);
        await this.usersService.update(receiver.id, receiver);
    }
}