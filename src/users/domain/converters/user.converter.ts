import { User } from "src/users/infra/user.schema";
import { UserDto } from "../dtos/user.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserConverter {
    public userToDto(entity: User): UserDto {
        const dto = new UserDto();
        dto.balance = entity.balance;
        dto.username = entity.username
        return dto;
    }
}