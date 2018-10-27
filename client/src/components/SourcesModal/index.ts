import { withRouter } from "react-router-dom";
import { graphql, compose } from "react-apollo";

import SourcesModal from "./component";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import { SourceFullFrag } from "../../graphql/gen.types";
import { Sources1Query, Sources1QueryVariables } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";
import { OwnProps } from "./sources-modal";
import { SourcesGqlProps } from "./sources-modal";
import { ProjectLocalGqlProps } from "./sources-modal";
import PROJECT_LOCAL_QUERY, {
  CurrentProjectLocalData
} from "../../state/project.local.query";

const reshapeSource = (s: SourceFullFrag | null) => {
  if (!s) {
    return {} as SourceFullFrag;
  }

  return {
    ...s,
    display: `${sourceDisplay(s)} | ${s.sourceType.name}`
  } as SourceFullFrag;
};

export const reshapeSources = (
  sources: SourceFullFrag[] | null
): SourceFullFrag[] => {
  if (!sources) {
    return [] as SourceFullFrag[];
  }

  return sources.map(reshapeSource);
};

const sourcesGraphQl = graphql<
  OwnProps,
  Sources1Query,
  Sources1QueryVariables,
  SourcesGqlProps | undefined
>(SOURCES_QUERY, {
  props: ({ data }) => {
    if (!data || !data.sources) {
      return data;
    }

    const sources = data.sources as SourceFullFrag[];
    return {
      ...data,
      sources: reshapeSources(sources)
    };
  },

  options: ({ currentProject }) => ({
    variables: {
      source: {
        projectId: (currentProject && currentProject.projectId) || "0"
      }
    }
  })
});

const projectLocalGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  ProjectLocalGqlProps | undefined
>(PROJECT_LOCAL_QUERY, {
  props: props => props.data
});

export default compose(
  withRouter,
  projectLocalGql,
  sourcesGraphQl
)(SourcesModal);
// );
