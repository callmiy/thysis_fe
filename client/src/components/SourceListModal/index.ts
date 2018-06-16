import { withRouter } from "react-router-dom";
import {  graphql } from "react-apollo";

import { SourceListModal } from "./component";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import { SourceFragFragment } from "../../graphql/gen.types";
import { OwnProps } from "./utils";
import { ComponentDataProps } from "./utils";
import { Sources1Query } from "../../graphql/gen.types";

const reshapeSource = (s: SourceFragFragment | null) => {
  if (!s) {
    return {} as SourceFragFragment;
  }

  return {
    ...s,
    display: `${s.display} | ${s.sourceType.name}`
  } as SourceFragFragment;
};

export const reshapeSources = (
  sources: SourceFragFragment[] | null
): SourceFragFragment[] => {
  if (!sources) {
    return [] as SourceFragFragment[];
  }

  return sources.map(reshapeSource);
};

const sourcesGraphQl = graphql<OwnProps, Sources1Query, {}, ComponentDataProps>(
  SOURCES_QUERY,
  {
    props: ({ data }) => {
      if (!data || !data.sources) {
        return data as ComponentDataProps;
      }

      const sources = data.sources as SourceFragFragment[];
      return {
        ...data,
        sources: reshapeSources(sources)
      } as ComponentDataProps;
    }
  }
);

export default withRouter(sourcesGraphQl(SourceListModal));
