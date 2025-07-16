import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIObject } from "openapi3-ts";
import { generateZodClientFromOpenAPI } from "../src";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "path";
import { expect, test } from "vitest";

test("api-doc.yaml generates expected TypeScript client", async () => {
    const openApiDoc = (await SwaggerParser.parse(resolve(__dirname, "schemas/api-doc.yaml"))) as OpenAPIObject;

    const result = await generateZodClientFromOpenAPI({
        openApiDoc,
        disableWriteToFile: true,
        options: {
            apiClientName: "api",
            shouldExportAllTypes: true,
        },
    });

    const expectedContent = readFileSync(resolve(__dirname, "test-generation/api-doc-expected.ts"), "utf8");

    writeFileSync(resolve(__dirname, "test-generation/api-doc-output.ts"), result, "utf8");

    expect(result).toBe(expectedContent);
});

test("api-doc.yaml with groupStrategy tag-file and shouldExportAllTypes", async () => {
    const openApiDoc = (await SwaggerParser.parse(resolve(__dirname, "schemas/api-doc.yaml"))) as OpenAPIObject;

    const result = await generateZodClientFromOpenAPI({
        openApiDoc,
        disableWriteToFile: true,
        options: {
            groupStrategy: "tag-file",
            shouldExportAllTypes: true,
        },
    });

    // Write actual output files to folder
    const outputDir = resolve(__dirname, "test-generation/api-doc-grouped-output");
    const expectedDir = resolve(__dirname, "test-generation/api-doc-grouped-expected");
    
    const fs = await import("@liuli-util/fs-extra");
    await fs.ensureDir(outputDir);
    await fs.ensureDir(expectedDir);
    
    // Write all generated files to output directory
    for (const [fileName, content] of Object.entries(result)) {
        const filePath = fileName.startsWith("__") ? `${fileName.slice(2)}.ts` : `${fileName}.ts`;
        writeFileSync(resolve(outputDir, filePath), content, "utf8");
    }
    
    // Compare each file with expected
    for (const [fileName, content] of Object.entries(result)) {
        const filePath = fileName.startsWith("__") ? `${fileName.slice(2)}.ts` : `${fileName}.ts`;
        const expectedPath = resolve(expectedDir, filePath);
        
        let expectedContent: string;
        try {
            expectedContent = readFileSync(expectedPath, "utf8");
        } catch (error) {
            // If expected file doesn't exist, create it from actual output
            expectedContent = content;
            writeFileSync(expectedPath, expectedContent, "utf8");
        }
        
        expect(content).toBe(expectedContent);
    }
});

test("api-doc.yaml with groupStrategy tag-file and shouldExportAllTypes and types only template", async () => {
    const openApiDoc = (await SwaggerParser.parse(resolve(__dirname, "schemas/api-doc.yaml"))) as OpenAPIObject;

    const outputDir = resolve(__dirname, "test-generation/custom-template-grouped-output");
    const expectedDir = resolve(__dirname, "test-generation/custom-template-grouped-expected");
    
    const fs = await import("@liuli-util/fs-extra");
    await fs.emptyDir(outputDir)
    await fs.ensureDir(outputDir);
    await fs.ensureDir(expectedDir);

    await generateZodClientFromOpenAPI({
        openApiDoc,
        distPath: outputDir,
        templatePath: resolve(__dirname, "../src/templates/types-only.hbs"),
        options: {
            groupStrategy: "tag-file",
            groupIndex: false,
            shouldExportAllTypes: true,
        },
    });

    // Read generated files and compare with expected
    const outputFiles = await fs.readdir(outputDir);
    const expectedFiles = await fs.readdir(expectedDir);
    
    // Filter only .ts files
    const outputTsFiles = outputFiles.filter(f => f.endsWith('.ts')).sort();
    const expectedTsFiles = expectedFiles.filter(f => f.endsWith('.ts')).sort();
    
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
