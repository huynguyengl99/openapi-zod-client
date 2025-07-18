import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import SwaggerParser from "@apidevtools/swagger-parser";
import cac from "cac";
import type { OpenAPIObject } from "openapi3-ts";
import { safeJSONParse } from "pastable/server";
import { resolveConfig } from "prettier";

import { toBoolean } from "./utils";
import { generateZodClientFromOpenAPI } from "./generateZodClientFromOpenAPI";

const cli = cac("openapi-zod-client");
const packageJson = safeJSONParse(readFileSync(resolve(__dirname, "../../package.json"), "utf8"));

cli.command("<input>", "path/url to OpenAPI/Swagger document as json/yaml")
    .option("-o, --output <path>", "Output path for the zodios api client ts file (defaults to `<input>.client.ts`)")
    .option(
        "-t, --template <path>",
        "Template path for the handlebars template that will be used to generate the output"
    )
    .option("-p, --prettier <path>", "Prettier config path that will be used to format the output client file")
    .option("-b, --base-url <url>", "Base url for the api")
    .option("--no-with-alias", "With alias as api client methods")
    .option("-a, --with-alias", "With alias as api client methods", { default: true })
    .option(
        "--api-client-name <name>",
        "when using the default `template.hbs`, allow customizing the `export const {apiClientName}`"
    )
    .option("--error-expr <expr>", "Pass an expression to determine if a response status is an error")
    .option("--success-expr <expr>", "Pass an expression to determine which response status is the main success status")
    .option("--media-type-expr <expr>", "Pass an expression to determine which response content should be allowed")
    .option("--export-schemas", "When true, will export all `#/components/schemas`")
    .option(
        "--implicit-required",
        "When true, will make all properties of an object required by default (rather than the current opposite), unless an explicitly `required` array is set"
    )
    .option("--with-deprecated", "when true, will keep deprecated endpoints in the api output")
    .option("--with-description", "when true, will add z.describe(xxx)")
    .option("--with-docs", "when true, will add jsdoc comments to generated types")
    .option(
        "--group-strategy",
        "groups endpoints by a given strategy, possible values are: 'none' | 'tag' | 'method' | 'tag-file' | 'method-file'"
    )
    .option("--group-index", "Generate index.ts file when using group strategies", { default: true })
    .option("--no-group-index", "Disable index.ts file generation when using group strategies")
    .option(
        "--complexity-threshold",
        "schema complexity threshold to determine which one (using less than `<` operator) should be assigned to a variable"
    )
    .option(
        "--default-status",
        "when defined as `auto-correct`, will automatically use `default` as fallback for `response` when no status code was declared"
    )
    .option("--all-readonly", "when true, all generated objects and arrays will be readonly")
    .option("--export-types", "When true, will defined types for all object schemas in `#/components/schemas`")
    .option(
        "--additional-props-default-value",
        "Set default value when additionalProperties is not provided. Default to true.",
        { default: true }
    )
    .option(
        "--strict-objects",
        "Use strict validation for objects so we don't allow unknown keys. Defaults to false.",
        { default: false }
    )
    .action(async (input, options) => {
        console.log("Retrieving OpenAPI document from", input);
        const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIObject;
        const prettierConfig = await resolveConfig(options.prettier || "./");
        const distPath = options.output || input + ".client.ts";
        const withAlias = toBoolean(options.withAlias, true);
        const additionalPropertiesDefaultValue = toBoolean(options.additionalPropsDefaultValue, true);

        await generateZodClientFromOpenAPI({
            openApiDoc,
            distPath,
            prettierConfig,
            templatePath: options.template,
            options: {
                withAlias,
                baseUrl: options.baseUrl,
                apiClientName: options.apiClientName,
                isErrorStatus: options.errorExpr,
                isMainResponseStatus: options.successExpr,
                shouldExportAllSchemas: options.exportSchemas,
                shouldExportAllTypes: options.exportTypes,
                isMediaTypeAllowed: options.mediaTypeExpr,
                withImplicitRequiredProps: options.implicitRequired,
                withDeprecatedEndpoints: options.withDeprecated,
                withDocs: options.withDocs,
                groupStrategy: options.groupStrategy,
                complexityThreshold: options.complexityThreshold,
                defaultStatusBehavior: options.defaultStatus,
                withDescription: options.withDescription,
                allReadonly: options.allReadonly,
                strictObjects: options.strictObjects,
                additionalPropertiesDefaultValue,
                groupIndex: options.groupIndex,
            },
        });
        console.log(`Done generating <${distPath}> !`);
    });

cli.version(packageJson.version!);
cli.help();

cli.parse();
