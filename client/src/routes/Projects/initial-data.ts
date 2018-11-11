import {
  ProjectFragment,
  TagFrag,
  SourceTypeFrag,
  AuthorFrag,
  SourceFullFrag
} from "src/graphql/gen.types";
import TAGS_MINI_QUERY from "src/graphql/tags-mini.query";
import SOURCES_QUERY from "src/graphql/sources-1.query";
import SOURCE_TYPES_QUERY from "src/graphql/source-types.query";
import AUTHORS_QUERY from "src/graphql/authors.query";
import { appClient } from "src/index";

interface SourceTypes {
  [key: string]: SourceTypeFrag[];
}

interface SourcesProject {
  [key: string]: SourceFullFrag[];
}

interface AuthorsProject {
  [key: string]: AuthorFrag[];
}

interface Load {
  projects: Array<null | ProjectFragment>;
  authorsProject: AuthorsProject;
  sourceTypes: SourceTypes;
  sourcesProject: SourcesProject;
  tags: TagFrag[];
}

export const load = (data: Load) => {
  saveTags(data.tags);
  saveSources(data.sourcesProject);
  saveSourceTypes(data.sourceTypes);
  saveProjectAuthors(data.authorsProject);

  async function saveTags(tags: Array<TagFrag | null> | null) {
    if (!tags || !tags.length) {
      return;
    }

    appClient.writeQuery({ query: TAGS_MINI_QUERY, data: { tags } });
  }

  async function saveSourceTypes(sourceTypes: SourceTypes) {
    if (!sourceTypes) {
      return;
    }

    appClient.writeQuery({
      query: SOURCE_TYPES_QUERY,
      data: { sourceTypes }
    });
  }

  async function saveSources(sourcesData: SourcesProject) {
    if (!sourcesData) {
      return;
    }

    for (const [projectId, sources] of Object.entries(sourcesData)) {
      appClient.writeQuery({
        query: SOURCES_QUERY,
        variables: {
          source: {
            projectId
          }
        },
        data: { sources }
      });
    }
  }

  async function saveProjectAuthors(authorsData: AuthorsProject) {
    if (!authorsData) {
      return;
    }

    for (const [projectId, authors] of Object.entries(authorsData)) {
      appClient.writeQuery({
        query: AUTHORS_QUERY,
        variables: {
          author: {
            projectId
          }
        },
        data: { authors }
      });
    }
  }
};

export default load;
