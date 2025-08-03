import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIObject } from "openapi3-ts";
import { generateZodClientFromOpenAPI } from "../src";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "path";
import { expect, test } from "vitest";

test("polymorphic.yaml generates expected TypeScript client", async () => {
    const openApiDoc = (await SwaggerParser.parse(resolve(__dirname, "schemas/polymorphic.yaml"))) as OpenAPIObject;

    const result = await generateZodClientFromOpenAPI({
        openApiDoc,
        disableWriteToFile: true,
        options: {
            apiClientName: "api",
            shouldExportAllTypes: true,
        },
    });

    const expectedContent = readFileSync(resolve(__dirname, "test-generation/polymorphic-expected.ts"), "utf8");

    writeFileSync(resolve(__dirname, "test-generation/polymorphic-output.ts"), result, "utf8");

    expect(result).toBe(expectedContent);
});
