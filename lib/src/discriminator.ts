import type { OpenAPIObject, SchemaObject } from "openapi3-ts";

/**
 * Handles discriminated union logic for OpenAPI schemas.
 * Pre-computes discriminator mappings and provides clean API for property detection.
 */
export class DiscriminatorHandler {
    private mappings: Record<string, string> = {};
    private properties: Set<string> = new Set();

    constructor(doc: OpenAPIObject) {
        this.buildMappings(doc);
    }

    /**
     * Check if a property name is a discriminator property in any schema.
     */
    isDiscriminatorProperty(propertyName: string): boolean {
        return this.properties.has(propertyName);
    }

    /**
     * Get the literal value for a discriminator property in a specific schema.
     * @param schemaRef - The schema reference (e.g., "#/components/schemas/PersonalProjectTyped")
     * @returns The literal value (e.g., "PersonalProject") or null if not found
     */
    getLiteralValue(schemaRef: string): string | null {
        return this.mappings[schemaRef] || null;
    }

    /**
     * Get all discriminator property names.
     */
    getDiscriminatorProperties(): Set<string> {
        return new Set(this.properties);
    }

    /**
     * Get all discriminator mappings.
     */
    getDiscriminatorMappings(): Record<string, string> {
        return { ...this.mappings };
    }

    /**
     * Build discriminator mappings from OpenAPI document.
     * Scans all schemas once to find oneOf schemas with discriminator configurations.
     */
    private buildMappings(doc: OpenAPIObject): void {
        if (!doc.components?.schemas) return;

        // Find all oneOf schemas with discriminator mappings
        for (const [, schema] of Object.entries(doc.components.schemas)) {
            if (schema && typeof schema === 'object' && 'oneOf' in schema) {
                const oneOfSchema = schema as SchemaObject;
                if (oneOfSchema.oneOf && oneOfSchema.discriminator?.mapping) {
                    const mapping = oneOfSchema.discriminator.mapping;
                    const propertyName = oneOfSchema.discriminator.propertyName;
                    
                    // Track discriminator property name
                    if (propertyName) {
                        this.properties.add(propertyName);
                    }
                    
                    // Map each discriminator value to its schema reference
                    for (const [discriminatorValue, schemaRef] of Object.entries(mapping)) {
                        this.mappings[schemaRef] = discriminatorValue;
                    }
                }
            }
        }
    }
}