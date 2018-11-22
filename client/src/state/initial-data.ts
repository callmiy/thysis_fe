import ApolloClient from "apollo-client";

import { sourceFullFrag } from "../graphql/source-full.fragment";
import { tagFrag } from "../graphql/tag-mini.fragment";
import { sourceTypeFrag } from "../graphql/source-type.fragment";
import gql from "graphql-tag";
import socket from "../socket";
import {
  ProjectFragment,
  AllQueries,
  TagFrag,
  SourceTypeFrag
} from "../graphql/gen.types";
import TAGS_MINI_QUERY from "../graphql/tags-mini.query";
import SOURCES_QUERY from "../graphql/sources-1.query";
import SOURCE_TYPES_QUERY from "../graphql/source-types.query";
import AUTHORS_QUERY from "../graphql/authors.query";
import PROJECTS_QUERY from "../graphql/projects.query";

const AUTHORS_PROJECT_INPUT_KEY = "authorProject";

export const connectAndLoad = (
  projects: Array<null | ProjectFragment> | null,
  client: ApolloClient<{}>,
  jwt: string
) => {
  if (!projects) {
    return;
  }

  if (!projects.length) {
    return;
  }

  client.writeQuery({
    query: PROJECTS_QUERY,
    data: { projects }
  });

  const sourcesProjVariables = {};
  const authorsProjectVariables = {};

  const projectIds = projects.map(p => {
    if (!p) {
      return "";
    }

    const { id: projectId } = p;

    sourcesProjVariables[`source${projectId}`] = { projectId };

    authorsProjectVariables[`${AUTHORS_PROJECT_INPUT_KEY}${projectId}`] = {
      projectId
    };

    return projectId;
  });

  const projectsLen = projectIds.length;

  const authorProject = makeAuthorsProjectsQuery(projectsLen);
  const sourcesProjects = makeSourcesProjectsQuery(projectsLen);
  const allInputs = [...sourcesProjects.inputs, ...authorProject.inputs].join(
    ","
  );

  const query = gql`
      query AllQueries(${allInputs}) {
        ${sourcesProjects.queryStr}

        ${authorProject.queryStr}

        tags: tags {
          ...TagFrag
        }

        sourceTypes {
          ...SourceTypeFrag
        }

      }

      ${sourceTypeFrag}
      ${sourceFullFrag}
      ${tagFrag} `;

  socket.connect(
    jwt,
    {
      query: query.loc.source.body,
      variables: { ...sourcesProjVariables, ...authorsProjectVariables },
      onData: onLoaded
    }
  );

  async function saveTags(tags: Array<TagFrag | null> | null) {
    if (!tags) {
      return;
    }

    client.writeQuery({ query: TAGS_MINI_QUERY, data: { tags } });
  }

  async function saveSourceTypes(
    sourceTypes: Array<SourceTypeFrag | null> | null
  ) {
    if (!sourceTypes) {
      return;
    }

    client.writeQuery({
      query: SOURCE_TYPES_QUERY,
      data: { sourceTypes }
    });
  }

  async function saveSources(data: AllQueries) {
    projectIds.forEach(id => {
      const sid = toSourceId(id);
      const sources = data[sid];

      if (!sources) {
        return;
      }

      client.writeQuery({
        query: SOURCES_QUERY,
        variables: {
          source: {
            projectId: id
          }
        },
        data: { sources }
      });
    });
  }

  async function saveProjectAuthors(data: AllQueries) {
    projectIds.forEach(id => {
      const authors = data[`${AUTHORS_PROJECT_INPUT_KEY}${id}`];

      if (!authors) {
        return;
      }

      client.writeQuery({
        query: AUTHORS_QUERY,
        variables: {
          author: {
            projectId: id
          }
        },
        data: { authors }
      });
    });
  }

  function onLoaded({ data }: { data: AllQueries }) {
    saveTags(data.tags);
    saveSources(data);
    saveSourceTypes(data.sourceTypes);
    saveProjectAuthors(data);
  }

  function toSourceId(id: string) {
    return `source${id}`;
  }

  function makeAuthorsProjectsQuery(len: number) {
    let queryStr = "";
    const inputs: string[] = [];

    if (!len) {
      return {
        queryStr,
        inputs
      };
    }

    projectIds.forEach(id => {
      const input = `${AUTHORS_PROJECT_INPUT_KEY}${id}`;
      inputs.push(`$${input}: GetAuthorsInput`);

      queryStr += `${input}: authors(author: $${input}) {
        ...AuthorFrag
      }\n`;
    });

    return {
      queryStr,
      inputs
    };
  }

  function makeSourcesProjectsQuery(len: number) {
    let queryStr = "";
    const inputs: string[] = [];

    if (!len) {
      return {
        queryStr,
        inputs
      };
    }

    projectIds.forEach(id => {
      const input = `${toSourceId(id)}`;
      inputs.push(`$${input}: GetSourcesInput`);

      queryStr += `${input}: sources(source: $${input}) {
        ...SourceFullFrag
      }\n`;
    });

    return {
      queryStr,
      inputs
    };
  }
};

export default connectAndLoad;
