import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type PersonalProject = {
  id: number;
  title: string;
  description?: string | undefined;
  priority?: ("low" | "medium" | "high" | "urgent") | undefined;
  dueDate?: string | undefined;
  createdAt: string;
  updatedAt: string;
};
type PersonalProjectRequest = {
  title: string;
  description?: string | undefined;
  priority?: ("low" | "medium" | "high" | "urgent") | undefined;
  dueDate?: string | undefined;
};
type PersonalProjectTyped = {
  project_type: "PersonalProject";
} & PersonalProject;
type PersonalProjectTypedRequest = {
  project_type: "PersonalProject";
} & PersonalProjectRequest;
type TeamProject = {
  id: number;
  title: string;
  description?: string | undefined;
  status?: ("planning" | "active" | "on_hold" | "completed") | undefined;
  budget?: number | undefined;
  teamSize?: number | undefined;
  isPublic?: boolean | undefined;
  createdAt: string;
  updatedAt: string;
};
type TeamProjectRequest = {
  title: string;
  description?: string | undefined;
  status?: ("planning" | "active" | "on_hold" | "completed") | undefined;
  budget?: number | undefined;
  teamSize?: number | undefined;
  isPublic?: boolean | undefined;
};
type TeamProjectTyped = {
  project_type: "TeamProject";
} & TeamProject;
type TeamProjectTypedRequest = {
  project_type: "TeamProject";
} & TeamProjectRequest;
type PaginatedProjectPolymorphicList = {
  count: number;
  next?: (string | null) | undefined;
  previous?: (string | null) | undefined;
  results: Array<ProjectPolymorphic>;
};
type ProjectPolymorphic = PersonalProjectTyped | TeamProjectTyped;
type PatchedPersonalProjectRequest = Partial<{
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
}>;
type PatchedPersonalProjectTypedRequest = Partial<{
  project_type: "PersonalProject";
}> &
  PatchedPersonalProjectRequest;
type PatchedTeamProjectRequest = Partial<{
  title: string;
  description: string;
  status: "planning" | "active" | "on_hold" | "completed";
  budget: number;
  teamSize: number;
  isPublic: boolean;
}>;
type PatchedTeamProjectTypedRequest = Partial<{
  project_type: "TeamProject";
}> &
  PatchedTeamProjectRequest;
type PatchedProjectPolymorphicRequest =
  | PatchedPersonalProjectTypedRequest
  | PatchedTeamProjectTypedRequest;
type ProjectCreate = PersonalProjectTyped | TeamProjectTyped;
type ProjectCreateRequest =
  | PersonalProjectTypedRequest
  | TeamProjectTypedRequest;
type ProjectPolymorphicRequest =
  | PersonalProjectTypedRequest
  | TeamProjectTypedRequest;

