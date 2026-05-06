import type { OpenAPIObject } from "openapi3-ts";
import { expect, test } from "vitest";
import { getZodClientTemplateContext } from "../src";

// When a query parameter has an inline oneOf with discriminator,
// a TypeScript type should be generated (union of referenced schemas)
test("inline-param-oneOf-generates-type", () => {
    const openApiDoc: OpenAPIObject = {
        openapi: "3.0.3",
        info: {
            title: "inline param oneOf type",
            version: "v1",
        },
        paths: {
            "/test": {
                get: {
                    parameters: [
                        {
                            in: "query",
                            name: "filter",
                            schema: {
                                oneOf: [
                                    { $ref: "#/components/schemas/ByName" },
                                    { $ref: "#/components/schemas/ById" },
                                    { $ref: "#/components/schemas/ByTag" },
                                ],
                                discriminator: {
                                    propertyName: "kind",
                                    mapping: {
                                        Name: "#/components/schemas/ByName",
                                        Id: "#/components/schemas/ById",
                                        Tag: "#/components/schemas/ByTag",
                                    },
                                },
                            },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "OK",
                            content: { "application/json": { schema: { type: "string" } } },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                ByName: {
                    type: "object",
                    required: ["kind", "name"],
                    properties: {
                        kind: { type: "string", enum: ["Name"] },
                        name: { type: "string" },
                    },
                },
                ById: {
                    type: "object",
                    required: ["kind", "id"],
                    properties: {
                        kind: { type: "string", enum: ["Id"] },
                        id: { type: "number" },
                    },
                },
                ByTag: {
                    type: "object",
                    required: ["kind", "tag"],
                    properties: {
                        kind: { type: "string", enum: ["Tag"] },
                        tag: { type: "string" },
                    },
                },
            },
        },
    };

    const ctx = getZodClientTemplateContext(openApiDoc, { shouldExportAllTypes: true });

    // Should generate a type for the inline parameter schema
    expect(ctx.types["filter"]).toBeDefined();
    expect(ctx.types["filter"]).toContain("ByName");
    expect(ctx.types["filter"]).toContain("ById");
    expect(ctx.types["filter"]).toContain("ByTag");
    // Should be a union type with |
    expect(ctx.types["filter"]).toContain("|");
});
