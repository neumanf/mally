import { IsOptional, Validate } from 'class-validator';

import { PositiveIntegerStringValidator } from '../../common/validators';

export class FindPastesByUserIdDto {
    @Validate(PositiveIntegerStringValidator)
    @IsOptional()
    page: string;

    @Validate(PositiveIntegerStringValidator)
    @IsOptional()
    take: string;
}
