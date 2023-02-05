import { IsOptional, Validate } from 'class-validator';
import { PositiveIntegerStringValidator } from '../../common/validators';

export class FindShortUrlsByUserIdDto {
    @Validate(PositiveIntegerStringValidator)
    @IsOptional()
    page: string;

    @Validate(PositiveIntegerStringValidator)
    @IsOptional()
    take: string;
}
