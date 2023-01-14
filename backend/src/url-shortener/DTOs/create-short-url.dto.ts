import { IsUrl } from 'class-validator';

export class CreateShortUrlDto {
    @IsUrl()
    url: string;
}
