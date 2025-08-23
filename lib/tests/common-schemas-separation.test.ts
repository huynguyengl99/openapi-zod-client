import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIObject } from "openapi3-ts";
import { expect, test } from "vitest";
import { emptyDir, ensureDir, readdir } from "@liuli-util/fs-extra";
import { generateZodClientFromOpenAPI } from "../src/generateZodClientFromOpenAPI";

test("should generate schemas-only common.ts when using schemas-only template", async () => {
    const openApiDoc = (await SwaggerParser.parse(resolve(__dirname, "schemas/api-with-common.yaml"))) as OpenAPIObject;

    const outputDir = resolve(__dirname, "test-generation/schemas-only-output");
    const expectedDir = resolve(__dirname, "test-generation/schemas-only-expected");
    await emptyDir(outputDir);
    await ensureDir(outputDir);

    await generateZodClientFromOpenAPI({
        openApiDoc,
        distPath: outputDir,
        templatePath: resolve(__dirname, "../src/templates/schemas-only.hbs"),
        options: {
            groupStrategy: "tag-file",
            shouldExportAllSchemas: true,
            commonTemplatePath: resolve(__dirname, "../src/templates/common-schemas-only.hbs"),
        },
    });

    // Read generated files and compare with expected
    const outputFiles = await readdir(outputDir);
    const expectedFiles = await readdir(expectedDir);

    // Filter only .ts files
    const outputTsFiles = outputFiles.filter((f) => f.endsWith(".ts")).sort();
    const expectedTsFiles = expectedFiles.filter((f) => f.endsWith(".ts")).sort();

    // Check that both directories have the same files
    expect(outputTsFiles).toEqual(expectedTsFiles);

    // Check content of each file
    for (const fileName of outputTsFiles) {
        const outputPath = resolve(outputDir, fileName);
        const expectedPath = resolve(expectedDir, fileName);

        const actualContent = readFileSync(outputPath, "utf8");
        const expectedContent = readFileSync(expectedPath, "utf8");

        expect(actualContent).toBe(expectedContent);
    }
});

test("should generate types-only common.ts when using types-only template", async () => {
    const openApiDoc = (await SwaggerParser.parse(resolve(__dirname, "schemas/api-with-common.yaml"))) as OpenAPIObject;

    const outputDir = resolve(__dirname, "test-generation/types-only-output");
    const expectedDir = resolve(__dirname, "test-generation/types-only-expected");
    await emptyDir(outputDir);
    await ensureDir(outputDir);

    await generateZodClientFromOpenAPI({
        openApiDoc,
        distPath: outputDir,
        templatePath: resolve(__dirname, "../src/templates/types-only.hbs"),
        options: {
            groupStrategy: "tag-file",
            shouldExportAllTypes: true,
            commonTemplatePath: resolve(__dirname, "../src/templates/common-types-only.hbs"),
        },
    });

    // Read generated files and compare with expected
    const outputFiles = await readdir(outputDir);
    const expectedFiles = await readdir(expectedDir);

    // Filter only .ts files
    const outputTsFiles = outputFiles.filter((f) => f.endsWith(".ts")).sort();
    const expectedTsFiles = expectedFiles.filter((f) => f.endsWith(".ts")).sort();

    // Check that both directories have the same files
    expect(outputTsFiles).toEqual(expectedTsFiles);

    // Check content of each file
    for (const fileName of outputTsFiles) {
        const outputPath = resolve(outputDir, fileName);
        const expectedPath = resolve(expectedDir, fileName);

        const actualContent = readFileSync(outputPath, "utf8");
        const expectedContent = readFileSync(expectedPath, "utf8");

        expect(actualContent).toBe(expectedContent);
    }
});