const PersonalProject: z.ZodType<PersonalProject> = z
  .object({
    id: z.number().int(),
    title: z.string().max(150),
    description: z.string().optional(),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional()
      .default("medium"),
    dueDate: z.string().optional(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const PersonalProjectTyped: z.ZodType<PersonalProjectTyped> = z
  .object({ project_type: z.literal("PersonalProject") })
  .passthrough()
  .merge(PersonalProject);
const TeamProject: z.ZodType<TeamProject> = z
  .object({
    id: z.number().int(),
    title: z.string().max(150),
    description: z.string().optional(),
    status: z
      .enum(["planning", "active", "on_hold", "completed"])
      .optional()
      .default("planning"),
    budget: z.number().optional(),
    teamSize: z.number().int().gte(1).optional(),
    isPublic: z.boolean().optional().default(false),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const TeamProjectTyped: z.ZodType<TeamProjectTyped> = z
  .object({ project_type: z.literal("TeamProject") })
  .passthrough()
  .merge(TeamProject);
const ProjectPolymorphic = z.discriminatedUnion("project_type", [
  PersonalProjectTyped,
  TeamProjectTyped,
]);
const PaginatedProjectPolymorphicList: z.ZodType<PaginatedProjectPolymorphicList> =
  z
    .object({
      count: z.number().int(),
      next: z.string().url().nullish(),
      previous: z.string().url().nullish(),
      results: z.array(ProjectPolymorphic),
    })
    .passthrough();
const PersonalProjectRequest: z.ZodType<PersonalProjectRequest> = z
  .object({
    title: z.string().min(1).max(150),
    description: z.string().optional(),
    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .optional()
      .default("medium"),
    dueDate: z.string().optional(),
  })
  .passthrough();
const PersonalProjectTypedRequest: z.ZodType<PersonalProjectTypedRequest> = z
  .object({ project_type: z.literal("PersonalProject") })
  .passthrough()
  .merge(PersonalProjectRequest);
const TeamProjectRequest: z.ZodType<TeamProjectRequest> = z
  .object({
    title: z.string().min(1).max(150),
    description: z.string().optional(),
    status: z
      .enum(["planning", "active", "on_hold", "completed"])
      .optional()
      .default("planning"),
    budget: z.number().optional(),
    teamSize: z.number().int().gte(1).optional(),
    isPublic: z.boolean().optional().default(false),
  })
  .passthrough();
const TeamProjectTypedRequest: z.ZodType<TeamProjectTypedRequest> = z
  .object({ project_type: z.literal("TeamProject") })
  .passthrough()
  .merge(TeamProjectRequest);
const ProjectCreateRequest: z.ZodType<ProjectCreateRequest> =
  z.discriminatedUnion("project_type", [
    PersonalProjectTypedRequest,
    TeamProjectTypedRequest,
  ]);
const ProjectCreate: z.ZodType<ProjectCreate> = z.discriminatedUnion(
  "project_type",
  [PersonalProjectTyped, TeamProjectTyped]
);
const ProjectPolymorphicRequest: z.ZodType<ProjectPolymorphicRequest> =
  z.discriminatedUnion("project_type", [
    PersonalProjectTypedRequest,
    TeamProjectTypedRequest,
  ]);
const PatchedPersonalProjectRequest: z.ZodType<PatchedPersonalProjectRequest> =
  z
    .object({
      title: z.string().min(1).max(150),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      dueDate: z.string(),
    })
    .partial()
    .passthrough();
const PatchedPersonalProjectTypedRequest: z.ZodType<PatchedPersonalProjectTypedRequest> =
  z
    .object({ project_type: z.literal("PersonalProject") })
    .partial()
    .passthrough()
    .merge(PatchedPersonalProjectRequest);
const PatchedTeamProjectRequest: z.ZodType<PatchedTeamProjectRequest> = z
  .object({
    title: z.string().min(1).max(150),
    description: z.string(),
    status: z
      .enum(["planning", "active", "on_hold", "completed"])
      .default("planning"),
    budget: z.number(),
    teamSize: z.number().int().gte(1),
    isPublic: z.boolean().default(false),
  })
  .partial()
  .passthrough();
const PatchedTeamProjectTypedRequest: z.ZodType<PatchedTeamProjectTypedRequest> =
  z
    .object({ project_type: z.literal("TeamProject") })
    .partial()
    .passthrough()
    .merge(PatchedTeamProjectRequest);
const PatchedProjectPolymorphicRequest: z.ZodType<PatchedProjectPolymorphicRequest> =
  z.discriminatedUnion("project_type", [
    PatchedPersonalProjectTypedRequest,
    PatchedTeamProjectTypedRequest,
  ]);
export const schemas = {
  PersonalProject,
  PersonalProjectTyped,
  TeamProject,
  TeamProjectTyped,
  ProjectPolymorphic,
  PaginatedProjectPolymorphicList,
  PersonalProjectRequest,
  PersonalProjectTypedRequest,
  TeamProjectRequest,
  TeamProjectTypedRequest,
  ProjectCreateRequest,
  ProjectCreate,
  ProjectPolymorphicRequest,
  PatchedPersonalProjectRequest,
  PatchedPersonalProjectTypedRequest,
  PatchedTeamProjectRequest,
  PatchedTeamProjectTypedRequest,
  PatchedProjectPolymorphicRequest,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/projects/",
    description: `List all projects where user has access.`,
    requestFormat: "json",
    parameters: [
      {
        name: "accept-language",
        type: "Header",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().optional(),
      },
    ],
    response: PaginatedProjectPolymorphicList,
  },
  {
    method: "post",
    path: "/api/projects/",
    description: `Create a new personal or team project.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ProjectCreateRequest,
      },
      {
        name: "accept-language",
        type: "Header",
        schema: z.string().optional(),
      },
    ],
    response: ProjectCreate,
  },
  {
    method: "get",
    path: "/api/projects/:id/",
    description: `Get project details.`,
    requestFormat: "json",
    parameters: [
      {
        name: "accept-language",
        type: "Header",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().regex(/^[0-9]+$/),
      },
    ],
    response: ProjectPolymorphic,
  },
  {
    method: "put",
    path: "/api/projects/:id/",
    description: `Update project information (requires permissions).`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ProjectPolymorphicRequest,
      },
      {
        name: "accept-language",
        type: "Header",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().regex(/^[0-9]+$/),
      },
    ],
    response: ProjectPolymorphic,
  },
  {
    method: "patch",
    path: "/api/projects/:id/",
    description: `Partially update project information (requires permissions).`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PatchedProjectPolymorphicRequest,
      },
      {
        name: "accept-language",
        type: "Header",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().regex(/^[0-9]+$/),
      },
    ],
    response: ProjectPolymorphic,
  },
  {
    method: "delete",
    path: "/api/projects/:id/",
    description: `Delete project (owners only, personal projects excluded).`,
    requestFormat: "json",
    parameters: [
      {
        name: "accept-language",
        type: "Header",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().regex(/^[0-9]+$/),
      },
    ],
    response: z.void(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
