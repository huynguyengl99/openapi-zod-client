import { describe, test, expect } from "vitest";
import type { OpenAPIObject } from "openapi3-ts";
import { DiscriminatorHandler } from "./discriminator";

const mockOpenApiDoc: OpenAPIObject = {
    openapi: "3.0.0",
    info: { title: "Test", version: "1.0.0" },
    paths: {},
    components: {
        schemas: {
            ProjectPolymorphic: {
                oneOf: [
                    { $ref: "#/components/schemas/PersonalProjectTyped" },
                    { $ref: "#/components/schemas/TeamProjectTyped" }
                ],
                discriminator: {
                    propertyName: "project_type",
                    mapping: {
                        PersonalProject: "#/components/schemas/PersonalProjectTyped",
                        TeamProject: "#/components/schemas/TeamProjectTyped"
                    }
                }
            },
            PersonalProjectTyped: {
                type: "object",
                properties: {
                    project_type: { type: "string" }
                }
            },
            TeamProjectTyped: {
                type: "object", 
                properties: {
                    project_type: { type: "string" }
                }
            }
        }
    }
};

describe("DiscriminatorHandler", () => {
    test("should detect discriminator properties", () => {
        const handler = new DiscriminatorHandler(mockOpenApiDoc);
        
        expect(handler.isDiscriminatorProperty("project_type")).toBe(true);
        expect(handler.isDiscriminatorProperty("title")).toBe(false);
    });

    test("should return correct literal values", () => {
        const handler = new DiscriminatorHandler(mockOpenApiDoc);
        
        expect(handler.getLiteralValue("#/components/schemas/PersonalProjectTyped")).toBe("PersonalProject");
        expect(handler.getLiteralValue("#/components/schemas/TeamProjectTyped")).toBe("TeamProject");
        expect(handler.getLiteralValue("#/components/schemas/NonExistent")).toBe(null);
    });

    test("should handle empty schemas", () => {
        const emptyDoc: OpenAPIObject = {
            openapi: "3.0.0",
            info: { title: "Empty", version: "1.0.0" },
            paths: {}
        };
        
        const handler = new DiscriminatorHandler(emptyDoc);
        
        expect(handler.isDiscriminatorProperty("any_prop")).toBe(false);
        expect(handler.getLiteralValue("any_ref")).toBe(null);
        expect(handler.getDiscriminatorProperties().size).toBe(0);
    });

    test("should return immutable copies of internal data", () => {
        const handler = new DiscriminatorHandler(mockOpenApiDoc);
        
        const properties = handler.getDiscriminatorProperties();
        const mappings = handler.getDiscriminatorMappings();
        
        // Modifications shouldn't affect the handler
        properties.add("new_prop");
        mappings["new_ref"] = "new_value";
        
        expect(handler.isDiscriminatorProperty("new_prop")).toBe(false);
        expect(handler.getLiteralValue("new_ref")).toBe(null);
    });
});