import { IsDateString, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreatePasteDto {
    @IsOptional()
    @IsString()
    @Length(0, 15)
    title?: string;

    @IsString()
    @Length(5)
    content: string;

    @IsString()
    @Matches(
        /^(text|markup|bash|clike|c|cpp|css|css-extras|javascript|jsx|js-extras|js-templates|coffeescript|diff|git|go|graphql|markup-templating|handlebars|json|less|makefile|markdown|objectivec|ocaml|python|reason|sass|scss|sql|stylus|tsx|typescript|wasm|yaml)$/,
        {
            message: 'syntax not supported',
        }
    )
    syntax: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: Date;
}
